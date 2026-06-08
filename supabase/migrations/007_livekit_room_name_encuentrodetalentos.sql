insert into public.live_rooms (livekit_room_name, title, status, starts_at)
values ('encuentrodetalentos', 'Encuentro de Talentos Live', 'scheduled', '2026-07-15 20:00:00+00')
on conflict (livekit_room_name)
do update set
  title = excluded.title,
  starts_at = excluded.starts_at;
