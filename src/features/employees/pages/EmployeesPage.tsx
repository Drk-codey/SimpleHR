import * as React from "react";
import { Link } from "react-router-dom";
import { Search, LayoutGrid, List, Plus, UserCircle2 } from "lucide-react";

import { useEmployees } from "../api/employeesApi";
import { useDepartments } from "@/features/departments/api/departmentsApi";
import { useRole } from "@/hooks/useRole";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { EmployeeWithRelations } from "../api/employeesApi";

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "active" | "on_leave" | "suspended" | "terminated";

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function EmployeeCard({ employee }: { employee: EmployeeWithRelations }) {
  return (
    <Link
      to={`/employees/${employee.id}`}
      className="group flex flex-col gap-3 rounded-lg border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <Avatar className="h-12 w-12">
          <AvatarImage src={employee.avatar_url ?? undefined} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(employee.first_name, employee.last_name)}
          </AvatarFallback>
        </Avatar>
        <StatusBadge status={employee.employment_status} />
      </div>
      <div>
        <p className="font-semibold leading-tight group-hover:text-primary transition-colors">
          {employee.first_name} {employee.last_name}
        </p>
        {employee.job_roles?.title && (
          <p className="mt-0.5 text-sm text-muted-foreground">{employee.job_roles.title}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {employee.departments?.name && (
          <Badge variant="outline" className="text-xs">
            {employee.departments.name}
          </Badge>
        )}
        {employee.location && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {employee.location}
          </Badge>
        )}
      </div>
      <p className="mt-auto text-xs text-muted-foreground truncate">{employee.email}</p>
    </Link>
  );
}

function EmployeeRow({ employee }: { employee: EmployeeWithRelations }) {
  return (
    <Link
      to={`/employees/${employee.id}`}
      className="group flex items-center gap-4 p-4 transition-colors hover:bg-muted/30"
    >
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={employee.avatar_url ?? undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
          {getInitials(employee.first_name, employee.last_name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="font-medium group-hover:text-primary transition-colors truncate">
          {employee.first_name} {employee.last_name}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {employee.job_roles?.title ?? "—"} · {employee.departments?.name ?? "No dept"}
        </p>
      </div>
      <div className="hidden sm:block text-sm text-muted-foreground truncate flex-1">
        {employee.email}
      </div>
      <div className="hidden md:block text-sm text-muted-foreground">
        {employee.location ?? "—"}
      </div>
      <StatusBadge status={employee.employment_status} />
    </Link>
  );
}

export function EmployeesPage() {
  const { data: employees, isLoading, isError, refetch } = useEmployees();
  const { data: departments } = useDepartments();
  const { isAdmin } = useRole();

  const [search, setSearch] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");

  if (isLoading) return <LoadingSpinner fullPage label="Loading employees..." />;
  if (isError) return <ErrorState description="Couldn't load employees." onRetry={() => refetch()} />;

  const filtered = (employees ?? []).filter((emp) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      emp.first_name.toLowerCase().includes(q) ||
      emp.last_name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.job_roles?.title?.toLowerCase().includes(q) ||
      emp.departments?.name?.toLowerCase().includes(q);

    const matchDept = deptFilter === "all" || emp.department_id === deptFilter;
    const matchStatus = statusFilter === "all" || emp.employment_status === statusFilter;

    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {employees?.length ?? 0} total employees
          </p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link to="/employees/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Link>
          </Button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="employee-search"
            placeholder="Search name, email, title…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          id="dept-filter"
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments?.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          id="status-filter"
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="suspended">Suspended</option>
          <option value="terminated">Terminated</option>
        </select>

        <div className="ml-auto flex gap-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            aria-label="Grid view"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            aria-label="List view"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-surface py-16 text-center">
          <UserCircle2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="text-lg font-medium">
            {search || deptFilter !== "all" || statusFilter !== "all"
              ? "No employees match your filters"
              : "No employees yet"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || deptFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter."
              : "Add your first employee to start building your company directory."}
          </p>
          {isAdmin && !search && deptFilter === "all" && statusFilter === "all" && (
            <Button variant="outline" className="mt-6" asChild>
              <Link to="/employees/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Link>
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border bg-surface divide-y">
          {filtered.map((emp) => (
            <EmployeeRow key={emp.id} employee={emp} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {filtered.length} of {employees?.length ?? 0} employees
        </p>
      )}
    </div>
  );
}
