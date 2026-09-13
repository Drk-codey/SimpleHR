# Phase 7 — Hardening (Tests, Accessibility, Mobile, Production Cleanup)

**Status:** ⏳ Planned
**Depends on:** All phases 1–6 complete
**Estimated start:** After Phase 6 sign-off

---

## Goal

Make the application production-ready:
- Comprehensive test coverage (unit, integration, end-to-end)
- Accessibility audit and fixes
- Mobile responsiveness pass
- Performance review
- Production build validation and deployment

---

## Checklist

### Unit & Integration Tests (Vitest + React Testing Library)

- [ ] `useAuth` — session handling, login redirect
- [ ] `useRole` — role derivation, permission guards
- [ ] `DepartmentForm` — validation, submit, error handling
- [ ] `JobRoleForm` — validation, department select, submit
- [ ] `LeaveRequestForm` — date validation, balance check
- [ ] `EmptyState`, `ErrorState`, `LoadingSpinner` — render correctly
- [ ] `StatusBadge` — correct badge for each status value
- [ ] `ConfirmDialog` — opens, confirms, cancels
- [ ] API hooks — mock Supabase client, test query/mutation success and error paths
- [ ] Target: ≥ 70% coverage on feature components and hooks

### End-to-End Tests (Playwright)

Critical user flows:

- [ ] **Login** — valid credentials → dashboard; invalid → error message
- [ ] **Submit Leave Request** — employee submits → pending status visible
- [ ] **Approve Leave** — manager logs in, approves → status changes to approved
- [ ] **Add Employee** — HR logs in, creates employee → appears in directory
- [ ] **Permission boundary** — Employee edits URL to `/employees/{other-id}` → blocked or no sensitive data
- [ ] **Role guard** — Employee visits `/departments` → redirect to `/unauthorized`

### Accessibility Pass

- [ ] Keyboard navigation throughout (tab order, focus ring)
- [ ] ARIA labels on icon-only buttons
- [ ] Form fields all have `<label>` associations
- [ ] Color contrast meets WCAG AA (use browser devtools or Axe)
- [ ] Dialog traps focus correctly
- [ ] Sidebar / topbar navigable by keyboard
- [ ] Screen reader test on login and employee directory

### Mobile Responsiveness Pass

- [ ] Sidebar collapses to mobile nav (hamburger menu) on small screens
- [ ] Employee directory: cards stack correctly on mobile
- [ ] Tables become horizontally scrollable (or switch to card view) on mobile
- [ ] Modals/dialogs fit within mobile viewport
- [ ] Forms remain usable at 375px width
- [ ] Topbar doesn't overflow at small widths
- [ ] Test on Chrome DevTools device emulator: iPhone SE, iPad, generic 375px

### Performance

- [ ] Lighthouse score ≥ 85 on desktop (Performance, Accessibility, Best Practices)
- [ ] Bundle size review — remove unused dependencies
- [ ] Images / avatars lazy-loaded
- [ ] TanStack Query caching verified (no unnecessary re-fetches)
- [ ] No console errors or warnings in production build

### Production Cleanup

- [ ] All `console.log` statements removed
- [ ] `PlaceholderPage` references removed (all routes point to real pages)
- [ ] `.env.example` up to date
- [ ] `README.md` updated with setup instructions, env variables, deployment guide
- [ ] No `any` TypeScript escape hatches left (or each one documented with a comment)
- [ ] ESLint passes with zero warnings
- [ ] Production build succeeds (`npm run build`)

### Deployment

- [ ] Supabase project confirmed active (not paused)
- [ ] Frontend deployed to Vercel / Netlify / Cloudflare Pages
- [ ] Environment variables set in host dashboard
- [ ] Custom domain configured (optional)
- [ ] Supabase auto-pause mitigation in place if needed (scheduled ping)

---

## Files to Create / Modify

```
tests/
  unit/
    useAuth.test.tsx
    useRole.test.tsx
    DepartmentForm.test.tsx
    JobRoleForm.test.tsx
    LeaveRequestForm.test.tsx
    StatusBadge.test.tsx
    ConfirmDialog.test.tsx
  hooks/
    useDepartments.test.ts
    useEmployees.test.ts
    useLeaveRequests.test.ts

e2e/
  auth.spec.ts
  leaveRequest.spec.ts
  addEmployee.spec.ts
  permissionBoundary.spec.ts

README.md                     (update)
.env.example                  (verify all vars present)
```

---

## Decisions Log

_Fill in as decisions are made during implementation._

---

## Verification (fill in when phase is complete)

- [ ] `npm run test` passes with ≥ 70% coverage
- [ ] `npm run test:e2e` — all 6 critical flows pass
- [ ] Lighthouse score ≥ 85 on desktop
- [ ] No keyboard trap or missing ARIA label issues
- [ ] Mobile layout correct at 375px
- [ ] Production build succeeds and deploys without errors
- [ ] App is live and accessible at deployment URL
