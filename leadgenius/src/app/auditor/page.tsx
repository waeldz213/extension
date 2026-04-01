"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { ScoreRing, HeatBadge } from "@/components/ui/ScoreRing";
import { mockAuditResult } from "@/lib/mock-data";
import { calculateHeatScore } from "@/lib/heat-score";
import type { AuditResult } from "@/types";
import {
  Search,
  Loader2,
  Shield,
  Gauge,
  Code2,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
} from "lucide-react";

/** Sanitize a URL to only allow http/https schemes, preventing javascript: XSS */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    // invalid URL
  }
  return "#";
}

export default function AuditorPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "seo" | "tech" | "security"
  >("overview");

  const handleAudit = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);

    // Simulate API call with delay
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // Fallback to mock data for demo
        await new Promise((r) => setTimeout(r, 2000));
        setResult({ ...mockAuditResult, url });
      }
    } catch {
      // Fallback to mock data for demo
      await new Promise((r) => setTimeout(r, 2000));
      setResult({ ...mockAuditResult, url });
    } finally {
      setLoading(false);
    }
  };

  const heatBreakdown = result ? calculateHeatScore(result) : null;

  const tabs = [
    { id: "overview" as const, label: "Vue d'ensemble", icon: Gauge },
    { id: "seo" as const, label: "SEO", icon: Globe },
    { id: "tech" as const, label: "Tech Stack", icon: Code2 },
    { id: "security" as const, label: "Sécurité", icon: Shield },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <TopBar title="Site Auditor" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Search Bar */}
        <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">
            Analyser un site web
          </h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAudit()}
                className="w-full pl-11 pr-4 py-3 bg-[#09090b] border border-[#27272a] rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              />
            </div>
            <button
              onClick={handleAudit}
              disabled={loading || !url}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Auditer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="animate-spin text-indigo-400" />
            <div className="text-center">
              <p className="text-zinc-200 font-medium">
                Analyse en cours...
              </p>
              <p className="text-zinc-500 text-sm mt-1">
                Lighthouse + Scraping + IA Deep Analysis
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              {["SEO", "Performance", "Sécurité", "Tech Stack"].map(
                (step, i) => (
                  <span
                    key={step}
                    className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400"
                    style={{
                      animationDelay: `${i * 0.5}s`,
                      animation: "heat-pulse 2s ease-in-out infinite",
                    }}
                  >
                    {step}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <>
            {/* Header with scores */}
            <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    Rapport d&apos;audit
                  </h3>
                  <a
                    href={sanitizeUrl(result.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
                  >
                    {result.url} <ExternalLink size={12} />
                  </a>
                </div>
                {heatBreakdown && (
                  <HeatBadge score={heatBreakdown.total} size="lg" />
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing score={result.lighthouse.performance} />
                  <span className="text-sm text-zinc-400">Performance</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing score={result.lighthouse.accessibility} />
                  <span className="text-sm text-zinc-400">Accessibilité</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing score={result.lighthouse.bestPractices} />
                  <span className="text-sm text-zinc-400">
                    Bonnes Pratiques
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing score={result.lighthouse.seo} />
                  <span className="text-sm text-zinc-400">SEO</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-[#18181b] rounded-lg border border-[#27272a] w-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="rounded-xl border border-[#27272a] bg-[#18181b] overflow-hidden">
              {activeTab === "overview" && (
                <OverviewTab result={result} heatBreakdown={heatBreakdown} />
              )}
              {activeTab === "seo" && <SEOTab seo={result.seo} />}
              {activeTab === "tech" && <TechTab tech={result.techStack} />}
              {activeTab === "security" && (
                <SecurityTab security={result.security} />
              )}
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <a
                href={`/pitcher?url=${encodeURIComponent(result.url)}`}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium text-white text-center transition-all"
              >
                Générer un Pitch basé sur cet audit →
              </a>
              <button
                onClick={() => {
                  const text = `Audit de ${result.url}\nPerformance: ${result.lighthouse.performance}/100\nSEO: ${result.lighthouse.seo}/100\nSécurité: ${result.security.https ? "HTTPS ✓" : "Pas HTTPS ✗"}`;
                  navigator.clipboard.writeText(text);
                }}
                className="px-4 py-3 border border-[#27272a] hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-all"
              >
                <Copy size={18} />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Sub-components for tabs

function OverviewTab({
  result,
  heatBreakdown,
}: {
  result: AuditResult;
  heatBreakdown: ReturnType<typeof calculateHeatScore> | null;
}) {
  const issues = [];

  if (!result.security.https)
    issues.push({
      severity: "critical",
      text: "Le site n'utilise pas HTTPS",
    });
  if (result.seo.h1Count === 0)
    issues.push({ severity: "high", text: "Aucune balise H1 trouvée" });
  if (!result.seo.metaDescription)
    issues.push({
      severity: "high",
      text: "Meta description manquante",
    });
  if (result.seo.imgWithoutAlt > 0)
    issues.push({
      severity: "medium",
      text: `${result.seo.imgWithoutAlt} images sans attribut ALT`,
    });
  for (const lib of result.techStack.outdatedLibraries) {
    issues.push({ severity: lib.severity, text: `${lib.name} ${lib.version}: ${lib.issue}` });
  }
  if (!result.seo.hasSitemap)
    issues.push({ severity: "medium", text: "Pas de sitemap.xml" });
  if (!result.seo.hasRobotsTxt)
    issues.push({ severity: "low", text: "Pas de robots.txt" });

  return (
    <div className="divide-y divide-[#27272a]">
      <div className="p-5">
        <h3 className="font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-400" />
          Problèmes Détectés ({issues.length})
        </h3>
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#09090b]"
            >
              <span
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  issue.severity === "critical"
                    ? "bg-red-500"
                    : issue.severity === "high"
                      ? "bg-orange-500"
                      : issue.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                }`}
              />
              <span className="text-sm text-zinc-300">{issue.text}</span>
            </div>
          ))}
        </div>
      </div>
      {heatBreakdown && (
        <div className="p-5">
          <h3 className="font-semibold text-zinc-100 mb-4">
            Décomposition du Heat Score
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Lighthouse",
                value: heatBreakdown.lighthouseScore,
                weight: "25%",
              },
              {
                label: "SEO",
                value: heatBreakdown.seoScore,
                weight: "25%",
              },
              {
                label: "Sécurité",
                value: heatBreakdown.securityScore,
                weight: "30%",
              },
              {
                label: "Dette Technique",
                value: heatBreakdown.techDebtScore,
                weight: "20%",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-zinc-400 w-32">
                  {item.label}
                </span>
                <div className="flex-1 h-2 bg-[#27272a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${item.value}%`,
                      background:
                        item.value >= 70
                          ? "#ef4444"
                          : item.value >= 40
                            ? "#f59e0b"
                            : "#10b981",
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-zinc-300 w-12 text-right">
                  {item.value}
                </span>
                <span className="text-xs text-zinc-600 w-8">
                  ({item.weight})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SEOTab({ seo }: { seo: AuditResult["seo"] }) {
  const checks = [
    {
      label: "Titre",
      ok: !!seo.title && seo.titleLength >= 30 && seo.titleLength <= 60,
      value: seo.title
        ? `"${seo.title}" (${seo.titleLength} car.)`
        : "Manquant",
    },
    {
      label: "Meta Description",
      ok:
        !!seo.metaDescription &&
        seo.metaDescriptionLength >= 120 &&
        seo.metaDescriptionLength <= 160,
      value: seo.metaDescription
        ? `${seo.metaDescriptionLength} caractères`
        : "Manquante",
    },
    {
      label: "Balise H1",
      ok: seo.h1Count === 1,
      value: `${seo.h1Count} trouvée(s)`,
    },
    {
      label: "Images avec ALT",
      ok: seo.imgWithoutAlt === 0,
      value: `${seo.totalImages - seo.imgWithoutAlt}/${seo.totalImages}`,
    },
    { label: "Open Graph", ok: seo.hasOpenGraph, value: seo.hasOpenGraph ? "Présent" : "Absent" },
    {
      label: "Twitter Card",
      ok: seo.hasTwitterCard,
      value: seo.hasTwitterCard ? "Présente" : "Absente",
    },
    { label: "Canonical", ok: seo.hasCanonical, value: seo.hasCanonical ? "Présent" : "Absent" },
    { label: "Sitemap", ok: seo.hasSitemap, value: seo.hasSitemap ? "Trouvé" : "Absent" },
    {
      label: "Robots.txt",
      ok: seo.hasRobotsTxt,
      value: seo.hasRobotsTxt ? "Trouvé" : "Absent",
    },
  ];

  return (
    <div className="divide-y divide-[#27272a]">
      {checks.map((check) => (
        <div
          key={check.label}
          className="flex items-center justify-between px-5 py-3"
        >
          <div className="flex items-center gap-3">
            {check.ok ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <XCircle size={18} className="text-red-400" />
            )}
            <span className="text-sm text-zinc-300">{check.label}</span>
          </div>
          <span
            className={`text-sm ${check.ok ? "text-zinc-400" : "text-red-400"}`}
          >
            {check.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function TechTab({ tech }: { tech: AuditResult["techStack"] }) {
  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Framework", value: tech.framework },
          { label: "CMS", value: tech.cms },
          { label: "CSS Framework", value: tech.cssFramework },
          { label: "CDN", value: tech.cdn },
          { label: "Serveur", value: tech.server },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-[#09090b]">
            <p className="text-xs text-zinc-500 mb-1">{item.label}</p>
            <p className="text-sm text-zinc-200">
              {item.value || "Non détecté"}
            </p>
          </div>
        ))}
      </div>

      {tech.jsLibraries.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">
            Librairies JS détectées
          </h4>
          <div className="flex flex-wrap gap-2">
            {tech.jsLibraries.map((lib) => (
              <span
                key={lib}
                className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700"
              >
                {lib}
              </span>
            ))}
          </div>
        </div>
      )}

      {tech.outdatedLibraries.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={14} />
            Librairies obsolètes
          </h4>
          <div className="space-y-2">
            {tech.outdatedLibraries.map((lib, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-red-500/5 border border-red-500/10"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-zinc-200">
                    {lib.name} {lib.version}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      lib.severity === "critical"
                        ? "bg-red-500/10 text-red-400"
                        : lib.severity === "high"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {lib.severity}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{lib.issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SecurityTab({ security }: { security: AuditResult["security"] }) {
  const checks = [
    {
      label: "HTTPS",
      ok: security.https,
      detail: security.https ? "Certificat SSL actif" : "Connexion non sécurisée",
    },
    {
      label: "HSTS",
      ok: security.hsts,
      detail: security.hsts
        ? "Header HSTS présent"
        : "Protection HSTS manquante",
    },
    {
      label: "Contenu Mixte",
      ok: !security.mixedContent,
      detail: security.mixedContent
        ? "Ressources HTTP sur page HTTPS"
        : "Pas de contenu mixte",
    },
    {
      label: "X-Frame-Options",
      ok: security.xFrameOptions,
      detail: security.xFrameOptions
        ? "Protection clickjacking active"
        : "Vulnérable au clickjacking",
    },
    {
      label: "Content-Security-Policy",
      ok: security.contentSecurityPolicy,
      detail: security.contentSecurityPolicy
        ? "CSP configuré"
        : "Pas de politique CSP",
    },
    {
      label: "Librairies à jour",
      ok: security.outdatedLibraries === 0,
      detail:
        security.outdatedLibraries > 0
          ? `${security.outdatedLibraries} librairie(s) obsolète(s)`
          : "Toutes les librairies sont à jour",
    },
  ];

  const score = checks.filter((c) => c.ok).length;

  return (
    <div>
      <div className="p-5 border-b border-[#27272a] flex items-center justify-between">
        <span className="text-sm text-zinc-400">Score de sécurité</span>
        <span
          className={`text-lg font-bold ${
            score >= 5
              ? "text-emerald-400"
              : score >= 3
                ? "text-yellow-400"
                : "text-red-400"
          }`}
        >
          {score}/{checks.length}
        </span>
      </div>
      <div className="divide-y divide-[#27272a]">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex items-center justify-between px-5 py-3"
          >
            <div className="flex items-center gap-3">
              {check.ok ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <XCircle size={18} className="text-red-400" />
              )}
              <div>
                <p className="text-sm text-zinc-300">{check.label}</p>
                <p className="text-xs text-zinc-500">{check.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
