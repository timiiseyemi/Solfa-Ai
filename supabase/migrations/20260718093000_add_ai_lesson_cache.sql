alter table public.songs
  add column if not exists ai_lesson jsonb,
  add column if not exists lesson_generated_at timestamptz;
