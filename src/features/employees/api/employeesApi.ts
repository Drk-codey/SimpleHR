import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
  PublicEmployeeDirectoryRow,
  EmploymentStatus,
  OnboardingStatus,
} from "@/types/database.types";

export type Employee = Tables<"employees">;

export type EmployeeWithRelations = Employee & {
  departments?: { id: string; name: string } | null;
  job_roles?: { id: string; title: string } | null;
  employment_types?: { id: string; name: string } | null;
};

export type DirectoryEmployee = PublicEmployeeDirectoryRow & {
  department_name: string | null;
  job_title: string | null;
  employment_type_name: string | null;
};

const EMPLOYEE_RELATIONS = `
  *,
  departments (id, name),
  job_roles (id, title),
  employment_types (id, name)
`;

export const useEmployeeDirectory = () => {
  const directory = useQuery({
    queryKey: ["employee_directory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_employee_directory")
        .select("*")
        .order("first_name");

      if (error) throw new Error(error.message);
      return data as PublicEmployeeDirectoryRow[];
    },
  });

  const departments = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("*").order("name");
      if (error) throw new Error(error.message);
      return data as Tables<"departments">[];
    },
  });

  const jobRoles = useQuery({
    queryKey: ["job_roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_roles").select("id, title");
      if (error) throw new Error(error.message);
      return data as { id: string; title: string }[];
    },
  });

  const employmentTypes = useQuery({
    queryKey: ["employment_types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employment_types")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw new Error(error.message);
      return data as Tables<"employment_types">[];
    },
  });

  const deptMap = new Map((departments.data ?? []).map((d) => [d.id, d.name]));
  const roleMap = new Map((jobRoles.data ?? []).map((r) => [r.id, r.title]));
  const typeMap = new Map((employmentTypes.data ?? []).map((t) => [t.id, t.name]));

  const employees: DirectoryEmployee[] | undefined = directory.data?.map((row) => ({
    ...row,
    department_name: row.department_id ? (deptMap.get(row.department_id) ?? null) : null,
    job_title: row.job_role_id ? (roleMap.get(row.job_role_id) ?? null) : null,
    employment_type_name: row.employment_type_id ? (typeMap.get(row.employment_type_id) ?? null) : null,
  }));

  return {
    data: employees,
    isLoading: directory.isLoading || departments.isLoading || jobRoles.isLoading || employmentTypes.isLoading,
    isError: directory.isError || departments.isError || jobRoles.isError || employmentTypes.isError,
    refetch: () => {
      void directory.refetch();
      void departments.refetch();
      void jobRoles.refetch();
      void employmentTypes.refetch();
    },
  };
};

export const useDirectoryEmployee = (id: string | undefined) => {
  return useQuery({
    queryKey: ["employee_directory", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const { data, error } = await supabase
        .from("public_employee_directory")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as PublicEmployeeDirectoryRow | null;
    },
    enabled: !!id,
  });
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(EMPLOYEE_RELATIONS)
        .is("deleted_at", null)
        .order("first_name");

      if (error) throw new Error(error.message);
      return data as EmployeeWithRelations[];
    },
  });
};

export const useMyEmployee = () => {
  return useQuery({
    queryKey: ["employees", "me"],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData.user?.id;
      if (!userId) return null;
      const { data, error } = await supabase
        .from("employees")
        .select("id, first_name, last_name, avatar_url")
        .eq("profile_id", userId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Pick<Employee, "id" | "first_name" | "last_name" | "avatar_url"> | null;
    },
  });
};

export const useEmployeeProfile = (id: string | undefined) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const { data, error } = await supabase
        .from("employees")
        .select(EMPLOYEE_RELATIONS)
        .eq("id", id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data as EmployeeWithRelations | null;
    },
    enabled: !!id,
  });
};

export type LeaveBalanceRow = Tables<"leave_balances"> & {
  leave_types?: { name: string; color: string } | null;
};

export const useEmployeeLeaveBalances = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ["leave_balances", employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error("ID is required");
      const year = new Date().getFullYear();
      const { data, error } = await supabase
        .from("leave_balances")
        .select("*, leave_types (name, color)")
        .eq("employee_id", employeeId)
        .eq("year", year);

      if (error) throw new Error(error.message);
      return data as LeaveBalanceRow[];
    },
    enabled: !!employeeId,
  });
};

export const useEmployeeOnboarding = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ["employee_onboarding", employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error("ID is required");
      const { data, error } = await supabase
        .from("employee_onboarding")
        .select("*")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data as (Tables<"employee_onboarding"> & { status: OnboardingStatus }) | null;
    },
    enabled: !!employeeId,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEmployee: TablesInsert<"employees">) => {
      const { data, error } = await supabase
        .from("employees")
        .insert(newEmployee as never)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_directory"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<"employees"> }) => {
      const { data, error } = await supabase
        .from("employees")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Employee;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employee_directory"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", data.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["employees", "me"] });
    },
  });
};

export const useUploadEmployeeAvatar = () => {
  const queryClient = useQueryClient();
  const updateEmployee = useUpdateEmployee();

  return useMutation({
    mutationFn: async ({ employeeId, file }: { employeeId: string; file: File }) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${employeeId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
      const avatarUrl = `${publicUrl.publicUrl}?t=${Date.now()}`;

      await updateEmployee.mutateAsync({ id: employeeId, updates: { avatar_url: avatarUrl } });
      return avatarUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] });
      queryClient.invalidateQueries({ queryKey: ["employee_directory"] });
    },
  });
};

export const useEmploymentTypes = () => {
  return useQuery({
    queryKey: ["employment_types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employment_types")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw new Error(error.message);
      return data as Tables<"employment_types">[];
    },
  });
};

export type { EmploymentStatus };
