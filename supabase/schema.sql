-- Always Happy: pilot profile + review workflow
-- Run once in Supabase Dashboard → SQL Editor → New query → Run.

-- 1. Pilot profiles (one row per account) ------------------------------------
create table if not exists public.pilot_profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  status           text not null default 'pending'
                   check (status in ('pending', 'approved', 'rejected')),
  email            text not null,
  name_chinese     text,
  name_english     text,
  phone            text,
  location         text,
  nationality      text,
  contact_time     text,
  experiences      jsonb not null default '[]'::jsonb,  -- [{company, role, period, status}]
  licence          text,
  licence_country  text,
  aircraft_types   text,
  type_rating      text,
  total_hours      integer,
  pic_hours        integer,
  english          text,
  target_location  text,
  work_type        text,
  availability     text,
  notes            text,
  review_note      text,         -- reviewer's note, shown to the pilot
  created_at       timestamptz not null default now(),
  reviewed_at      timestamptz
);

-- 2. Row Level Security: a pilot can only read their own row. ----------------
--    There is no insert/update policy for pilots: rows are created by the
--    signup trigger below and only reviewers (Dashboard) can change status.
alter table public.pilot_profiles enable row level security;

drop policy if exists "pilots read own profile" on public.pilot_profiles;
create policy "pilots read own profile"
  on public.pilot_profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- 3. Create the profile from the signup form data. ---------------------------
--    The form sends its fields as user metadata under "pilot_profile".
create or replace function public.to_int_or_null(value text)
returns integer
language sql
immutable
as $$
  select case when value ~ '^\d{1,7}$' then value::integer end
$$;

create or replace function public.handle_new_pilot()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  p jsonb := new.raw_user_meta_data -> 'pilot_profile';
begin
  if p is null then
    return new;
  end if;

  insert into public.pilot_profiles (
    id, email, name_chinese, name_english, phone, location, nationality, contact_time,
    experiences, licence, licence_country, aircraft_types, type_rating,
    total_hours, pic_hours, english, target_location, work_type, availability, notes
  ) values (
    new.id, new.email,
    left(p ->> 'name_chinese', 100), left(p ->> 'name_english', 100),
    left(p ->> 'phone', 50), left(p ->> 'location', 100),
    left(p ->> 'nationality', 100), left(p ->> 'contact_time', 50),
    case when jsonb_typeof(p -> 'experiences') = 'array' then p -> 'experiences' else '[]'::jsonb end,
    left(p ->> 'licence', 100), left(p ->> 'licence_country', 100),
    left(p ->> 'aircraft_types', 200), left(p ->> 'type_rating', 20),
    public.to_int_or_null(p ->> 'total_hours'), public.to_int_or_null(p ->> 'pic_hours'),
    left(p ->> 'english', 50), left(p ->> 'target_location', 200),
    left(p ->> 'work_type', 50), left(p ->> 'availability', 100),
    left(p ->> 'notes', 2000)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_pilot on auth.users;
create trigger on_auth_user_created_pilot
  after insert on auth.users
  for each row execute function public.handle_new_pilot();

-- 4. Stamp reviewed_at whenever a reviewer changes the status. ---------------
create or replace function public.stamp_reviewed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status then
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists pilot_profiles_reviewed_at on public.pilot_profiles;
create trigger pilot_profiles_reviewed_at
  before update on public.pilot_profiles
  for each row execute function public.stamp_reviewed_at();
