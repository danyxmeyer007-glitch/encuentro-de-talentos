create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('audience', 'performer', 'host', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.live_room_status as enum ('scheduled', 'live', 'closed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.user_role not null default 'audience',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  name text not null,
  username text not null unique,
  photo_url text,
  country text,
  city text,
  bio text,
  talent_type text,
  age_range text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-zA-Z0-9_]{3,32}$')
);

create table if not exists public.performer_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  stage_name text not null,
  genre text,
  experience_level text,
  social_links jsonb not null default '{}'::jsonb,
  demo_video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.live_rooms (
  id uuid primary key default gen_random_uuid(),
  livekit_room_name text not null unique,
  title text not null,
  status public.live_room_status not null default 'scheduled',
  starts_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auditions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  room_id uuid references public.live_rooms(id) on delete set null,
  song_name text not null,
  recording_url text,
  score numeric(4, 2) default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  audition_id uuid not null references public.auditions(id) on delete cascade,
  voter_id uuid not null references public.users(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  created_at timestamptz not null default now(),
  unique (audition_id, voter_id)
);

create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists users_role_idx on public.users (role);
create index if not exists performer_profiles_genre_idx on public.performer_profiles (genre);
create index if not exists live_rooms_status_idx on public.live_rooms (status);
create index if not exists auditions_room_id_idx on public.auditions (room_id);
create index if not exists auditions_user_id_idx on public.auditions (user_id);
create index if not exists votes_audition_id_idx on public.votes (audition_id);
create index if not exists votes_voter_id_idx on public.votes (voter_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists performer_profiles_set_updated_at on public.performer_profiles;
create trigger performer_profiles_set_updated_at
before update on public.performer_profiles
for each row execute function public.set_updated_at();

drop trigger if exists live_rooms_set_updated_at on public.live_rooms;
create trigger live_rooms_set_updated_at
before update on public.live_rooms
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'audience')
  )
  on conflict (id) do nothing;

  return new;
exception
  when invalid_text_representation then
    insert into public.users (id, email, role)
    values (new.id, coalesce(new.email, ''), 'audience')
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.performer_profiles enable row level security;
alter table public.live_rooms enable row level security;
alter table public.auditions enable row level security;
alter table public.votes enable row level security;

drop policy if exists "Users can read themselves" on public.users;
create policy "Users can read themselves"
on public.users for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can update themselves" on public.users;
create policy "Users can update themselves"
on public.users for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"
on public.profiles for select
to anon, authenticated
using (true);

drop policy if exists "Users create own profile" on public.profiles;
create policy "Users create own profile"
on public.profiles for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Performer profiles are public" on public.performer_profiles;
create policy "Performer profiles are public"
on public.performer_profiles for select
to anon, authenticated
using (true);

drop policy if exists "Performers create own performer profile" on public.performer_profiles;
create policy "Performers create own performer profile"
on public.performer_profiles for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.users
    where users.id = auth.uid()
    and users.role in ('performer', 'host', 'admin')
  )
);

drop policy if exists "Performers update own performer profile" on public.performer_profiles;
create policy "Performers update own performer profile"
on public.performer_profiles for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Live rooms are public read" on public.live_rooms;
create policy "Live rooms are public read"
on public.live_rooms for select
to anon, authenticated
using (true);

drop policy if exists "Auditions are public read" on public.auditions;
create policy "Auditions are public read"
on public.auditions for select
to anon, authenticated
using (true);

drop policy if exists "Performers create own auditions" on public.auditions;
create policy "Performers create own auditions"
on public.auditions for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.users
    where users.id = auth.uid()
    and users.role in ('performer', 'host', 'admin')
  )
);

drop policy if exists "Performers update own auditions" on public.auditions;
create policy "Performers update own auditions"
on public.auditions for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Votes are public read" on public.votes;
create policy "Votes are public read"
on public.votes for select
to authenticated
using (true);

drop policy if exists "Audience can vote once during live rooms" on public.votes;
create policy "Audience can vote once during live rooms"
on public.votes for insert
to authenticated
with check (
  voter_id = auth.uid()
  and exists (
    select 1
    from public.auditions
    join public.live_rooms on live_rooms.id = auditions.room_id
    where auditions.id = votes.audition_id
    and live_rooms.status = 'live'
  )
);

insert into public.live_rooms (livekit_room_name, title, status, starts_at)
values ('voces-debut-julio-15', 'Voces Debut', 'scheduled', '2026-07-15 20:00:00+00')
on conflict (livekit_room_name) do nothing;
