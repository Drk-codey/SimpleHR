import type { ElementType } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  Umbrella,
  ClipboardList,
  Cake,
  UserPlus,
  Award,
  Activity,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import { useDashboardStats, type WidgetPerson } from "../api/dashboardApi";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { getInitials } from "@/lib/names";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  hr_admin: "HR/Admin",
  manager: "Manager",
  employee: "Employee",
};

const CHART_COLORS = ["#1e3a4c", "#3d5a6c", "#5c7a84", "#0f5c56", "#6b5e4f", "#8a7a68", "#4a5560", "#2f4858"];

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ElementType;
  description?: string;
}

function StatCard({ label, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

function PersonRow({ person, extra }: { person: WidgetPerson; extra: string }) {
  return (
    <Link
      to={`/employees/${person.id}`}
      className="flex items-center gap-3 rounded-md px-1 py-2 hover:bg-muted/60"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={person.avatar_url ?? undefined} />
        <AvatarFallback className="text-xs">
          {getInitials(person.first_name, person.last_name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {person.first_name} {person.last_name}
        </p>
        {person.subtitle && (
          <p className="truncate text-xs text-muted-foreground">{person.subtitle}</p>
        )}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{extra}</span>
    </Link>
  );
}

function WidgetList({
  people,
  empty,
  extra,
}: {
  people: WidgetPerson[];
  empty: string;
  extra: (p: WidgetPerson) => string;
}) {
  if (people.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="divide-y">
      {people.slice(0, 6).map((p) => (
        <PersonRow key={p.id} person={p} extra={extra(p)} />
      ))}
    </div>
  );
}

function formatShortDate(iso?: string) {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "d MMM");
  } catch {
    return iso;
  }
}

export function DashboardPage() {
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useCurrentProfile();
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useDashboardStats();

  if (profileLoading) return <LoadingSpinner fullPage label="Loading your dashboard…" />;
  if (profileError || !profile) {
    return <ErrorState description="Couldn't load your profile. Try again." onRetry={() => refetchProfile()} />;
  }
  if (statsError) {
    return <ErrorState description="Couldn't load dashboard metrics." onRetry={() => refetchStats()} />;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">
            Welcome back, {profile.full_name.split(" ")[0]}
          </h1>
          <Badge variant="outline">{ROLE_LABEL[profile.role]}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of people, leave, and upcoming dates.
        </p>
      </div>

      {statsLoading || !stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Employees" value={stats.total} icon={Users} />
          <StatCard label="Active" value={stats.active} icon={UserCheck} description="currently working" />
          <StatCard label="On Leave" value={stats.onLeave} icon={Umbrella} />
          <StatCard
            label="Pending Leave"
            value={stats.pendingLeave}
            icon={ClipboardList}
            description="awaiting approval"
          />
          <StatCard
            label="Birthdays Soon"
            value={stats.upcomingBirthdays.length}
            icon={Cake}
            description="next 7 days"
          />
          <StatCard
            label="New Hires"
            value={stats.newHires.length}
            icon={UserPlus}
            description="last 30 days"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Headcount by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <div className="h-48 animate-pulse rounded bg-muted" />
            ) : stats.deptBreakdown.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.deptBreakdown} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={110}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {stats.deptBreakdown.map((row) => (
                      <Cell key={row.name} fill={CHART_COLORS[stats.deptBreakdown.indexOf(row) % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Employment Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <div className="h-48 animate-pulse rounded bg-muted" />
            ) : stats.typeBreakdown.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats.typeBreakdown}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.typeBreakdown.map((entry, i) => (
                      <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Cake className="h-4 w-4" />
              Upcoming birthdays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WidgetList
              people={stats?.upcomingBirthdays ?? []}
              empty="No birthdays in the next 7 days."
              extra={(p) =>
                p.daysUntil === 0 ? "Today" : p.daysUntil === 1 ? "Tomorrow" : `${p.daysUntil}d · ${formatShortDate(p.date)}`
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Award className="h-4 w-4" />
              Work anniversaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WidgetList
              people={stats?.workAnniversaries ?? []}
              empty="No anniversaries in the next 7 days."
              extra={(p) => `${p.years ?? 0} yr${(p.years ?? 0) === 1 ? "" : "s"}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <UserPlus className="h-4 w-4" />
              New hires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WidgetList
              people={stats?.newHires ?? []}
              empty="No new hires in the last 30 days."
              extra={(p) => formatShortDate(p.date)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="h-4 w-4" />
              Recent HR activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!stats || stats.activity.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Nothing recent to show.</p>
            ) : (
              <ul className="divide-y">
                {stats.activity.slice(0, 6).map((item) => (
                  <li key={item.id} className="py-2">
                    <p className="text-sm font-medium capitalize">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail}
                      {item.created_at ? ` · ${formatShortDate(item.created_at)}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
