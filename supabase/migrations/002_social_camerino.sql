do $$
begin
  create type public.friend_request_status as enum ('pending', 'accepted', 'declined');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_no_self check (follower_id <> following_id)
);

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.users(id) on delete cascade,
  addressee_id uuid not null references public.users(id) on delete cascade,
  status public.friend_request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friend_requests_no_self check (requester_id <> addressee_id),
  constraint friend_requests_unique_pair unique (requester_id, addressee_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1200),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint messages_no_self check (sender_id <> receiver_id)
);

create index if not exists follows_following_id_idx on public.follows (following_id);
create index if not exists friend_requests_requester_id_idx on public.friend_requests (requester_id);
create index if not exists friend_requests_addressee_id_idx on public.friend_requests (addressee_id);
create index if not exists friend_requests_status_idx on public.friend_requests (status);
create index if not exists messages_sender_id_idx on public.messages (sender_id);
create index if not exists messages_receiver_id_idx on public.messages (receiver_id);
create index if not exists messages_created_at_idx on public.messages (created_at);

drop trigger if exists friend_requests_set_updated_at on public.friend_requests;
create trigger friend_requests_set_updated_at
before update on public.friend_requests
for each row execute function public.set_updated_at();

create or replace function public.are_friends(first_user_id uuid, second_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.friend_requests
    where status = 'accepted'
    and (
      (requester_id = first_user_id and addressee_id = second_user_id)
      or (requester_id = second_user_id and addressee_id = first_user_id)
    )
  );
$$;

alter table public.follows enable row level security;
alter table public.friend_requests enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Follows are public read" on public.follows;
create policy "Follows are public read"
on public.follows for select
to anon, authenticated
using (true);

drop policy if exists "Users follow as themselves" on public.follows;
create policy "Users follow as themselves"
on public.follows for insert
to authenticated
with check (follower_id = auth.uid());

drop policy if exists "Users unfollow as themselves" on public.follows;
create policy "Users unfollow as themselves"
on public.follows for delete
to authenticated
using (follower_id = auth.uid());

drop policy if exists "Friend requests visible to participants" on public.friend_requests;
create policy "Friend requests visible to participants"
on public.friend_requests for select
to authenticated
using (requester_id = auth.uid() or addressee_id = auth.uid());

drop policy if exists "Users create own friend requests" on public.friend_requests;
create policy "Users create own friend requests"
on public.friend_requests for insert
to authenticated
with check (requester_id = auth.uid());

drop policy if exists "Users respond to received friend requests" on public.friend_requests;
create policy "Users respond to received friend requests"
on public.friend_requests for update
to authenticated
using (addressee_id = auth.uid())
with check (
  addressee_id = auth.uid()
  and status in ('accepted', 'declined')
);

drop policy if exists "Users can remove their friend requests" on public.friend_requests;
create policy "Users can remove their friend requests"
on public.friend_requests for delete
to authenticated
using (requester_id = auth.uid() or addressee_id = auth.uid());

drop policy if exists "Messages visible to participants" on public.messages;
create policy "Messages visible to participants"
on public.messages for select
to authenticated
using (sender_id = auth.uid() or receiver_id = auth.uid());

drop policy if exists "Friends can send messages" on public.messages;
create policy "Friends can send messages"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and public.are_friends(sender_id, receiver_id)
);

drop policy if exists "Receivers can mark messages read" on public.messages;
create policy "Receivers can mark messages read"
on public.messages for update
to authenticated
using (receiver_id = auth.uid())
with check (receiver_id = auth.uid());
