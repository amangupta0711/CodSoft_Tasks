import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

const ApplySchema = z.object({
  coverLetter: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { error: "Please log in as a job seeker to apply for this job." },
        { status: 401 }
      );
    }

    if (session.role !== "JOB_SEEKER") {
      return NextResponse.json(
        { error: "Only registered job seekers can submit applications." },
        { status: 403 }
      );
    }

    const job = await db.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job listing not found." }, { status: 404 });
    }

    if (job.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "This job listing is closed and no longer accepting applications." },
        { status: 400 }
      );
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return NextResponse.json(
        { error: "The application deadline for this job has expired." },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await db.findApplication(job.id, session.id);
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted an application for this position." },
        { status: 409 }
      );
    }

    // Check candidate profile & resume
    const profile = await db.getSeekerProfile(session.id);
    if (!profile || !profile.resumePath) {
      return NextResponse.json(
        {
          error:
            "Please upload your resume to your candidate profile before submitting an application.",
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = ApplySchema.safeParse(body);

    const application = await db.createApplication({
      jobId: job.id,
      applicantId: session.id,
      coverLetter: parsed.success ? parsed.data.coverLetter : "",
      resumePath: profile.resumePath,
      resumeOriginalName: profile.resumeOriginalName || "Resume.pdf",
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! You can track its status in your dashboard.",
      application,
    });
  } catch (error: any) {
    console.error("Apply error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit job application" },
      { status: 500 }
    );
  }
}
