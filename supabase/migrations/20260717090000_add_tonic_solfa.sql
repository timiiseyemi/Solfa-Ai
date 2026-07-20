alter table public.songs
  add column if not exists tonic_solfa text;
