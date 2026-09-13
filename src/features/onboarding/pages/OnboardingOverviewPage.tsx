import * as React from "react";
import { Link } from "react-router-dom";
import { Plus, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import {
  useAllEmployeeOnboardings,
  useAssignOnboardingTemplate,
  useOnboardingTemplates,
} from "../api/onboardingApi";
import { useEmployees } from "@/features/employees/api/employeesApi";
import { OnboardingProgressBar } from "../components/OnboardingProgressBar";
import { useRole } from "@/hooks/useRole";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const assignSchema = z.object({
  employee_id: z.string().min(1, "Employee is required"),
  template_id: z.string().min(1, "Template is required"),
  start_date: z.string().min(1, "Start date is required"),
});
type AssignValues = z.infer<typeof assignSchema>;

function AssignForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { data: employees } = useEmployees();
  const { data: templates } = useOnboardingTemplates();
  const assign = useAssignOnboardingTemplate();

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<AssignValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: { start_date: new Date().toISOString().split("T")[0] },
  });

  const onSubmit = async (values: AssignValues) => {
    try {
      await assign.mutateAsync({
        employeeId: values.employee_id,
        templateId: values.template_id,
        startDate: values.start_date,
      });
      toast.success("Onboarding started!");
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't assign template");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="assign-employee">Employee *</Label>
        <select id="assign-employee" {...register("employee_id")} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option value="">Select employee</option>
          {employees?.map((e) => (
            <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
          ))}
        </select>
        {errors.employee_id && <p className="text-sm text-destructive">{errors.employee_id.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="assign-template">Template *</Label>
        <select id="assign-template" {...register("template_id")} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option value="">Select template</option>
          {templates?.filter((t) => t.is_active).map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {errors.template_id && <p className="text-sm text-destructive">{errors.template_id.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="assign-start">Start Date *</Label>
        <Input id="assign-start" type="date" {...register("start_date")} aria-invalid={!!errors.start_date} />
        {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>Start Onboarding</Button>
      </div>
    </form>
  );
}

export function OnboardingOverviewPage() {
  const { data: onboardings, isLoading, isError, refetch } = useAllEmployeeOnboardings();
  const { isAdmin } = useRole();
  const [isAssignOpen, setIsAssignOpen] = React.useState(false);

  if (isLoading) return <LoadingSpinner fullPage label="Loading onboarding..." />;
  if (isError) return <ErrorState description="Couldn't load onboarding records." onRetry={() => refetch()} />;

  // Role scoping is enforced by RLS: admins see all, managers see their team, employees see their own.
  const visible = onboardings ?? [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Onboarding</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track onboarding progress across your team.
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" asChild>
              <Link to="/onboarding/templates">Manage Templates</Link>
            </Button>
          )}
          {isAdmin && (
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Onboarding
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Onboarding Template</DialogTitle>
                </DialogHeader>
                <AssignForm onSuccess={() => setIsAssignOpen(false)} onCancel={() => setIsAssignOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-surface py-16 text-center">
          <Users className="mb-4 h-10 w-10 text-muted-foreground/30" />
          <p className="text-lg font-medium">No active onboardings</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start an onboarding process by assigning a template to an employee.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((ob) => {
            const totalTasks = ob.onboarding_tasks.length;
            const completedTasks = ob.onboarding_tasks.filter((t) => t.status === "completed").length;
            const allDone = totalTasks > 0 && completedTasks === totalTasks;

            return (
              <Link
                key={ob.id}
                to={`/onboarding/${ob.id}`}
                className="group flex flex-col gap-4 rounded-lg border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={ob.employees.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {ob.employees.first_name[0]}{ob.employees.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate group-hover:text-primary transition-colors">
                        {ob.employees.first_name} {ob.employees.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {ob.onboarding_templates?.name ?? "No template"}
                      </p>
                    </div>
                  </div>
                  {allDone && <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />}
                </div>

                <OnboardingProgressBar total={totalTasks} completed={completedTasks} />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">{ob.status.replace(/_/g, " ")}</Badge>
                  <span>Started {ob.start_date}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}



