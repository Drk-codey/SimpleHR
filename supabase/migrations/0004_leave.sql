-- ============================================================
-- 0004: Leave management
-- ============================================================

create table leave_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  default_annual_allowance numeric(5,1) not null default 0,
  requires_approval boolean not null default true,
  color text not null default '#64748b',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table leave_balances (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  leave_type_id uuid not null references leave_types(id) on delete cascade,
  year int not null check (year between 2000 and 2100),
  allocated_days numeric(5,1) not null default 0 check (allocated_days >= 0),
  used_days numeric(5,1) not null default 0 check (used_days >= 0),
  carried_over_days numeric(5,1) not null default 0 check (carried_over_days >= 0),
  adjusted_days numeric(5,1) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, leave_type_id, year)
);

create index idx_leave_balances_employee on leave_balances(employee_id, year);

create table leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  leave_type_id uuid not null references leave_types(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  total_days numeric(5,1) not null check (total_days > 0),
  reason text,
  status leave_status not null default 'pending',
  approver_id uuid references employees(id) on delete set null,
  approved_at timestamptz,
  decision_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_leave_dates check (end_date >= start_date)
);

create index idx_leave_requests_employee on leave_requests(employee_id);
create index idx_leave_requests_status on leave_requests(status);
create index idx_leave_requests_dates on leave_requests(start_date, end_date);
