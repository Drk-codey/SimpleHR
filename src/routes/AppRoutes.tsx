import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleGuard } from "@/routes/RoleGuard";
import { AppShell } from "@/components/layout/AppShell";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

// People
import { DepartmentsPage } from "@/features/departments/pages/DepartmentsPage";
import { JobRolesPage } from "@/features/jobRoles/pages/JobRolesPage";
import { EmployeesPage } from "@/features/employees/pages/EmployeesPage";
import { EmployeeProfilePage } from "@/features/employees/pages/EmployeeProfilePage";
import { EmployeeFormPage } from "@/features/employees/pages/EmployeeFormPage";

// Workflows
import { TasksPage } from "@/features/tasks/pages/TasksPage";
import { OnboardingOverviewPage } from "@/features/onboarding/pages/OnboardingOverviewPage";
import { OnboardingTemplatesPage } from "@/features/onboarding/pages/OnboardingTemplatesPage";
import { EmployeeOnboardingPage } from "@/features/onboarding/pages/EmployeeOnboardingPage";

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

          {/* People — directory/profile open to all; management admin-only */}
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/:id" element={<EmployeeProfilePage />} />
          <Route element={<RoleGuard allow={[...ADMIN_ROLES]} />}>
            <Route path="/employees/new" element={<EmployeeFormPage mode="create" />} />
            <Route path="/employees/:id/edit" element={<EmployeeFormPage mode="edit" />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/job-roles" element={<JobRolesPage />} />
          </Route>

          {/* Leave */}
          <Route path="/leave/requests" element={<PlaceholderPage title="Leave Requests" phase={3} />} />
          <Route path="/leave/calendar" element={<PlaceholderPage title="Leave Calendar" phase={3} />} />

          {/* Workflows: all roles can view scoped records; admins manage templates and assignments. */}
          <Route path="/onboarding" element={<OnboardingOverviewPage />} />
          <Route path="/onboarding/:id" element={<EmployeeOnboardingPage />} />
          <Route element={<RoleGuard allow={[...ADMIN_ROLES]} />}>
            <Route path="/onboarding/templates" element={<OnboardingTemplatesPage />} />
          </Route>
          <Route path="/tasks" element={<TasksPage />} />

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


