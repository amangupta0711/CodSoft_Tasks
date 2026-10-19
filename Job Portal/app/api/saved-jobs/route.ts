import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await db.getSavedJobs(session.id);
    const companies = await db.getAllCompanies();
    const companyMap = new Map(companies.map((c) => [c.id, c]));

    const jobs = await Promise.all(
      saved.map(async (s) => {
        const job = await db.getJobById(s.jobId);
        if (!job) return null;
        return {
          ...job,
          company: companyMap.get(job.companyId),
          savedAt: s.createdAt,
        };
      })
    );

    const validJobs = jobs.filter(Boolean);

    return NextResponse.json({
      success: true,
      count: validJobs.length,
      savedJobs: validJobs,
    });
  } catch (error: any) {
    console.error("Get saved jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch saved jobs" }, { status: 500 });
  }
}
