export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          id: string
          location: string | null
          notes: string | null
          professional_name: string | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          id?: string
          location?: string | null
          notes?: string | null
          professional_name?: string | null
          status?: string | null
          title?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          id?: string
          location?: string | null
          notes?: string | null
          professional_name?: string | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment: string | null
          created_at: string | null
          email: string
          id: string
          results: Json | null
          updated_at: string | null
        }
        Insert: {
          assessment?: string | null
          created_at?: string | null
          email: string
          id?: string
          results?: Json | null
          updated_at?: string | null
        }
        Update: {
          assessment?: string | null
          created_at?: string | null
          email?: string
          id?: string
          results?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          id: string
          injury_id: string | null
          logged_at: string | null
          mood: number | null
          notes: string | null
          pain_level: number
          user_id: string
        }
        Insert: {
          id?: string
          injury_id?: string | null
          logged_at?: string | null
          mood?: number | null
          notes?: string | null
          pain_level: number
          user_id: string
        }
        Update: {
          id?: string
          injury_id?: string | null
          logged_at?: string | null
          mood?: number | null
          notes?: string | null
          pain_level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_injury_id_fkey"
            columns: ["injury_id"]
            isOneToOne: false
            referencedRelation: "injuries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sessions: {
        Row: {
          count: number | null
          created_at: string | null
          duration_seconds: number | null
          exercise_type: string
          id: string
          notes: string | null
          session_date: string | null
          user_id: string
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          exercise_type?: string
          id?: string
          notes?: string | null
          session_date?: string | null
          user_id: string
        }
        Update: {
          count?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          exercise_type?: string
          id?: string
          notes?: string | null
          session_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      injuries: {
        Row: {
          body_part: string
          created_at: string | null
          description: string | null
          id: string
          injury_type: string
          is_active: boolean | null
          severity: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          body_part: string
          created_at?: string | null
          description?: string | null
          id?: string
          injury_type: string
          is_active?: boolean | null
          severity?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          body_part?: string
          created_at?: string | null
          description?: string | null
          id?: string
          injury_type?: string
          is_active?: boolean | null
          severity?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "injuries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          id: string
          medical_record_number: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          medical_record_number?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          medical_record_number?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          pdf_url: string | null
          report_type: string
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          pdf_url?: string | null
          report_type: string
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          pdf_url?: string | null
          report_type?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
