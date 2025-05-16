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
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          profile_picture_url: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          profile_picture_url?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_picture_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          available_days: string | null
          available_times: string | null
          created_at: string | null
          curriculum: string | null
          experience_level:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null
          grade_level: string | null
          id: string
          learning_goals: string | null
          onboarding_completed: boolean | null
          preferred_learning_mode:
            | Database["public"]["Enums"]["learning_mode_enum"]
            | null
          preferred_subjects: string[] | null
          skills: string[] | null
          updated_at: string | null
          use_case: string | null
        }
        Insert: {
          available_days?: string | null
          available_times?: string | null
          created_at?: string | null
          curriculum?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null
          grade_level?: string | null
          id: string
          learning_goals?: string | null
          onboarding_completed?: boolean | null
          preferred_learning_mode?:
            | Database["public"]["Enums"]["learning_mode_enum"]
            | null
          preferred_subjects?: string[] | null
          skills?: string[] | null
          updated_at?: string | null
          use_case?: string | null
        }
        Update: {
          available_days?: string | null
          available_times?: string | null
          created_at?: string | null
          curriculum?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null
          grade_level?: string | null
          id?: string
          learning_goals?: string | null
          onboarding_completed?: boolean | null
          preferred_learning_mode?:
            | Database["public"]["Enums"]["learning_mode_enum"]
            | null
          preferred_subjects?: string[] | null
          skills?: string[] | null
          updated_at?: string | null
          use_case?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_profiles: {
        Row: {
          availability: Json | null
          available_days: string[] | null
          available_times: string | null
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          experience: string | null
          experience_years: string | null
          full_name: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          languages_spoken: string[] | null
          location: string | null
          old_subjects: Json | null
          onboarding_completed: boolean | null
          skills: string[] | null
          subjects: string[] | null
          target_student_types: string[] | null
          teaching_mode:
            | Database["public"]["Enums"]["teaching_mode_enum"]
            | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          available_days?: string[] | null
          available_times?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          experience?: string | null
          experience_years?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          is_active?: boolean | null
          languages_spoken?: string[] | null
          location?: string | null
          old_subjects?: Json | null
          onboarding_completed?: boolean | null
          skills?: string[] | null
          subjects?: string[] | null
          target_student_types?: string[] | null
          teaching_mode?:
            | Database["public"]["Enums"]["teaching_mode_enum"]
            | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          available_days?: string[] | null
          available_times?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          experience?: string | null
          experience_years?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          languages_spoken?: string[] | null
          location?: string | null
          old_subjects?: Json | null
          onboarding_completed?: boolean | null
          skills?: string[] | null
          subjects?: string[] | null
          target_student_types?: string[] | null
          teaching_mode?:
            | Database["public"]["Enums"]["teaching_mode_enum"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experience_level_enum: "beginner" | "intermediate" | "advanced"
      learning_mode_enum: "online" | "offline" | "hybrid"
      teaching_mode_enum: "online" | "offline" | "hybrid"
      user_role: "student" | "tutor"
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
      experience_level_enum: ["beginner", "intermediate", "advanced"],
      learning_mode_enum: ["online", "offline", "hybrid"],
      teaching_mode_enum: ["online", "offline", "hybrid"],
      user_role: ["student", "tutor"],
    },
  },
} as const
