// ============================================
// Supabase Database Types
// ============================================

import type { KanbanStatus } from "@/types";

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: LeadUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface LeadRow {
  id: string;
  company: string;
  website: string;
  contact_name: string;
  contact_email: string;
  phone: string | null;
  heat_score: number;
  status: KanbanStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadInsert = Omit<LeadRow, "id" | "created_at" | "updated_at">;
export type LeadUpdate = Partial<Omit<LeadRow, "id" | "created_at">>;
