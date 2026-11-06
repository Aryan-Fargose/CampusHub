-- ==============================================================================
-- CampusHub Supabase Migration: Owl Post Feature
-- Secure Schema, Row Level Security (RLS), Safe Public View & Moderation
-- ==============================================================================
-- NOTE: DO NOT EXECUTE AUTOMATICALLY.
-- Review and execute this migration via the Supabase SQL Editor.
-- This script is strictly idempotent, rerunnable, and preserves all existing data.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Prerequisites & Profile Role Security
-- Ensure public.profiles exists and verify/guarantee the 'role' column.
-- ------------------------------------------------------------------------------
do $$
begin
  -- Ensure profiles table exists
  if not exists (
    select 1 from information_schema.tables 
    where table_schema = 'public' and table_name = 'profiles'
  ) then
    create table if not exists public.profiles (
      id uuid references auth.users(id) on delete cascade primary key,
      username text unique,
      role text default 'student',
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
  end if;

  -- Ensure role column exists on public.profiles
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'role'
  ) then
    alter table public.profiles add column role text default 'student';
  end if;
end $$;

-- Prevent Privilege Escalation:
-- Normal authenticated users must NEVER be able to update their own role column.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- If role is modified by a standard user session, raise exception
  if (new.role is distinct from old.role) and (current_user not in ('postgres', 'service_role', 'supabase_admin')) then
    raise exception 'Modifying user roles is strictly restricted to academy administrators.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_role on public.profiles;
create trigger trg_protect_profile_role
  before update on public.profiles
  for each row
  execute function public.protect_profile_role();

-- ------------------------------------------------------------------------------
-- 2. Security Definer Helper Functions (Zero RLS Recursion)
-- ------------------------------------------------------------------------------

-- Helper A: Check if current user is an authorized moderator / scholar / prefect / admin
create or replace function public.is_owl_post_moderator()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and lower(role) in ('scholar', 'prefect', 'admin', 'moderator')
  );
$$;

-- Helper B: Check if a post exists and is approved (used to validate reactions/reports)
create or replace function public.is_owl_post_approved(p_post_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.owl_posts
    where id = p_post_id
      and status = 'approved'
  );
$$;

-- ------------------------------------------------------------------------------
-- 3. Table: public.owl_posts
-- Confession and message records. Default status is 'pending'.
-- ------------------------------------------------------------------------------
create table if not exists public.owl_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  content text not null,
  alias text not null default 'Anonymous',
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint owl_posts_content_length check (
    char_length(trim(content)) >= 1 and char_length(content) <= 1000
  ),
  constraint owl_posts_status_check check (
    status in ('pending', 'approved', 'rejected')
  )
);

-- Ensure default status is 'pending' even if table previously existed with 'approved'
alter table public.owl_posts alter column status set default 'pending';

-- ------------------------------------------------------------------------------
-- 4. Table: public.owl_post_reactions
-- Student reactions (heart, owl, sparkle, laugh).
-- ------------------------------------------------------------------------------
create table if not exists public.owl_post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.owl_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  reaction text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint owl_reaction_type_check check (
    reaction in ('heart', 'owl', 'sparkle', 'laugh')
  ),
  constraint owl_reaction_unique_user_post unique (post_id, user_id, reaction)
);

-- ------------------------------------------------------------------------------
-- 5. Table: public.owl_post_reports
-- Confidential moderation reports.
-- ------------------------------------------------------------------------------
create table if not exists public.owl_post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.owl_posts(id) on delete cascade not null,
  reporter_id uuid references auth.users(id) on delete set null,
  reason text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint owl_reports_reason_check check (
    reason in (
      'Harassment or bullying',
      'Personal information exposure',
      'Hate or abusive content',
      'Spam',
      'Threats or unsafe content',
      'Other'
    )
  ),
  constraint owl_reports_status_check check (
    status in ('pending', 'reviewed', 'dismissed')
  ),
  constraint owl_reports_unique_reporter unique (post_id, reporter_id)
);

-- ------------------------------------------------------------------------------
-- 6. Performance Indexes
-- ------------------------------------------------------------------------------
create index if not exists idx_owl_posts_status_created_at
  on public.owl_posts (status, created_at desc);

create index if not exists idx_owl_posts_user_id
  on public.owl_posts (user_id);

create index if not exists idx_owl_reactions_post_id
  on public.owl_post_reactions (post_id);

create index if not exists idx_owl_reactions_user_id
  on public.owl_post_reactions (user_id);

create index if not exists idx_owl_reports_post_id
  on public.owl_post_reports (post_id);

create index if not exists idx_owl_reports_status
  on public.owl_post_reports (status);

-- ------------------------------------------------------------------------------
-- 7. Safe Public View: public.owl_posts_public
-- CRITICAL PRIVACY ARCHITECTURE:
-- The public feed queries this security-barrier view, which physically excludes
-- user_id, email, and private metadata. Direct-table queries on public.owl_posts
-- do not expose author IDs to other users.
-- ------------------------------------------------------------------------------
create or replace view public.owl_posts_public with (security_barrier = true) as
select
  id,
  content,
  alias,
  status,
  created_at
from public.owl_posts
where status = 'approved';

grant select on public.owl_posts_public to anon, authenticated;

-- ------------------------------------------------------------------------------
-- 8. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
alter table public.owl_posts enable row level security;
alter table public.owl_post_reactions enable row level security;
alter table public.owl_post_reports enable row level security;

-- ==============================================================================
-- Policies on public.owl_posts
-- ==============================================================================

-- A. Authors can view their own submissions (pending, approved, or rejected) for "My Letters"
drop policy if exists "Approved owl posts are viewable by everyone" on public.owl_posts;
drop policy if exists "Authors can view own owl posts" on public.owl_posts;
create policy "Authors can view own owl posts" on public.owl_posts
  for select using ((select auth.uid()) = user_id);

-- B. Moderators can view all posts (pending, approved, rejected)
drop policy if exists "Moderators can view all owl posts" on public.owl_posts;
create policy "Moderators can view all owl posts" on public.owl_posts
  for select using (public.is_owl_post_moderator());

-- C. Normal users can ONLY insert their own posts with status = 'pending'
drop policy if exists "Authenticated users can submit owl posts" on public.owl_posts;
drop policy if exists "Users can insert own pending owl posts" on public.owl_posts;
create policy "Users can insert own pending owl posts" on public.owl_posts
  for insert with check (
    (select auth.uid()) = user_id
    and status = 'pending'
  );

-- D. Normal users CANNOT update post status. Only authorized moderators can approve/reject.
drop policy if exists "Moderators can update owl posts" on public.owl_posts;
create policy "Moderators can update owl posts" on public.owl_posts
  for update
  using (public.is_owl_post_moderator())
  with check (public.is_owl_post_moderator());

-- E. Authors can delete their own pending posts (before approval)
drop policy if exists "Authors can delete own owl posts" on public.owl_posts;
drop policy if exists "Authors can delete own pending owl posts" on public.owl_posts;
create policy "Authors can delete own pending owl posts" on public.owl_posts
  for delete using (
    (select auth.uid()) = user_id
    and status = 'pending'
  );

-- F. Moderators can delete any owl post
drop policy if exists "Moderators can delete any owl post" on public.owl_posts;
create policy "Moderators can delete any owl post" on public.owl_posts
  for delete using (public.is_owl_post_moderator());

-- ==============================================================================
-- Policies on public.owl_post_reactions
-- ==============================================================================

-- A. Public can view reaction counts on approved posts
drop policy if exists "Public can view reactions on approved posts" on public.owl_post_reactions;
create policy "Public can view reactions on approved posts" on public.owl_post_reactions
  for select using (public.is_owl_post_approved(post_id));

-- B. Authenticated users can ONLY react to approved posts
drop policy if exists "Users can add own reaction" on public.owl_post_reactions;
drop policy if exists "Users can add own reaction on approved posts" on public.owl_post_reactions;
create policy "Users can add own reaction on approved posts" on public.owl_post_reactions
  for insert with check (
    (select auth.uid()) = user_id
    and public.is_owl_post_approved(post_id)
  );

-- C. Users can remove their own reaction
drop policy if exists "Users can remove own reaction" on public.owl_post_reactions;
create policy "Users can remove own reaction" on public.owl_post_reactions
  for delete using ((select auth.uid()) = user_id);

-- D. Moderators can delete any reaction if needed
drop policy if exists "Moderators can delete reactions" on public.owl_post_reactions;
create policy "Moderators can delete reactions" on public.owl_post_reactions
  for delete using (public.is_owl_post_moderator());

-- ==============================================================================
-- Policies on public.owl_post_reports
-- ==============================================================================

-- A. Authenticated users can file reports on approved posts only
drop policy if exists "Users can file reports" on public.owl_post_reports;
drop policy if exists "Users can file reports on approved posts" on public.owl_post_reports;
create policy "Users can file reports on approved posts" on public.owl_post_reports
  for insert with check (
    (select auth.uid()) = reporter_id
    and public.is_owl_post_approved(post_id)
  );

-- B. Confidential: Only authorized moderators can view reports
drop policy if exists "Moderators can view reports" on public.owl_post_reports;
drop policy if exists "Moderators can view all reports" on public.owl_post_reports;
create policy "Moderators can view all reports" on public.owl_post_reports
  for select using (public.is_owl_post_moderator());

-- C. Only authorized moderators can update report status (e.g., mark reviewed/dismissed)
drop policy if exists "Moderators can update report status" on public.owl_post_reports;
create policy "Moderators can update report status" on public.owl_post_reports
  for update
  using (public.is_owl_post_moderator())
  with check (public.is_owl_post_moderator());
