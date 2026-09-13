# Phase 4 — Workflows (Onboarding, HR Tasks, Notifications)

**Status:** ⏳ Planned
**Depends on:** Phase 2 complete (employees, departments)
**Estimated start:** After Phase 3 sign-off

---

## Goal

Build the operational workflow layer that HR uses to manage new hire onboarding, day-to-day HR tasks, and in-app notifications.

Modules:
- **Onboarding** — templates, task assignment, progress tracking
- **HR Tasks** — general task management for HR staff
- **Notifications** — in-app notification system

---

## Checklist

### Onboarding Templates (HR/Admin only)
- [ ] `onboardingApi.ts` — CRUD for `onboarding_templates` + `onboarding_template_tasks`
- [ ] Templates list page (`/onboarding/templates`)
- [ ] Create / edit template form
- [ ] Add / reorder / delete template tasks
- [ ] Task fields: title, description, day_offset, assigned_role, priority

### Employee Onboarding Tracking
- [ ] Assign onboarding template to employee (HR/Admin)
- [ ] Onboarding overview page (`/onboarding`)
  - HR/Admin: all employees in onboarding
  - Manager: own team
  - Employee: own onboarding progress
- [ ] Individual employee onboarding detail view
  - Task list with status, assignee, due date, priority
  - Progress bar (% tasks completed)
  - Mark task complete (role-appropriate)
- [ ] Overdue status auto-detection (due_date < today and not completed)

### HR Tasks (`/tasks`)
- [ ] `hrTasksApi.ts` — CRUD for `hr_tasks`
- [ ] Task dashboard
  - My tasks
  - Overdue
  - Due today
  - Upcoming
  - Completed
- [ ] Create task form
  - Title, description, assignee, related employee, due date, priority, status
- [ ] Edit / delete task
- [ ] Priority badge (Low / Medium / High / Urgent)
- [ ] Status badge (To Do / In Progress / Completed / Cancelled)
- [ ] Inline status update

### In-App Notifications
- [ ] `notificationsApi.ts` — fetch unread, mark read, mark all read
- [ ] Notification bell in Topbar (unread count badge)
- [ ] Notification dropdown / panel
- [ ] Mark individual notification as read
- [ ] Mark all as read
- [ ] Notification types supported:
  - Leave request submitted (→ manager/HR)
  - Leave approved (→ employee)
  - Leave rejected (→ employee)
  - Task assigned (→ assignee)
  - Task approaching deadline (→ assignee)
  - Onboarding task completed (→ HR/manager)
- [ ] Notifications written by Supabase DB triggers or by API mutation (decide during implementation)

---

## Files to Create

```
src/features/
  onboarding/
    api/onboardingApi.ts
    components/
      OnboardingTemplateForm.tsx
      TemplateTaskList.tsx
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

---

## Routes to Wire Up

```
/onboarding              — OnboardingOverviewPage   (all roles, scoped)
/onboarding/templates    — OnboardingTemplatesPage  (HR/Admin only)
/tasks                   — TasksPage                (HR/Admin all; Manager/Employee own)
```

---

## Decisions Log

_Fill in as decisions are made during implementation._

---

## Verification (fill in when phase is complete)

- [ ] HR can create an onboarding template with multiple tasks
- [ ] Template can be assigned to a new employee
- [ ] Employee sees their onboarding tasks and can mark them complete
- [ ] Manager sees onboarding progress for their direct reports
- [ ] HR can create, assign, and update HR tasks
- [ ] Task assignee receives an in-app notification
- [ ] Notification bell shows unread count
- [ ] Mark-as-read works
- [ ] TypeScript clean, ESLint clean
