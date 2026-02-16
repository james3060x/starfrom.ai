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
