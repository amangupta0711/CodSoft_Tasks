import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { ResumeStorageService } from "@/lib/storage";
import db from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please authenticate to download candidate documents." },
        { status: 401 }
      );
    }

    const requestedFile = decodeURIComponent(params.id);

    // 1. Check if caller is Admin
    let isAuthorized = session.role === "ADMIN";

    // 2. Check if caller is candidate themselves
    if (!isAuthorized && session.role === "JOB_SEEKER") {
      const profile = await db.getSeekerProfile(session.id);
      if (profile && profile.resumePath === requestedFile) {
        isAuthorized = true;
      }
    }

    // 3. Check if caller is a Recruiter who received an application with this resume
    if (!isAuthorized && session.role === "RECRUITER") {
      const myJobs = await db.getAllJobs({ recruiterId: session.id });
      const myJobIds = new Set(myJobs.map((j) => j.id));

      // Check all applications to this recruiter's jobs
      for (const job of myJobs) {
        const apps = await db.getApplicationsForJob(job.id);
        const match = apps.find(
          (a) => a.resumePath === requestedFile || a.id === requestedFile
        );
        if (match) {
          isAuthorized = true;
          break;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error:
            "Access Denied. You do not have permission to view or download this candidate's resume.",
        },
        { status: 403 }
      );
    }

    // Retrieve file safely
    const { buffer, exists } = await ResumeStorageService.getResume(requestedFile);

    if (!exists) {
      return NextResponse.json(
        { error: "Requested resume file was not found in storage." },
        { status: 404 }
      );
    }

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${requestedFile}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      { error: "Internal server error downloading resume." },
      { status: 500 }
    );
  }
}
