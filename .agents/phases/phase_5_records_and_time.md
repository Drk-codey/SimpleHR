# Phase 5 — Records & Time (Documents, Attendance, Company Calendar)

**Status:** ⏳ Planned
**Depends on:** Phase 2 complete (employees exist); Phase 3 (leave data for calendar)
**Estimated start:** After Phase 4 sign-off

---

## Goal

Build the time and records layer:
- **Documents** — employee document upload/storage via Supabase Storage
- **Attendance** — lightweight check-in / check-out for small teams
- **Company Calendar** — unified calendar of leave, birthdays, anniversaries, events

---

## Checklist

### Employee Documents (`/documents`)
- [ ] `documentsApi.ts` — upload, list, delete, access control
- [ ] Supabase Storage bucket configuration (`employee-documents`)
- [ ] Documents list page
  - HR/Admin: filter by employee
  - Employee: own documents only (visibility-scoped)
- [ ] Upload document form
  - Employee select (HR/Admin)
  - Document name, type, visibility (employee_only / manager_hr / hr_only)
  - File input → Supabase Storage upload
- [ ] Download / view document link (signed URL)
- [ ] Delete document (HR/Admin only)
- [ ] Visibility badge
- [ ] Empty state

### Attendance (`/attendance`)
- [ ] `attendanceApi.ts` — check in, check out, list
- [ ] Check-in / check-out card on attendance page (or dashboard widget)
  - Shows today's status: not checked in / checked in at HH:MM / checked out
  - Check In button → inserts row with `check_in_time = now()`
  - Check Out button → updates row with `check_out_time = now()`
- [ ] Employee attendance history table (own only for Employee role)
- [ ] HR attendance view — filter by employee, date range
  - Highlight late check-ins (configurable threshold)
  - Flag missing check-outs
- [ ] Empty state

### Company Calendar (`/calendar`)
- [ ] `calendarApi.ts` — fetch calendar events + computed events (leave, birthdays, anniversaries)
- [ ] Monthly calendar view
- [ ] List view toggle
- [ ] Event types:
  - Approved leave (from `leave_requests`, coloured by leave type)
  - Birthdays (from `employees.date_of_birth`, day/month match)
  - Work anniversaries (from `employees.start_date`, year-over-year match)
  - Onboarding deadlines (from `onboarding_tasks.due_date`)
  - HR task due dates (from `hr_tasks.due_date`)
  - Company events / holidays (from `calendar_events`)
- [ ] Filter by event type
- [ ] Add company event form (HR/Admin only)
- [ ] Role-scoped: Employee sees own leave + company-wide approved; Manager sees team; HR sees all
- [ ] Empty state

---

## Files to Create

```
src/features/
  documents/
    api/documentsApi.ts
    components/
      DocumentUploadForm.tsx
      DocumentCard.tsx
      DocumentVisibilityBadge.tsx
    pages/
      DocumentsPage.tsx
  attendance/
    api/attendanceApi.ts
    components/
      CheckInOutCard.tsx
      AttendanceTable.tsx
    pages/
      AttendancePage.tsx
  calendar/
    api/calendarApi.ts
    components/
      CalendarMonthView.tsx
      CalendarListView.tsx
      CalendarEventChip.tsx
      AddEventForm.tsx
    pages/
      CalendarPage.tsx
```

---

## Routes to Wire Up

```
/documents               — DocumentsPage     (all roles, scoped)
/attendance              — AttendancePage    (all roles, scoped)
/calendar                — CalendarPage      (all roles, scoped)
```

---

## Supabase Storage Notes

- Bucket name: `employee-documents`
- Bucket must be **private** (not public)
- Access via signed URLs generated server-side (Supabase `createSignedUrl`)
- RLS on the `documents` table gates who can request a signed URL
- File path convention: `{employee_id}/{uuid}_{original_filename}`

---

## Decisions Log

_Fill in as decisions are made during implementation._

---

## Verification (fill in when phase is complete)

- [ ] HR can upload a document and set visibility
- [ ] Employee can download their own document (employee_only visibility)
- [ ] Employee cannot see hr_only documents
- [ ] Employee can check in and check out
- [ ] Employee cannot check in twice in one day
- [ ] HR sees attendance for all employees
- [ ] Calendar shows approved leave entries
- [ ] Birthdays and anniversaries computed correctly
- [ ] Company event added by HR appears on calendar
- [ ] Signed URL download works
- [ ] TypeScript clean, ESLint clean
