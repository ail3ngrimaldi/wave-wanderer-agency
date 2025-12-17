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
      packages: {
        Row: {
          country: string
          created_at: string
          created_by: string | null
          currency: string
          departure_city: string
          description: string | null
          destination: string
          disclaimer: string | null
          end_date: string | null
          expires_at: string
          hotel_name: string | null
          id: string
          image_url: string | null
          includes_flight: boolean
          includes_hotel: boolean
          includes_transfer: boolean
          nights: number
          payment_link: string | null
          price: number
          price_note: string | null
          start_date: string | null
          title: string
        }
        Insert: {
          country: string
          created_at?: string
          created_by?: string | null
          currency?: string
          departure_city: string
          description?: string | null
          destination: string
          disclaimer?: string | null
          end_date?: string | null
          expires_at?: string
          hotel_name?: string | null
          id?: string
          image_url?: string | null
          includes_flight?: boolean
          includes_hotel?: boolean
          includes_transfer?: boolean
          nights?: number
          payment_link?: string | null
          price: number
          price_note?: string | null
          start_date?: string | null
          title: string
        }
        Update: {
          country?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          departure_city?: string
          description?: string | null
          destination?: string
          disclaimer?: string | null
          end_date?: string | null
          expires_at?: string
          hotel_name?: string | null
          id?: string
          image_url?: string | null
          includes_flight?: boolean
          includes_hotel?: boolean
          includes_transfer?: boolean
          nights?: number
          payment_link?: string | null
          price?: number
          price_note?: string | null
          start_date?: string | null
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      packages_public: {
        Row: {
          country: string | null
          created_at: string | null
          currency: string | null
          departure_city: string | null
          description: string | null
          destination: string | null
          disclaimer: string | null
          end_date: string | null
          expires_at: string | null
          hotel_name: string | null
          id: string | null
          image_url: string | null
          includes_flight: boolean | null
          includes_hotel: boolean | null
          includes_transfer: boolean | null
          nights: number | null
          payment_link: string | null
          price: number | null
          price_note: string | null
          start_date: string | null
          title: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          currency?: string | null
          departure_city?: string | null
          description?: string | null
          destination?: string | null
          disclaimer?: string | null
          end_date?: string | null
          expires_at?: string | null
          hotel_name?: string | null
          id?: string | null
          image_url?: string | null
          includes_flight?: boolean | null
          includes_hotel?: boolean | null
          includes_transfer?: boolean | null
          nights?: number | null
          payment_link?: string | null
          price?: number | null
          price_note?: string | null
          start_date?: string | null
          title?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          currency?: string | null
          departure_city?: string | null
          description?: string | null
          destination?: string | null
          disclaimer?: string | null
          end_date?: string | null
          expires_at?: string | null
          hotel_name?: string | null
          id?: string | null
          image_url?: string | null
          includes_flight?: boolean | null
          includes_hotel?: boolean | null
          includes_transfer?: boolean | null
          nights?: number | null
          payment_link?: string | null
          price?: number | null
          price_note?: string | null
          start_date?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_expired_packages: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
