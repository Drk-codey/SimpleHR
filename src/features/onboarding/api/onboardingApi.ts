import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { OnboardingAssigneeRole, Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export type OnboardingTemplate = Tables<"onboarding_templates">;
export type OnboardingTemplateTask = Tables<"onboarding_template_tasks">;
export type EmployeeOnboarding = Tables<"employee_onboarding">;
export type OnboardingTask = Tables<"onboarding_tasks">;

export type TemplateWithTasks = OnboardingTemplate & {
  onboarding_template_tasks: OnboardingTemplateTask[];
};

export type EmployeeOnboardingWithTasks = EmployeeOnboarding & {
  employees: { first_name: string; last_name: string; avatar_url: string | null };
  onboarding_templates: { name: string } | null;
  onboarding_tasks: (OnboardingTask & { assigned_profile?: { full_name: string } | null })[];
};

// ── Templates ───────────────────────────────────────────────────────────────

export const useOnboardingTemplates = () => {
  return useQuery({
    queryKey: ["onboarding_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_templates")
        .select("*, onboarding_template_tasks(*)")
        .order("name");

      if (error) throw new Error(error.message);
      return data as TemplateWithTasks[];
    },
  });
};

export const useCreateOnboardingTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: TablesInsert<"onboarding_templates">) => {
      const { data, error } = await supabase
        .from("onboarding_templates")
        .insert(template as never)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as OnboardingTemplate;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding_templates"] }),
  });
};

export const useUpdateOnboardingTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<"onboarding_templates"> }) => {
      const { data, error } = await supabase
        .from("onboarding_templates")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as OnboardingTemplate;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding_templates"] }),
  });
};

export const useDeleteOnboardingTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("onboarding_templates").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding_templates"] }),
  });
};

// ── Template Tasks ────────────────────────────────────────────────────────

export const useCreateTemplateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: TablesInsert<"onboarding_template_tasks">) => {
      const { data, error } = await supabase
        .from("onboarding_template_tasks")
        .insert(task as never)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as OnboardingTemplateTask;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding_templates"] }),
  });
};

export const useUpdateTemplateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<"onboarding_template_tasks"> }) => {
      const { data, error } = await supabase
        .from("onboarding_template_tasks")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as OnboardingTemplateTask;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding_templates"] }),
  });
};

export const useDeleteTemplateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("onboarding_template_tasks").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["onboarding_templates"] }),
  });
};

// ── Employee Onboarding ───────────────────────────────────────────────────

export const useAllEmployeeOnboardings = () => {
  return useQuery({
    queryKey: ["employee_onboardings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_onboarding")
        .select(`
          *,
          employees (first_name, last_name, avatar_url),
          onboarding_templates (name),
          onboarding_tasks (*, assigned_profile:profiles!onboarding_tasks_assigned_to_fkey (full_name))
        `)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as EmployeeOnboardingWithTasks[];
    },
  });
};

export const useEmployeeOnboardingDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["employee_onboarding_detail", id],
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      const { data, error } = await supabase
        .from("employee_onboarding")
        .select(`
          *,
          employees (first_name, last_name, avatar_url),
          onboarding_templates (name),
          onboarding_tasks (*, assigned_profile:profiles!onboarding_tasks_assigned_to_fkey (full_name))
        `)
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data as EmployeeOnboardingWithTasks;
    },
    enabled: !!id,
  });
};

export const useAssignOnboardingTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      employeeId,
      templateId,
      startDate,
    }: {
      employeeId: string;
      templateId: string;
      startDate: string;
    }) => {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw new Error(userErr.message);

      const { data: employeeData, error: employeeErr } = await supabase
        .from("employees")
        .select("id, profile_id, manager_id")
        .eq("id", employeeId)
        .single();
      if (employeeErr) throw new Error(employeeErr.message);
      const employee = employeeData as Pick<Tables<"employees">, "id" | "profile_id" | "manager_id">;

      let managerProfileId: string | null = null;
      if (employee.manager_id) {
        const { data: managerData, error: managerErr } = await supabase
          .from("employees")
          .select("profile_id")
          .eq("id", employee.manager_id)
          .maybeSingle();
        if (managerErr) throw new Error(managerErr.message);
        const manager = managerData as Pick<Tables<"employees">, "profile_id"> | null;
        managerProfileId = manager?.profile_id ?? null;
      }

      const assigneeForRole = (role: OnboardingAssigneeRole): string | null => {
        if (role === "employee") return employee.profile_id ?? null;
        if (role === "manager") return managerProfileId;
        if (role === "hr") return userData.user?.id ?? null;
        return null;
      };

      // 1. Create employee_onboarding record
      const { data: onboarding, error: oErr } = await supabase
        .from("employee_onboarding")
        .insert({
          employee_id: employeeId,
          template_id: templateId,
          start_date: startDate,
          status: "in_progress",
        } as never)
        .select()
        .single();
      if (oErr) throw new Error(oErr.message);

      // 2. Fetch template tasks
      const { data: templateTasks, error: ttErr } = await supabase
        .from("onboarding_template_tasks")
        .select("*")
        .eq("template_id", templateId)
        .order("order_index");
      if (ttErr) throw new Error(ttErr.message);

      // 3. Create onboarding tasks from template
      const templateTaskRows = (templateTasks ?? []) as OnboardingTemplateTask[];
      if (templateTaskRows.length > 0) {
        const start = new Date(startDate);
        const tasks = templateTaskRows.map((tt) => {
          const due = new Date(start);
          due.setDate(due.getDate() + (tt.day_offset ?? 0));
          return {
            employee_onboarding_id: (onboarding as EmployeeOnboarding).id,
            template_task_id: tt.id,
            title: tt.title,
            description: tt.description,
            priority: tt.priority,
            assigned_to: assigneeForRole(tt.assigned_role),
            due_date: due.toISOString().split("T")[0],
            status: "not_started" as const,
          };
        });
        const { error: tasksErr } = await supabase.from("onboarding_tasks").insert(tasks as never[]);
        if (tasksErr) throw new Error(tasksErr.message);
      }

      return onboarding as EmployeeOnboarding;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_onboardings"] });
      queryClient.invalidateQueries({ queryKey: ["employee_onboarding"] });
    },
  });
};

export const useUpdateOnboardingTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const completedAt = status === "completed" ? new Date().toISOString() : null;
      const { data, error } = await supabase
        .from("onboarding_tasks")
        .update({ status, completed_at: completedAt } as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as OnboardingTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_onboardings"] });
      queryClient.invalidateQueries({ queryKey: ["employee_onboarding_detail"] });
      queryClient.invalidateQueries({ queryKey: ["employee_onboarding"] });
    },
  });
};


