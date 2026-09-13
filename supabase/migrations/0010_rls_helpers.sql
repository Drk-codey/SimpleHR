-- ============================================================
-- 0010: RLS helper functions
-- ============================================================

create or replace function auth_role()
returns user_role
language sql stable security definer set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function auth_employee_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from employees where profile_id = auth.uid();
$$;

create or replace function is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select auth_role() in ('super_admin', 'hr_admin');
$$;

create or replace function is_manager_of(target_employee_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from employees
    where id = target_employee_id and manager_id = auth_employee_id()
  );
$$;
