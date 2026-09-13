import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ label = "Loading…", className, fullPage = false }: LoadingSpinnerProps) {
  const content = (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[60vh] w-full items-center justify-center">{content}</div>;
  }

  return content;
}
