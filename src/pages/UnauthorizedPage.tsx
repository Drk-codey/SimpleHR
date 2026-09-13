import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-subtle">
        <ShieldAlert className="h-6 w-6 text-warning" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-lg font-semibold">You don't have access to this page</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Your account role doesn't include this section. If you think this is a mistake, ask your HR admin.
        </p>
      </div>
      <Button asChild variant="secondary">
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
