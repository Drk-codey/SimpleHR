import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useEmployeeOnboardingDetail, useUpdateOnboardingTaskStatus } from "../api/onboardingApi";
import { OnboardingProgressBar } from "../components/OnboardingProgressBar";
import { OnboardingTaskRow } from "../components/OnboardingTaskRow";
import { useRole } from "@/hooks/useRole";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";

export function EmployeeOnboardingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: onboarding, isLoading, isError, refetch } = useEmployeeOnboardingDetail(id);
  const { data: profile } = useCurrentProfile();
  const { isAdmin } = useRole();
  const updateTaskStatus = useUpdateOnboardingTaskStatus();

  if (isLoading) return <LoadingSpinner fullPage label="Loading onboarding..." />;
  if (isError || !onboarding) return <ErrorState description="Couldn't load this onboarding record." onRetry={() => refetch()} />;

  const totalTasks = onboarding.onboarding_tasks.length;
  const completedTasks = onboarding.onboarding_tasks.filter((t) => t.status === "completed").length;

  // RLS allows admins or the assigned profile to update onboarding task status.
  const canToggleTask = (assignedTo: string | null) => isAdmin || assignedTo === profile?.id;

  const handleToggle = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "completed" ? "not_started" : "completed";
    try {
      await updateTaskStatus.mutateAsync({ id: taskId, status: nextStatus });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update task");
    }
  };

  const emp = onboarding.employees;
  const sorted = [...onboarding.onboarding_tasks].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/onboarding">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Onboarding
        </Link>
      </Button>

      {/* Header card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start gap-5">
            <Avatar className="h-16 w-16">
              <AvatarImage src={emp.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {emp.first_name[0]}{emp.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold">{emp.first_name} {emp.last_name}</h1>
                <Badge variant="outline" className="text-xs">{onboarding.status.replace(/_/g, " ")}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Template: {onboarding.onboarding_templates?.name ?? "—"} · Started: {onboarding.start_date}
              </p>
              <div className="mt-4">
                <OnboardingProgressBar total={totalTasks} completed={completedTasks} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Tasks
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {completedTasks}/{totalTasks} completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {totalTasks === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No tasks in this onboarding record.
            </p>
          ) : (
            <div className="divide-y">
              {sorted.map((task) => (
                <OnboardingTaskRow
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  canToggle={canToggleTask(task.assigned_to)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

