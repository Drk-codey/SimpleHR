import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleGuard } from "@/routes/RoleGuard";
import { AppShell } from "@/components/layout/AppShell";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

const ADMIN_ROLES = ["super_admin", "hr_admin"] as const;

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* People — directory/profile are open to all (row-scoped by RLS); management is admin-only */}
          <Route path="/employees" element={<PlaceholderPage title="Employees" phase={2} />} />
          <Route element={<RoleGuard allow={[...ADMIN_ROLES]} />}>
            <Route path="/departments" element={<PlaceholderPage title="Departments" phase={2} />} />
            <Route path="/job-roles" element={<PlaceholderPage title="Job Roles" phase={2} />} />
          </Route>

          {/* Leave */}
          <Route path="/leave/requests" element={<PlaceholderPage title="Leave Requests" phase={3} />} />
          <Route path="/leave/calendar" element={<PlaceholderPage title="Leave Calendar" phase={3} />} />

          {/* Workflows */}
          <Route path="/onboarding" element={<PlaceholderPage title="Onboarding" phase={4} />} />
          <Route path="/tasks" element={<PlaceholderPage title="Tasks" phase={4} />} />

          {/* Records & time */}
          <Route path="/attendance" element={<PlaceholderPage title="Attendance" phase={5} />} />
          <Route path="/calendar" element={<PlaceholderPage title="Calendar" phase={5} />} />
          <Route path="/documents" element={<PlaceholderPage title="Documents" phase={5} />} />

          {/* Operations — admin only */}
          <Route element={<RoleGuard allow={[...ADMIN_ROLES]} />}>
            <Route path="/reports" element={<PlaceholderPage title="Reports" phase={6} />} />
            <Route path="/audit-log" element={<PlaceholderPage title="Audit Log" phase={6} />} />
          </Route>
          <Route element={<RoleGuard allow={["super_admin"]} />}>
            <Route path="/settings" element={<PlaceholderPage title="Settings" phase={6} />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
