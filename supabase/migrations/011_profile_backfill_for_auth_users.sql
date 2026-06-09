create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
  next_role public.user_role := 'audience';
  profile_name text;
  username_base text;
  generated_username text;
begin
  if requested_role in ('audience', 'performer', 'host', 'admin') then
    next_role := requested_role::public.user_role;
  end if;

  insert into public.users (id, email, role)
  values (new.id, coalesce(new.email, ''), next_role)
  on conflict (id) do nothing;

  profile_name := nullif(
    trim(
      coalesce(
        new.raw_user_meta_data ->> 'name',
        new.raw_user_meta_data ->> 'full_name',
        split_part(coalesce(new.email, ''), '@', 1),
        'Usuario ET'
      )
    ),
    ''
  );

  if profile_name is null then
    profile_name := 'Usuario ET';
  end if;

  username_base := lower(
    regexp_replace(
      coalesce(
        nullif(new.raw_user_meta_data ->> 'username', ''),
        profile_name,
        'perfil_et'
      ),
      '[^a-z0-9_]+',
      '_',
      'g'
    )
  );
  username_base := trim(both '_' from username_base);

  if char_length(username_base) < 3 then
    username_base := 'perfil_et';
  end if;

  generated_username := left(username_base, 23) || '_' || left(replace(new.id::text, '-', ''), 8);

  insert into public.profiles (user_id, name, username)
  values (new.id, profile_name, generated_username)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

insert into public.profiles (user_id, name, username)
select
  auth_user.id,
  auth_user.profile_name,
  left(auth_user.username_base, 23) || '_' || left(replace(auth_user.id::text, '-', ''), 8)
from (
  select
    users.id,
    coalesce(
      nullif(trim(users.raw_user_meta_data ->> 'name'), ''),
      nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(split_part(coalesce(users.email, ''), '@', 1)), ''),
      'Usuario ET'
    ) as profile_name,
    case
      when char_length(
        trim(
          both '_'
          from lower(
            regexp_replace(
              coalesce(
                nullif(users.raw_user_meta_data ->> 'username', ''),
                nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
                'perfil_et'
              ),
              '[^a-z0-9_]+',
              '_',
              'g'
            )
          )
        )
      ) >= 3
      then trim(
        both '_'
        from lower(
          regexp_replace(
            coalesce(
              nullif(users.raw_user_meta_data ->> 'username', ''),
              nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
              'perfil_et'
            ),
            '[^a-z0-9_]+',
            '_',
            'g'
          )
        )
      )
      else 'perfil_et'
    end as username_base
  from auth.users
) as auth_user
where not exists (
  select 1
  from public.profiles
  where profiles.user_id = auth_user.id
)
on conflict do nothing;

notify pgrst, 'reload schema';
