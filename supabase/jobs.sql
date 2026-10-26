-- Always Happy: pilot job listings, visible only to approved members.
-- Run once in Supabase Dashboard → SQL Editor → New query → Run (after schema.sql).
-- Add or edit jobs later in Table Editor → jobs; set published = false to hide one.

-- 1. Jobs ---------------------------------------------------------------------
create table if not exists public.jobs (
  id               bigint generated always as identity primary key,
  title            text not null,                 -- 職位
  aircraft         text,                          -- 機型
  airline          text,                          -- 航空公司（可寫代稱）
  base             text,                          -- 工作國家／基地
  employment_type  text,                          -- 全職／合約…
  requirements     text,                          -- 資格條件
  benefits         text,                          -- 待遇與福利
  contact_name     text,                          -- 聯絡人
  contact_info     text,                          -- 聯絡方式
  published        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- 2. Only signed-in pilots whose profile is approved can read published jobs.
--    (To show jobs to every signed-in member, replace the using(...) with: using (published))
alter table public.jobs enable row level security;

create or replace function public.is_approved_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.pilot_profiles
    where id = (select auth.uid()) and status = 'approved'
  )
$$;

drop policy if exists "approved members read published jobs" on public.jobs;
create policy "approved members read published jobs"
  on public.jobs for select
  to authenticated
  using (published and (select public.is_approved_member()));

-- 3. Sample jobs (fictional — replace or delete before going live) -------------
insert into public.jobs
  (title, aircraft, airline, base, employment_type, requirements, benefits, contact_name, contact_info)
values
  ('【範例】A320 副機師 First Officer', 'Airbus A320 / A321', '範例航空 A（日本低成本航空）', '日本・大阪關西',
   '全職・3 年合約', E'ATPL 或 CPL + IR\n總飛行時數 1,500 小時以上\nA320 Type Rating\nICAO 英文 Level 4 以上',
   E'提供住宿補助\n年度返鄉機票', 'Always Happy 招募團隊', '（範例）請洽 Always Happy 顧問'),
  ('【範例】B737 機長 Captain', 'Boeing 737-800 / MAX', '範例航空 B（東南亞航空）', '越南・胡志明市',
   '全職・合約可續', E'ATPL\n總飛行時數 5,000 小時以上，PIC 3,000 小時以上\nB737 Type Rating\n近 12 個月有飛行紀錄',
   E'具競爭力的薪資\n排班可協商', 'Always Happy 招募團隊', '（範例）請洽 Always Happy 顧問'),
  ('【範例】ATR 72 副機師', 'ATR 72-600', '範例航空 C（區域航空）', '台灣・台北松山',
   '全職', E'CPL + IR\n總飛行時數 500 小時以上\n可接受無 Type Rating（公司安排訓練）\n具台灣工作資格',
   E'公司負擔機型訓練\n在地基地', 'Always Happy 招募團隊', '（範例）請洽 Always Happy 顧問'),
  ('【範例】A330 巡航副機師 Cruise Relief Pilot', 'Airbus A330', '範例航空 D（中東航空）', '阿拉伯聯合大公國・杜拜',
   '全職・合約', E'ATPL\n總飛行時數 3,000 小時以上\n寬體機經驗優先\nICAO 英文 Level 5 以上',
   E'免稅薪資\n眷屬住房與教育補助', 'Always Happy 招募團隊', '（範例）請洽 Always Happy 顧問');
