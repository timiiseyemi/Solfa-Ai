alter table public.songs
  add column if not exists estimated_key text,
  add column if not exists estimated_bpm integer,
  add column if not exists estimated_time_signature text,
  add column if not exists difficulty text,
  add column if not exists pitch_accuracy integer,
  add column if not exists complexity_score integer;
