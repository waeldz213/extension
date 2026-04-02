import { NextResponse } from "next/server";
import { fetchLeadById, updateLead, deleteLead } from "@/lib/leads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lead = await fetchLeadById(id);

  if (!lead) {
    return NextResponse.json({ error: "Lead introuvable" }, { status: 404 });
  }

  return NextResponse.json(lead);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updated = await updateLead(id, body);

  if (!updated) {
    return NextResponse.json(
      { error: "Impossible de modifier le lead" },
      { status: 500 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteLead(id);

  if (!ok) {
    return NextResponse.json(
      { error: "Impossible de supprimer le lead" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
