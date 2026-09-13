# Phase 6 — Operations (Reports, Audit Log, Settings)

**Status:** ⏳ Planned
**Depends on:** All previous phases complete (data exists to report on; triggers to audit)
**Estimated start:** After Phase 5 sign-off

---

## Goal

Build the administrative operations layer:
- **Reports** — HR data reports with CSV (and optional PDF) export
- **Audit Log** — trigger-populated, immutable log of key system actions
- **Settings** — company settings, HR configuration, user/role management

---

## Checklist

### Reports (`/reports`) — HR/Admin only

- [ ] `reportsApi.ts` — aggregate queries for each report type
- [ ] Reports hub page
- [ ] Report types:
  - Employee Headcount (total, active, on leave, terminated)
  - Employees by Department (bar chart + table)
  - Employees by Employment Type (donut chart + table)
  - Employees by Employment Status (table)
  - Leave Utilization (used vs. allocated per leave type)
  - Pending Leave Requests (table)
  - Onboarding Completion (% completed per employee)
  - Attendance Summary (by employee and date range)
- [ ] Date range filter where applicable
- [ ] CSV export for each report (using native browser CSV generation — no extra lib)
- [ ] PDF export (optional — use `jsPDF` or `react-to-print` if practical; free only)
- [ ] Charts via Recharts (consistent with dashboard)
- [ ] Loading / empty states

### Audit Log (`/audit-log`) — HR/Admin (read-only)

- [ ] Audit log triggers written in Postgres (`security definer`)
  - `employees` — INSERT / UPDATE / DELETE (soft delete)
  - `leave_requests` — status changes (submitted, approved, rejected)
  - `documents` — upload, delete
  - `profiles` — role changes
  - `company_settings` — any update
- [ ] `auditLogApi.ts` — paginated read from `audit_logs`
- [ ] Audit log page
  - Filterable by: actor, entity type, action, date range
  - Columns: timestamp, actor, action, entity, entity ID, metadata preview
  - Pagination
- [ ] No client-side insert (triggers only)

### Settings

#### Company Settings (`/settings/company`) — Super Admin only
- [ ] `companySettingsApi.ts` — fetch and update `company_settings`
- [ ] Form: company name, logo upload (Supabase Storage), address, contact email, contact phone
- [ ] Date format + timezone selects

#### HR Settings (`/settings/hr`) — HR/Admin
- [ ] Leave Types management (if not already on its own page in Phase 3, consolidate here)
- [ ] Employment Types management (CRUD for `employment_types`)
- [ ] Departments management (link/embed existing Departments page)
- [ ] Job Roles management (link/embed existing Job Roles page)

#### User & Role Management (`/settings/users`) — Super Admin only
- [ ] `usersApi.ts` — list `profiles` + update role
- [ ] User list: name, email, role, active status
- [ ] Change user role (dropdown, save)
- [ ] Deactivate user (set `is_active = false`)
- [ ] Cannot demote own Super Admin account (guard)

---

## Files to Create

```
src/features/
  reports/
    api/reportsApi.ts
    components/
      HeadcountCard.tsx
      DeptBreakdownChart.tsx
      LeaveUtilizationTable.tsx
      ExportButton.tsx
    pages/
      ReportsPage.tsx
  auditLog/
    api/auditLogApi.ts
    components/
      AuditLogTable.tsx
      AuditLogFilters.tsx
    pages/
      AuditLogPage.tsx
  settings/
    api/
      companySettingsApi.ts
      usersApi.ts
    components/
      CompanySettingsForm.tsx
      UserRoleForm.tsx
      EmploymentTypeForm.tsx
    pages/
      CompanySettingsPage.tsx
      UserManagementPage.tsx
      HRSettingsPage.tsx
```

---

## Routes to Wire Up

```
/reports                 — ReportsPage             (HR/Admin only)
/audit-log               — AuditLogPage            (HR/Admin read-only)
/settings/company        — CompanySettingsPage      (Super Admin only)
/settings/users          — UserManagementPage       (Super Admin only)
/settings/hr             — HRSettingsPage           (HR/Admin)
```

---

## Audit Trigger Plan

Triggers ship as a new migration file `0013_audit_triggers.sql` (or split if large).

```sql
-- Pattern per table:
create or replace function audit_employees()
returns trigger language plpgsql security definer as $$
begin
  insert into audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    tg_op,         -- 'INSERT', 'UPDATE', 'DELETE'
    'employees',
    coalesce(new.id, old.id),
    jsonb_build_object('old', row_to_json(old), 'new', row_to_json(new))
  );
  return coalesce(new, old);
end;
$$;

create trigger trg_audit_employees
after insert or update or delete on employees
for each row execute procedure audit_employees();
```

---

## Decisions Log

_Fill in as decisions are made during implementation._

---

## Verification (fill in when phase is complete)

- [ ] Headcount report shows correct totals
- [ ] CSV export downloads valid file
- [ ] Audit log records appear after employee is created/updated
- [ ] Audit log is not writable from the client (trigger-only)
- [ ] Company settings update persists and reflects in the UI
- [ ] Super Admin can change another user's role
- [ ] Super Admin cannot change their own role to a lower one
- [ ] TypeScript clean, ESLint clean
