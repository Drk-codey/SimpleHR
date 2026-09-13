import { cn } from "@/lib/utils";

interface OnboardingProgressBarProps {
  total: number;
  completed: number;
  className?: string;
}

export function OnboardingProgressBar({ total, completed, className }: OnboardingProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{completed} of {total} tasks completed</span>
        <span className="font-medium text-foreground">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            pct === 100 ? "bg-success" : pct >= 50 ? "bg-primary" : "bg-warning"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
