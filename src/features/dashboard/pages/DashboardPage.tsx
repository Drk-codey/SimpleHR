import { Users, ClipboardList, CalendarClock, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  hr_admin: "HR/Admin",
  manager: "Manager",
  employee: "Employee",
};

const PLACEHOLDER_CARDS = [
  { label: "Total employees", icon: Users },
  { label: "Pending leave requests", icon: ClipboardList },
  { label: "Upcoming birthdays", icon: CalendarClock },
  { label: "Outstanding onboarding tasks", icon: CheckSquare },
];

export function DashboardPage() {
  const { data: profile, isLoading, isError, refetch } = useCurrentProfile();

  if (isLoading) return <LoadingSpinner fullPage label="Loading your dashboard…" />;
  if (isError || !profile) {
    return <ErrorState description="Couldn't load your profile. Try again." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back, {profile.full_name.split(" ")[0]}</h1>
          <Badge variant="outline">{ROLE_LABEL[profile.role]}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Authentication, roles, and the app shell are wired up. Live HR metrics land in Phase 2.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLACEHOLDER_CARDS.map(({ label, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums text-muted-foreground/50">—</p>
              <p className="mt-1 text-xs text-muted-foreground">Coming in Phase 2</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's next</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Phase 2 adds the real dashboard metrics, the employee directory, employee profiles, departments,
          and job roles — all backed by the tables and RLS policies already migrated in this phase.
        </CardContent>
      </Card>
    </div>
  );
}
