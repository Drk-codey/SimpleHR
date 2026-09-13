# SimpleHR

A free, self-hostable HR management system for small companies (< 50 employees), inspired by the
workflow of tools like BambooHR — with its own branding, UI, and architecture.

**Status: Phase 1 complete.** Auth, roles, the full database schema, Row Level Security, and the
app shell are in place. Every other module (directory, leave, onboarding, tasks, documents,
attendance, reports) has a placeholder page and is scheduled in the phases below.

---

## 1. Features

| Module | Status |
|---|---|
| Authentication (Supabase Auth, email/password) | ✅ Phase 1 |
| Roles & permissions (Super Admin / HR-Admin / Manager / Employee) | ✅ Phase 1 |
| Full database schema + Row Level Security | ✅ Phase 1 |
| App shell (sidebar, topbar, mobile nav) | ✅ Phase 1 |
| Dashboard | 🔜 Phase 2 |
| Employee directory & profiles | 🔜 Phase 2 |
| Departments & job roles | 🔜 Phase 2 |
| Leave requests, balances, approvals, calendar | 🔜 Phase 3 |
| Onboarding, HR tasks, notifications | 🔜 Phase 4 |
| Documents, attendance, company calendar | 🔜 Phase 5 |
| Reports, audit log, settings | 🔜 Phase 6 |
| Testing, accessibility, mobile polish | 🔜 Phase 7 |

## 2. Tech stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, hand-built shadcn-style/Radix UI
  primitives, React Router, TanStack Query, React Hook Form + Zod, Lucide icons, Recharts, date-fns
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Row Level Security) — no custom server
- **Testing:** Vitest + React Testing Library (unit), Playwright (e2e, from Phase 7)

## 3. Architecture

```
Browser (React + Vite, anon key only)
        │ HTTPS
        ▼
Supabase: Postgres + RLS · Auth · Storage
```

There's no custom backend. Every permission rule is enforced in Postgres via Row Level Security,
so a bug in a React component can never leak another employee's data — worst case, a query returns
zero rows. See `SimpleHR_Architecture.md` in the project files for the full ERD, role/permission
matrix, and route table this build follows.

## 4. Requirements

- Node.js 18+
- A free [Supabase](https://supabase.com) account (no credit card required)
- Git

## 5. Installation

```bash
npm install
cp .env.example .env
# fill in .env — see section 6
npm run dev
```

The app runs at `http://localhost:5173`.

## 6. Environment variables

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Get both from your Supabase project: **Settings → API** → "Project URL" and the **`anon` `public`**
key. Never use the `service_role` key here — it bypasses Row Level Security and must never reach
the browser.

## 7. Supabase project setup

1. Create a free project at [supabase.com](https://supabase.com/dashboard).
2. Copy the Project URL and anon key into `.env` (step 6).
3. Run the migrations (step 8) and the seed data (step 9).
4. Create your first user and promote them to Super Admin (step 10).

## 8. Database migrations

Migrations live in `supabase/migrations/`, numbered in the order they must run. The easiest way to
apply them without installing anything extra:

1. Open your Supabase project → **SQL Editor**.
2. Paste and run each file in `supabase/migrations/` **in numeric order** (0001 → 0012).

If you'd rather use the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

**What the migrations set up**, in order:
- `0001` — extensions + enum types
- `0002`–`0007` — every table in the schema (reference tables → profiles/employees → leave →
  onboarding → HR tasks/documents/attendance → calendar/notifications/audit log/settings)
- `0008` — generic `updated_at` triggers
- `0009` — the `handle_new_user` trigger (auto-creates a `profiles` row on signup) and two
  defense-in-depth triggers that silently block privilege escalation on `profiles.role` and
  restricted `employees` columns, even if a buggy or tampered client tries to write them directly
- `0010` — RLS helper functions (`is_admin()`, `is_manager_of()`, etc.)
- `0011`–`0012` — the full Row Level Security policy set, one per table

## 9. Seed data

Run `supabase/seed.sql` (SQL Editor or `npx supabase db execute -f supabase/seed.sql`) after the
migrations. It seeds employment types, departments, and leave types so dropdowns aren't empty. The
~20-employee demo dataset from the brief ships in Phase 2, once the Employee Directory exists to
display it.

## 10. Creating your first Super Admin

Roles aren't self-assignable, so bootstrap one manually:

1. Supabase dashboard → **Authentication → Users → Add user**. Create yourself an account.
2. In the SQL Editor:
   ```sql
   update public.profiles
   set role = 'super_admin'
   where id = (select id from auth.users where email = 'you@company.com');
   ```
3. Sign in at `http://localhost:5173/login` with that email/password.

## 11. Development commands

```bash
npm run dev         # start dev server
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint
npm run test         # Vitest (unit)
npm run e2e          # Playwright (from Phase 7)
npm run build        # typecheck + production build
npm run preview      # preview the production build locally
```

## 12. Deployment (free tier)

- **Backend:** Supabase free tier — 500 MB database, 1 GB storage, 5 GB bandwidth/month, no card
  required. A free project auto-pauses after 7 days of inactivity and needs a manual resume from
  the dashboard.
- **Frontend:** Vercel, Netlify, or Cloudflare Pages (any works for a static Vite app). Connect the
  GitHub repo, set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` as environment variables in the
  host's dashboard, and every push to `main` redeploys automatically.
- **Source control:** GitHub (free for private repos).

Cost to run at this scale: **$0**, until the 500 MB database cap is a real constraint — a long way
off for a company under 50 employees.

## 13. Security notes

- Row Level Security is enabled on every table; the frontend is a *view*, not the security
  boundary.
- The `service_role` key is never used in frontend code — only the `anon` key, which is safe to
  ship because RLS governs every row.
- `profiles.role` and the sensitive `employees` columns (department, employment status, manager,
  etc.) can't be self-escalated even via a direct API call — see migration `0009`.
- The public employee directory (name, title, department, work email) is served through the
  `public_employee_directory` **view**, which deliberately exposes fewer columns than the raw
  `employees` table so sensitive HR data (DOB, address, private notes) stays restricted to
  self/manager/admin.
- No secrets are committed — `.env` is git-ignored; only `.env.example` (with blank values) is
  tracked.

## 14. Project structure

```
src/
  components/{ui,layout,common}   # UI primitives, app shell, shared widgets
  features/{auth,dashboard,...}    # one folder per module — components/hooks/services/pages
  hooks/                            # cross-feature hooks (useAuth, useCurrentProfile, useRole)
  lib/                              # supabaseClient, queryClient, cn()
  routes/                           # AppRoutes, ProtectedRoute, RoleGuard
  types/                            # database.types.ts (hand-typed until a live project exists)
supabase/
  migrations/                       # numbered SQL migrations
  seed.sql                          # dev-only seed data
tests/                              # Vitest + RTL
e2e/                                # Playwright (Phase 7)
```

## 15. Next: Phase 2

Dashboard metrics, the Employee Directory (grid + table views, search, filters), Employee Profiles,
Departments, and Job Roles — all backed by tables and RLS policies already migrated in this phase.
