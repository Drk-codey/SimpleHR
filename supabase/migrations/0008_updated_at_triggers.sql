-- ============================================================
-- 0008: updated_at triggers
-- ============================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
  tables_with_updated_at text[] := array[
    'profiles', 'departments', 'job_roles', 'employees',
    'leave_balances', 'leave_requests',
    'onboarding_templates', 'employee_onboarding', 'onboarding_tasks',
    'hr_tasks', 'attendance', 'company_settings'
  ];
begin
  foreach t in array tables_with_updated_at loop
    execute format(
      'create trigger trg_set_updated_at before update on %I for each row execute function set_updated_at();',
      t
    );
  end loop;
end $$;
