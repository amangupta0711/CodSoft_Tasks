import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "JOB_SEEKER") {
      return NextResponse.json(
        { error: "Please log in as a job seeker to bookmark jobs." },
        { status: 401 }
      );
    }

    const job = await db.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const isSaved = await db.toggleSaveJob(job.id, session.id);

    return NextResponse.json({
      success: true,
      isSaved,
      message: isSaved ? "Job saved to your bookmarks" : "Job removed from bookmarks",
    });
  } catch (error: any) {
    console.error("Save job error:", error);
    return NextResponse.json({ error: "Failed to bookmark job" }, { status: 500 });
  }
}
