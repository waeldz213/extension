// ============================================
// API Route: Smart Pitcher
// Generates 3 pitch variants based on audit data
// Uses Claude API if key is available, otherwise local templates
// ============================================

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, companyName } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    let domain: string;
    try {
      domain = new URL(normalizedUrl).hostname;
    } catch {
      domain = normalizedUrl;
    }

    const name = companyName || domain;

    // Check if Claude API key is available
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (anthropicKey) {
      const pitches = await generateWithClaude(anthropicKey, normalizedUrl, name);
      return NextResponse.json({ pitches });
    }

    // Fallback: local template-based generation (100% gratuit)
    const pitches = generateLocalPitches(normalizedUrl, name);
    return NextResponse.json({ pitches });
  } catch (error) {
    console.error("Pitch generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate pitches" },
      { status: 500 }
    );
  }
}

async function generateWithClaude(
  apiKey: string,
  url: string,
  companyName: string
) {
  const prompt = `Tu es un expert en prospection commerciale pour une agence web.
Generate 3 prospection emails for ${companyName} (site: ${url}).
Each email: max 150 words, professional, in French.
3 styles: aggressive (urgent, shocking stats), empathetic (kind, helpful), expert (technical).
Reply ONLY in JSON: {"aggressive":"...","empathetic":"...","expert":"..."}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "{}";

  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse Claude response");
  }
}

function generateLocalPitches(url: string, companyName: string) {
  let domain: string;
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  return {
    aggressive: [
      `Objet : ${domain} perd des clients chaque jour`,
      "",
      "Bonjour,",
      "",
      `J'ai analys\u00e9 ${domain} et les r\u00e9sultats sont pr\u00e9occupants :`,
      "",
      "\uD83D\uDD34 Votre site met trop de temps \u00e0 charger \u2014 chaque seconde co\u00fbte 7% de conversions",
      "\uD83D\uDD34 Plusieurs probl\u00e8mes de s\u00e9curit\u00e9 d\u00e9tect\u00e9s",
      "\uD83D\uDD34 Le r\u00e9f\u00e9rencement naturel n'est pas optimis\u00e9",
      "",
      "Vos concurrents qui ont corrig\u00e9 ces probl\u00e8mes ont vu leur trafic augmenter de 60%.",
      "",
      `Je suis sp\u00e9cialis\u00e9 dans l'optimisation de sites comme celui de ${companyName}.`,
      "",
      "Disponible pour un appel de 15 min cette semaine ?",
      "",
      "Cordialement",
    ].join("\n"),

    empathetic: [
      `Objet : Quelques suggestions pour ${domain}`,
      "",
      "Bonjour,",
      "",
      `En d\u00e9couvrant le site de ${companyName}, j'ai remarqu\u00e9 qu'il a beaucoup de potentiel.`,
      "",
      "Quelques ajustements pourraient faire la diff\u00e9rence :",
      "\u2022 La vitesse de chargement pourrait \u00eatre am\u00e9lior\u00e9e",
      "\u2022 Quelques optimisations SEO aideraient votre visibilit\u00e9 Google",
      "\u2022 De petits ajustements de s\u00e9curit\u00e9 renforceraient la confiance",
      "",
      "Ce sont des am\u00e9liorations courantes et r\u00e9alisables.",
      "",
      "Seriez-vous ouvert \u00e0 en discuter bri\u00e8vement ? Sans engagement.",
      "",
      "Belle journ\u00e9e",
    ].join("\n"),

    expert: [
      `Objet : Audit technique de ${domain}`,
      "",
      "Bonjour,",
      "",
      `J'ai r\u00e9alis\u00e9 une analyse technique de ${domain}. Points critiques :`,
      "",
      "PERFORMANCE",
      "- Temps de chargement au-dessus des recommandations Google (>3.8s)",
      "- Optimisation des images et du cache \u00e0 revoir",
      "",
      "S\u00c9CURIT\u00c9",
      "- V\u00e9rification des headers de s\u00e9curit\u00e9 recommand\u00e9e",
      "- Mise \u00e0 jour des librairies JavaScript conseill\u00e9e",
      "",
      "SEO",
      "- Optimisation des balises meta \u00e0 compl\u00e9ter",
      "- Structure des headings \u00e0 revoir",
      "",
      "Je propose un plan de rem\u00e9diation en 3 phases.",
      "",
      "Disponible pour un call technique de 20 min ?",
      "",
      "Cordialement",
    ].join("\n"),
  };
}
