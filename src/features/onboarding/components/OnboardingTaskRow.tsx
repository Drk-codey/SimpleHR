import { format, isPast, isToday } from "date-fns";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { OnboardingTask } from "../api/onboardingApi";
import { cn } from "@/lib/utils";
import { TaskPriorityBadge } from "@/features/tasks/components/TaskPriorityBadge";
import type { TaskPriority } from "@/types/database.types";

interface OnboardingTaskRowProps {
  task: OnboardingTask & { assigned_profile?: { full_name: string } | null };
  onToggle: (id: string, currentStatus: string) => void;
  canToggle: boolean;
}

export function OnboardingTaskRow({ task, onToggle, canToggle }: OnboardingTaskRowProps) {
  const isCompleted = task.status === "completed";
  const isOverdue =
    task.due_date &&
    !isCompleted &&
    isPast(new Date(task.due_date)) &&
    !isToday(new Date(task.due_date));

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors",
        isCompleted && "opacity-60",
        isOverdue && "bg-destructive/5"
      )}
    >
      <button
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
        disabled={!canToggle}
        onClick={() => onToggle(task.id, task.status)}
        className={cn(
          "mt-0.5 shrink-0 transition-colors",
          canToggle ? "cursor-pointer hover:text-primary" : "cursor-default",
          isCompleted ? "text-success" : "text-muted-foreground/50"
        )}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", isCompleted && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <TaskPriorityBadge priority={task.priority as TaskPriority} />
          {task.due_date && (
            <span className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-destructive font-medium" : "text-muted-foreground")}>
              <Clock className="h-3 w-3" />
              {isToday(new Date(task.due_date))
                ? "Due today"
                : format(new Date(task.due_date), "dd MMM yyyy")}
              {isOverdue && " (Overdue)"}
            </span>
          )}
          {task.assigned_profile?.full_name && (
            <span className="text-xs text-muted-foreground">→ {task.assigned_profile.full_name}</span>
          )}
        </div>
      </div>
    </div>
  );
}
