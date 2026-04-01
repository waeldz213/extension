"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import {
  Swords,
  Heart,
  GraduationCap,
  Copy,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";

const pitchStyles = [
  {
    id: "aggressive" as const,
    label: "Agressif",
    icon: Swords,
    color: "red",
    description: "Direct, chiffres choc, urgence",
  },
  {
    id: "empathetic" as const,
    label: "Empathique",
    icon: Heart,
    color: "pink",
    description: "Bienveillant, compréhensif, progressif",
  },
  {
    id: "expert" as const,
    label: "Expert",
    icon: GraduationCap,
    color: "blue",
    description: "Technique, précis, professionnel",
  },
];

// Mock pitch generation
function generateMockPitch(
  style: "aggressive" | "empathetic" | "expert",
  url: string
): string {
  const domain = url ? new URL(url).hostname : "votre-site.fr";

  const pitches = {
    aggressive: `Objet : ${domain} perd 40% de son trafic — voici pourquoi

Bonjour,

Je viens d'analyser ${domain} et les résultats sont alarmants :

🔴 Score Performance : 32/100 — Chaque seconde de chargement vous coûte 7% de conversions
🔴 Pas de HTTPS — Google vous pénalise activement dans les résultats de recherche
🔴 jQuery 1.12.4 — Faille de sécurité critique (CVE-2020-11022) exploitable par n'importe qui
🔴 8 images sans ALT — Google ne peut pas les indexer

Vos concurrents qui ont corrigé ces problèmes ont vu leur trafic augmenter de 60% en moyenne.

Je peux corriger tout ça en 2 semaines.

Disponible pour un appel de 15 min cette semaine ?

Cordialement`,

    empathetic: `Objet : Quelques idées pour améliorer ${domain}

Bonjour,

En naviguant sur ${domain}, j'ai remarqué que votre site a beaucoup de potentiel, mais quelques ajustements techniques pourraient vraiment faire la différence.

Par exemple :
• La vitesse de chargement pourrait être améliorée (actuellement 32/100 sur Lighthouse)
• L'ajout d'un certificat SSL (HTTPS) renforcerait la confiance de vos visiteurs
• Quelques optimisations d'images aideraient le référencement naturel

Ce sont des améliorations assez courantes et tout à fait réalisables. Beaucoup de mes clients ont vu des résultats positifs rapidement après ces ajustements.

Seriez-vous ouvert à en discuter brièvement ? Je serais ravi de vous partager quelques recommandations personnalisées, sans engagement.

Belle journée`,

    expert: `Objet : Audit technique de ${domain} — Rapport synthétique

Bonjour,

J'ai réalisé un audit technique de ${domain} via Lighthouse et une analyse du code source. Voici les points critiques identifiés :

PERFORMANCE (32/100)
- Time to Interactive : >5s (recommandé : <3.8s)
- Largest Contentful Paint : non optimisé
- Pas de lazy loading sur les images

SÉCURITÉ
- Protocole HTTP (pas de TLS/SSL)
- jQuery 1.12.4 : vulnérable au XSS (CVE-2020-11022)
- Bootstrap 3.3.7 : CVE-2018-14041
- Pas de Content-Security-Policy header
- Pas de X-Frame-Options (vulnérable au clickjacking)

SEO
- Meta description absente
- Pas de balise H1
- 8/12 images sans attribut alt
- Pas de sitemap.xml ni robots.txt

STACK TECHNIQUE
- WordPress 5.2 (non maintenu, multiples CVE)
- Apache 2.4.29 (mise à jour recommandée)

Je propose un plan de remédiation en 3 phases : sécurité (semaine 1), performance (semaine 2), SEO (semaine 3).

Disponible pour un call technique de 20 min ?

Cordialement`,
  };

  return pitches[style];
}

function PitcherContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const [url, setUrl] = useState(initialUrl);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pitches, setPitches] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);

    try {
      const response = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, companyName }),
      });

      if (response.ok) {
        const data = await response.json();
        setPitches(data.pitches);
      } else {
        throw new Error("API failed");
      }
    } catch {
      // Fallback to local generation
      await new Promise((r) => setTimeout(r, 1500));
      const validUrl = url.startsWith("http") ? url : `https://${url}`;
      setPitches({
        aggressive: generateMockPitch("aggressive", validUrl),
        empathetic: generateMockPitch("empathetic", validUrl),
        expert: generateMockPitch("expert", validUrl),
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <TopBar title="Smart Pitcher" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Input */}
        <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-1">
            Générer des emails de prospection
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            3 variantes générées par IA basées sur l&apos;audit du site
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
            />
            <input
              type="text"
              placeholder="Nom de l'entreprise (optionnel)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !url}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Génération IA en cours...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Générer 3 Pitches
              </>
            )}
          </button>
        </div>

        {/* Pitch Cards */}
        {Object.keys(pitches).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {pitchStyles.map((style) => {
              const Icon = style.icon;
              const pitch = pitches[style.id];
              if (!pitch) return null;

              const colorMap: Record<string, string> = {
                red: "border-red-500/20 hover:border-red-500/40",
                pink: "border-pink-500/20 hover:border-pink-500/40",
                blue: "border-blue-500/20 hover:border-blue-500/40",
              };

              const iconColorMap: Record<string, string> = {
                red: "text-red-400 bg-red-500/10",
                pink: "text-pink-400 bg-pink-500/10",
                blue: "text-blue-400 bg-blue-500/10",
              };

              return (
                <div
                  key={style.id}
                  className={`rounded-xl border bg-[#18181b] transition-all ${colorMap[style.color]}`}
                >
                  <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColorMap[style.color]}`}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {style.label}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {style.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(pitch, style.id)}
                      className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                    >
                      {copiedId === style.id ? (
                        <Check size={16} className="text-emerald-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {pitch}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function PitcherPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center h-screen">
          <Loader2 size={32} className="animate-spin text-indigo-400" />
        </div>
      }
    >
      <PitcherContent />
    </Suspense>
  );
}
