// ============================================
// API Route: Heat Score Calculator
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { calculateHeatScore } from "@/lib/heat-score";
import type { AuditResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const audit: AuditResult = await request.json();

    if (!audit || !audit.lighthouse) {
      return NextResponse.json(
        { error: "Valid audit data is required" },
        { status: 400 }
      );
    }

    const breakdown = calculateHeatScore(audit);

    return NextResponse.json({
      score: breakdown.total,
      breakdown,
    });
  } catch (error) {
    console.error("Heat score error:", error);
    return NextResponse.json(
      { error: "Failed to calculate heat score" },
      { status: 500 }
    );
  }
}
