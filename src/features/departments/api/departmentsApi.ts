import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Tables } from "@/types/database.types";

export type Department = Tables<"departments">;

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");

      if (error) throw new Error(error.message);
      return data as Department[];
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDepartment: { name: string; description?: string | null; department_head_id?: string | null }) => {
      const { data, error } = await supabase
        .from("departments")
        .insert(newDepartment as any)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<{ name: string; description: string | null; department_head_id: string | null; is_active: boolean }> }) => {
      const { data, error } = await supabase
        .from("departments")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("departments").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};
