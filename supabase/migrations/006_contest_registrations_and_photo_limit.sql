update storage.buckets
set file_size_limit = 2097152
where id = 'profile-photos';

create table if not exists public.contest_registrations (
  id uuid primary key default gen_random_uuid(),
  contest_slug text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (contest_slug, user_id)
);

create index if not exists contest_registrations_contest_slug_idx
on public.contest_registrations (contest_slug);

create index if not exists contest_registrations_user_id_idx
on public.contest_registrations (user_id);

alter table public.contest_registrations enable row level security;

drop policy if exists "Contest registrations are public read" on public.contest_registrations;
create policy "Contest registrations are public read"
on public.contest_registrations for select
to anon, authenticated
using (true);

drop policy if exists "Users register themselves to contests" on public.contest_registrations;
create policy "Users register themselves to contests"
on public.contest_registrations for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users remove own contest registration" on public.contest_registrations;
create policy "Users remove own contest registration"
on public.contest_registrations for delete
to authenticated
using (user_id = auth.uid());
