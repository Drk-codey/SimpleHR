import * as React from "react";
import { Plus, ClipboardList } from "lucide-react";
import { isToday, isPast, isFuture, addDays } from "date-fns";
import { toast } from "sonner";

import { useHrTasks, useDeleteHrTask, useUpdateHrTask, type HrTask } from "../api/hrTasksApi";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { useRole } from "@/hooks/useRole";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";

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
import type { HrTaskStatus } from "@/types/database.types";

type TabKey = "my" | "today" | "overdue" | "upcoming" | "completed";

const TABS: { key: TabKey; label: string }[] = [
  { key: "my", label: "My Tasks" },
  { key: "today", label: "Due Today" },
  { key: "overdue", label: "Overdue" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

export function TasksPage() {
  const { data: tasks, isLoading, isError, refetch } = useHrTasks();
  const { data: profile } = useCurrentProfile();
  const { isAdmin } = useRole();
  const deleteTask = useDeleteHrTask();
  const updateTask = useUpdateHrTask();

  const [activeTab, setActiveTab] = React.useState<TabKey>("my");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<HrTask | null>(null);

  if (isLoading) return <LoadingSpinner fullPage label="Loading tasks..." />;
  if (isError) return <ErrorState description="Couldn't load tasks." onRetry={() => refetch()} />;

  const canCreateTask = isAdmin;

  const filterTasks = (key: TabKey): HrTask[] => {
    const all = tasks ?? [];
    const myId = profile?.id;
    switch (key) {
      case "my":
        return all.filter((t) => t.assignee_id === myId && t.status !== "completed" && t.status !== "cancelled");
      case "today":
        return all.filter((t) => t.due_date && isToday(new Date(t.due_date)) && t.status !== "completed" && t.status !== "cancelled");
      case "overdue":
        return all.filter((t) => t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date)) && t.status !== "completed" && t.status !== "cancelled");
      case "upcoming":
        return all.filter((t) => {
          if (!t.due_date || t.status === "completed" || t.status === "cancelled") return false;
          const d = new Date(t.due_date);
          return isFuture(d) && d <= addDays(new Date(), 14);
        });
      case "completed":
        return all.filter((t) => t.status === "completed" || t.status === "cancelled");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this task?")) {
      try {
        await deleteTask.mutateAsync(id);
        toast.success("Task deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Couldn't delete task");
      }
    }
  };

  const handleStatusChange = async (id: string, status: HrTaskStatus) => {
    try {
      await updateTask.mutateAsync({ id, updates: { status } });
      toast.success("Status updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update status");
    }
  };

  const filtered = filterTasks(activeTab);
  const overdueCnt = filterTasks("overdue").length;
  const todayCnt = filterTasks("today").length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">HR Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track operational HR tasks.
          </p>
        </div>
        {canCreateTask && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSuccess={() => setIsCreateOpen(false)} onCancel={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none ${
              activeTab === tab.key
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.key === "overdue" && overdueCnt > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {overdueCnt}
              </span>
            )}
            {tab.key === "today" && todayCnt > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-warning-foreground">
                {todayCnt}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-surface py-16 text-center">
          <ClipboardList className="mb-4 h-10 w-10 text-muted-foreground/30" />
          <p className="text-lg font-medium">No tasks here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === "my" ? "You have no open tasks assigned to you." : "Nothing to show in this view."}
          </p>
          {canCreateTask && activeTab === "my" && (
            <Button variant="outline" className="mt-5" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => setEditingTask(t)}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              canManage={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => { if (!open) setEditingTask(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              initialData={editingTask}
              onSuccess={() => setEditingTask(null)}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

