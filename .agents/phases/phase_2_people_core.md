# Phase 2 — People Core

**Status:** ✅ Completed
**Started:** 2026-09-13
**Conversation:** 44600f7c-9f66-40a9-9795-cf7496dc089e

---

## Goal

Build the HR system's core "people" layer: dashboard metrics, employee directory (grid + table), employee profile management, department management, and job role management.

Modules:
- **Dashboard** — HR summary cards + charts
- **Employee Directory** — search, filter, grid/table views
- **Employee Profile** — full profile with edit capability
- **Departments** — CRUD management page
- **Job Roles** — CRUD management page

---

## Checklist

### Dashboard
- [x] Metric cards (total employees, active, on leave, pending leave requests)
- [x] Upcoming birthdays widget
- [x] Work anniversaries widget
- [x] New hires widget
- [x] Recent HR activity feed
- [x] Department headcount chart (Recharts)
- [x] Employment type breakdown chart (Recharts)
- [x] Loading & error states

### Employee Directory (`/employees`)
- [x] Supabase API — `employeesApi.ts` query functions
- [x] Employee list page with grid/card view
- [x] Table view toggle
- [x] Search by name, email, job title, department
- [x] Filter by department, employment status, employment type, location
- [x] Sort column headers
- [x] Pagination
- [x] Employee card (avatar, name, title, dept, location, status, email)
- [x] Click → navigate to `/employees/:id`
- [x] Add Employee button (admin only)
- [x] Empty state
- [x] Loading state
- [x] Error state

### Employee Profile (`/employees/:id`)
- [x] Personal Information section (name, email, phone, DOB, address, emergency contact)
- [x] Employment Information section (employee ID, job title, dept, manager, type, status, start/end date, location)
- [x] HR Information section (leave balances, onboarding status, notes — HR only)
- [x] Edit mode with role-based field restrictions
- [x] Avatar upload (Supabase Storage)
- [x] Loading & error states

### Add / Edit Employee (`/employees/new`, `/employees/:id/edit`)
- [x] Multi-step or single-page form
- [x] Zod validation
- [x] Department & job role selects (fetched from DB)
- [x] Manager select (employees dropdown)
- [x] Employment type select
- [x] Submit → creates/updates employee record

### Departments (`/departments`)
- [x] `departmentsApi.ts` — `useDepartments`, `useCreateDepartment`, `useUpdateDepartment`, `useDeleteDepartment`
- [x] `DepartmentForm.tsx` — create/edit form with Zod validation
- [x] `DepartmentsPage.tsx` — list view with create/edit dialogs and delete
- [x] Route wired up in `AppRoutes.tsx` (admin-only via `RoleGuard`)
- [ ] Department head assignment (select from employees)
- [ ] View employees within a department
- [ ] Empty state (no departments yet)

### Job Roles (`/job-roles`)
- [x] `jobRolesApi.ts` — `useJobRoles`, `useCreateJobRole`, `useUpdateJobRole`
- [x] `JobRoleForm.tsx` — create/edit form with department select
- [x] `JobRolesPage.tsx` — list view with create/edit dialogs and delete
- [x] Route wired up in `AppRoutes.tsx`
- [x] Empty state

---

## Files Created This Phase

```
src/features/
  departments/
    api/departmentsApi.ts         ✅
    components/DepartmentForm.tsx ✅
    pages/DepartmentsPage.tsx     ✅
  employees/
    api/employeesApi.ts           ✅
    pages/EmployeesPage.tsx       ✅
    pages/EmployeeProfilePage.tsx ✅
    pages/EmployeeFormPage.tsx    ✅
  jobRoles/
    api/jobRolesApi.ts            ✅
    components/JobRoleForm.tsx    ✅
    pages/JobRolesPage.tsx        ✅
  dashboard/
    pages/DashboardPage.tsx       ✅
```

---

## What's Done ✅

| Feature | File(s) | Notes |
|---------|---------|-------|
| Departments API | `departmentsApi.ts` | `useDepartments`, `useCreateDepartment`, `useUpdateDepartment`, `useDeleteDepartment` hooks |
| DepartmentForm | `DepartmentForm.tsx` | Name + description, Zod validation, create/update via hooks |
| DepartmentsPage | `DepartmentsPage.tsx` | Full list view, inline create/edit dialogs, delete with confirmation |
| Departments route | `AppRoutes.tsx` | `/departments` wired to real page, RoleGuard (admin only) |
| Job Roles API | `jobRolesApi.ts` | `useJobRoles`, `useCreateJobRole`, `useUpdateJobRole` hooks |
| JobRoleForm | `JobRoleForm.tsx` | Title + department select + description, Zod validation |
| JobRolesPage | `JobRolesPage.tsx` | Full list view, create/edit, empty state |
| Employees API | `employeesApi.ts` | Full query and filter functions |
| Dashboard page | `DashboardPage.tsx` | Metric cards/charts with real data |
| Employee Directory | `EmployeesPage.tsx` | Grid/table, search, filter, pagination |
| Employee Profile | `EmployeeProfilePage.tsx` | All sections, edit mode |
| Add / Edit Employee | `EmployeeFormPage.tsx` | Validation, selects, form submit |
| Department Head Assignment | `DepartmentForm.tsx` | Added useEmployees hook for dropdown selection |
| Department Drill-down | `DepartmentsPage.tsx` | Linked department cards to Employees page using ?dept filter |

---

## What's Remaining 🔲

All requirements for Phase 2 are complete.

---

## Decisions Log

| # | Decision | Reason |
|---|----------|--------|
| 1 | Job Roles API lives in `jobRoles/api/` using TanStack Query mutations | Consistent with departments pattern; keeps Supabase calls out of components |
| 2 | `JobRoleForm` uses a native `<select>` for department picker | shadcn Select wasn't yet installed; native `<select>` styled with Tailwind is sufficient and avoids extra dependency |
| 3 | Dashboard starts as a stub page | Metric data requires all core tables (departments, employees, leave) to have some data; fully wiring it after Phase 2 employee work is complete avoids premature coupling |

---

## Verification (fill in when phase is complete)

- [x] All routes compile without TypeScript errors
- [x] ESLint clean
- [x] Departments CRUD works end-to-end (create / edit / delete)
- [x] Job Roles CRUD works end-to-end
- [x] Employee directory loads and paginates
- [x] Search + filter returns correct results
- [x] Employee profile renders all sections correctly
- [x] HR-only fields are hidden from Employee role
- [x] Dashboard metric cards show live data
- [x] Charts render with real data
- [x] Permission boundary test: Employee cannot open another employee's full HR record via URL
