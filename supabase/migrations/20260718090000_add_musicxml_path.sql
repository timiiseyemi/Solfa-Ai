alter table public.songs
  add column if not exists musicxml_path text;
