import Link from "next/link";
import {
  Zap,
  Search,
  MessageSquare,
  Columns3,
  ArrowRight,
  Shield,
  Gauge,
  Brain,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-y-auto">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">LeadGenius</span>
        </div>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-all"
        >
          Lancer l&apos;app →
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-sm mb-8">
          <Brain size={14} />
          Propuls&eacute; par l&apos;IA Deep Analysis
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
          Trouvez des clients avec{" "}
          <span className="gradient-text">l&apos;IA qui analyse vraiment</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
          LeadGenius audite les sites de vos prospects, d&eacute;tecte leurs failles
          techniques, et g&eacute;n&egrave;re des pitchs personnalis&eacute;s qui convertissent.
          Pas du texte g&eacute;n&eacute;rique &mdash; de l&apos;analyse r&eacute;elle.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-medium text-lg transition-all"
          >
            Commencer gratuitement
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/auditor"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-zinc-700 hover:border-zinc-500 rounded-xl font-medium text-lg text-zinc-300 transition-all"
          >
            Tester l&apos;Auditor
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          4 modules, z&eacute;ro complexit&eacute;
        </h2>
        <p className="text-zinc-500 text-center mb-12 max-w-xl mx-auto">
          Tout est faisable en 3 clics max. Design Apple-like, IA qui fait le
          gros du travail.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: Search,
              title: "Site Auditor",
              desc: "Collez une URL, obtenez un rapport complet en 30s. SEO, performance, s\u00e9curit\u00e9, tech stack.",
              color: "indigo",
              href: "/auditor",
            },
            {
              icon: MessageSquare,
              title: "Smart Pitcher",
              desc: "3 variantes d'emails g\u00e9n\u00e9r\u00e9es par IA bas\u00e9es sur les failles r\u00e9elles du site prospect.",
              color: "purple",
              href: "/pitcher",
            },
            {
              icon: Columns3,
              title: "CRM Kanban",
              desc: "Glissez vos prospects de 'Contact\u00e9' \u00e0 'Sign\u00e9'. Simple, visuel, efficace.",
              color: "emerald",
              href: "/kanban",
            },
            {
              icon: Gauge,
              title: "Heat Score IA",
              desc: "Chaque lead re\u00e7oit un score de 0 \u00e0 100 bas\u00e9 sur les probl\u00e8mes d\u00e9tect\u00e9s. Priorisez les plus chauds.",
              color: "orange",
              href: "/dashboard",
            },
          ].map((feature) => {
            const Icon = feature.icon;
            const colorClasses: Record<string, string> = {
              indigo: "border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5",
              purple: "border-purple-500/20 hover:border-purple-500/40 bg-purple-500/5",
              emerald: "border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5",
              orange: "border-orange-500/20 hover:border-orange-500/40 bg-orange-500/5",
            };
            const iconClasses: Record<string, string> = {
              indigo: "bg-indigo-500/10 text-indigo-400",
              purple: "bg-purple-500/10 text-purple-400",
              emerald: "bg-emerald-500/10 text-emerald-400",
              orange: "bg-orange-500/10 text-orange-400",
            };
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className={`group rounded-xl border p-6 transition-all ${colorClasses[feature.color]}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconClasses[feature.color]}`}
                >
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Differentiator */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-indigo-400" />
            <h2 className="text-2xl font-bold">
              L&apos;IA Deep &mdash; Notre avantage
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-red-400 mb-3 uppercase tracking-wider">
                Concurrents (IA g&eacute;n&eacute;rique)
              </h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>&quot;Bonjour, j&apos;ai vu votre site et j&apos;aimerais...&quot;</li>
                <li>&quot;Am&eacute;liorez votre pr&eacute;sence en ligne...&quot;</li>
                <li>&quot;Nous proposons des services web...&quot;</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-emerald-400 mb-3 uppercase tracking-wider">
                LeadGenius (IA Deep)
              </h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>
                  &quot;Votre site utilise jQuery 1.12.4 &mdash; faille XSS critique
                  (CVE-2020-11022)&quot;
                </li>
                <li>
                  &quot;Performance 32/100 sur Lighthouse &mdash; vous perdez 40% de
                  visiteurs&quot;
                </li>
                <li>
                  &quot;Pas de HTTPS &mdash; Google p&eacute;nalise activement votre
                  r&eacute;f&eacute;rencement&quot;
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Pr&ecirc;t &agrave; prospecter intelligemment ?</h2>
        <p className="text-zinc-400 mb-8">
          100% gratuit pour commencer. Pas de carte bancaire.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-medium text-lg transition-all"
        >
          Lancer LeadGenius
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6 text-center text-sm text-zinc-600">
        &copy; 2026 LeadGenius. Fait avec Next.js, Tailwind CSS et l&apos;IA.
      </footer>
    </div>
  );
}
