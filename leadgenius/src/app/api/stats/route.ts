import { NextResponse } from "next/server";
import { fetchDashboardStats } from "@/lib/leads";

export async function GET() {
  const stats = await fetchDashboardStats();
  return NextResponse.json(stats);
}
