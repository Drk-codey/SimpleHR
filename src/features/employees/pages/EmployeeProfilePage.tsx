import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, Phone, MapPin, Calendar, Building2, Briefcase, User } from "lucide-react";
import { format } from "date-fns";

import { useEmployeeProfile } from "../api/employeesApi";
import { useRole } from "@/hooks/useRole";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { StatusBadge } from "@/components/common/StatusBadge";

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm">{value ?? <span className="text-muted-foreground/50">—</span>}</span>
    </div>
  );
}

export function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: employee, isLoading, isError, refetch } = useEmployeeProfile(id);
  const { isAdmin } = useRole();

  if (isLoading) return <LoadingSpinner fullPage label="Loading profile..." />;
  if (isError || !employee) {
    return <ErrorState description="Couldn't load this employee's profile." onRetry={() => refetch()} />;
  }

  const fullName = `${employee.first_name} ${employee.last_name}`;

  const fmtDate = (d: string | null) => {
    if (!d) return null;
    try { return format(new Date(d), "dd MMM yyyy"); } catch { return d; }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Back + Edit */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
        {isAdmin && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/employees/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        )}
      </div>

      {/* Profile header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start gap-5">
            <Avatar className="h-20 w-20 text-2xl">
              <AvatarImage src={employee.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                {getInitials(employee.first_name, employee.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{fullName}</h1>
                {employee.preferred_name && employee.preferred_name !== employee.first_name && (
                  <span className="text-sm text-muted-foreground">({employee.preferred_name})</span>
                )}
                <StatusBadge status={employee.employment_status} />
              </div>
              <p className="mt-1 text-muted-foreground">
                {employee.job_roles?.title ?? "No job role"} · {employee.departments?.name ?? "No department"}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {employee.email}
                </span>
                {employee.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {employee.phone}
                  </span>
                )}
                {employee.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {employee.location}
                  </span>
                )}
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {employee.employee_number}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="First Name" value={employee.first_name} />
            <InfoRow label="Last Name" value={employee.last_name} />
            <InfoRow label="Preferred Name" value={employee.preferred_name} />
            <InfoRow label="Email" value={employee.email} />
            <InfoRow label="Phone" value={employee.phone} />
            <InfoRow label="Date of Birth" value={fmtDate(employee.date_of_birth)} />
            <InfoRow label="Address" value={employee.address} />
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Employee ID" value={employee.employee_number} />
            <InfoRow label="Job Title" value={employee.job_roles?.title} />
            <InfoRow label="Department" value={employee.departments?.name} />
            <InfoRow
              label="Employment Type"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value={(employee as any).employment_types?.name ?? null}
            />
            <InfoRow label="Status" value={employee.employment_status.replace("_", " ")} />
            <InfoRow label="Start Date" value={fmtDate(employee.start_date)} />
            {employee.end_date && (
              <InfoRow label="End Date" value={fmtDate(employee.end_date)} />
            )}
            <InfoRow label="Location" value={employee.location} />
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Name" value={employee.emergency_contact_name} />
              <InfoRow label="Phone" value={employee.emergency_contact_phone} />
              <InfoRow label="Relationship" value={employee.emergency_contact_relationship} />
            </CardContent>
          </Card>
        )}

        {/* HR Notes (admin only) */}
        {isAdmin && employee.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" />
                HR Notes
                <Badge variant="outline" className="ml-auto text-xs">Admin only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{employee.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timeline strip */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Record created</p>
            <p>{fmtDate(employee.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Last updated</p>
            <p>{fmtDate(employee.updated_at)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Start date</p>
            <p>{fmtDate(employee.start_date)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
