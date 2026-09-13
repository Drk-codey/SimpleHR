-- ============================================================
-- 0005: Onboarding
-- ============================================================

create table onboarding_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_active boolean not null default true,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table onboarding_template_tasks (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references onboarding_templates(id) on delete cascade,
  title text not null,
  description text,
  day_offset int not null default 0,
  assigned_role onboarding_assignee_role not null default 'hr',
  priority task_priority not null default 'medium',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_onboarding_template_tasks_template on onboarding_template_tasks(template_id);

create table employee_onboarding (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  template_id uuid references onboarding_templates(id) on delete set null,
  start_date date not null,
  status onboarding_status not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, template_id)
);

create index idx_employee_onboarding_employee on employee_onboarding(employee_id);

create table onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  employee_onboarding_id uuid not null references employee_onboarding(id) on delete cascade,
  template_task_id uuid references onboarding_template_tasks(id) on delete set null,
  title text not null,
  description text,
  assigned_to uuid references profiles(id) on delete set null,
  due_date date,
  priority task_priority not null default 'medium',
  status onboarding_status not null default 'not_started',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_onboarding_tasks_assignee on onboarding_tasks(assigned_to);
create index idx_onboarding_tasks_onboarding on onboarding_tasks(employee_onboarding_id);
