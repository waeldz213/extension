// ============================================
// Heat Score Calculator
// Algorithme local - Pas d'API nécessaire
// ============================================

import { AuditResult, HeatScoreBreakdown } from "@/types";

/**
 * Calcule le Heat Score d'un lead basé sur son audit.
 * Plus le score est élevé, plus le lead a besoin de nos services
 * (= plus il est "chaud" pour nous).
 *
 * Score: 0-100
 * 0-30: Froid (site correct, peu de besoins)
 * 31-60: Tiède (améliorations possibles)
 * 61-80: Chaud (plusieurs problèmes détectés)
 * 81-100: Brûlant (site en mauvais état, besoin urgent)
 */
export function calculateHeatScore(audit: AuditResult): HeatScoreBreakdown {
  const lighthouseScore = calculateLighthouseComponent(audit.lighthouse);
  const seoScore = calculateSEOComponent(audit.seo);
  const securityScore = calculateSecurityComponent(audit.security);
  const techDebtScore = calculateTechDebtComponent(audit.techStack);

  // Weighted average - security and tech debt weigh more
  // because they're harder for prospects to fix themselves
  const total = Math.round(
    lighthouseScore * 0.25 +
      seoScore * 0.25 +
      securityScore * 0.3 +
      techDebtScore * 0.2
  );

  return {
    lighthouseScore: Math.round(lighthouseScore),
    seoScore: Math.round(seoScore),
    securityScore: Math.round(securityScore),
    techDebtScore: Math.round(techDebtScore),
    total: Math.min(100, Math.max(0, total)),
  };
}

function calculateLighthouseComponent(lh: AuditResult["lighthouse"]): number {
  // Inverse: low lighthouse scores = high heat score
  const avg =
    (lh.performance + lh.accessibility + lh.bestPractices + lh.seo) / 4;
  return 100 - avg;
}

function calculateSEOComponent(seo: AuditResult["seo"]): number {
  let score = 0;

  // Title issues
  if (!seo.title) score += 15;
  else if (seo.titleLength < 30 || seo.titleLength > 60) score += 8;

  // Meta description
  if (!seo.metaDescription) score += 15;
  else if (seo.metaDescriptionLength < 120 || seo.metaDescriptionLength > 160)
    score += 8;

  // H1 issues
  if (seo.h1Count === 0) score += 12;
  else if (seo.h1Count > 1) score += 6;

  // Images without alt
  if (seo.totalImages > 0) {
    const ratio = seo.imgWithoutAlt / seo.totalImages;
    score += Math.round(ratio * 15);
  }

  // Missing structured data
  if (!seo.hasOpenGraph) score += 8;
  if (!seo.hasTwitterCard) score += 5;
  if (!seo.hasCanonical) score += 8;
  if (!seo.hasSitemap) score += 7;
  if (!seo.hasRobotsTxt) score += 5;

  return Math.min(100, score);
}

function calculateSecurityComponent(
  security: AuditResult["security"]
): number {
  let score = 0;

  if (!security.https) score += 35;
  if (!security.hsts) score += 15;
  if (security.mixedContent) score += 20;
  if (!security.xFrameOptions) score += 10;
  if (!security.contentSecurityPolicy) score += 10;
  score += Math.min(10, security.outdatedLibraries * 3);

  return Math.min(100, score);
}

function calculateTechDebtComponent(tech: AuditResult["techStack"]): number {
  let score = 0;

  // Outdated libraries
  for (const lib of tech.outdatedLibraries) {
    switch (lib.severity) {
      case "critical":
        score += 25;
        break;
      case "high":
        score += 15;
        break;
      case "medium":
        score += 8;
        break;
      case "low":
        score += 3;
        break;
    }
  }

  // Old frameworks/CMS
  if (tech.jsLibraries.some((lib) => lib.toLowerCase().includes("jquery"))) {
    score += 15;
  }

  return Math.min(100, score);
}

export function getHeatLabel(
  score: number
): { label: string; color: string; emoji: string } {
  if (score >= 81) return { label: "Brûlant", color: "#ef4444", emoji: "🔥" };
  if (score >= 61) return { label: "Chaud", color: "#f97316", emoji: "🟠" };
  if (score >= 31) return { label: "Tiède", color: "#eab308", emoji: "🟡" };
  return { label: "Froid", color: "#3b82f6", emoji: "🔵" };
}
