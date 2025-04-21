export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auth_logs: {
        Row: {
          error_message: string | null
          event_type: string
          id: string
          ip_address: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          error_message?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          error_message?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      course_applications: {
        Row: {
          course_id: string
          course_title: string
          created_at: string | null
          email: string
          format: string | null
          free_practice: boolean | null
          full_name: string
          id: string
          languages: string[] | null
          message: string | null
          phone_number: string
          session_type: string | null
          status: string
        }
        Insert: {
          course_id: string
          course_title: string
          created_at?: string | null
          email: string
          format?: string | null
          free_practice?: boolean | null
          full_name: string
          id?: string
          languages?: string[] | null
          message?: string | null
          phone_number: string
          session_type?: string | null
          status?: string
        }
        Update: {
          course_id?: string
          course_title?: string
          created_at?: string | null
          email?: string
          format?: string | null
          free_practice?: boolean | null
          full_name?: string
          id?: string
          languages?: string[] | null
          message?: string | null
          phone_number?: string
          session_type?: string | null
          status?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          course_id: string
          created_at: string | null
          enrollment_date: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      course_instructors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          course_id: string
          created_at: string | null
          id: string
          name: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          name: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          name?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_instructors_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          course_id: string
          created_at: string | null
          duration: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          duration: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          duration?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_outcomes: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          outcome: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          outcome: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          outcome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_outcomes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_requirements: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          requirement: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          requirement: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          requirement?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_requirements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          author_type: string | null
          button_text: string | null
          color: string
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          duration: string
          icon_name: string
          id: string
          image_url: string | null
          institution: string | null
          instructor: string | null
          instructor_ids: string[] | null
          is_persistent: boolean | null
          is_public: boolean | null
          modules: string[] | null
          organization_logo: string | null
          prefer_icon: boolean | null
          price: string
          show_on_homepage: boolean | null
          slug: string | null
          specialization: string | null
          subtitle: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_type?: string | null
          button_text?: string | null
          color?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          duration: string
          icon_name: string
          id?: string
          image_url?: string | null
          institution?: string | null
          instructor?: string | null
          instructor_ids?: string[] | null
          is_persistent?: boolean | null
          is_public?: boolean | null
          modules?: string[] | null
          organization_logo?: string | null
          prefer_icon?: boolean | null
          price: string
          show_on_homepage?: boolean | null
          slug?: string | null
          specialization?: string | null
          subtitle?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_type?: string | null
          button_text?: string | null
          color?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          duration?: string
          icon_name?: string
          id?: string
          image_url?: string | null
          institution?: string | null
          instructor?: string | null
          instructor_ids?: string[] | null
          is_persistent?: boolean | null
          is_public?: boolean | null
          modules?: string[] | null
          organization_logo?: string | null
          prefer_icon?: boolean | null
          price?: string
          show_on_homepage?: boolean | null
          slug?: string | null
          specialization?: string | null
          subtitle?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employer_projects: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          tech_stack: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          tech_stack?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          tech_stack?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      group_students: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_students_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          course: string
          created_at: string | null
          id: string
          lecturer_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          course: string
          created_at?: string | null
          id?: string
          lecturer_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          course?: string
          created_at?: string | null
          id?: string
          lecturer_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assignments: {
        Row: {
          created_at: string
          id: number
          instructor_id: string | null
          project_id: number | null
          status: string | null
          student_id: string | null
          supervisor_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          instructor_id?: string | null
          project_id?: number | null
          status?: string | null
          student_id?: string | null
          supervisor_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          instructor_id?: string | null
          project_id?: number | null
          status?: string | null
          student_id?: string | null
          supervisor_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_proposals: {
        Row: {
          created_at: string
          description: string
          duration: string | null
          employer_id: string
          feedback: string | null
          id: string
          organization: string | null
          requirements: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration?: string | null
          employer_id: string
          feedback?: string | null
          id?: string
          organization?: string | null
          requirements?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string | null
          employer_id?: string
          feedback?: string | null
          id?: string
          organization?: string | null
          requirements?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          complexity: string | null
          created_at: string
          created_by: string | null
          description: string
          duration: string | null
          id: number
          image: string | null
          is_public: boolean | null
          learning_outcomes: string[] | null
          organization_name: string | null
          prerequisites: string[] | null
          steps: string[] | null
          tech_stack: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          complexity?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          duration?: string | null
          id?: number
          image?: string | null
          is_public?: boolean | null
          learning_outcomes?: string[] | null
          organization_name?: string | null
          prerequisites?: string[] | null
          steps?: string[] | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          complexity?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          duration?: string | null
          id?: number
          image?: string | null
          is_public?: boolean | null
          learning_outcomes?: string[] | null
          organization_name?: string | null
          prerequisites?: string[] | null
          steps?: string[] | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      specializations: {
        Row: {
          courses: number | null
          created_at: string | null
          description: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          courses?: number | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          courses?: number | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string
          due_date: string | null
          id: number
          project_id: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          due_date?: string | null
          id?: number
          project_id?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          due_date?: string | null
          id?: number
          project_id?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          banner_image_url: string | null
          category: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          module_id: number | null
          summary: string
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_image_url?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          module_id?: number | null
          summary: string
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_image_url?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          module_id?: number | null
          summary?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          completed: boolean | null
          created_at: string
          date: string
          description: string
          id: number
          project_id: number | null
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          date: string
          description: string
          id?: number
          project_id?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          date?: string
          description?: string
          id?: number
          project_id?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          course: string | null
          created_at: string
          department: string | null
          email: string
          group_name: string | null
          id: string
          name: string
          organization: string | null
          registration_approved: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          specialization: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          course?: string | null
          created_at?: string
          department?: string | null
          email: string
          group_name?: string | null
          id: string
          name: string
          organization?: string | null
          registration_approved?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          course?: string | null
          created_at?: string
          department?: string | null
          email?: string
          group_name?: string | null
          id?: string
          name?: string
          organization?: string | null
          registration_approved?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_first_admin: {
        Args: { admin_email: string }
        Returns: boolean
      }
      approve_specific_admin: {
        Args: { admin_email: string }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type: string
        }
        Returns: undefined
      }
      ensure_admin_login: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_auth_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_first_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_designated_admin: {
        Args: { email_to_check: string }
        Returns: boolean
      }
      reset_admin_account: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_designated_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role:
        | "admin"
        | "lecturer"
        | "project_manager"
        | "employer"
        | "student"
        | "instructor"
        | "supervisor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "admin",
        "lecturer",
        "project_manager",
        "employer",
        "student",
        "instructor",
        "supervisor",
      ],
    },
  },
} as const
