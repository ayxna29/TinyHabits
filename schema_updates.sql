-- Tiny Habits Practice — schema updates for Goals and Journal
-- Run this once in your Supabase project's SQL Editor, after schema.sql.
-- Safe to run even if you're not sure whether some of it already ran —
-- the table/column creation is idempotent, but don't re-run the CREATE POLICY
-- lines a second time (Postgres will error "policy already exists").

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  why text,
  target_date date,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "Users can view their own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

create index if not exists goals_user_id_idx on public.goals (user_id);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  tag_recipe_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy "Users can view their own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

create index if not exists journal_entries_user_id_idx on public.journal_entries (user_id);

-- extend recipes with an optional parent goal
alter table public.recipes add column if not exists goal_id uuid references public.goals(id) on delete set null;

create index if not exists recipes_goal_id_idx on public.recipes (goal_id);
