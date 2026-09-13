-- ============================================================
-- 0011: RLS policies — profiles, reference tables, employees
--
-- Approach: RLS is enabled on every table with no default access; every
-- allowed read/write is an explicit policy. See 0010 for the helper
-- functions (auth_role, auth_employee_id, is_admin, is_manager_of) used
-- throughout.
-- ============================================================

-- ---------- profiles ----------
alter table profiles enable row level security;

create policy profiles_select_self on profiles for select
  to authenticated using (id = auth.uid());

create policy profiles_select_admin on profiles for select
  to authenticated using (is_admin());

create policy profiles_update_self on profiles for update
  to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy profiles_update_admin on profiles for update
  to authenticated using (is_admin()) with check (is_admin());

-- No INSERT/DELETE policy: rows are created only by the handle_new_user
-- trigger (0009), which runs as the table owner and so is unaffected by
-- RLS. Accounts are deactivated via `is_active`, never hard-deleted.

-- ---------- employment_types ----------
alter table employment_types enable row level security;

create policy employment_types_select on employment_types for select
  to authenticated using (true);

create policy employment_types_insert on employment_types for insert
  to authenticated with check (is_admin());

create policy employment_types_update on employment_types for update
  to authenticated using (is_admin()) with check (is_admin());

create policy employment_types_delete on employment_types for delete
  to authenticated using (is_admin());

-- ---------- departments ----------
alter table departments enable row level security;

create policy departments_select on departments for select
  to authenticated using (true);

create policy departments_insert on departments for insert
  to authenticated with check (is_admin());

create policy departments_update on departments for update
  to authenticated using (is_admin()) with check (is_admin());

create policy departments_delete on departments for delete
  to authenticated using (is_admin());

-- ---------- job_roles ----------
alter table job_roles enable row level security;

create policy job_roles_select on job_roles for select
  to authenticated using (true);

create policy job_roles_insert on job_roles for insert
  to authenticated with check (is_admin());

create policy job_roles_update on job_roles for update
  to authenticated using (is_admin()) with check (is_admin());

create policy job_roles_delete on job_roles for delete
  to authenticated using (is_admin());

-- ---------- employees ----------
-- Note: the public_employee_directory view (0003) is how every role browses
-- the company directory. These policies govern the raw table, which carries
-- sensitive fields (DOB, address, notes, emergency contacts) — so reads here
-- are intentionally limited to self / direct manager / admin, matching the
-- "View full HR record" row of the role matrix.
alter table employees enable row level security;

create policy employees_select_admin on employees for select
  to authenticated using (is_admin());

create policy employees_select_manager on employees for select
  to authenticated using (auth_role() = 'manager' and manager_id = auth_employee_id());

create policy employees_select_self on employees for select
  to authenticated using (profile_id = auth.uid());

create policy employees_insert_admin on employees for insert
  to authenticated with check (is_admin());

create policy employees_update_admin on employees for update
  to authenticated using (is_admin()) with check (is_admin());

-- Employees may update their own row, but the trigger in 0009 strips any
-- change outside the handful of personal fields the brief allows them to
-- self-edit (phone, address, emergency contact, etc).
create policy employees_update_self on employees for update
  to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- Prefer soft delete (UPDATE deleted_at) from the application; this policy
-- exists for completeness but the UI should not expose hard delete.
create policy employees_delete_admin on employees for delete
  to authenticated using (is_admin());
