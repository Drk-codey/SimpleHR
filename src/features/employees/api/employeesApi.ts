import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Tables, PublicEmployeeDirectoryRow, EmploymentStatus } from "@/types/database.types";

export type Employee = Tables<"employees">;

export type EmployeeWithRelations = Employee & {
  departments?: { name: string } | null;
  job_roles?: { title: string } | null;
  employment_types?: { name: string } | null;
  manager?: { first_name: string; last_name: string } | null;
};

// Fetch for the public directory (view)
export const useEmployeeDirectory = () => {
  return useQuery({
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
};

// Fetch all employees with relations (admin/HR view)
export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          departments (name),
          job_roles (title),
          employment_types (name)
        `)
        .is("deleted_at", null)
        .order("first_name");

      if (error) throw new Error(error.message);
      return data as EmployeeWithRelations[];
    },
  });
};

// Dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("id, employment_status, date_of_birth, start_date, departments(name)")
        .is("deleted_at", null);

      if (error) throw new Error(error.message);

      const employees = data as (Employee & { departments?: { name: string } | null })[];
      const today = new Date();
      const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(today.getDate() + 7);

      const total = employees.length;
      const active = employees.filter((e) => e.employment_status === "active").length;
      const onLeave = employees.filter((e) => e.employment_status === "on_leave").length;

      // Upcoming birthdays (next 7 days)
      const upcomingBirthdays = employees.filter((e) => {
        if (!e.date_of_birth) return false;
        const bday = e.date_of_birth.slice(5); // MM-DD
        return bday >= todayMD && bday <= `${String(sevenDaysLater.getMonth() + 1).padStart(2, "0")}-${String(sevenDaysLater.getDate()).padStart(2, "0")}`;
      });

      // New hires (last 30 days)
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const newHires = employees.filter((e) => new Date(e.start_date) >= thirtyDaysAgo).length;

      // Department breakdown
      const deptMap: Record<string, number> = {};
      employees.forEach((e) => {
        const name = e.departments?.name ?? "No Department";
        deptMap[name] = (deptMap[name] ?? 0) + 1;
      });
      const deptBreakdown = Object.entries(deptMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Status breakdown
      const statusMap: Record<string, number> = {};
      employees.forEach((e) => {
        statusMap[e.employment_status] = (statusMap[e.employment_status] ?? 0) + 1;
      });
      const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

      return {
        total,
        active,
        onLeave,
        newHires,
        upcomingBirthdays: upcomingBirthdays.length,
        deptBreakdown,
        statusBreakdown,
      };
    },
  });
};

// Pending leave count for dashboard
export const usePendingLeaveCount = () => {
  return useQuery({
    queryKey: ["pending_leave_count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("leave_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) throw new Error(error.message);
      return count ?? 0;
    },
  });
};

// Fetch full details of a specific employee
export const useEmployeeProfile = (id: string | undefined) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          departments (id, name),
          job_roles (id, title),
          employment_types (id, name)
        `)
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data as EmployeeWithRelations;
    },
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEmployee: {
      employee_number: string;
      first_name: string;
      last_name: string;
      email: string;
      start_date: string;
      preferred_name?: string | null;
      phone?: string | null;
      date_of_birth?: string | null;
      address?: string | null;
      department_id?: string | null;
      job_role_id?: string | null;
      employment_type_id?: string | null;
      manager_id?: string | null;
      employment_status?: EmploymentStatus;
      location?: string | null;
      notes?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("employees")
        .insert(newEmployee as any)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_directory"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Employee> }) => {
      const { data, error } = await supabase
        .from("employees")
        .update(updates as any)
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
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
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
