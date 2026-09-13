import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { daysUntilNextMonthDay, isWithinPastDays, isWithinUpcomingDays, monthDay, yearsElapsed } from "@/lib/dates";
import type { EmploymentStatus, Tables } from "@/types/database.types";

export type WidgetPerson = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  date?: string;
  subtitle?: string;
  daysUntil?: number;
  years?: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  created_at: string;
};

export type DashboardStats = {
  total: number;
  active: number;
  onLeave: number;
  pendingLeave: number;
  upcomingBirthdays: WidgetPerson[];
  workAnniversaries: WidgetPerson[];
  newHires: WidgetPerson[];
  deptBreakdown: { name: string; count: number }[];
  typeBreakdown: { name: string; count: number }[];
  activity: ActivityItem[];
};

type DirectoryRow = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  department_id: string | null;
  employment_type_id: string | null;
  employment_status: EmploymentStatus;
};

type PrivateRow = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  start_date: string;
  job_roles?: { title: string } | null;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const [dirRes, empRes, deptRes, typeRes, leaveRes, auditRes] = await Promise.all([
        supabase
          .from("public_employee_directory")
          .select("id, first_name, last_name, avatar_url, department_id, employment_type_id, employment_status"),
        supabase
          .from("employees")
          .select("id, first_name, last_name, avatar_url, date_of_birth, start_date, job_roles (title)")
          .is("deleted_at", null),
        supabase.from("departments").select("id, name"),
        supabase.from("employment_types").select("id, name"),
        supabase.from("leave_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase
          .from("audit_logs")
          .select("id, action, entity_type, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (dirRes.error) throw new Error(dirRes.error.message);
      if (deptRes.error) throw new Error(deptRes.error.message);
      if (typeRes.error) throw new Error(typeRes.error.message);

      const directory = (dirRes.data ?? []) as DirectoryRow[];
      const privateEmployees = (empRes.error ? [] : empRes.data ?? []) as PrivateRow[];
      const departments = (deptRes.data ?? []) as Pick<Tables<"departments">, "id" | "name">[];
      const types = (typeRes.data ?? []) as Pick<Tables<"employment_types">, "id" | "name">[];

      const deptName = new Map(departments.map((d) => [d.id, d.name]));
      const typeName = new Map(types.map((t) => [t.id, t.name]));

      const total = directory.length;
      const active = directory.filter((e) => e.employment_status === "active").length;
      const onLeave = directory.filter((e) => e.employment_status === "on_leave").length;

      const deptMap: Record<string, number> = {};
      directory.forEach((e) => {
        const name = (e.department_id && deptName.get(e.department_id)) || "Unassigned";
        deptMap[name] = (deptMap[name] ?? 0) + 1;
      });
      const deptBreakdown = Object.entries(deptMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      const typeMap: Record<string, number> = {};
      directory.forEach((e) => {
        const name = (e.employment_type_id && typeName.get(e.employment_type_id)) || "Unassigned";
        typeMap[name] = (typeMap[name] ?? 0) + 1;
      });
      const typeBreakdown = Object.entries(typeMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      const upcomingBirthdays: WidgetPerson[] = privateEmployees
        .filter((e) => e.date_of_birth && isWithinUpcomingDays(e.date_of_birth, 7))
        .map((e) => ({
          id: e.id,
          first_name: e.first_name,
          last_name: e.last_name,
          avatar_url: e.avatar_url,
          date: e.date_of_birth ?? undefined,
          daysUntil: e.date_of_birth ? daysUntilNextMonthDay(monthDay(e.date_of_birth)) : undefined,
        }))
        .sort((a, b) => (a.daysUntil ?? 0) - (b.daysUntil ?? 0));

      const workAnniversaries: WidgetPerson[] = privateEmployees
        .filter((e) => isWithinUpcomingDays(e.start_date, 7) && yearsElapsed(e.start_date) >= 1)
        .map((e) => ({
          id: e.id,
          first_name: e.first_name,
          last_name: e.last_name,
          avatar_url: e.avatar_url,
          date: e.start_date,
          daysUntil: daysUntilNextMonthDay(monthDay(e.start_date)),
          years: yearsElapsed(e.start_date),
        }))
        .sort((a, b) => (a.daysUntil ?? 0) - (b.daysUntil ?? 0));

      const newHires: WidgetPerson[] = privateEmployees
        .filter((e) => isWithinPastDays(e.start_date, 30))
        .map((e) => ({
          id: e.id,
          first_name: e.first_name,
          last_name: e.last_name,
          avatar_url: e.avatar_url,
          date: e.start_date,
          subtitle: e.job_roles?.title ?? undefined,
        }))
        .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

      const activity: ActivityItem[] = auditRes.error
        ? []
        : ((auditRes.data ?? []) as { id: string; action: string; entity_type: string; created_at: string }[]).map(
            (row) => ({
              id: row.id,
              title: row.action.replace(/_/g, " "),
              detail: row.entity_type.replace(/_/g, " "),
              created_at: row.created_at,
            }),
          );

      if (activity.length === 0) {
        newHires.slice(0, 5).forEach((h) => {
          activity.push({
            id: `hire-${h.id}`,
            title: `${h.first_name} ${h.last_name} joined`,
            detail: h.subtitle ?? "New hire",
            created_at: h.date ?? "",
          });
        });
      }

      return {
        total,
        active,
        onLeave,
        pendingLeave: leaveRes.error ? 0 : (leaveRes.count ?? 0),
        upcomingBirthdays,
        workAnniversaries,
        newHires,
        deptBreakdown,
        typeBreakdown,
        activity,
      };
    },
  });
};
