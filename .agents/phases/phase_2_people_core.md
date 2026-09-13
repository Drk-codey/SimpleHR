# Phase 2 — People Core

**Status:** 🔄 In Progress
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
- [ ] Metric cards (total employees, active, on leave, pending leave requests)
- [ ] Upcoming birthdays widget
- [ ] Work anniversaries widget
- [ ] New hires widget
- [ ] Recent HR activity feed
- [ ] Department headcount chart (Recharts)
- [ ] Employment type breakdown chart (Recharts)
- [ ] Loading & error states

### Employee Directory (`/employees`)
- [ ] Supabase API — `employeesApi.ts` query functions
- [ ] Employee list page with grid/card view
- [ ] Table view toggle
- [ ] Search by name, email, job title, department
- [ ] Filter by department, employment status, employment type, location
- [ ] Sort column headers
- [ ] Pagination
- [ ] Employee card (avatar, name, title, dept, location, status, email)
- [ ] Click → navigate to `/employees/:id`
- [ ] Add Employee button (admin only)
- [ ] Empty state
- [ ] Loading state
- [ ] Error state

### Employee Profile (`/employees/:id`)
- [ ] Personal Information section (name, email, phone, DOB, address, emergency contact)
- [ ] Employment Information section (employee ID, job title, dept, manager, type, status, start/end date, location)
- [ ] HR Information section (leave balances, onboarding status, notes — HR only)
- [ ] Edit mode with role-based field restrictions
- [ ] Avatar upload (Supabase Storage)
- [ ] Loading & error states

### Add / Edit Employee (`/employees/new`, `/employees/:id/edit`)
- [ ] Multi-step or single-page form
- [ ] Zod validation
- [ ] Department & job role selects (fetched from DB)
- [ ] Manager select (employees dropdown)
- [ ] Employment type select
- [ ] Submit → creates/updates employee record

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
- [ ] `JobRolesPage.tsx` — list view with create/edit dialogs and delete
- [ ] Route wired up in `AppRoutes.tsx`
- [ ] Empty state

---

## Files Created This Phase

```
src/features/
  departments/
    api/departmentsApi.ts         ✅
    components/DepartmentForm.tsx ✅
    pages/DepartmentsPage.tsx     ✅
  employees/
    api/employeesApi.ts           ✅ (stub — needs expansion)
  jobRoles/
    api/jobRolesApi.ts            ✅
    components/JobRoleForm.tsx    ✅
    pages/JobRolesPage.tsx        🔲 TODO
  dashboard/
    pages/DashboardPage.tsx       ✅ (stub — needs metric data)
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
| Employees API (stub) | `employeesApi.ts` | Basic fetch scaffolded — full query/filter needs expanding |
| Dashboard page (stub) | `DashboardPage.tsx` | Placeholder shell — metric cards/charts not yet wired to live data |

---

## What's Remaining 🔲

1. **JobRolesPage** — list view page analogous to DepartmentsPage (create/edit dialogs, delete, empty state)
2. **Wire `/job-roles` route** — replace placeholder with `JobRolesPage`
3. **Employee Directory page** — full grid + table, search/filter/sort/pagination
4. **Employee Profile page** — all sections, edit mode, role-scoped field visibility
5. **Add/Edit Employee form** — multi-field form, all FK dropdowns populated
6. **Dashboard metrics** — hook up real Supabase queries for all stat cards
7. **Dashboard charts** — Recharts bar/donut for dept headcount + employment types
8. **Department head assignment** on DepartmentForm
9. **Department → employees list** drill-down

---

## Decisions Log

| # | Decision | Reason |
|---|----------|--------|
| 1 | Job Roles API lives in `jobRoles/api/` using TanStack Query mutations | Consistent with departments pattern; keeps Supabase calls out of components |
| 2 | `JobRoleForm` uses a native `<select>` for department picker | shadcn Select wasn't yet installed; native `<select>` styled with Tailwind is sufficient and avoids extra dependency |
| 3 | Dashboard starts as a stub page | Metric data requires all core tables (departments, employees, leave) to have some data; fully wiring it after Phase 2 employee work is complete avoids premature coupling |

---

## Verification (fill in when phase is complete)

- [ ] All routes compile without TypeScript errors
- [ ] ESLint clean
- [ ] Departments CRUD works end-to-end (create / edit / delete)
- [ ] Job Roles CRUD works end-to-end
- [ ] Employee directory loads and paginates
- [ ] Search + filter returns correct results
- [ ] Employee profile renders all sections correctly
- [ ] HR-only fields are hidden from Employee role
- [ ] Dashboard metric cards show live data
- [ ] Charts render with real data
- [ ] Permission boundary test: Employee cannot open another employee's full HR record via URL
