import * as React from "react";
import { Plus, Building2, Pencil, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { useDepartments, useDeleteDepartment, type Department } from "../api/departmentsApi";
import { DepartmentForm } from "../components/DepartmentForm";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";

export function DepartmentsPage() {
  const { data: departments, isLoading, isError, refetch } = useDepartments();
  const deleteDepartment = useDeleteDepartment();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingDepartment, setEditingDepartment] = React.useState<Department | null>(null);

  if (isLoading) return <LoadingSpinner fullPage label="Loading departments..." />;
  if (isError) {
    return <ErrorState description="Couldn't load departments." onRetry={() => refetch()} />;
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment.mutateAsync(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Departments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage company departments and teams.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
            </DialogHeader>
            <DepartmentForm onSuccess={() => setIsCreateOpen(false)} onCancel={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-surface">
        {departments && departments.length > 0 ? (
          <div className="grid grid-cols-1 divide-y">
            {departments.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{dept.name}</h3>
                    {dept.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{dept.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild title="View employees">
                    <Link to={`/employees?dept=${dept.id}`}>
                      <Users className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Dialog
                    open={editingDepartment?.id === dept.id}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) setEditingDepartment(null);
                      else setEditingDepartment(dept);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Edit department">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                      </DialogHeader>
                      <DepartmentForm
                        initialData={dept}
                        onSuccess={() => setEditingDepartment(null)}
                        onCancel={() => setEditingDepartment(null)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(dept.id)}
                    aria-label="Delete department"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">No departments found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new department.</p>
            <Button variant="outline" className="mt-6" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Department
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
