// ============================================
// API Route: Site Audit
// Lighthouse API (gratuit) + HTML Scraping + Analysis
// ============================================

import { NextRequest, NextResponse } from "next/server";
import type {
  AuditResult,
  LighthouseScores,
  SEOAnalysis,
  TechStackInfo,
  SecurityInfo,
  OutdatedLibrary,
} from "@/types";

const LIGHTHOUSE_API =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeedTest";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URL
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    // Validate URL: only allow http/https schemes to prevent SSRF
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are allowed" },
        { status: 400 }
      );
    }

    const safeUrl = parsedUrl.toString();

    // Run Lighthouse and HTML scraping in parallel
    const [lighthouseData, htmlData] = await Promise.allSettled([
      fetchLighthouseData(safeUrl),
      fetchAndAnalyzeHTML(safeUrl),
    ]);

    const lighthouse: LighthouseScores =
      lighthouseData.status === "fulfilled"
        ? lighthouseData.value
        : { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 };

    const { seo, techStack, security } =
      htmlData.status === "fulfilled"
        ? htmlData.value
        : getDefaultHTMLAnalysis();

    const result: AuditResult = {
      url: safeUrl,
      timestamp: new Date().toISOString(),
      lighthouse,
      seo,
      techStack,
      security,
      overall: Math.round(
        (lighthouse.performance +
          lighthouse.accessibility +
          lighthouse.bestPractices +
          lighthouse.seo) /
          4
      ),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json(
      { error: "Failed to audit the site" },
      { status: 500 }
    );
  }
}

// ---- Lighthouse API (Google PageSpeed Insights - 100% GRATUIT) ----

async function fetchLighthouseData(url: string): Promise<LighthouseScores> {
  const apiUrl = `${LIGHTHOUSE_API}?url=${encodeURIComponent(url)}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`;

  const response = await fetch(apiUrl, {
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`Lighthouse API failed: ${response.status}`);
  }

  const data = await response.json();
  const categories = data.lighthouseResult?.categories;

  return {
    performance: Math.round((categories?.performance?.score || 0) * 100),
    accessibility: Math.round((categories?.accessibility?.score || 0) * 100),
    bestPractices: Math.round(
      (categories?.["best-practices"]?.score || 0) * 100
    ),
    seo: Math.round((categories?.seo?.score || 0) * 100),
  };
}

// ---- HTML Scraping & Analysis (100% GRATUIT, Node.js) ----

async function fetchAndAnalyzeHTML(url: string): Promise<{
  seo: SEOAnalysis;
  techStack: TechStackInfo;
  security: SecurityInfo;
}> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; LeadGenius/1.0; +https://leadgenius.app)",
    },
  });

  const html = await response.text();
  const headers = response.headers;

  // Use cheerio for parsing
  const { load } = await import("cheerio");
  const $ = load(html);

  // SEO Analysis
  const title = $("title").text().trim();
  const metaDesc =
    $('meta[name="description"]').attr("content")?.trim() || "";
  const h1Tags = $("h1")
    .map((_, el) => $(el).text().trim())
    .get();
  const images = $("img");
  const imgWithoutAlt = images.filter(
    (_, el) => !$(el).attr("alt")?.trim()
  ).length;

  const canonical = $('link[rel="canonical"]').attr("href");
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const twitterCard = $('meta[name="twitter:card"]').attr("content");

  const hostname = new URL(url).hostname;
  let internalLinks = 0;
  let externalLinks = 0;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.startsWith("/") || href.includes(hostname)) {
      internalLinks++;
    } else if (href.startsWith("http")) {
      externalLinks++;
    }
  });

  const seo: SEOAnalysis = {
    title,
    titleLength: title.length,
    metaDescription: metaDesc,
    metaDescriptionLength: metaDesc.length,
    h1Count: h1Tags.length,
    h1Tags,
    h2Count: $("h2").length,
    imgWithoutAlt,
    totalImages: images.length,
    hasCanonical: !!canonical,
    hasRobotsTxt: false, // Checked separately
    hasSitemap: false, // Checked separately
    hasOpenGraph: !!ogTitle,
    hasTwitterCard: !!twitterCard,
    internalLinks,
    externalLinks,
    brokenLinks: [],
  };

  // Check robots.txt and sitemap
  try {
    const robotsRes = await fetch(new URL("/robots.txt", url).toString(), {
      signal: AbortSignal.timeout(5000),
    });
    seo.hasRobotsTxt = robotsRes.ok;
  } catch {
    // ignore
  }

  try {
    const sitemapRes = await fetch(new URL("/sitemap.xml", url).toString(), {
      signal: AbortSignal.timeout(5000),
    });
    seo.hasSitemap = sitemapRes.ok;
  } catch {
    // ignore
  }

  // Tech Stack Detection
  const scriptSrcs = $("script[src]")
    .map((_, el) => $(el).attr("src") || "")
    .get();
  const allScripts = html;
  const linkHrefs = $("link[href]")
    .map((_, el) => $(el).attr("href") || "")
    .get();

  const jsLibraries: string[] = [];
  const outdatedLibraries: OutdatedLibrary[] = [];

  // jQuery detection
  const jqueryMatch = allScripts.match(/jquery[.-](\d+\.\d+\.\d+)/i);
  if (
    jqueryMatch ||
    scriptSrcs.some((s) => s.includes("jquery"))
  ) {
    const version = jqueryMatch?.[1] || "unknown";
    jsLibraries.push(`jQuery ${version}`);
    if (version && version < "3.5.0") {
      outdatedLibraries.push({
        name: "jQuery",
        version,
        issue: "Vulnérabilité XSS connue (CVE-2020-11022)",
        severity: "critical",
      });
    }
  }

  // Bootstrap detection
  const bootstrapMatch = allScripts.match(/bootstrap[.-](\d+\.\d+\.\d+)/i);
  if (
    bootstrapMatch ||
    scriptSrcs.some((s) => s.includes("bootstrap")) ||
    linkHrefs.some((h) => h.includes("bootstrap"))
  ) {
    const version = bootstrapMatch?.[1] || "unknown";
    jsLibraries.push(`Bootstrap ${version}`);
    if (version && version < "4.3.1") {
      outdatedLibraries.push({
        name: "Bootstrap",
        version,
        issue: "XSS dans data-target (CVE-2018-14041)",
        severity: "high",
      });
    }
  }

  // React detection
  if (
    allScripts.includes("__NEXT_DATA__") ||
    allScripts.includes("_next/") ||
    allScripts.includes("react")
  ) {
    jsLibraries.push("React");
  }

  // Vue detection
  if (allScripts.includes("Vue") || allScripts.includes("__vue__")) {
    jsLibraries.push("Vue.js");
  }

  // Angular detection
  if (
    allScripts.includes("ng-version") ||
    allScripts.includes("angular")
  ) {
    jsLibraries.push("Angular");
  }

  // Analytics detection
  const analytics: string[] = [];
  if (
    allScripts.includes("google-analytics") ||
    allScripts.includes("gtag") ||
    allScripts.includes("ga(")
  ) {
    analytics.push("Google Analytics");
  }
  if (
    allScripts.includes("fbq(") ||
    allScripts.includes("facebook.net/en_US/fbevents")
  ) {
    analytics.push("Facebook Pixel");
  }
  if (allScripts.includes("hotjar")) {
    analytics.push("Hotjar");
  }

  // CMS detection - use hostname or distinct path patterns for accuracy
  let cms: string | null = null;
  const urlHostname = new URL(url).hostname;
  if (
    allScripts.includes("wp-content") ||
    allScripts.includes("wp-includes")
  ) {
    const wpVersion = html.match(
      /content="WordPress (\d+\.\d+\.?\d*)"/
    );
    cms = `WordPress${wpVersion ? ` ${wpVersion[1]}` : ""}`;
  } else if (allScripts.includes("Shopify")) {
    cms = "Shopify";
  } else if (
    urlHostname.endsWith(".wixsite.com") ||
    urlHostname.endsWith(".wix.com") ||
    scriptSrcs.some((s) => {
      try { return new URL(s, url).hostname.endsWith(".wix.com"); } catch { return false; }
    })
  ) {
    cms = "Wix";
  } else if (allScripts.includes("squarespace")) {
    cms = "Squarespace";
  }

  // CSS Framework
  let cssFramework: string | null = null;
  if (
    linkHrefs.some((h) => h.includes("bootstrap")) ||
    scriptSrcs.some((s) => s.includes("bootstrap"))
  ) {
    cssFramework = "Bootstrap";
  } else if (linkHrefs.some((h) => h.includes("tailwind"))) {
    cssFramework = "Tailwind CSS";
  }

  const techStack: TechStackInfo = {
    framework:
      jsLibraries.find((l) =>
        ["React", "Vue.js", "Angular"].includes(l)
      ) || null,
    cms,
    jsLibraries,
    cssFramework,
    analytics,
    cdn: null,
    server: headers.get("server"),
    outdatedLibraries,
  };

  // Security
  const security: SecurityInfo = {
    https: url.startsWith("https"),
    hsts: !!headers.get("strict-transport-security"),
    mixedContent: html.includes('src="http://') || html.includes("src='http://"),
    outdatedLibraries: outdatedLibraries.length,
    xFrameOptions: !!headers.get("x-frame-options"),
    contentSecurityPolicy: !!headers.get("content-security-policy"),
  };

  return { seo, techStack, security };
}

function getDefaultHTMLAnalysis() {
  return {
    seo: {
      title: "",
      titleLength: 0,
      metaDescription: "",
      metaDescriptionLength: 0,
      h1Count: 0,
      h1Tags: [],
      h2Count: 0,
      imgWithoutAlt: 0,
      totalImages: 0,
      hasCanonical: false,
      hasRobotsTxt: false,
      hasSitemap: false,
      hasOpenGraph: false,
      hasTwitterCard: false,
      internalLinks: 0,
      externalLinks: 0,
      brokenLinks: [],
    } satisfies SEOAnalysis,
    techStack: {
      framework: null,
      cms: null,
      jsLibraries: [],
      cssFramework: null,
      analytics: [],
      cdn: null,
      server: null,
      outdatedLibraries: [],
    } satisfies TechStackInfo,
    security: {
      https: false,
      hsts: false,
      mixedContent: false,
      outdatedLibraries: 0,
      xFrameOptions: false,
      contentSecurityPolicy: false,
    } satisfies SecurityInfo,
  };
}
