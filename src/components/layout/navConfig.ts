import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  CheckSquare,
  Clock,
  FileText,
  BarChart3,
  Settings,
  History,
} from "lucide-react";
import type { UserRole } from "@/types/database.types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  allow: UserRole[];
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

const ALL_ROLES: UserRole[] = ["super_admin", "hr_admin", "manager", "employee"];
const ADMIN_ROLES: UserRole[] = ["super_admin", "hr_admin"];

// Phase 1 ships auth + shell only, so most hrefs below point at placeholder
// routes that will get real pages in Phases 2–6. They're listed now so the
// nav doesn't need to be rebuilt every phase — only RoleGuard targets change.
export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, allow: ALL_ROLES }],
  },
  {
    label: "People",
    items: [
      { label: "Employees", href: "/employees", icon: Users, allow: ALL_ROLES },
      { label: "Departments", href: "/departments", icon: Building2, allow: ADMIN_ROLES },
      { label: "Job Roles", href: "/job-roles", icon: Briefcase, allow: ADMIN_ROLES },
    ],
  },
  {
    label: "Leave",
    items: [
      { label: "Leave Requests", href: "/leave/requests", icon: ClipboardList, allow: ALL_ROLES },
      { label: "Leave Calendar", href: "/leave/calendar", icon: CalendarClock, allow: ALL_ROLES },
    ],
  },
  {
    items: [
      { label: "Onboarding", href: "/onboarding", icon: CheckSquare, allow: ALL_ROLES },
      { label: "Tasks", href: "/tasks", icon: ClipboardList, allow: ALL_ROLES },
      { label: "Attendance", href: "/attendance", icon: Clock, allow: ALL_ROLES },
      { label: "Calendar", href: "/calendar", icon: CalendarDays, allow: ALL_ROLES },
      { label: "Documents", href: "/documents", icon: FileText, allow: ALL_ROLES },
    ],
  },
  {
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3, allow: ADMIN_ROLES },
      { label: "Audit Log", href: "/audit-log", icon: History, allow: ADMIN_ROLES },
      { label: "Settings", href: "/settings", icon: Settings, allow: ["super_admin"] },
    ],
  },
];
