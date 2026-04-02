// ============================================
// DSFGenius - Type Definitions
// ============================================

export interface Lead {
  id: string;
  company: string;
  website: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  heatScore: number;
  status: KanbanStatus;
  auditResult?: AuditResult;
  pitchVariants?: PitchVariants;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type KanbanStatus =
  | "new"
  | "contacted"
  | "meeting"
  | "proposal"
  | "signed"
  | "lost";

export const KANBAN_COLUMNS: { id: KanbanStatus; label: string; color: string }[] = [
  { id: "new", label: "Nouveau", color: "#6366f1" },
  { id: "contacted", label: "Contacté", color: "#f59e0b" },
  { id: "meeting", label: "RDV Pris", color: "#3b82f6" },
  { id: "proposal", label: "Proposition", color: "#8b5cf6" },
  { id: "signed", label: "Signé", color: "#10b981" },
  { id: "lost", label: "Perdu", color: "#ef4444" },
];

export interface AuditResult {
  url: string;
  timestamp: string;
  lighthouse: LighthouseScores;
  seo: SEOAnalysis;
  techStack: TechStackInfo;
  security: SecurityInfo;
  overall: number;
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface SEOAnalysis {
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  h1Count: number;
  h1Tags: string[];
  h2Count: number;
  imgWithoutAlt: number;
  totalImages: number;
  hasCanonical: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: string[];
}

export interface TechStackInfo {
  framework: string | null;
  cms: string | null;
  jsLibraries: string[];
  cssFramework: string | null;
  analytics: string[];
  cdn: string | null;
  server: string | null;
  outdatedLibraries: OutdatedLibrary[];
}

export interface OutdatedLibrary {
  name: string;
  version: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface SecurityInfo {
  https: boolean;
  hsts: boolean;
  mixedContent: boolean;
  outdatedLibraries: number;
  xFrameOptions: boolean;
  contentSecurityPolicy: boolean;
}

export interface PitchVariants {
  aggressive: string;
  empathetic: string;
  expert: string;
}

export interface HeatScoreBreakdown {
  lighthouseScore: number;
  seoScore: number;
  securityScore: number;
  techDebtScore: number;
  total: number;
}

export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  contactedToday: number;
  conversionRate: number;
  avgHeatScore: number;
}
