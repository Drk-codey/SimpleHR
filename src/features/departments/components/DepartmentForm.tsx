
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDepartment, useUpdateDepartment, type Department } from "../api/departmentsApi";
import { toast } from "sonner";

const departmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(255).optional(),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      if (initialData) {
        await updateDepartment.mutateAsync({ id: initialData.id, updates: values });
        toast.success("Department updated");
      } else {
        await createDepartment.mutateAsync(values);
        toast.success("Department created");
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
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
