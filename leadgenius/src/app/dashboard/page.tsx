"use client";

import {
  Users,
  Flame,
  Send,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { StatCard, HeatBadge } from "@/components/ui/ScoreRing";
import { mockLeads, mockDashboardStats } from "@/lib/mock-data";
import Link from "next/link";

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const topLeads = [...mockLeads]
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, 5);

  const recentActivity = [
    {
      id: 1,
      text: 'Audit complété pour "Restaurant Le Parisien"',
      time: "Il y a 2h",
      type: "audit",
    },
    {
      id: 2,
      text: 'Email envoyé à "Plomberie Martin"',
      time: "Il y a 5h",
      type: "email",
    },
    {
      id: 3,
      text: 'RDV pris avec "Boulangerie Leclerc"',
      time: "Hier",
      type: "meeting",
    },
    {
      id: 4,
      text: 'Nouveau lead ajouté: "Auto-École Conduite+"',
      time: "Hier",
      type: "new",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <TopBar title="Command Center" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Leads"
            value={stats.totalLeads}
            change="+3 cette semaine"
            icon={Users}
            color="indigo"
          />
          <StatCard
            label="Leads Chauds"
            value={stats.hotLeads}
            change="+2 aujourd'hui"
            icon={Flame}
            color="orange"
          />
          <StatCard
            label="Contactés Aujourd'hui"
            value={stats.contactedToday}
            icon={Send}
            color="green"
          />
          <StatCard
            label="Taux de Conversion"
            value={`${stats.conversionRate}%`}
            change="+2.3%"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Leads - Takes 2 columns */}
          <div className="lg:col-span-2 rounded-xl border border-[#27272a] bg-[#18181b] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a]">
              <h2 className="font-semibold text-zinc-100 flex items-center gap-2">
                <Flame size={18} className="text-orange-400" />
                Top Leads par Heat Score
              </h2>
              <Link
                href="/kanban"
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Voir tout <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-[#27272a]">
              {topLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#1f1f23] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {lead.company}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-zinc-500 truncate">
                        {lead.website}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <HeatBadge score={lead.heatScore} size="sm" />
                    <Link
                      href={`/auditor?url=${encodeURIComponent(lead.website)}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-[#27272a] bg-[#18181b] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#27272a]">
              <h2 className="font-semibold text-zinc-100">Activité Récente</h2>
            </div>
            <div className="divide-y divide-[#27272a]">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="px-5 py-3 hover:bg-[#1f1f23] transition-colors"
                >
                  <p className="text-sm text-zinc-300">{activity.text}</p>
                  <p className="text-xs text-zinc-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/auditor"
            className="group rounded-xl border border-[#27272a] bg-[#18181b] p-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <ExternalLink size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors">
                Auditer un Site
              </h3>
            </div>
            <p className="text-sm text-zinc-500">
              Analyse SEO, performance et sécurité en 30 secondes
            </p>
          </Link>

          <Link
            href="/pitcher"
            className="group rounded-xl border border-[#27272a] bg-[#18181b] p-5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Send size={20} className="text-purple-400" />
              </div>
              <h3 className="font-medium text-zinc-200 group-hover:text-purple-300 transition-colors">
                Générer un Pitch
              </h3>
            </div>
            <p className="text-sm text-zinc-500">
              3 variantes d&apos;emails basées sur l&apos;audit IA
            </p>
          </Link>

          <Link
            href="/kanban"
            className="group rounded-xl border border-[#27272a] bg-[#18181b] p-5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users size={20} className="text-emerald-400" />
              </div>
              <h3 className="font-medium text-zinc-200 group-hover:text-emerald-300 transition-colors">
                Gérer les Leads
              </h3>
            </div>
            <p className="text-sm text-zinc-500">
              CRM visuel avec drag &amp; drop
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
