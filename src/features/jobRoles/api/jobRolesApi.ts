import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Tables } from "@/types/database.types";

export type JobRole = Tables<"job_roles"> & {
  departments?: { name: string } | null;
};

export const useJobRoles = () => {
  return useQuery({
    queryKey: ["job_roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_roles")
        .select(`
          *,
          departments (name)
        `)
        .order("title");

      if (error) throw new Error(error.message);
      return data as JobRole[];
    },
  });
};

export const useCreateJobRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRole: { title: string; department_id: string; description?: string | null; default_employment_type_id?: string | null }) => {
      const { data, error } = await supabase
        .from("job_roles")
        .insert(newRole as any)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Tables<"job_roles">;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job_roles"] });
    },
  });
};

export const useUpdateJobRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<{ title: string; department_id: string; description: string | null; is_active: boolean }> }) => {
      const { data, error } = await supabase
        .from("job_roles")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Tables<"job_roles">;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job_roles"] });
    },
  });
};

export const useDeleteJobRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_roles").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job_roles"] });
    },
  });
};
