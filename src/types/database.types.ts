// Hand-written to match supabase/migrations/*.sql.
// Once the project is linked to a real Supabase project, regenerate with:
//   npx supabase gen types typescript --project-id <ref> > src/types/database.types.ts
// and diff against this file before overwriting — some helper types below
// (e.g. PublicEmployeeDirectoryRow) come from a view, not a table.

export type UserRole = "super_admin" | "hr_admin" | "manager" | "employee";
export type EmploymentStatus = "active" | "on_leave" | "suspended" | "terminated";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "overdue";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type HrTaskStatus = "to_do" | "in_progress" | "completed" | "cancelled";
export type DocumentVisibility = "employee_only" | "manager_hr" | "hr_only";
export type OnboardingAssigneeRole = "hr" | "manager" | "employee" | "specific";
export type CalendarEventType = "company_event" | "holiday";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          avatar_url?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      employment_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["employment_types"]["Insert"]>;
      };
      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          department_head_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          department_head_id?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["departments"]["Insert"]>;
      };
      job_roles: {
        Row: {
          id: string;
          title: string;
          department_id: string;
          description: string | null;
          default_employment_type_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          department_id: string;
          description?: string | null;
          default_employment_type_id?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["job_roles"]["Insert"]>;
      };
      employees: {
        Row: {
          id: string;
          profile_id: string | null;
          employee_number: string;
          first_name: string;
          last_name: string;
          preferred_name: string | null;
          email: string;
          phone: string | null;
          date_of_birth: string | null;
          address: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          emergency_contact_relationship: string | null;
          department_id: string | null;
          job_role_id: string | null;
          employment_type_id: string | null;
          manager_id: string | null;
          employment_status: EmploymentStatus;
          start_date: string;
          end_date: string | null;
          location: string | null;
          avatar_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          employee_number: string;
          first_name: string;
          last_name: string;
          preferred_name?: string | null;
          email: string;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_relationship?: string | null;
          department_id?: string | null;
          job_role_id?: string | null;
          employment_type_id?: string | null;
          manager_id?: string | null;
          employment_status?: EmploymentStatus;
          start_date: string;
          end_date?: string | null;
          location?: string | null;
          avatar_url?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["employees"]["Insert"]>;
      };
      leave_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          default_annual_allowance: number;
          requires_approval: boolean;
          color: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          default_annual_allowance?: number;
          requires_approval?: boolean;
          color?: string;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["leave_types"]["Insert"]>;
      };
      leave_balances: {
        Row: {
          id: string;
          employee_id: string;
          leave_type_id: string;
          year: number;
          allocated_days: number;
          used_days: number;
          carried_over_days: number;
          adjusted_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          leave_type_id: string;
          year: number;
          allocated_days?: number;
          used_days?: number;
          carried_over_days?: number;
          adjusted_days?: number;
        };
        Update: Partial<Database["public"]["Tables"]["leave_balances"]["Insert"]>;
      };
      leave_requests: {
        Row: {
          id: string;
          employee_id: string;
          leave_type_id: string;
          start_date: string;
          end_date: string;
          total_days: number;
          reason: string | null;
          status: LeaveStatus;
          approver_id: string | null;
          approved_at: string | null;
          decision_comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          leave_type_id: string;
          start_date: string;
          end_date: string;
          total_days: number;
          reason?: string | null;
          status?: LeaveStatus;
          approver_id?: string | null;
          approved_at?: string | null;
          decision_comment?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["leave_requests"]["Insert"]>;
      };
      onboarding_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["onboarding_templates"]["Insert"]>;
      };
      onboarding_template_tasks: {
        Row: {
          id: string;
          template_id: string;
          title: string;
          description: string | null;
          day_offset: number;
          assigned_role: OnboardingAssigneeRole;
          priority: TaskPriority;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          title: string;
          description?: string | null;
          day_offset?: number;
          assigned_role?: OnboardingAssigneeRole;
          priority?: TaskPriority;
          order_index?: number;
        };
        Update: Partial<Database["public"]["Tables"]["onboarding_template_tasks"]["Insert"]>;
      };
      employee_onboarding: {
        Row: {
          id: string;
          employee_id: string;
          template_id: string | null;
          start_date: string;
          status: OnboardingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          template_id?: string | null;
          start_date: string;
          status?: OnboardingStatus;
        };
        Update: Partial<Database["public"]["Tables"]["employee_onboarding"]["Insert"]>;
      };
      onboarding_tasks: {
        Row: {
          id: string;
          employee_onboarding_id: string;
          template_task_id: string | null;
          title: string;
          description: string | null;
          assigned_to: string | null;
          due_date: string | null;
          priority: TaskPriority;
          status: OnboardingStatus;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_onboarding_id: string;
          template_task_id?: string | null;
          title: string;
          description?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          priority?: TaskPriority;
          status?: OnboardingStatus;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["onboarding_tasks"]["Insert"]>;
      };
      hr_tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          assignee_id: string | null;
          related_employee_id: string | null;
          due_date: string | null;
          priority: TaskPriority;
          status: HrTaskStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          assignee_id?: string | null;
          related_employee_id?: string | null;
          due_date?: string | null;
          priority?: TaskPriority;
          status?: HrTaskStatus;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["hr_tasks"]["Insert"]>;
      };
      documents: {
        Row: {
          id: string;
          employee_id: string;
          document_name: string;
          document_type: string;
          file_path: string;
          uploaded_by: string | null;
          visibility: DocumentVisibility;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          document_name: string;
          document_type: string;
          file_path: string;
          uploaded_by?: string | null;
          visibility?: DocumentVisibility;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
      };
      attendance: {
        Row: {
          id: string;
          employee_id: string;
          work_date: string;
          check_in_time: string | null;
          check_out_time: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          work_date: string;
          check_in_time?: string | null;
          check_out_time?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Insert"]>;
      };
      calendar_events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_type: CalendarEventType;
          event_date: string;
          end_date: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_type?: CalendarEventType;
          event_date: string;
          end_date?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["calendar_events"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          type: string;
          title: string;
          message: string | null;
          related_entity_type: string | null;
          related_entity_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          type: string;
          title: string;
          message?: string | null;
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          is_read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: never; // populated only by security-definer triggers (Phase 6)
        Update: never;
      };
      company_settings: {
        Row: {
          id: number;
          company_name: string;
          logo_url: string | null;
          address: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          date_format: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          company_name?: string;
          logo_url?: string | null;
          address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          date_format?: string;
          timezone?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_settings"]["Insert"]>;
      };
    };
    Views: {
      public_employee_directory: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          preferred_name: string | null;
          avatar_url: string | null;
          job_role_id: string | null;
          department_id: string | null;
          employment_type_id: string | null;
          location: string | null;
          employment_status: EmploymentStatus;
          email: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type ProfileRow = Tables<"profiles">;
export type EmployeeRow = Tables<"employees">;
export type PublicEmployeeDirectoryRow =
  Database["public"]["Views"]["public_employee_directory"]["Row"];
