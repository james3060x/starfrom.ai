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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          scopes: string[] | null
          total_requests: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          scopes?: string[] | null
          total_requests?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          scopes?: string[] | null
          total_requests?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosis_results: {
        Row: {
          answers: Json
          created_at: string | null
          estimated_days: string | null
          estimated_price_max: number | null
          estimated_price_min: number | null
          id: string
          lead_id: string | null
          recommended_modules: Json | null
        }
        Insert: {
          answers?: Json
          created_at?: string | null
          estimated_days?: string | null
          estimated_price_max?: number | null
          estimated_price_min?: number | null
          id?: string
          lead_id?: string | null
          recommended_modules?: Json | null
        }
        Update: {
          answers?: Json
          created_at?: string | null
          estimated_days?: string | null
          estimated_price_max?: number | null
          estimated_price_min?: number | null
          id?: string
          lead_id?: string | null
          recommended_modules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnosis_results_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "service_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_bases: {
        Row: {
          chunk_overlap: number | null
          chunk_size: number | null
          created_at: string | null
          description: string | null
          embedding_model: string | null
          id: string
          name: string
          total_chunks: number | null
          total_files: number | null
          total_size_bytes: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chunk_overlap?: number | null
          chunk_size?: number | null
          created_at?: string | null
          description?: string | null
          embedding_model?: string | null
          id?: string
          name: string
          total_chunks?: number | null
          total_files?: number | null
          total_size_bytes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chunk_overlap?: number | null
          chunk_size?: number | null
          created_at?: string | null
          description?: string | null
          embedding_model?: string | null
          id?: string
          name?: string
          total_chunks?: number | null
          total_files?: number | null
          total_size_bytes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      knowledge_files: {
        Row: {
          chunk_count: number | null
          created_at: string | null
          error_message: string | null
          file_size_bytes: number
          file_type: string
          filename: string
          id: string
          knowledge_base_id: string | null
          processed_at: string | null
          processing_status: string | null
          storage_path: string
        }
        Insert: {
          chunk_count?: number | null
          created_at?: string | null
          error_message?: string | null
          file_size_bytes: number
          file_type: string
          filename: string
          id?: string
          knowledge_base_id?: string | null
          processed_at?: string | null
          processing_status?: string | null
          storage_path: string
        }
        Update: {
          chunk_count?: number | null
          created_at?: string | null
          error_message?: string | null
          file_size_bytes?: number
          file_type?: string
          filename?: string
          id?: string
          knowledge_base_id?: string | null
          processed_at?: string | null
          processing_status?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_files_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      service_cases: {
        Row: {
          challenge: string | null
          company_size: string | null
          created_at: string | null
          id: string
          image_url: string | null
          industry: string | null
          is_featured: boolean | null
          modules_used: Json | null
          results: Json | null
          solution: string | null
          sort_order: number | null
          testimonial: string | null
          title: string
        }
        Insert: {
          challenge?: string | null
          company_size?: string | null
          created_at?: string | null
          id: string
          image_url?: string | null
          industry?: string | null
          is_featured?: boolean | null
          modules_used?: Json | null
          results?: Json | null
          solution?: string | null
          sort_order?: number | null
          testimonial?: string | null
          title: string
        }
        Update: {
          challenge?: string | null
          company_size?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_featured?: boolean | null
          modules_used?: Json | null
          results?: Json | null
          solution?: string | null
          sort_order?: number | null
          testimonial?: string | null
          title?: string
        }
        Relationships: []
      }
      service_leads: {
        Row: {
          budget_range: string | null
          company_name: string | null
          company_size: string | null
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          contact_wechat: string | null
          created_at: string | null
          expected_timeline: string | null
          follow_up_notes: string | null
          id: string
          industry: string | null
          need_type: string | null
          notes: string | null
          selected_modules: Json | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget_range?: string | null
          company_name?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          contact_wechat?: string | null
          created_at?: string | null
          expected_timeline?: string | null
          follow_up_notes?: string | null
          id?: string
          industry?: string | null
          need_type?: string | null
          notes?: string | null
          selected_modules?: Json | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_range?: string | null
          company_name?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          contact_wechat?: string | null
          created_at?: string | null
          expected_timeline?: string | null
          follow_up_notes?: string | null
          id?: string
          industry?: string | null
          need_type?: string | null
          notes?: string | null
          selected_modules?: Json | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_modules: {
        Row: {
          category: string | null
          created_at: string | null
          delivery_days: string | null
          description: string | null
          features: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          price_max: number | null
          price_min: number | null
          price_unit: string | null
          sort_order: number | null
          type: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          delivery_days?: string | null
          description?: string | null
          features?: Json | null
          icon?: string | null
          id: string
          is_active?: boolean | null
          name: string
          price_max?: number | null
          price_min?: number | null
          price_unit?: string | null
          sort_order?: number | null
          type: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          delivery_days?: string | null
          description?: string | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_max?: number | null
          price_min?: number | null
          price_unit?: string | null
          sort_order?: number | null
          type?: string
        }
        Relationships: []
      }
      solo_users: {
        Row: {
          agent_limit: number
          api_calls_limit: number
          created_at: string | null
          id: string
          plan_status: string
          plan_type: string
          storage_limit_gb: number
          subscription_expires_at: string | null
          subscription_id: string | null
          total_agents: number | null
          total_api_calls: number | null
          total_conversations: number | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_limit?: number
          api_calls_limit?: number
          created_at?: string | null
          id?: string
          plan_status?: string
          plan_type?: string
          storage_limit_gb?: number
          subscription_expires_at?: string | null
          subscription_id?: string | null
          total_agents?: number | null
          total_api_calls?: number | null
          total_conversations?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_limit?: number
          api_calls_limit?: number
          created_at?: string | null
          id?: string
          plan_status?: string
          plan_type?: string
          storage_limit_gb?: number
          subscription_expires_at?: string | null
          subscription_id?: string | null
          total_agents?: number | null
          total_api_calls?: number | null
          total_conversations?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_agents: {
        Row: {
          created_at: string | null
          description: string | null
          enable_function_calling: boolean | null
          enable_web_search: boolean | null
          icon: string | null
          id: string
          is_active: boolean | null
          knowledge_base_id: string | null
          last_used_at: string | null
          max_tokens: number | null
          model: string
          name: string
          stop_sequences: string[] | null
          system_prompt: string
          temperature: number | null
          total_conversations: number | null
          total_messages: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          enable_function_calling?: boolean | null
          enable_web_search?: boolean | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_base_id?: string | null
          last_used_at?: string | null
          max_tokens?: number | null
          model?: string
          name: string
          stop_sequences?: string[] | null
          system_prompt: string
          temperature?: number | null
          total_conversations?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          enable_function_calling?: boolean | null
          enable_web_search?: boolean | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_base_id?: string | null
          last_used_at?: string | null
          max_tokens?: number | null
          model?: string
          name?: string
          stop_sequences?: string[] | null
          system_prompt?: string
          temperature?: number | null
          total_conversations?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_conversations: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          message_count: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "user_agents"
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
