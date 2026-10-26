-- Always Happy: reviewer accounts for the /admin/ review page.
-- Run once in Supabase Dashboard → SQL Editor → New query → Run (after schema.sql).

-- 1. Reviewer list (managed by you in the Dashboard) ---------------------------
create table if not exists public.reviewers (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

alter table public.reviewers enable row level security;

-- A reviewer can see their own entry (the admin page uses this to check access).
drop policy if exists "reviewers read own entry" on public.reviewers;
create policy "reviewers read own entry"
  on public.reviewers for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.reviewers where user_id = (select auth.uid()))
$$;

-- 2. Reviewers can read every profile and change only status + review_note. ----
alter table public.pilot_profiles add column if not exists reviewed_by uuid references auth.users (id) on delete set null;

drop policy if exists "reviewers read all profiles" on public.pilot_profiles;
create policy "reviewers read all profiles"
  on public.pilot_profiles for select
  to authenticated
  using ((select public.is_reviewer()));

drop policy if exists "reviewers update profiles" on public.pilot_profiles;
create policy "reviewers update profiles"
  on public.pilot_profiles for update
  to authenticated
  using ((select public.is_reviewer()))
  with check ((select public.is_reviewer()));

-- Column-level limit: through the API, only these two columns can ever be updated.
revoke update on public.pilot_profiles from anon, authenticated;
grant update (status, review_note) on public.pilot_profiles to authenticated;

-- 3. Record who reviewed and when (replaces the version in schema.sql). --------
create or replace function public.stamp_reviewed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status then
    new.reviewed_at := now();
    new.reviewed_by := auth.uid();   -- null when changed from the Dashboard
  end if;
  return new;
end;
$$;

-- 4. Add a reviewer --------------------------------------------------------------
-- First create their login in Authentication → Users → Add user → Create new user
-- (tick "Auto Confirm User"), then run this with their email and display name:
--
--   insert into public.reviewers (user_id, name)
--   select id, '審核員姓名' from auth.users where email = 'reviewer@example.com';
--
-- Remove a reviewer:
--   delete from public.reviewers where user_id = (select id from auth.users where email = 'reviewer@example.com');
