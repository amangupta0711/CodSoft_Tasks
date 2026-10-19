import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const stats = await db.getRecruiterStats(session.id);
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    console.error("Recruiter stats error:", error);
    return NextResponse.json({ error: "Failed to load recruiter statistics" }, { status: 500 });
  }
}
