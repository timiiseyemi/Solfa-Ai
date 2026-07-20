alter table public.songs
  add column if not exists lesson_source text default 'fallback';
