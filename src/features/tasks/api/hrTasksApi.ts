import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export type HrTask = Tables<"hr_tasks"> & {
  assignee?: { full_name: string } | null;
  related_employee?: { first_name: string; last_name: string } | null;
};

const HR_TASK_RELATIONS = `
  *,
  assignee:profiles!hr_tasks_assignee_id_fkey (full_name),
  related_employee:employees!hr_tasks_related_employee_id_fkey (first_name, last_name)
`;

export const useHrTasks = () => {
  return useQuery({
    queryKey: ["hr_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hr_tasks")
        .select(HR_TASK_RELATIONS)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as HrTask[];
    },
  });
};

export const useMyHrTasks = () => {
  return useQuery({
    queryKey: ["hr_tasks", "mine"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("hr_tasks")
        .select(HR_TASK_RELATIONS)
        .eq("assignee_id", user.id)
        .order("due_date", { ascending: true, nullsFirst: false });

      if (error) throw new Error(error.message);
      return data as HrTask[];
    },
  });
};

export const useCreateHrTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: TablesInsert<"hr_tasks">) => {
      const { data, error } = await supabase
        .from("hr_tasks")
        .insert(task as never)
        .select(HR_TASK_RELATIONS)
        .single();

      if (error) throw new Error(error.message);
      return data as HrTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr_tasks"] });
    },
  });
};

export const useUpdateHrTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<"hr_tasks"> }) => {
      const { data, error } = await supabase
        .from("hr_tasks")
        .update(updates as never)
        .eq("id", id)
        .select(HR_TASK_RELATIONS)
        .single();

      if (error) throw new Error(error.message);
      return data as HrTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr_tasks"] });
    },
  });
};

export const useDeleteHrTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hr_tasks").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr_tasks"] });
    },
  });
};
