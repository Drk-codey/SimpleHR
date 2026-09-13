-- ============================================================
-- 0002: Reference / lookup tables
-- ============================================================

create table employment_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- department_head_id references employees, which doesn't exist yet.
-- The FK is added in 0003 once the employees table is created.
create table departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  department_head_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table job_roles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department_id uuid not null references departments(id) on delete restrict,
  description text,
  default_employment_type_id uuid references employment_types(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (title, department_id)
);

create index idx_job_roles_department on job_roles(department_id);
