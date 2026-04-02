"use client";

import { useState, useCallback } from "react";
import TopBar from "@/components/layout/TopBar";
import { HeatBadge } from "@/components/ui/ScoreRing";
import { mockLeads } from "@/lib/mock-data";
import { KANBAN_COLUMNS, type Lead, type KanbanStatus } from "@/types";
import {
  GripVertical,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Globe,
  X,
} from "lucide-react";

export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanStatus | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const getColumnLeads = useCallback(
    (status: KanbanStatus) => leads.filter((l) => l.status === status),
    [leads]
  );

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: KanbanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: KanbanStatus) => {
    e.preventDefault();
    if (!draggedLead) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === draggedLead.id
          ? { ...l, status: newStatus, updatedAt: new Date().toISOString() }
          : l
      )
    );
    setDraggedLead(null);
    setDragOverColumn(null);
  };

  const handleAddLead = (newLead: Partial<Lead>) => {
    const lead: Lead = {
      id: Date.now().toString(),
      company: newLead.company || "Nouvelle entreprise",
      website: newLead.website || "",
      contactName: newLead.contactName || "",
      contactEmail: newLead.contactEmail || "",
      phone: newLead.phone,
      heatScore: 0,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: newLead.notes,
    };
    setLeads((prev) => [...prev, lead]);
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <TopBar title="CRM Kanban" />

      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-500">
            {leads.length} leads au total •{" "}
            {leads.filter((l) => l.status === "signed").length} signés
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-all"
          >
            <Plus size={16} />
            Nouveau Lead
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 min-w-max pb-4">
          {KANBAN_COLUMNS.map((column) => {
            const columnLeads = getColumnLeads(column.id);
            const isDragOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className={`w-72 flex-shrink-0 rounded-xl border transition-all ${
                  isDragOver
                    ? "border-indigo-500/50 bg-indigo-500/5"
                    : "border-[#27272a] bg-[#18181b]/50"
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="text-sm font-medium text-zinc-300">
                      {column.label}
                    </span>
                    <span className="text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                      {columnLeads.length}
                    </span>
                  </div>
                  <button className="p-1 rounded text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-all">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 min-h-[200px]">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onClick={() => setSelectedLead(lead)}
                      className={`group rounded-lg border border-[#27272a] bg-[#18181b] p-3 cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-all ${
                        draggedLead?.id === lead.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical
                            size={14}
                            className="text-zinc-700 group-hover:text-zinc-500"
                          />
                          <span className="text-sm font-medium text-zinc-200 truncate max-w-[180px]">
                            {lead.company}
                          </span>
                        </div>
                      </div>

                      <div className="ml-6 space-y-1.5">
                        <p className="text-xs text-zinc-500 truncate">
                          {lead.contactName}
                        </p>
                        {lead.website && (
                          <p className="text-xs text-zinc-600 truncate">
                            {lead.website}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <HeatBadge score={lead.heatScore} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-sm text-zinc-700 border border-dashed border-zinc-800 rounded-lg">
                      Déposer ici
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Lead Modal */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLead}
        />
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

function AddLeadModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (lead: Partial<Lead>) => void;
}) {
  const [form, setForm] = useState({
    company: "",
    website: "",
    contactName: "",
    contactEmail: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-xl border border-[#27272a] bg-[#18181b] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
          <h3 className="font-semibold text-zinc-100">Nouveau Lead</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            {
              key: "company",
              label: "Entreprise *",
              type: "text",
              required: true,
            },
            { key: "website", label: "Site web", type: "url", required: false },
            {
              key: "contactName",
              label: "Nom du contact",
              type: "text",
              required: false,
            },
            {
              key: "contactEmail",
              label: "Email",
              type: "email",
              required: false,
            },
            {
              key: "phone",
              label: "Téléphone",
              type: "tel",
              required: false,
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm text-zinc-400 mb-1 block">
                {field.label}
              </label>
              <input
                type={field.type}
                required={field.required}
                value={form[field.key as keyof typeof form]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-[#09090b] border border-[#27272a] rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all text-sm"
              />
            </div>
          ))}
          <textarea
            placeholder="Notes..."
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-2.5 bg-[#09090b] border border-[#27272a] rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all text-sm resize-none"
          />
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#27272a] rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-all text-sm"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LeadDetailModal({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 rounded-xl border border-[#27272a] bg-[#18181b] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
          <h3 className="font-semibold text-zinc-100">{lead.company}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <HeatBadge score={lead.heatScore} size="lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-[#09090b]">
              <p className="text-xs text-zinc-500 mb-1">Contact</p>
              <p className="text-sm text-zinc-200">{lead.contactName || "—"}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#09090b]">
              <p className="text-xs text-zinc-500 mb-1">Statut</p>
              <p className="text-sm text-zinc-200 capitalize">
                {KANBAN_COLUMNS.find((c) => c.id === lead.status)?.label || lead.status}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {lead.contactEmail && (
              <a
                href={`mailto:${lead.contactEmail}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#09090b] hover:bg-zinc-800 transition-all"
              >
                <Mail size={16} className="text-zinc-500" />
                <span className="text-sm text-zinc-300">
                  {lead.contactEmail}
                </span>
              </a>
            )}
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#09090b] hover:bg-zinc-800 transition-all"
              >
                <Phone size={16} className="text-zinc-500" />
                <span className="text-sm text-zinc-300">{lead.phone}</span>
              </a>
            )}
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-[#09090b] hover:bg-zinc-800 transition-all"
              >
                <Globe size={16} className="text-zinc-500" />
                <span className="text-sm text-zinc-300">{lead.website}</span>
              </a>
            )}
          </div>

          {lead.notes && (
            <div className="p-3 rounded-lg bg-[#09090b]">
              <p className="text-xs text-zinc-500 mb-1">Notes</p>
              <p className="text-sm text-zinc-300">{lead.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <a
              href={`/auditor?url=${encodeURIComponent(lead.website)}`}
              className="flex-1 px-4 py-2.5 border border-[#27272a] rounded-lg text-zinc-300 hover:text-indigo-300 hover:border-indigo-500/30 text-center transition-all text-sm"
            >
              Auditer le site
            </a>
            <a
              href={`/pitcher?url=${encodeURIComponent(lead.website)}`}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium text-center transition-all text-sm"
            >
              Générer un Pitch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
