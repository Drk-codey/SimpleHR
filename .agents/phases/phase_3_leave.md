# Phase 3 — Leave Management

**Status:** ⏳ Planned
**Depends on:** Phase 2 complete (employees, departments, job roles all working)
**Estimated start:** After Phase 2 sign-off

---

## Goal

Build a complete leave management system including:
- Leave request submission, cancellation, history
- Approval / rejection flow (Manager + HR/Admin)
- Leave balances per employee per leave type per year
- Leave types & policies configuration (HR/Admin)
- Leave calendar (monthly calendar view + list view)

---

## Checklist

### Leave Types & Configuration
- [ ] `leaveTypesApi.ts` — CRUD for `leave_types` table
- [ ] Leave Types list page (HR/Admin only)
- [ ] Create / edit / deactivate leave type form
- [ ] Fields: name, description, default annual allowance, requires approval, color

### Leave Balances
- [ ] `leaveBalancesApi.ts` — fetch balances per employee, update (HR adjust)
- [ ] Leave Balances page (`/leave/balances`)
  - All employees for HR/Admin
  - Own balance only for Employee
- [ ] HR balance adjustment form

### Leave Requests
- [ ] `leaveRequestsApi.ts` — list, create, cancel, approve, reject
- [ ] Leave Requests list page (`/leave/requests`) — role-scoped
- [ ] Status filter (pending / approved / rejected / cancelled)
- [ ] New Leave Request form (`/leave/requests/new`)
  - Leave type select (fetched from DB)
  - Start / end date pickers
  - Reason text area
  - Working-days calculation (client-side, using `date-fns`)
  - Balance check before submit
- [ ] Cancel request button (employee, while status = pending)
- [ ] Approve / Reject actions (manager for own team, HR/Admin for all)
- [ ] Decision comment on approval/rejection
- [ ] Status badges
- [ ] Empty state
- [ ] Loading / error states

### Leave Calendar (`/leave/calendar`)
- [ ] Monthly calendar view showing approved leave
- [ ] List/table view toggle
- [ ] Filter by employee, leave type
- [ ] Colour-coded by leave type (from `leave_types.color`)
- [ ] Company holidays overlay (from `calendar_events`)

### Validation
- [ ] End date ≥ start date
- [ ] Required fields enforced (Zod)
- [ ] Request rejected if balance insufficient (when leave type requires it)
- [ ] Unauthorized approve/reject blocked (RLS + frontend guard)

---

## Files to Create

```
src/features/leave/
  api/
    leaveTypesApi.ts
    leaveBalancesApi.ts
    leaveRequestsApi.ts
  components/
    LeaveRequestForm.tsx
    LeaveRequestCard.tsx
    LeaveStatusBadge.tsx
    ApprovalActionBar.tsx
  pages/
    LeaveRequestsPage.tsx
    NewLeaveRequestPage.tsx
    LeaveBalancesPage.tsx
    LeaveCalendarPage.tsx
    LeaveTypesPage.tsx       (HR/Admin only)
```

---

## Routes to Wire Up

```
/leave/requests          — LeaveRequestsPage     (all roles, scoped)
/leave/requests/new      — NewLeaveRequestPage   (all roles)
/leave/balances          — LeaveBalancesPage     (all roles, scoped)
/leave/calendar          — LeaveCalendarPage     (all roles, scoped)
/leave/types             — LeaveTypesPage        (HR/Admin only)
```

---

## Decisions Log

_Fill in as decisions are made during implementation._

---

## Verification (fill in when phase is complete)

- [ ] Employee can submit a leave request and see it in their history
- [ ] Manager can approve/reject direct report's request
- [ ] HR/Admin can approve/reject any request
- [ ] Employee cannot approve their own or another employee's request
- [ ] Balance deducted correctly on approval
- [ ] Calendar shows approved leave for correct scope per role
- [ ] Leave types can be created/edited/deactivated by HR/Admin
- [ ] HR can manually adjust leave balances
- [ ] TypeScript clean, ESLint clean
- [ ] Permission boundary: Employee cannot approve via URL manipulation
