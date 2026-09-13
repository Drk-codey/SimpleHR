-- ============================================================
-- 0001: Extensions and enum types
-- ============================================================

create extension if not exists pgcrypto;

create type user_role as enum ('super_admin', 'hr_admin', 'manager', 'employee');
create type employment_status as enum ('active', 'on_leave', 'suspended', 'terminated');
create type leave_status as enum ('pending', 'approved', 'rejected', 'cancelled');
create type onboarding_status as enum ('not_started', 'in_progress', 'completed', 'overdue');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');
create type hr_task_status as enum ('to_do', 'in_progress', 'completed', 'cancelled');
create type document_visibility as enum ('employee_only', 'manager_hr', 'hr_only');
create type onboarding_assignee_role as enum ('hr', 'manager', 'employee', 'specific');
create type calendar_event_type as enum ('company_event', 'holiday');
