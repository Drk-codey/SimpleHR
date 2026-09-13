import { Users, UserCheck, Umbrella, ClipboardList, Cake, UserPlus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

import { useDashboardStats, usePendingLeaveCount } from "../api/employeesApi";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";

// Import employees API from the correct module path
import { useDashboardStats as _unused } from "@/features/employees/api/employeesApi";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  hr_admin: "HR/Admin",
  manager: "Manager",
  employee: "Employee",
};

const STATUS_COLORS: Record<string, string> = {
  active: "#22c55e",
  on_leave: "#f59e0b",
  suspended: "#ef4444",
  terminated: "#94a3b8",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  on_leave: "On Leave",
  suspended: "Suspended",
  terminated: "Terminated",
};

const CHART_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
];

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  accent?: string;
}

function StatCard({ label, value, icon: Icon, description, accent }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </CardTitle>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: accent ? `${accent}20` : undefined }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useCurrentProfile();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: pendingLeave } = usePendingLeaveCount();

  if (profileLoading) return <LoadingSpinner fullPage label="Loading your dashboard…" />;
  if (profileError || !profile) {
    return <ErrorState description="Couldn't load your profile. Try again." onRetry={() => refetchProfile()} />;
  }

  const isLoadingStats = statsLoading;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">
            Welcome back, {profile.full_name.split(" ")[0]}
          </h1>
          <Badge variant="outline">{ROLE_LABEL[profile.role]}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening across your organisation today.
        </p>
      </div>

      {/* Stat cards */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-8 w-16 rounded bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Total Employees"
            value={stats?.total ?? 0}
            icon={Users}
            accent="#6366f1"
          />
          <StatCard
            label="Active"
            value={stats?.active ?? 0}
            icon={UserCheck}
            description="currently working"
            accent="#22c55e"
          />
          <StatCard
            label="On Leave"
            value={stats?.onLeave ?? 0}
            icon={Umbrella}
            accent="#f59e0b"
          />
          <StatCard
            label="Pending Leave"
            value={pendingLeave ?? 0}
            icon={ClipboardList}
            description="awaiting approval"
            accent="#ef4444"
          />
          <StatCard
            label="Birthdays Soon"
            value={stats?.upcomingBirthdays ?? 0}
            icon={Cake}
            description="next 7 days"
            accent="#ec4899"
          />
          <StatCard
            label="New Hires"
            value={stats?.newHires ?? 0}
            icon={UserPlus}
            description="last 30 days"
            accent="#14b8a6"
          />
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Dept breakdown bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Headcount by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="h-48 rounded bg-muted animate-pulse" />
            ) : !stats?.deptBreakdown?.length ? (
              <p className="text-sm text-muted-foreground text-center py-10">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.deptBreakdown} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={110}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{ fontSize: 12, borderRadius: 6 }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {stats.deptBreakdown.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status breakdown pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Employment Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="h-48 rounded bg-muted animate-pulse" />
            ) : !stats?.statusBreakdown?.length ? (
              <p className="text-sm text-muted-foreground text-center py-10">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats.statusBreakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, percent }) =>
                      `${STATUS_LABEL[status] ?? status} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {stats.statusBreakdown.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={STATUS_COLORS[entry.status] ?? CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 6 }}
                    formatter={(v, name) => [v, STATUS_LABEL[name as string] ?? name]}
                  />
                  <Legend
                    formatter={(value) => STATUS_LABEL[value] ?? value}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
