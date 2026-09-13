import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2, GripVertical } from "lucide-react";
import * as React from "react";

import {
  useCreateOnboardingTemplate,
  useUpdateOnboardingTemplate,
  useCreateTemplateTask,
  useUpdateTemplateTask,
  useDeleteTemplateTask,
  type OnboardingTemplate,
  type OnboardingTemplateTask,
} from "../api/onboardingApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  day_offset: z.coerce.number().min(0).default(0),
  assigned_role: z.enum(["hr", "manager", "employee", "specific"]).default("hr"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface OnboardingTemplateFormProps {
  initialData?: OnboardingTemplate & { onboarding_template_tasks?: OnboardingTemplateTask[] };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OnboardingTemplateForm({ initialData, onSuccess, onCancel }: OnboardingTemplateFormProps) {
  const [savedTemplateId, setSavedTemplateId] = React.useState<string | null>(initialData?.id ?? null);
  const [tasks, setTasks] = React.useState<OnboardingTemplateTask[]>(initialData?.onboarding_template_tasks ?? []);
  const [addingTask, setAddingTask] = React.useState(false);

  const createTemplate = useCreateOnboardingTemplate();
  const updateTemplate = useUpdateOnboardingTemplate();
  const createTask = useCreateTemplateTask();
  const updateTask = useUpdateTemplateTask();
  const deleteTask = useDeleteTemplateTask();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
    },
  });

  const {
    register: registerTask,
    handleSubmit: handleTaskSubmit,
    reset: resetTask,
    formState: { errors: taskErrors, isSubmitting: isTaskSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { day_offset: 0, assigned_role: "hr", priority: "medium" },
  });

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      if (initialData) {
        await updateTemplate.mutateAsync({ id: initialData.id, updates: values });
        toast.success("Template updated");
        onSuccess?.();
      } else {
        const created = await createTemplate.mutateAsync(values);
        setSavedTemplateId(created.id);
        toast.success("Template created — now add tasks below");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const onAddTask = async (values: TaskFormValues) => {
    if (!savedTemplateId) return;
    try {
      const created = await createTask.mutateAsync({
        ...values,
        template_id: savedTemplateId,
        order_index: tasks.length,
      });
      setTasks((prev) => [...prev, created]);
      resetTask();
      setAddingTask(false);
      toast.success("Task added");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't add task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't remove task");
    }
  };

  const handleMoveTask = async (id: string, direction: "up" | "down") => {
    const currentIndex = tasks.findIndex((task) => task.id === id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= tasks.length) return;

    const nextTasks = [...tasks];
    const current = nextTasks[currentIndex];
    const target = nextTasks[targetIndex];
    nextTasks[currentIndex] = target;
    nextTasks[targetIndex] = current;

    setTasks(nextTasks.map((task, index) => ({ ...task, order_index: index })));

    try {
      await Promise.all([
        updateTask.mutateAsync({ id: current.id, updates: { order_index: targetIndex } }),
        updateTask.mutateAsync({ id: target.id, updates: { order_index: currentIndex } }),
      ]);
    } catch (e) {
      setTasks(tasks);
      toast.error(e instanceof Error ? e.message : "Couldn't reorder tasks");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Template info */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="template-name">Template Name *</Label>
          <Input id="template-name" placeholder="e.g. Engineering Onboarding" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="template-description">Description</Label>
          <Input id="template-description" placeholder="Optional description" {...register("description")} />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && !savedTemplateId && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? "Save template" : savedTemplateId ? "Saved ✓" : "Create template"}
          </Button>
        </div>
      </form>

      {/* Tasks section */}
      {savedTemplateId && (
        <div className="flex flex-col gap-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Tasks ({tasks.length})</h3>
            <Button size="sm" variant="outline" onClick={() => setAddingTask(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Task
            </Button>
          </div>

          {tasks.length === 0 && !addingTask && (
            <p className="text-sm text-muted-foreground">No tasks yet. Add at least one task to this template.</p>
          )}

          <div className="divide-y rounded-md border">
            {tasks.map((t, index) => (
              <div key={t.id} className="flex items-start gap-2 p-3">
                <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Day {t.day_offset} - {t.assigned_role} - {t.priority}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleMoveTask(t.id, "up")}
                    disabled={index === 0 || updateTask.isPending}
                    aria-label="Move task up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleMoveTask(t.id, "down")}
                    disabled={index === tasks.length - 1 || updateTask.isPending}
                    aria-label="Move task down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteTask(t.id)}
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {addingTask && (
              <form onSubmit={handleTaskSubmit(onAddTask)} className="flex flex-col gap-3 p-3 bg-muted/30">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 flex flex-col gap-1">
                    <Label htmlFor="task-title-input" className="text-xs">Title *</Label>
                    <Input id="task-title-input" placeholder="e.g. Set up workstation" {...registerTask("title")} />
                    {taskErrors.title && <p className="text-xs text-destructive">{taskErrors.title.message}</p>}
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <Label htmlFor="task-description-input" className="text-xs">Description</Label>
                    <textarea
                      id="task-description-input"
                      {...registerTask("description")}
                      rows={2}
                      className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="task-day-offset" className="text-xs">Day offset</Label>
                    <Input id="task-day-offset" type="number" min="0" {...registerTask("day_offset")} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="task-assigned-role" className="text-xs">Assigned role</Label>
                    <select id="task-assigned-role" {...registerTask("assigned_role")} className="h-9 rounded-md border border-input bg-transparent px-2 text-sm">
                      <option value="hr">HR</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                      <option value="specific">Specific person</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="task-priority" className="text-xs">Priority</Label>
                    <select id="task-priority" {...registerTask("priority")} className="h-9 rounded-md border border-input bg-transparent px-2 text-sm">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setAddingTask(false); resetTask(); }}>Cancel</Button>
                  <Button type="submit" size="sm" isLoading={isTaskSubmitting}>Add task</Button>
                </div>
              </form>
            )}
          </div>

          {savedTemplateId && !initialData && (
            <Button className="mt-2" onClick={() => onSuccess?.()}>
              Done
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

