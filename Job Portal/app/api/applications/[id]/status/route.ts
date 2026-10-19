import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

const StatusUpdateSchema = z.object({
  status: z.enum([
    "APPLIED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "INTERVIEW",
    "HIRED",
    "REJECTED",
    "WITHDRAWN",
  ]),
  notes: z.string().optional(),
  interviewDate: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Only recruiters and administrators can update application statuses." },
        { status: 403 }
      );
    }

    const app = await db.getApplicationById(params.id);
    if (!app) {
      return NextResponse.json({ error: "Application record not found." }, { status: 404 });
    }

    // Verify ownership: recruiter must own the job this application is for
    if (session.role === "RECRUITER") {
      const job = await db.getJobById(app.jobId);
      if (!job || job.recruiterId !== session.id) {
        return NextResponse.json(
          { error: "Forbidden. You can only update applications for your own job listings." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const parsed = StatusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await db.updateApplicationStatus(
      params.id,
      parsed.data.status,
      session.id,
      parsed.data.notes,
      parsed.data.interviewDate ?? undefined
    );

    return NextResponse.json({
      success: true,
      message: `Candidate application moved to ${parsed.data.status}`,
      application: updated,
    });
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 });
  }
}
