-- ============================================================
-- 0009: Auth bootstrap + anti-escalation triggers
-- ============================================================

-- Every new Supabase Auth user automatically gets a `profiles` row with the
-- lowest-privilege role. Without this, profiles would stay empty for new
-- signups (the client can't INSERT into profiles — see 0011 — and a brand
-- new user has no profile yet to even pass an is_admin() check).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'employee');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Defense in depth: even if a bug or a tampered client PATCHes role/is_active
-- on someone's own profile, a non-admin's change to those two columns is
-- silently reverted before the write commits. Real permission checks still
-- live in RLS (0011) — this just makes column-level escalation impossible
-- even under an application bug, since RLS alone can't restrict columns.
create or replace function prevent_profile_self_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if not (select role in ('super_admin', 'hr_admin') from profiles where id = auth.uid()) then
    new.role := old.role;
    new.is_active := old.is_active;
  end if;
  return new;
end;
$$;

create trigger trg_prevent_profile_self_escalation
  before update on profiles
  for each row execute function prevent_profile_self_escalation();

-- Same idea for employees: an employee editing their own record (Phase 2's
-- "edit permitted personal information") can only ever change the handful
-- of personal fields the brief calls out. Anything else silently reverts to
-- its previous value unless the actor is HR/Admin/Super Admin.
create or replace function prevent_employee_field_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if not (select role in ('super_admin', 'hr_admin') from profiles where id = auth.uid()) then
    new.employee_number := old.employee_number;
    new.first_name := old.first_name;
    new.last_name := old.last_name;
    new.email := old.email;
    new.department_id := old.department_id;
    new.job_role_id := old.job_role_id;
    new.employment_type_id := old.employment_type_id;
    new.manager_id := old.manager_id;
    new.employment_status := old.employment_status;
    new.start_date := old.start_date;
    new.end_date := old.end_date;
    new.notes := old.notes;
    new.deleted_at := old.deleted_at;
    new.profile_id := old.profile_id;
    -- Left editable by the employee themself: preferred_name, phone,
    -- date_of_birth, address, emergency_contact_*, location, avatar_url.
  end if;
  return new;
end;
$$;

create trigger trg_prevent_employee_field_escalation
  before update on employees
  for each row execute function prevent_employee_field_escalation();
