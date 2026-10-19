import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Administrative access required." },
        { status: 403 }
      );
    }

    const stats = await db.getPlatformStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to load platform stats" }, { status: 500 });
  }
}
