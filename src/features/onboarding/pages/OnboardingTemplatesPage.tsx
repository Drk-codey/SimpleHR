import * as React from "react";
import { Plus, FileText, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  useOnboardingTemplates,
  useDeleteOnboardingTemplate,
  type TemplateWithTasks,
} from "../api/onboardingApi";
import { OnboardingTemplateForm } from "../components/OnboardingTemplateForm";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";

export function OnboardingTemplatesPage() {
  const { data: templates, isLoading, isError, refetch } = useOnboardingTemplates();
  const deleteTemplate = useDeleteOnboardingTemplate();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<TemplateWithTasks | null>(null);

  if (isLoading) return <LoadingSpinner fullPage label="Loading templates..." />;
  if (isError) return <ErrorState description="Couldn't load onboarding templates." onRetry={() => refetch()} />;

  const handleDelete = async (id: string) => {
    if (confirm("Delete this onboarding template? This cannot be undone.")) {
      try {
        await deleteTemplate.mutateAsync(id);
        toast.success("Template deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Couldn't delete template");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Onboarding Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define reusable onboarding checklists to assign to new hires.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Onboarding Template</DialogTitle>
            </DialogHeader>
            <OnboardingTemplateForm
              onSuccess={() => setIsCreateOpen(false)}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      <div className="rounded-md border bg-surface">
        {templates && templates.length > 0 ? (
          <div className="divide-y">
            {templates.map((tpl) => (
              <div key={tpl.id} className="flex items-start justify-between gap-4 p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{tpl.name}</h3>
                      {!tpl.is_active && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Inactive</Badge>
                      )}
                    </div>
                    {tpl.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{tpl.description}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tpl.onboarding_template_tasks.length} task{tpl.onboarding_template_tasks.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Dialog
                    open={editingTemplate?.id === tpl.id}
                    onOpenChange={(open) => { if (!open) setEditingTemplate(null); else setEditingTemplate(tpl); }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Edit template">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Template</DialogTitle>
                      </DialogHeader>
                      <OnboardingTemplateForm
                        initialData={tpl}
                        onSuccess={() => setEditingTemplate(null)}
                        onCancel={() => setEditingTemplate(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(tpl.id)}
                    aria-label="Delete template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">No templates yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create an onboarding template to start assigning it to new employees.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
