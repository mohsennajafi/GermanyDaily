-- German Daily: minimal secure cloud-sync schema
-- Run in Supabase SQL Editor. This schema only stores synced app settings
-- and user-created vocabulary; it does not implement paid subscriptions yet.

create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  custom_words jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

revoke all on public.user_data from anon;
grant select, insert, update, delete on public.user_data to authenticated;

drop policy if exists "Users can read own German Daily data" on public.user_data;
create policy "Users can read own German Daily data"
  on public.user_data for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own German Daily data" on public.user_data;
create policy "Users can insert own German Daily data"
  on public.user_data for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own German Daily data" on public.user_data;
create policy "Users can update own German Daily data"
  on public.user_data for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own German Daily data" on public.user_data;
create policy "Users can delete own German Daily data"
  on public.user_data for delete to authenticated
  using (auth.uid() = user_id);
