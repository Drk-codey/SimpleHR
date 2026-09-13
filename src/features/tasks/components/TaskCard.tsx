import { format, isPast, isToday } from "date-fns";
import { Calendar, User, UserCircle2, Pencil, Trash2 } from "lucide-react";
import type { HrTask } from "../api/hrTasksApi";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HrTaskStatus } from "@/types/database.types";

interface TaskCardProps {
  task: HrTask;
  onEdit: (task: HrTask) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: HrTaskStatus) => void;
  canManage?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, canManage = false }: TaskCardProps) {
  const isOverdue =
    task.due_date &&
    task.status !== "completed" &&
    task.status !== "cancelled" &&
    isPast(new Date(task.due_date)) &&
    !isToday(new Date(task.due_date));

  const relatedName = task.related_employee
    ? `${task.related_employee.first_name} ${task.related_employee.last_name}`
    : null;

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-lg border bg-surface p-4 shadow-sm transition-all",
        isOverdue && "border-destructive/40 bg-destructive/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-snug">{task.title}</p>
          {task.description && (
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          )}
        </div>
        {canManage && (
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(task)} aria-label="Edit task">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
        {isOverdue && (
          <span className="inline-flex items-center rounded-full border border-transparent bg-destructive px-2.5 py-0.5 text-xs font-medium text-destructive-foreground">
            Overdue
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {task.assignee?.full_name && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {task.assignee.full_name}
          </span>
        )}
        {relatedName && (
          <span className="flex items-center gap-1">
            <UserCircle2 className="h-3 w-3" />
            re: {relatedName}
          </span>
        )}
        {task.due_date && (
          <span className={cn("flex items-center gap-1", isOverdue && "text-destructive font-medium")}>
            <Calendar className="h-3 w-3" />
            {isToday(new Date(task.due_date))
              ? "Due today"
              : format(new Date(task.due_date), "dd MMM yyyy")}
          </span>
        )}
      </div>

      {/* Inline status update */}
      <div className="flex items-center gap-2 border-t pt-2">
        <span className="text-xs text-muted-foreground">Status:</span>
        <select
          className="h-7 flex-1 rounded border border-input bg-transparent px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as HrTaskStatus)}
        >
          <option value="to_do">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}

