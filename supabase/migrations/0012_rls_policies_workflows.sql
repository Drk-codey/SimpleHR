-- ============================================================
-- 0012: RLS policies — leave, onboarding, tasks, documents,
-- attendance, calendar, notifications, audit log, settings
-- ============================================================

-- ---------- leave_types ----------
alter table leave_types enable row level security;

create policy leave_types_select on leave_types for select
  to authenticated using (true);

create policy leave_types_insert on leave_types for insert
  to authenticated with check (is_admin());

create policy leave_types_update on leave_types for update
  to authenticated using (is_admin()) with check (is_admin());

create policy leave_types_delete on leave_types for delete
  to authenticated using (is_admin());

-- ---------- leave_balances ----------
alter table leave_balances enable row level security;

create policy leave_balances_select on leave_balances for select
  to authenticated using (
    is_admin() or employee_id = auth_employee_id() or is_manager_of(employee_id)
  );

-- Only HR/Admin adjust balances (brief §5: "Adjust employee leave balances").
create policy leave_balances_write_admin on leave_balances for all
  to authenticated using (is_admin()) with check (is_admin());

-- ---------- leave_requests ----------
alter table leave_requests enable row level security;

create policy leave_requests_select on leave_requests for select
  to authenticated using (
    is_admin() or employee_id = auth_employee_id() or is_manager_of(employee_id)
  );

create policy leave_requests_insert on leave_requests for insert
  to authenticated with check (employee_id = auth_employee_id() or is_admin());

-- Employees can only touch their own request while it's still pending (cancel).
create policy leave_requests_update_self on leave_requests for update
  to authenticated
  using (employee_id = auth_employee_id() and status = 'pending')
  with check (employee_id = auth_employee_id());

-- Managers/admins change status on requests they're allowed to see.
create policy leave_requests_update_approver on leave_requests for update
  to authenticated
  using (is_admin() or is_manager_of(employee_id))
  with check (is_admin() or is_manager_of(employee_id));

-- No DELETE policy: cancellation is a status change (UPDATE), not a delete.

-- ---------- onboarding_templates / onboarding_template_tasks ----------
alter table onboarding_templates enable row level security;

create policy onboarding_templates_all_admin on onboarding_templates for all
  to authenticated using (is_admin()) with check (is_admin());

alter table onboarding_template_tasks enable row level security;

create policy onboarding_template_tasks_all_admin on onboarding_template_tasks for all
  to authenticated using (is_admin()) with check (is_admin());

-- ---------- employee_onboarding ----------
alter table employee_onboarding enable row level security;

create policy employee_onboarding_select on employee_onboarding for select
  to authenticated using (
    is_admin() or employee_id = auth_employee_id() or is_manager_of(employee_id)
  );

create policy employee_onboarding_write_admin on employee_onboarding for all
  to authenticated using (is_admin()) with check (is_admin());

-- ---------- onboarding_tasks ----------
alter table onboarding_tasks enable row level security;

create policy onboarding_tasks_select on onboarding_tasks for select
  to authenticated using (
    is_admin()
    or assigned_to = auth.uid()
    or exists (
      select 1 from employee_onboarding eo
      where eo.id = onboarding_tasks.employee_onboarding_id
        and (eo.employee_id = auth_employee_id() or is_manager_of(eo.employee_id))
    )
  );

create policy onboarding_tasks_insert_admin on onboarding_tasks for insert
  to authenticated with check (is_admin());

-- The assignee can update their own task (e.g. mark complete); admins can
-- update any. A column-level restriction limiting the assignee to only the
-- status/completed_at fields ships alongside the Phase 4 onboarding UI.
create policy onboarding_tasks_update on onboarding_tasks for update
  to authenticated
  using (assigned_to = auth.uid() or is_admin())
  with check (assigned_to = auth.uid() or is_admin());

create policy onboarding_tasks_delete_admin on onboarding_tasks for delete
  to authenticated using (is_admin());

-- ---------- hr_tasks ----------
alter table hr_tasks enable row level security;

create policy hr_tasks_select on hr_tasks for select
  to authenticated using (is_admin() or assignee_id = auth.uid());

create policy hr_tasks_insert_admin on hr_tasks for insert
  to authenticated with check (is_admin());

create policy hr_tasks_update on hr_tasks for update
  to authenticated
  using (is_admin() or assignee_id = auth.uid())
  with check (is_admin() or assignee_id = auth.uid());

create policy hr_tasks_delete_admin on hr_tasks for delete
  to authenticated using (is_admin());

-- ---------- documents ----------
alter table documents enable row level security;

create policy documents_select on documents for select
  to authenticated using (
    is_admin()
    or (visibility <> 'hr_only' and employee_id = auth_employee_id())
    or (visibility = 'manager_hr' and is_manager_of(employee_id))
  );

create policy documents_write_admin on documents for all
  to authenticated using (is_admin()) with check (is_admin());

-- ---------- attendance ----------
alter table attendance enable row level security;

create policy attendance_select on attendance for select
  to authenticated using (
    is_admin() or employee_id = auth_employee_id() or is_manager_of(employee_id)
  );

-- An employee can only check in/out for themself, and only for today —
-- prevents back-dating attendance from the client. Admins can log/correct
-- any date (e.g. fixing a missed check-out).
create policy attendance_insert_self on attendance for insert
  to authenticated with check (
    is_admin() or (employee_id = auth_employee_id() and work_date = current_date)
  );

create policy attendance_update_self on attendance for update
  to authenticated
  using (is_admin() or (employee_id = auth_employee_id() and work_date = current_date))
  with check (is_admin() or (employee_id = auth_employee_id() and work_date = current_date));

-- ---------- calendar_events ----------
alter table calendar_events enable row level security;

create policy calendar_events_select on calendar_events for select
  to authenticated using (true);

create policy calendar_events_insert on calendar_events for insert
  to authenticated with check (is_admin());

create policy calendar_events_update on calendar_events for update
  to authenticated using (is_admin()) with check (is_admin());

create policy calendar_events_delete on calendar_events for delete
  to authenticated using (is_admin());

-- ---------- notifications ----------
alter table notifications enable row level security;

create policy notifications_select_self on notifications for select
  to authenticated using (recipient_id = auth.uid());

create policy notifications_update_self on notifications for update
  to authenticated using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- No INSERT policy: created only by security-definer triggers added in
-- Phase 4 (leave submitted/approved, task assigned, etc), never by the client.

-- ---------- audit_logs ----------
alter table audit_logs enable row level security;

create policy audit_logs_select_admin on audit_logs for select
  to authenticated using (is_admin());

-- No INSERT/UPDATE/DELETE policy for anyone, including admins, via the
-- client. Rows are written only by security-definer triggers added in
-- Phase 6, and audit history must never be editable after the fact.

-- ---------- company_settings ----------
alter table company_settings enable row level security;

create policy company_settings_select on company_settings for select
  to authenticated using (true);

-- Company settings are Super Admin only, per the role matrix (stricter than
-- is_admin(), which also includes HR/Admin).
create policy company_settings_update on company_settings for update
  to authenticated using (auth_role() = 'super_admin') with check (auth_role() = 'super_admin');

-- No INSERT/DELETE: exactly one row is seeded in 0007 and chk_singleton
-- prevents a second one.
