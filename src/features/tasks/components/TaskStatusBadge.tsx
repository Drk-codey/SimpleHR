import { cn } from "@/lib/utils";
import type { HrTaskStatus } from "@/types/database.types";

const STATUS_CONFIG: Record<HrTaskStatus, { label: string; className: string }> = {
  to_do:       { label: "To Do",       className: "border-border bg-muted text-muted-foreground" },
  in_progress: { label: "In Progress", className: "border-transparent bg-info-subtle text-info" },
  completed:   { label: "Completed",   className: "border-transparent bg-success-subtle text-success" },
  cancelled:   { label: "Cancelled",   className: "border-transparent bg-destructive-subtle text-destructive" },
};

export function TaskStatusBadge({ status }: { status: HrTaskStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.to_do;
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
