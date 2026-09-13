# Phase 1 — Foundation

**Status:** ✅ Complete
**Completed:** 2026-09-13
**Conversation:** 44600f7c-9f66-40a9-9795-cf7496dc089e (Phase Two session, foundation confirmed complete)

---

## Goal

Bootstrap the entire technical foundation so every subsequent phase has nothing to set up from scratch.

Deliverables:
- Vite + React + TypeScript project scaffold
- Tailwind CSS + shadcn/ui component library wired up
- Supabase client configured (env-based)
- Full PostgreSQL schema via numbered SQL migrations
- Row Level Security helpers and policies (core + workflows)
- `auth.users` trigger → `profiles` auto-creation
- `updated_at` triggers on all mutable tables
- Auth flow: login page, session handling, protected routes, role guard
- App shell: sidebar, topbar, mobile nav, route structure with placeholders

---

## Checklist

### Project Scaffold
- [x] Vite + React 18 + TypeScript
- [x] Tailwind CSS configured (`tailwind.config.ts`, `postcss.config.js`)
- [x] shadcn/ui primitives installed and configured
- [x] `tsconfig.json` with path aliases (`@/`)
- [x] `.env` / `.env.example` with Supabase keys
- [x] ESLint config (`.eslintrc.cjs`)
- [x] Playwright config (`playwright.config.ts`)

### Supabase / Database
- [x] `0001` — Extensions & enum types
- [x] `0002` — Reference tables (`employment_types`, `departments`, `job_roles`)
- [x] `0003` — `profiles` + `employees` tables (with self-referencing `manager_id`, deferred FK for `department_head_id`)
- [x] `0004` — Leave tables (`leave_types`, `leave_balances`, `leave_requests`)
- [x] `0005` — Onboarding tables (`onboarding_templates`, `onboarding_template_tasks`, `employee_onboarding`, `onboarding_tasks`)
- [x] `0006` — HR tasks, documents, attendance tables
- [x] `0007` — Calendar events, notifications, audit logs, company settings
- [x] `0008` — `updated_at` trigger function + applied to all mutable tables
- [x] `0009` — Auth trigger: `handle_new_user()` function → auto-inserts into `profiles` on signup
- [x] `0010` — RLS helper functions (`auth_role()`, `auth_employee_id()`, `is_admin()`, `is_manager_of()`)
- [x] `0011` — Core RLS policies (`profiles`, `employees`, `departments`, `job_roles`, etc.)
- [x] `0012` — Workflow RLS policies (leave, onboarding, tasks, documents, attendance, notifications, audit)
- [x] Seed file (`supabase/seed.sql`) with realistic demo data

### Auth & Shell
- [x] `supabaseClient.ts` — typed Supabase client
- [x] `queryClient.ts` — TanStack Query client
- [x] `useAuth.tsx` — session hook + `AuthContext`
- [x] `useCurrentProfile.ts` — fetches logged-in user's `profiles` row
- [x] `useRole.ts` — role helper derived from profile
- [x] `LoginPage.tsx` + `LoginForm.tsx` — email/password login
- [x] `ProtectedRoute.tsx` — redirects to `/login` if no session
- [x] `RoleGuard.tsx` — redirects to `/unauthorized` if role not in allow-list
- [x] `AppRoutes.tsx` — full route tree with placeholders for Phases 2–6
- [x] `AppShell.tsx` — layout wrapper (sidebar + topbar + outlet)
- [x] `Sidebar.tsx` — role-aware navigation
- [x] `Topbar.tsx` — user menu, logout, notifications bell
- [x] `navConfig.ts` — navigation item definitions
- [x] `NotFoundPage.tsx`, `UnauthorizedPage.tsx`, `PlaceholderPage.tsx`

### Shared UI Components
- [x] `components/ui/` — button, card, dialog, dropdown-menu, input, label, separator, sheet, skeleton, badge, avatar
- [x] `components/common/` — `EmptyState`, `ErrorState`, `LoadingSpinner`, `ConfirmDialog`, `StatusBadge`

### Types
- [x] `types/database.types.ts` — generated Supabase DB types

---

## Files Created / Key Paths

```
src/
  App.tsx
  main.tsx
  index.css
  vite-env.d.ts
  lib/
    supabaseClient.ts
    queryClient.ts
    utils.ts
  hooks/
    useAuth.tsx
    useCurrentProfile.ts
    useRole.ts
  routes/
    AppRoutes.tsx
    ProtectedRoute.tsx
    RoleGuard.tsx
  components/
    layout/
      AppShell.tsx
      Sidebar.tsx
      Topbar.tsx
      navConfig.ts
    common/
      ConfirmDialog.tsx
      EmptyState.tsx
      ErrorState.tsx
      LoadingSpinner.tsx
      StatusBadge.tsx
    ui/
      avatar.tsx  badge.tsx  button.tsx  card.tsx  dialog.tsx
      dropdown-menu.tsx  input.tsx  label.tsx  separator.tsx
      sheet.tsx  skeleton.tsx
  features/
    auth/
      components/LoginForm.tsx
      pages/LoginPage.tsx
  pages/
    NotFoundPage.tsx
    UnauthorizedPage.tsx
    PlaceholderPage.tsx
  types/
    database.types.ts
supabase/
  migrations/
    0001_extensions_and_enums.sql
    0002_reference_tables.sql
    0003_profiles_and_employees.sql
    0004_leave.sql
    0005_onboarding.sql
    0006_hr_tasks_documents_attendance.sql
    0007_calendar_notifications_audit_settings.sql
    0008_updated_at_triggers.sql
    0009_auth_triggers.sql
    0010_rls_helpers.sql
    0011_rls_policies_core.sql
    0012_rls_policies_workflows.sql
  seed.sql
```

---

## Decisions Log

| # | Decision | Reason |
|---|----------|--------|
| 1 | `profiles` and `employees` are separate tables | `profiles` mirrors `auth.users` (auth identity); `employees` is the HR record. A Super Admin might not be an employee. Allows HR to create an employee record before that person has a login. |
| 2 | All migrations are numbered and separate | Makes it easy to track what ran vs. what's new; Supabase CLI applies them in order. |
| 3 | RLS helpers (`auth_role`, `is_admin`, etc.) in a dedicated migration | Keeps policies readable; helpers are reused across 20+ policies without duplicating SQL. |
| 4 | Placeholders for Phases 2–6 routes | Allows the app to compile and navigate without stub implementations causing import errors. |

---

## Verification

- [x] Project runs locally (`npm run dev`)
- [x] Login page renders and accepts Supabase credentials
- [x] Authenticated session persists on refresh
- [x] Role guard redirects correctly (non-admin visiting admin route → `/unauthorized`)
- [x] Sidebar navigation visible and role-filtered
- [x] All placeholder routes reachable without errors
- [x] No TypeScript errors, ESLint clean
