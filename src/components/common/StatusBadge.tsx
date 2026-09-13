import { Badge, type BadgeProps } from "@/components/ui/badge";
import type {
  EmploymentStatus,
  LeaveStatus,
  OnboardingStatus,
  HrTaskStatus,
} from "@/types/database.types";

type KnownStatus = EmploymentStatus | LeaveStatus | OnboardingStatus | HrTaskStatus;

const STATUS_CONFIG: Record<KnownStatus, { label: string; variant: BadgeProps["variant"] }> = {
  // Employment status
  active: { label: "Active", variant: "success" },
  on_leave: { label: "On leave", variant: "info" },
  suspended: { label: "Suspended", variant: "warning" },
  terminated: { label: "Terminated", variant: "neutral" },
  // Leave status
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "neutral" },
  // Onboarding status
  not_started: { label: "Not started", variant: "neutral" },
  in_progress: { label: "In progress", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  overdue: { label: "Overdue", variant: "destructive" },
  // HR task status
  to_do: { label: "To do", variant: "neutral" },
};

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: KnownStatus;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "neutral" as const };
  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.label}
    </Badge>
  );
}
