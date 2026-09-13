
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateJobRole, useUpdateJobRole, type JobRole } from "../api/jobRolesApi";
import { useDepartments } from "@/features/departments/api/departmentsApi";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const jobRoleSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  department_id: z.string().min(1, "Department is required"),
  description: z.string().max(255).optional(),
});

type JobRoleFormValues = z.infer<typeof jobRoleSchema>;

interface JobRoleFormProps {
  initialData?: JobRole;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function JobRoleForm({ initialData, onSuccess, onCancel }: JobRoleFormProps) {
  const createJobRole = useCreateJobRole();
  const updateJobRole = useUpdateJobRole();
  const { data: departments, isLoading: isLoadingDepts } = useDepartments();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobRoleFormValues>({
    resolver: zodResolver(jobRoleSchema),
    defaultValues: {
      title: initialData?.title || "",
      department_id: initialData?.department_id || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (values: JobRoleFormValues) => {
    try {
      if (initialData) {
        await updateJobRole.mutateAsync({ id: initialData.id, updates: values });
        toast.success("Job role updated");
      } else {
        await createJobRole.mutateAsync(values);
        toast.success("Job role created");
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  if (isLoadingDepts) {
    return <LoadingSpinner label="Loading departments..." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          placeholder="e.g. Senior Frontend Engineer"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="department_id">Department</Label>
        <select
          id="department_id"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!errors.department_id}
          {...register("department_id")}
        >
          <option value="">Select a department...</option>
          {departments?.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.department_id && <p className="text-sm text-destructive">{errors.department_id.message}</p>}
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

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Save changes" : "Create role"}
        </Button>
      </div>
    </form>
  );
}
