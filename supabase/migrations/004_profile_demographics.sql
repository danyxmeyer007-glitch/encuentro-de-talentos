alter table public.profiles
add column if not exists date_of_birth date,
add column if not exists gender text;

alter table public.profiles
drop constraint if exists profiles_gender_allowed;

alter table public.profiles
add constraint profiles_gender_allowed
check (
  gender is null
  or gender in (
    'mujer',
    'hombre',
    'no_binario',
    'prefiero_no_decir',
    'otro'
  )
);

create index if not exists profiles_country_idx on public.profiles (country);
create index if not exists profiles_gender_idx on public.profiles (gender);
create index if not exists profiles_date_of_birth_idx on public.profiles (date_of_birth);
