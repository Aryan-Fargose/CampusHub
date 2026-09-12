-- ==============================================================================
-- CampusHub Supabase Schema: public.profiles
-- ==============================================================================
-- Run this migration in your Supabase SQL Editor if you wish to initialize
-- or update the dedicated public.profiles table with Row Level Security (RLS).
-- ==============================================================================

-- 1. Create profiles table if it doesn't already exist
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  username_changed_at timestamp with time zone default null,
  house text default 'Ravenclaw',
  role text default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. If table already existed, ensure required columns exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'username_changed_at'
  ) then
    alter table public.profiles add column username_changed_at timestamp with time zone default null;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'house'
  ) then
    alter table public.profiles add column house text default 'Ravenclaw';
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'role'
  ) then
    alter table public.profiles add column role text default 'student';
  end if;
end $$;

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 4. Policies: Public viewable, authenticated users can insert and update their own record
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles
  for insert with check ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using ((select auth.uid()) = id);

-- 5. Helpful index on username for quick lookups
create index if not exists idx_profiles_username on public.profiles (username);
