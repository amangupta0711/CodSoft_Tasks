import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const stats = await db.stats.getAdminDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    const status = error.message.includes("Forbidden") || error.message.includes("Unauthorized") ? 403 : 500;
    return NextResponse.json({ error: error.message || "Failed to load admin stats" }, { status });
  }
}
