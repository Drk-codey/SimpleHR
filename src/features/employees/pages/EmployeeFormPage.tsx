import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  useCreateEmployee,
  useUpdateEmployee,
  useEmployeeProfile,
  useEmployees,
  useEmploymentTypes,
} from "../api/employeesApi";
import { useDepartments } from "@/features/departments/api/departmentsApi";
import { useJobRoles } from "@/features/jobRoles/api/jobRolesApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const employeeSchema = z.object({
  employee_number: z.string().min(1, "Employee number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Must be a valid email"),
  start_date: z.string().min(1, "Start date is required"),
  preferred_name: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  department_id: z.string().optional(),
  job_role_id: z.string().optional(),
  employment_type_id: z.string().optional(),
  manager_id: z.string().optional(),
  employment_status: z.enum(["active", "on_leave", "suspended", "terminated"]).default("active"),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  notes: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

function SelectField({
  id, label, register, name, children, error,
}: {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  name: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        {...register(name)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {children}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface EmployeeFormPageProps {
  mode: "create" | "edit";
}

export function EmployeeFormPage({ mode }: EmployeeFormPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: existing, isLoading: isLoadingExisting } = useEmployeeProfile(
    mode === "edit" ? id : undefined
  );
  const { data: departments } = useDepartments();
  const { data: jobRoles } = useJobRoles();
  const { data: employmentTypes } = useEmploymentTypes();
  const { data: employees } = useEmployees();

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    values: existing
      ? {
          employee_number: existing.employee_number,
          first_name: existing.first_name,
          last_name: existing.last_name,
          email: existing.email,
          start_date: existing.start_date,
          preferred_name: existing.preferred_name ?? "",
          phone: existing.phone ?? "",
          date_of_birth: existing.date_of_birth ?? "",
          address: existing.address ?? "",
          location: existing.location ?? "",
          department_id: existing.department_id ?? "",
          job_role_id: existing.job_role_id ?? "",
          employment_type_id: existing.employment_type_id ?? "",
          manager_id: existing.manager_id ?? "",
          employment_status: existing.employment_status,
          emergency_contact_name: existing.emergency_contact_name ?? "",
          emergency_contact_phone: existing.emergency_contact_phone ?? "",
          emergency_contact_relationship: existing.emergency_contact_relationship ?? "",
          notes: existing.notes ?? "",
        }
      : undefined,
  });

  if (mode === "edit" && isLoadingExisting) {
    return <LoadingSpinner fullPage label="Loading employee..." />;
  }

  const onSubmit = async (values: EmployeeFormValues) => {
    const payload = {
      ...values,
      preferred_name: values.preferred_name || null,
      phone: values.phone || null,
      date_of_birth: values.date_of_birth || null,
      address: values.address || null,
      location: values.location || null,
      department_id: values.department_id || null,
      job_role_id: values.job_role_id || null,
      employment_type_id: values.employment_type_id || null,
      manager_id: values.manager_id || null,
      emergency_contact_name: values.emergency_contact_name || null,
      emergency_contact_phone: values.emergency_contact_phone || null,
      emergency_contact_relationship: values.emergency_contact_relationship || null,
      notes: values.notes || null,
    };

    try {
      if (mode === "create") {
        const created = await createEmployee.mutateAsync(payload);
        toast.success("Employee created");
        navigate(`/employees/${created.id}`);
      } else if (id) {
        await updateEmployee.mutateAsync({ id, updates: payload });
        toast.success("Employee updated");
        navigate(`/employees/${id}`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={mode === "edit" && id ? `/employees/${id}` : "/employees"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">
          {mode === "create" ? "Add Employee" : "Edit Employee"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" {...register("first_name")} aria-invalid={!!errors.first_name} />
              {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input id="last_name" {...register("last_name")} aria-invalid={!!errors.last_name} />
              {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="preferred_name">Preferred Name</Label>
              <Input id="preferred_name" {...register("preferred_name")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="employee_number">Employee Number *</Label>
              <Input id="employee_number" {...register("employee_number")} aria-invalid={!!errors.employee_number} />
              {errors.employee_number && <p className="text-sm text-destructive">{errors.employee_number.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
            </div>
          </CardContent>
        </Card>

        {/* Employment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input id="start_date" type="date" {...register("start_date")} aria-invalid={!!errors.start_date} />
              {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g. Lagos, Remote" {...register("location")} />
            </div>

            <SelectField id="department_id" label="Department" register={register} name="department_id">
              <option value="">No department</option>
              {departments?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </SelectField>

            <SelectField id="job_role_id" label="Job Role" register={register} name="job_role_id">
              <option value="">No role</option>
              {jobRoles?.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
            </SelectField>

            <SelectField id="employment_type_id" label="Employment Type" register={register} name="employment_type_id">
              <option value="">No type</option>
              {employmentTypes?.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </SelectField>

            <SelectField id="manager_id" label="Manager" register={register} name="manager_id">
              <option value="">No manager</option>
              {employees
                ?.filter((e) => e.id !== id)
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.first_name} {e.last_name}
                  </option>
                ))}
            </SelectField>

            <SelectField id="employment_status" label="Status" register={register} name="employment_status">
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </SelectField>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="emergency_contact_name">Name</Label>
              <Input id="emergency_contact_name" {...register("emergency_contact_name")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="emergency_contact_phone">Phone</Label>
              <Input id="emergency_contact_phone" {...register("emergency_contact_phone")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="emergency_contact_relationship">Relationship</Label>
              <Input id="emergency_contact_relationship" placeholder="e.g. Spouse" {...register("emergency_contact_relationship")} />
            </div>
          </CardContent>
        </Card>

        {/* HR Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">HR Notes <span className="text-xs text-muted-foreground font-normal">(admin only)</span></CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              id="notes"
              {...register("notes")}
              rows={4}
              placeholder="Private HR notes — not visible to the employee."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(mode === "edit" && id ? `/employees/${id}` : "/employees")}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {mode === "create" ? "Create Employee" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
