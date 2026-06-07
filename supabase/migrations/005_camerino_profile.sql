alter table public.profiles
add column if not exists camerino_theme text not null default 'gold';

alter table public.profiles
drop constraint if exists profiles_camerino_theme_allowed;

alter table public.profiles
add constraint profiles_camerino_theme_allowed
check (camerino_theme in ('gold', 'cyan', 'pink', 'violet', 'emerald'));

create table if not exists public.camerino_samples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 90),
  url text not null check (url ~* '^https?://'),
  sample_type text not null default 'link',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint camerino_samples_type_allowed check (
    sample_type in ('audio', 'video', 'image', 'link')
  )
);

create index if not exists camerino_samples_user_id_idx on public.camerino_samples (user_id);
create index if not exists camerino_samples_created_at_idx on public.camerino_samples (created_at);

drop trigger if exists camerino_samples_set_updated_at on public.camerino_samples;
create trigger camerino_samples_set_updated_at
before update on public.camerino_samples
for each row execute function public.set_updated_at();

alter table public.camerino_samples enable row level security;

drop policy if exists "Camerino samples are public read" on public.camerino_samples;
create policy "Camerino samples are public read"
on public.camerino_samples for select
to anon, authenticated
using (true);

drop policy if exists "Users create own camerino samples" on public.camerino_samples;
create policy "Users create own camerino samples"
on public.camerino_samples for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users update own camerino samples" on public.camerino_samples;
create policy "Users update own camerino samples"
on public.camerino_samples for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users delete own camerino samples" on public.camerino_samples;
create policy "Users delete own camerino samples"
on public.camerino_samples for delete
to authenticated
using (user_id = auth.uid());
