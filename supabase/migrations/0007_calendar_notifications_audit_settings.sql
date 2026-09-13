-- ============================================================
-- 0007: Calendar, notifications, audit log, company settings
-- ============================================================

-- Manual entries only (company holidays, all-hands meetings). Birthdays,
-- anniversaries, approved leave, and task due dates are computed at query
-- time from their source tables rather than duplicated in here.
create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type calendar_event_type not null default 'company_event',
  event_date date not null,
  end_date date,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint chk_calendar_end_after_start check (end_date is null or end_date >= event_date)
);

create index idx_calendar_events_date on calendar_events(event_date);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  related_entity_type text,
  related_entity_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_recipient on notifications(recipient_id, is_read);

-- Populated only by security-definer triggers on the audited tables
-- (added in the Phase 6 migration) — never inserted directly by the client.
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index idx_audit_logs_created on audit_logs(created_at desc);

-- Singleton row: the `check (id = 1)` constraint plus seeding exactly one
-- row is the simplest reliable way to guarantee a single settings record.
create table company_settings (
  id int primary key default 1,
  company_name text not null default 'My Company',
  logo_url text,
  address text,
  contact_email text,
  contact_phone text,
  date_format text not null default 'DD/MM/YYYY',
  timezone text not null default 'Africa/Lagos',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_singleton check (id = 1)
);

insert into company_settings (id) values (1);
