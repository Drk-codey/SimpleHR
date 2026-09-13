# SimpleHR — Phases Documentation

This folder tracks every development phase for SimpleHR, from planning to production.

## Phase Index

| Phase | Name | Status | File |
|-------|------|--------|------|
| 1 | Foundation | ✅ Complete | [phase_1_foundation.md](./phase_1_foundation.md) |
| 2 | People Core | 🔄 In Progress | [phase_2_people_core.md](./phase_2_people_core.md) |
| 3 | Leave | ⏳ Planned | [phase_3_leave.md](./phase_3_leave.md) |
| 4 | Workflows | In Progress | [phase_4_workflows.md](./phase_4_workflows.md) |
| 5 | Records & Time | ⏳ Planned | [phase_5_records_and_time.md](./phase_5_records_and_time.md) |
| 6 | Operations | ⏳ Planned | [phase_6_operations.md](./phase_6_operations.md) |
| 7 | Hardening | ⏳ Planned | [phase_7_hardening.md](./phase_7_hardening.md) |

## Legend

- ✅ **Complete** — All tasks done, verified, and merged.
- 🔄 **In Progress** — Actively being built.
- ⏳ **Planned** — Not yet started; spec finalized in the Architecture doc.
- 🚧 **Blocked** — Waiting on a dependency or decision.

## How to Use This Folder

- Each phase file is the single source of truth for that phase: goals, tasks checklist, decisions made, files changed, and a verification record.
- Update the checklist in real time as you work.
- Add a **Decisions Log** entry any time you deviate from the original plan, so future sessions can understand why.
- When a phase is complete, mark its status in this index and fill in the verification section of its file.

## Quick Reference — Architecture

The full architecture document (DB schema, RLS strategy, route table, permission matrix) lives at:

```
.agents/SimpleHR_Architecture.md
```

Project brief / original prompt:

```
.agents/project_prompt.md
```

Agent instructions / conventions:

```
.agents/project_instructions.md
```

