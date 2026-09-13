import * as React from "react";
import { Plus, Briefcase, Pencil, Trash2 } from "lucide-react";

import { useJobRoles, useDeleteJobRole, type JobRole } from "../api/jobRolesApi";
import { JobRoleForm } from "../components/JobRoleForm";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { toast } from "sonner";

export function JobRolesPage() {
  const { data: jobRoles, isLoading, isError, refetch } = useJobRoles();
  const deleteJobRole = useDeleteJobRole();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<JobRole | null>(null);

  if (isLoading) return <LoadingSpinner fullPage label="Loading job roles..." />;
  if (isError) {
    return <ErrorState description="Couldn't load job roles." onRetry={() => refetch()} />;
  }

  const handleDelete = async (id: string) => {
    if (confirm("Delete this job role? Employees assigned to it will have their role cleared.")) {
      try {
        await deleteJobRole.mutateAsync(id);
        toast.success("Job role deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Couldn't delete job role");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Job Roles</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage job titles and their associated departments.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Job Role</DialogTitle>
            </DialogHeader>
            <JobRoleForm onSuccess={() => setIsCreateOpen(false)} onCancel={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-surface">
        {jobRoles && jobRoles.length > 0 ? (
          <div className="grid grid-cols-1 divide-y">
            {jobRoles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{role.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {role.departments && (
                        <Badge variant="outline" className="text-xs">
                          {role.departments.name}
                        </Badge>
                      )}
                      {role.description && (
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      )}
                      {!role.is_active && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog
                    open={editingRole?.id === role.id}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) setEditingRole(null);
                      else setEditingRole(role);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Edit job role">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Job Role</DialogTitle>
                      </DialogHeader>
                      <JobRoleForm
                        initialData={role}
                        onSuccess={() => setEditingRole(null)}
                        onCancel={() => setEditingRole(null)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(role.id)}
                    aria-label="Delete job role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">No job roles found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create job roles to assign to employees.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Role
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
