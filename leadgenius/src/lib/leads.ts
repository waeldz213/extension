// ============================================
// Leads Data Access Layer
// Supabase with mock-data fallback
// ============================================

import { getSupabase, isSupabaseConfigured } from "./supabase";
import { mockLeads } from "./mock-data";
import type { Lead, KanbanStatus, DashboardStats } from "@/types";
import type { LeadRow } from "@/types/database";

// ---------- Helpers ----------

function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    company: row.company,
    website: row.website,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    phone: row.phone ?? undefined,
    heatScore: row.heat_score,
    status: row.status,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------- Queries ----------

export async function fetchLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured()) return mockLeads;

  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchLeads error:", error);
    return mockLeads;
  }

  return (data as LeadRow[]).map(rowToLead);
}

export async function fetchLeadById(id: string): Promise<Lead | null> {
  if (!isSupabaseConfigured()) return mockLeads.find((l) => l.id === id) ?? null;

  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("fetchLeadById error:", error);
    return null;
  }

  return rowToLead(data as LeadRow);
}

export async function createLead(
  lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "heatScore">
): Promise<Lead | null> {
  if (!isSupabaseConfigured()) {
    // In-memory fallback – return a temporary lead
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      heatScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newLead;
  }

  const { data, error } = await getSupabase()
    .from("leads")
    .insert({
      company: lead.company,
      website: lead.website,
      contact_name: lead.contactName,
      contact_email: lead.contactEmail,
      phone: lead.phone ?? null,
      heat_score: 0,
      status: lead.status,
      notes: lead.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("createLead error:", error);
    return null;
  }

  return rowToLead(data as LeadRow);
}

export async function updateLead(
  id: string,
  updates: Partial<Omit<Lead, "id" | "createdAt">>
): Promise<Lead | null> {
  if (!isSupabaseConfigured()) return null;

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.company !== undefined) payload.company = updates.company;
  if (updates.website !== undefined) payload.website = updates.website;
  if (updates.contactName !== undefined) payload.contact_name = updates.contactName;
  if (updates.contactEmail !== undefined) payload.contact_email = updates.contactEmail;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.heatScore !== undefined) payload.heat_score = updates.heatScore;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { data, error } = await getSupabase()
    .from("leads")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateLead error:", error);
    return null;
  }

  return rowToLead(data as LeadRow);
}

export async function deleteLead(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { error } = await getSupabase().from("leads").delete().eq("id", id);

  if (error) {
    console.error("deleteLead error:", error);
    return false;
  }

  return true;
}

export async function updateLeadStatus(
  id: string,
  status: KanbanStatus
): Promise<Lead | null> {
  return updateLead(id, { status });
}

// ---------- Stats ----------

export async function fetchDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) {
    const leads = mockLeads;
    return computeStats(leads);
  }

  const leads = await fetchLeads();
  return computeStats(leads);
}

function computeStats(leads: Lead[]): DashboardStats {
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.heatScore >= 70).length;

  const today = new Date().toISOString().slice(0, 10);
  const contactedToday = leads.filter(
    (l) => l.status === "contacted" && l.updatedAt.slice(0, 10) === today
  ).length;

  const signed = leads.filter((l) => l.status === "signed").length;
  const conversionRate = totalLeads > 0 ? Math.round((signed / totalLeads) * 1000) / 10 : 0;

  const avgHeatScore =
    totalLeads > 0
      ? Math.round(leads.reduce((sum, l) => sum + l.heatScore, 0) / totalLeads)
      : 0;

  return {
    totalLeads,
    hotLeads,
    contactedToday,
    conversionRate,
    avgHeatScore,
  };
}
