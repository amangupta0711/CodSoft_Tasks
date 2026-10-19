import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await db.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job listing not found" }, { status: 404 });
    }

    const company = await db.getCompanyById(job.companyId);
    const session = getSessionFromRequest(req);

    let hasApplied = false;
    let isSaved = false;
    let userApplication = null;

    if (session && session.role === "JOB_SEEKER") {
      const app = await db.findApplication(job.id, session.id);
      if (app) {
        hasApplied = true;
        userApplication = app;
      }
      const saved = await db.getSavedJobs(session.id);
      isSaved = saved.some((s) => s.jobId === job.id);
    }

    const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        company,
        hasApplied,
        isSaved,
        userApplication,
        isExpired,
      },
    });
  } catch (error: any) {
    console.error("Get job details error:", error);
    return NextResponse.json({ error: "Failed to retrieve job details" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const job = await db.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Enforce ownership: only the recruiter who posted it or an Admin can edit
    if (session.role === "RECRUITER" && job.recruiterId !== session.id) {
      return NextResponse.json(
        { error: "Forbidden. You can only modify your own job listings." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updated = await db.updateJob(params.id, body);

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
      job: updated,
    });
  } catch (error: any) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const job = await db.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (session.role === "RECRUITER" && job.recruiterId !== session.id) {
      return NextResponse.json(
        { error: "Forbidden. You can only delete your own job listings." },
        { status: 403 }
      );
    }

    await db.deleteJob(params.id);

    return NextResponse.json({
      success: true,
      message: "Job listing removed successfully",
    });
  } catch (error: any) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
