import { Navigate, Outlet } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { UserRole } from "@/types/database.types";

interface RoleGuardProps {
  allow: UserRole[];
}

/**
 * UX convenience only — real access control lives in Postgres RLS.
 * This just avoids flashing pages a role can't act on and gives a clear
 * "not authorized" message instead of a confusing empty screen.
 */
export function RoleGuard({ allow }: RoleGuardProps) {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return <LoadingSpinner fullPage label="Checking your access…" />;
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
