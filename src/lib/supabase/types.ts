export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      service_modules: {
        Row: {
          id: string
          name: string
          type: 'base' | 'plugin' | 'subscription'
          category: string | null
          description: string | null
          features: Json
          price_min: number | null
          price_max: number | null
          price_unit: string | null
          delivery_days: string | null
          icon: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          type: 'base' | 'plugin' | 'subscription'
          category?: string | null
          description?: string | null
          features?: Json
          price_min?: number | null
          price_max?: number | null
          price_unit?: string | null
          delivery_days?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'base' | 'plugin' | 'subscription'
          category?: string | null
          description?: string | null
          features?: Json
          price_min?: number | null
          price_max?: number | null
          price_unit?: string | null
          delivery_days?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      service_cases: {
        Row: {
          id: string
          title: string
          industry: string | null
          company_size: string | null
          challenge: string | null
          solution: string | null
          results: Json
          modules_used: Json
          testimonial: string | null
          image_url: string | null
          is_featured: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id: string
          title: string
          industry?: string | null
          company_size?: string | null
          challenge?: string | null
          solution?: string | null
          results?: Json
          modules_used?: Json
          testimonial?: string | null
          image_url?: string | null
          is_featured?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          industry?: string | null
          company_size?: string | null
          challenge?: string | null
          solution?: string | null
          results?: Json
          modules_used?: Json
          testimonial?: string | null
          image_url?: string | null
          is_featured?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      service_leads: {
        Row: {
          id: string
          company_name: string | null
          contact_name: string
          contact_phone: string | null
          contact_wechat: string | null
          contact_email: string | null
          industry: string | null
          company_size: string | null
          need_type: string | null
          selected_modules: Json
          budget_range: string | null
          expected_timeline: string | null
          notes: string | null
          source: string | null
          status: 'new' | 'contacted' | 'demo_scheduled' | 'proposal' | 'signed' | 'lost'
          follow_up_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name?: string | null
          contact_name: string
          contact_phone?: string | null
          contact_wechat?: string | null
          contact_email?: string | null
          industry?: string | null
          company_size?: string | null
          need_type?: string | null
          selected_modules?: Json
          budget_range?: string | null
          expected_timeline?: string | null
          notes?: string | null
          source?: string | null
          status?: 'new' | 'contacted' | 'demo_scheduled' | 'proposal' | 'signed' | 'lost'
          follow_up_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string | null
          contact_name?: string
          contact_phone?: string | null
          contact_wechat?: string | null
          contact_email?: string | null
          industry?: string | null
          company_size?: string | null
          need_type?: string | null
          selected_modules?: Json
          budget_range?: string | null
          expected_timeline?: string | null
          notes?: string | null
          source?: string | null
          status?: 'new' | 'contacted' | 'demo_scheduled' | 'proposal' | 'signed' | 'lost'
          follow_up_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      diagnosis_results: {
        Row: {
          id: string
          answers: Json
          recommended_modules: Json
          estimated_price_min: number | null
          estimated_price_max: number | null
          estimated_days: string | null
          lead_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          answers: Json
          recommended_modules?: Json
          estimated_price_min?: number | null
          estimated_price_max?: number | null
          estimated_days?: string | null
          lead_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          answers?: Json
          recommended_modules?: Json
          estimated_price_min?: number | null
          estimated_price_max?: number | null
          estimated_days?: string | null
          lead_id?: string | null
          created_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          owner_id: string
          plan: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          plan?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          plan?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          workspace_id: string
          name: string
          key_hash: string
          prefix: string
          scopes: string[]
          is_active: boolean
          last_used_at: string | null
          created_at: string
          expires_at: string | null
          allowed_ips: string[] | null
          rate_limit_rpm: number
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          key_hash: string
          prefix: string
          scopes?: string[]
          is_active?: boolean
          last_used_at?: string | null
          created_at?: string
          expires_at?: string | null
          allowed_ips?: string[] | null
          rate_limit_rpm?: number
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          key_hash?: string
          prefix?: string
          scopes?: string[]
          is_active?: boolean
          last_used_at?: string | null
          created_at?: string
          expires_at?: string | null
          allowed_ips?: string[] | null
          rate_limit_rpm?: number
        }
      }
      mcp_tokens: {
        Row: {
          id: string
          workspace_id: string
          name: string
          token_hash: string
          prefix: string
          is_active: boolean
          last_used_at: string | null
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          token_hash: string
          prefix: string
          is_active?: boolean
          last_used_at?: string | null
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          token_hash?: string
          prefix?: string
          is_active?: boolean
          last_used_at?: string | null
          created_at?: string
          expires_at?: string | null
        }
      }
      agents: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          model: string
          status: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          model?: string
          status?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          model?: string
          status?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      workflow_runs: {
        Row: {
          id: string
          workflow_id: string
          workspace_id: string
          status: string
          trigger_type: string
          input_data: Json
          output_data: Json | null
          error_message: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workflow_id: string
          workspace_id: string
          status?: string
          trigger_type?: string
          input_data?: Json
          output_data?: Json | null
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workflow_id?: string
          workspace_id?: string
          status?: string
          trigger_type?: string
          input_data?: Json
          output_data?: Json | null
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          workspace_id: string
          agent_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          agent_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          agent_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: string
          content?: string
          created_at?: string
        }
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
  }
}
