create index if not exists profiles_created_at_desc_idx
on public.profiles (created_at desc);

create index if not exists contest_registrations_slug_created_at_idx
on public.contest_registrations (contest_slug, created_at);

create index if not exists camerino_samples_user_created_at_idx
on public.camerino_samples (user_id, created_at desc);

create index if not exists messages_sender_created_at_idx
on public.messages (sender_id, created_at desc);

create index if not exists messages_receiver_created_at_idx
on public.messages (receiver_id, created_at desc);

create index if not exists friend_requests_requester_addressee_idx
on public.friend_requests (requester_id, addressee_id);

create index if not exists friend_requests_addressee_requester_idx
on public.friend_requests (addressee_id, requester_id);
