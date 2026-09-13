-- ============================================================
-- Seed data (development only — never run against production)
--
-- Phase 1 seeds just the reference/lookup tables so dropdowns aren't empty
-- while you build the app shell. The ~20 fictional employees, leave
-- requests, and onboarding tasks called for in the brief are seeded in
-- Phase 2, once the Employee Directory exists to actually display them.
-- ============================================================

insert into employment_types (name, description) values
  ('Full Time', 'Standard full-time employment'),
  ('Part Time', 'Reduced-hours employment'),
  ('Contract', 'Fixed-term contract'),
  ('Intern', 'Internship placement'),
  ('Corp Member', 'NYSC placement'),
  ('Graduate Trainee', 'Early-career graduate program')
on conflict (name) do nothing;

insert into departments (name, description) values
  ('Management', 'Executive and senior leadership'),
  ('Human Resources', 'People operations and HR'),
  ('Finance', 'Accounting and finance'),
  ('Marketing', 'Brand, content, and growth'),
  ('Operations', 'Day-to-day business operations'),
  ('IT', 'Engineering and IT support'),
  ('Sales', 'Business development and sales'),
  ('Logistics', 'Logistics and supply chain management'),
  ('Production', 'Media & Content Production'),
  ('Social Media', 'Social Media Management'),
  ('Broadcasting', 'Broadcasting & Presenters')
on conflict (name) do nothing;

insert into leave_types (name, description, default_annual_allowance, requires_approval, color) values
  ('Annual Leave', 'Standard yearly vacation allowance', 20, true, '#3b82f6'),
  ('Sick Leave', 'Illness or medical appointments', 10, true, '#ef4444'),
  ('Personal Leave', 'Personal matters', 5, true, '#a855f7'),
  ('Maternity/Paternity Leave', 'Parental leave', 90, true, '#ec4899'),
  ('Compassionate Leave', 'Bereavement or family emergency', 5, true, '#64748b'),
  ('Other', 'Anything not covered above', 0, true, '#94a3b8')
on conflict (name) do nothing;

-- ------------------------------------------------------------
-- Bootstrapping your first Super Admin (one-time, manual step)
-- ------------------------------------------------------------
-- 1. In the Supabase dashboard: Authentication → Users → Add user.
--    Create yourself an account with an email + password.
-- 2. Run the statement below in the SQL Editor, with your new user's UUID
--    (copy it from the Users table) or email:
--
--   update public.profiles
--   set role = 'super_admin'
--   where id = (select id from auth.users where email = 'you@company.com');
--
-- The handle_new_user trigger (migration 0009) already created your
-- `profiles` row with role = 'employee' the moment the auth user was
-- created — this just promotes it.
