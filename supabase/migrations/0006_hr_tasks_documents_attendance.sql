-- ============================================================
-- 0006: HR tasks, documents, attendance
-- ============================================================

create table hr_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assignee_id uuid references profiles(id) on delete set null,
  related_employee_id uuid references employees(id) on delete set null,
  due_date date,
  priority task_priority not null default 'medium',
  status hr_task_status not null default 'to_do',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_hr_tasks_assignee on hr_tasks(assignee_id);
create index idx_hr_tasks_status on hr_tasks(status);

create table documents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  document_name text not null,
  document_type text not null,
  file_path text not null,                -- path inside the Supabase Storage bucket
  uploaded_by uuid references profiles(id) on delete set null,
  visibility document_visibility not null default 'hr_only',
  uploaded_at timestamptz not null default now()
);

create index idx_documents_employee on documents(employee_id);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  work_date date not null,
  check_in_time timestamptz,
  check_out_time timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, work_date),
  constraint chk_checkout_after_checkin
    check (check_out_time is null or check_in_time is null or check_out_time >= check_in_time)
);

create index idx_attendance_date on attendance(work_date);
create index idx_attendance_employee on attendance(employee_id, work_date);
