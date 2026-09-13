import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types/database.types";

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  low:    { label: "Low",    className: "border-transparent bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "border-transparent bg-warning-subtle text-warning" },
  high:   { label: "High",   className: "border-transparent bg-destructive-subtle text-destructive" },
  urgent: { label: "Urgent", className: "border-transparent bg-destructive text-destructive-foreground" },
};

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className
      )}
    >
      {cfg.label}
    </span>
  );
}
