import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import type { UserRole } from "@/types/database.types";

/**
 * Convenience wrapper around useCurrentProfile for permission checks in the UI.
 * NOTE: this is a UX layer only. The real enforcement is Postgres RLS —
 * see supabase/migrations/0005_rls_policies.sql. Never trust this hook alone
 * to protect sensitive data or actions.
 */
export function useRole() {
  const { data: profile, isLoading } = useCurrentProfile();
  const role = profile?.role;

  const hasRole = (allowed: UserRole[]) => (role ? allowed.includes(role) : false);
  const isAdmin = role === "super_admin" || role === "hr_admin";
  const isSuperAdmin = role === "super_admin";
  const isManager = role === "manager";

  return { role, isLoading, hasRole, isAdmin, isSuperAdmin, isManager };
}
