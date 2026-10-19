import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { ResumeStorageService } from "@/lib/storage";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "JOB_SEEKER") {
      return NextResponse.json(
        { error: "Unauthorized. Please log in as a job seeker to upload resumes." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded. Please select a PDF resume." },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get previous resume to clean up if replacing
    const currentProfile = await db.getSeekerProfile(session.id);
    const oldResumePath = currentProfile?.resumePath;

    // Save new resume
    const uploadResult = await ResumeStorageService.saveResume(
      buffer,
      file.name,
      file.type || "application/pdf"
    );

    // Delete old resume file if exists
    if (oldResumePath && oldResumePath !== "alex_rivera_resume.pdf" && oldResumePath !== "sarah_chen_resume.pdf") {
      await ResumeStorageService.deleteResume(oldResumePath);
    }

    // Update profile
    const updated = await db.upsertSeekerProfile(session.id, {
      resumePath: uploadResult.storedFileName,
      resumeOriginalName: uploadResult.originalFileName,
      resumeUploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully!",
      resume: {
        fileName: uploadResult.storedFileName,
        originalName: uploadResult.originalFileName,
        size: uploadResult.size,
        uploadedAt: updated.resumeUploadedAt,
      },
    });
  } catch (error: any) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process resume upload" },
      { status: 400 }
    );
  }
}
