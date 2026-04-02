import { NextResponse } from "next/server";
import { fetchLeads, createLead } from "@/lib/leads";

export async function GET() {
  const leads = await fetchLeads();
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { company, website, contactName, contactEmail, phone, status, notes } =
    body as Record<string, string | undefined>;

  if (!company) {
    return NextResponse.json(
      { error: "Le champ 'company' est requis" },
      { status: 400 }
    );
  }

  const lead = await createLead({
    company,
    website: website ?? "",
    contactName: contactName ?? "",
    contactEmail: contactEmail ?? "",
    phone,
    status: (status as "new") ?? "new",
    notes,
  });

  if (!lead) {
    return NextResponse.json(
      { error: "Impossible de créer le lead" },
      { status: 500 }
    );
  }

  return NextResponse.json(lead, { status: 201 });
}
