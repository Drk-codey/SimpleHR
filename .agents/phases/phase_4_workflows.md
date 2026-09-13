# Phase 4 - Workflows (Onboarding, HR Tasks, Notifications)

**Status:** In Progress
**Depends on:** Phase 2 complete (employees, departments)
**Last reviewed:** 2026-09-13

---

## Goal

Build the operational workflow layer that HR uses to manage new hire onboarding, day-to-day HR tasks, and in-app notifications.

Modules:
- **Onboarding** - templates, task assignment, progress tracking
- **HR Tasks** - general task management for HR staff
- **Notifications** - in-app notification system

---

## Current Implementation Status

Phase 4 has been started and is now typecheck/lint/build clean. The main app pages, routes, and data-access hooks exist. Remaining work is mostly notification breadth and live Supabase verification after migrations are applied.

---

## Checklist

### Onboarding Templates (HR/Admin only)
- [x] `onboardingApi.ts` - CRUD for `onboarding_templates` + `onboarding_template_tasks`
- [x] Templates list page (`/onboarding/templates`)
- [x] Create / edit template form
- [x] Add / reorder / delete template tasks
- [x] Task fields: title, description, day_offset, assigned_role, priority

### Employee Onboarding Tracking
- [x] Assign onboarding template to employee (HR/Admin)
- [x] Onboarding overview page (`/onboarding`)
  - HR/Admin: all employees in onboarding
  - Manager: own team through RLS scoping
  - Employee: own onboarding progress through RLS scoping
- [x] Individual employee onboarding detail view
  - Task list with status, assignee, due date, priority
  - Progress bar (% tasks completed)
  - Mark task complete when the current user is admin or the assigned profile
- [x] Overdue status auto-detection in the UI (due_date < today and not completed)
- [ ] Live Supabase smoke test for assigning a real template and completing a real task

### HR Tasks (`/tasks`)
- [x] `hrTasksApi.ts` - CRUD for `hr_tasks`
- [x] Task dashboard
  - My tasks
  - Overdue
  - Due today
  - Upcoming
  - Completed
- [x] Create task form
  - Title, description, assignee, related employee, due date, priority, status
- [x] Edit / delete task (HR/Admin UI only, matching RLS)
- [x] Priority badge (Low / Medium / High / Urgent)
- [x] Status badge (To Do / In Progress / Completed / Cancelled)
- [x] Inline status update
- [ ] Live Supabase smoke test for task assignment, status update, and deletion

### In-App Notifications
- [x] `notificationsApi.ts` - fetch unread, mark read, mark all read
- [x] Notification bell in Topbar (unread count badge)
- [x] Notification dropdown / panel
- [x] Mark individual notification as read
- [x] Mark all as read
- [ ] Notification types supported:
  - [ ] Leave request submitted (blocked until Phase 3 leave UI/API exists)
  - [ ] Leave approved (blocked until Phase 3 leave UI/API exists)
  - [ ] Leave rejected (blocked until Phase 3 leave UI/API exists)
  - [x] Task assigned (DB trigger in `0014_notification_triggers.sql`)
  - [ ] Task approaching deadline (needs scheduled job/periodic DB function decision)
  - [ ] Onboarding task completed (trigger not implemented yet)
- [x] Notifications written by Supabase DB trigger for HR task assignment

---

## Files Created

```
src/features/
  onboarding/
    api/onboardingApi.ts
    components/
      OnboardingTemplateForm.tsx
      OnboardingProgressBar.tsx
      OnboardingTaskRow.tsx
    pages/
      OnboardingOverviewPage.tsx
      OnboardingTemplatesPage.tsx
      EmployeeOnboardingPage.tsx
  tasks/
    api/hrTasksApi.ts
    components/
      TaskForm.tsx
      TaskCard.tsx
      TaskStatusBadge.tsx
      TaskPriorityBadge.tsx
    pages/
      TasksPage.tsx
  notifications/
    api/notificationsApi.ts
    components/
      NotificationBell.tsx
      NotificationPanel.tsx
      NotificationItem.tsx
```

Also added:
- `src/components/ui/popover.tsx`
- `supabase/migrations/0014_notification_triggers.sql`

---

## Routes Wired Up

```
/onboarding              - OnboardingOverviewPage   (all roles, RLS scoped)
/onboarding/:id          - EmployeeOnboardingPage   (all roles, RLS scoped)
/onboarding/templates    - OnboardingTemplatesPage  (HR/Admin only)
/tasks                   - TasksPage                (all roles, RLS scoped)
```

---

## Decisions Log

- 2026-09-13: Use Supabase DB triggers for notification writes where possible. Implemented `task_assigned` notifications in migration `0014_notification_triggers.sql`.
- 2026-09-13: Keep HR task creation/edit/delete HR/Admin-only in the UI because the existing RLS only allows admins to insert/delete HR tasks. Assignees can update status inline.
- 2026-09-13: Onboarding template task roles must match the DB enum: `hr`, `manager`, `employee`, `specific`. Removed the invalid `it` option.
- 2026-09-13: When assigning an onboarding template, copied tasks now resolve `assigned_to` from the template role where possible: employee profile, manager profile, or assigning HR/admin profile.

---

## Verification

- [x] TypeScript clean: `npm run typecheck`
- [x] ESLint clean: `npm run lint`
- [x] Unit tests pass: `npm run test`
- [x] Production build passes: `npm run build`
- [ ] HR can create an onboarding template with multiple tasks in a live Supabase project
- [ ] Template can be assigned to a new employee in a live Supabase project
- [ ] Employee sees their onboarding tasks and can mark assigned tasks complete in a live Supabase project
- [ ] Manager sees onboarding progress for direct reports in a live Supabase project
- [ ] HR can create, assign, and update HR tasks in a live Supabase project
- [ ] Task assignee receives an in-app notification in a live Supabase project
- [ ] Notification bell shows unread count in a live Supabase project
- [ ] Mark-as-read works in a live Supabase project
