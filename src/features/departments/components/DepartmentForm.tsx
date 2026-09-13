
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDepartment, useUpdateDepartment, type Department } from "../api/departmentsApi";
import { useEmployees } from "@/features/employees/api/employeesApi";
import { toast } from "sonner";

const departmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(255).optional(),
  department_head_id: z.string().nullable().optional().or(z.literal("")),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  initialData?: Department;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DepartmentForm({ initialData, onSuccess, onCancel }: DepartmentFormProps) {
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const { data: employees } = useEmployees();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      department_head_id: initialData?.department_head_id || "",
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      const payload = {
        ...values,
        department_head_id: values.department_head_id === "" ? null : values.department_head_id,
      };

      if (initialData) {
        await updateDepartment.mutateAsync({ id: initialData.id, updates: payload });
        toast.success("Department updated");
      } else {
        await createDepartment.mutateAsync(payload);
        toast.success("Department created");
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="e.g. Engineering"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Optional description"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="department_head_id">Department Head</Label>
        <select
          id="department_head_id"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("department_head_id")}
        >
          <option value="">Select a head (optional)</option>
          {employees?.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Save changes" : "Create department"}
        </Button>
      </div>
    </form>
  );
}
