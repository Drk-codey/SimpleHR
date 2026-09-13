-- ============================================================
-- 0003: Profiles and employees
-- ============================================================

-- profiles is the thin auth-linked record (role + display name), 1:1 with
-- auth.users. employees is the full HR record. They're kept separate because
-- a Super Admin account doesn't have to *be* an employee, and HR can create
-- an employee record before that person has login access (profile_id is
-- nullable on employees).
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'employee',
  full_name text not null,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles(id) on delete set null,
  employee_number text not null unique,
  first_name text not null,
  last_name text not null,
  preferred_name text,
  email text not null unique,
  phone text,
  date_of_birth date,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relationship text,
  department_id uuid references departments(id) on delete set null,
  job_role_id uuid references job_roles(id) on delete set null,
  employment_type_id uuid references employment_types(id) on delete set null,
  manager_id uuid references employees(id) on delete set null,
  employment_status employment_status not null default 'active',
  start_date date not null,
  end_date date,
  location text,
  avatar_url text,
  notes text,                  -- HR-only private notes, never shown to the employee
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,       -- soft delete
  constraint chk_end_after_start check (end_date is null or end_date >= start_date),
  constraint chk_not_own_manager check (manager_id is null or manager_id <> id)
);

create index idx_employees_department on employees(department_id);
create index idx_employees_job_role on employees(job_role_id);
create index idx_employees_manager on employees(manager_id);
create index idx_employees_status on employees(employment_status);
create index idx_employees_profile on employees(profile_id);
create unique index idx_employees_active_email on employees(lower(email)) where deleted_at is null;

alter table departments
  add constraint fk_department_head foreign key (department_head_id)
  references employees(id) on delete set null;

-- Directory privacy: a VIEW exposes only safe columns to all authenticated
-- users, instead of relying on RLS to hide specific columns of the raw
-- employees table (RLS filters rows, not columns).
--
-- Note: this view intentionally runs with the privileges of its owner (the
-- migration role), which is why it can show every active employee even
-- though the underlying `employees` table's RLS restricts full-row reads to
-- self/manager/admin — that's the whole point of the view. Supabase's
-- dashboard linter may flag this as a "security definer view"; that warning
-- doesn't apply here because the view's own column list is the security
-- boundary, not a bypass of something it shouldn't bypass.
create view public_employee_directory as
  select id, first_name, last_name, preferred_name, avatar_url,
         job_role_id, department_id, location, employment_status, email
  from employees
  where deleted_at is null;

grant select on public_employee_directory to authenticated;
