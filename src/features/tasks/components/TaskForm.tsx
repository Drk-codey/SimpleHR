import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useCreateHrTask, useUpdateHrTask, type HrTask } from "../api/hrTasksApi";
import { useEmployees } from "@/features/employees/api/employeesApi";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TablesInsert } from "@/types/database.types";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignee_id: z.string().optional(),
  related_employee_id: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["to_do", "in_progress", "completed", "cancelled"]).default("to_do"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: HrTask;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TaskForm({ initialData, onSuccess, onCancel }: TaskFormProps) {
  const { data: employees } = useEmployees();
  const { data: profile } = useCurrentProfile();
  const { isAdmin } = useRole();
  const createTask = useCreateHrTask();
  const updateTask = useUpdateHrTask();

  const canAssignToOthers = isAdmin;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      assignee_id: initialData?.assignee_id ?? "",
      related_employee_id: initialData?.related_employee_id ?? "",
      due_date: initialData?.due_date ?? "",
      priority: (initialData?.priority as TaskFormValues["priority"]) ?? "medium",
      status: (initialData?.status as TaskFormValues["status"]) ?? "to_do",
    },
  });

  const onSubmit = async (values: TaskFormValues) => {
    try {
      const payload: TablesInsert<"hr_tasks"> = {
        title: values.title,
        description: values.description || null,
        assignee_id: values.assignee_id || profile?.id || null,
        related_employee_id: values.related_employee_id || null,
        due_date: values.due_date || null,
        priority: values.priority,
        status: values.status,
      };

      if (initialData) {
        await updateTask.mutateAsync({ id: initialData.id, updates: payload });
        toast.success("Task updated");
      } else {
        await createTask.mutateAsync(payload);
        toast.success("Task created");
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="task-title">Title *</Label>
        <Input id="task-title" placeholder="e.g. Send welcome email" {...register("title")} aria-invalid={!!errors.title} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="task-description">Description</Label>
        <textarea
          id="task-description"
          {...register("description")}
          rows={3}
          placeholder="Optional details..."
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-priority">Priority</Label>
          <select id="task-priority" {...register("priority")} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-status">Status</Label>
          <select id="task-status" {...register("status")} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {canAssignToOthers && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-assignee">Assignee</Label>
          <select id="task-assignee" {...register("assignee_id")} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="">Unassigned (me)</option>
            {employees?.filter((emp) => emp.profile_id).map((emp) => (
              <option key={emp.id} value={emp.profile_id ?? ""}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-related-employee">Related Employee</Label>
          <select id="task-related-employee" {...register("related_employee_id")} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="">None</option>
            {employees?.filter((emp) => emp.profile_id).map((emp) => (
              <option key={emp.id} value={emp.profile_id ?? ""}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-due-date">Due Date</Label>
          <Input id="task-due-date" type="date" {...register("due_date")} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}

