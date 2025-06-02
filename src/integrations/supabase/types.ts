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
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          profile_picture_url?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_picture_url?: string | null
          role?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string | null
          grade_level: string | null
          id: string
          learning_goals: string | null
          preferred_subjects: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          grade_level?: string | null
          id: string
          learning_goals?: string | null
          preferred_subjects?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          grade_level?: string | null
          id?: string
          learning_goals?: string | null
          preferred_subjects?: string[] | null
          updated_at?: string | null
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
          created_at: string | null
          experience: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          location: string | null
          old_subjects: Json | null
          subjects: string[] | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          available_days?: string[] | null
          available_times?: string | null
          created_at?: string | null
          experience?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          location?: string | null
          old_subjects?: Json | null
          subjects?: string[] | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          available_days?: string[] | null
          available_times?: string | null
          created_at?: string | null
          experience?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          old_subjects?: Json | null
          subjects?: string[] | null
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
      bookings: {
        Row: {
          calendar_event: string | null
          created_at: string
          end_time: string
          id: string
          note: string | null
          room_url: string | null
          session_summary: string | null
          start_time: string
          status: string
          student_id: string
          subject: string
          tutor_id: string
          updated_at: string
          email_reminder: boolean | null
        }
        Insert: {
          calendar_event?: string | null
          created_at?: string
          end_time: string
          id?: string
          note?: string | null
          room_url?: string | null
          session_summary?: string | null
          start_time: string
          status: string
          student_id: string
          subject: string
          tutor_id: string
          updated_at?: string
          email_reminder?: boolean | null
        }
        Update: {
          calendar_event?: string | null
          created_at?: string
          end_time?: string
          id?: string
          note?: string | null
          room_url?: string | null
          session_summary?: string | null
          start_time?: string
          status?: string
          student_id?: string
          subject?: string
          tutor_id?: string
          updated_at?: string
          email_reminder?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            referencedBy: []
            references: {
              columns: ["id"]
              isManyColumns: false
              referencedRelation: "profiles"
            }
          },
          {
            foreignKeyName: "bookings_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedBy: []
            references: {
              columns: ["id"]
              isManyColumns: false
              referencedRelation: "profiles"
            }
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          sender_id: string
          content: string
          type: string
          link: string | null
          is_read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          sender_id: string
          content: string
          type: string
          link?: string | null
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          sender_id?: string
          content?: string
          type?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            referencedBy: []
            references: {
              columns: ["id"]
              isManyColumns: false
              referencedRelation: "profiles"
            }
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            referencedBy: []
            references: {
              columns: ["id"]
              isManyColumns: false
              referencedRelation: "profiles"
            }
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_updated_at:
        {
          Args: {}
          Returns: Trigger
        }
    }
    Enums: {
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
      user_role: ["student", "tutor"],
    },
  },
} as const

export type Bookings = Database['public']['Tables']['bookings']['Row']
export type Profiles = Database['public']['Tables']['profiles']['Row']
export type StudentProfiles = Database['public']['Tables']['student_profiles']['Row']
export type TutorProfiles = Database['public']['Tables']['tutor_profiles']['Row']
