import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

const ProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.string().optional(),
  phone: z.string().optional(),
  portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedInUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  gitHubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  education: z.array(z.any()).optional(),
  experience: z.array(z.any()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId") || session.id;

    // Authorization: User can view their own profile. Recruiters and Admins can view candidates who applied.
    if (targetUserId !== session.id && session.role === "JOB_SEEKER") {
      return NextResponse.json(
        { error: "Forbidden. You cannot view other candidates' private profiles." },
        { status: 403 }
      );
    }

    const user = await db.findUserById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await db.getSeekerProfile(targetUserId);

    return NextResponse.json({
      success: true,
      profile: {
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        headline: profile?.headline || "",
        bio: profile?.bio || "",
        location: profile?.location || "",
        skills: profile?.skills || "",
        portfolioUrl: profile?.portfolioUrl || "",
        linkedInUrl: profile?.linkedInUrl || "",
        gitHubUrl: profile?.gitHubUrl || "",
        resumePath: profile?.resumePath || null,
        resumeOriginalName: profile?.resumeOriginalName || null,
        resumeUploadedAt: profile?.resumeUploadedAt || null,
        education: profile?.education || [],
        experience: profile?.experience || [],
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Failed to load candidate profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "JOB_SEEKER") {
      return NextResponse.json(
        { error: "Unauthorized. Only candidates can edit candidate profiles." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = ProfileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    // Update base user details if provided
    if (parsed.data.name || parsed.data.phone) {
      const user = await db.findUserById(session.id);
      if (user) {
        if (parsed.data.name) user.name = parsed.data.name;
        if (parsed.data.phone) user.phone = parsed.data.phone;
      }
    }

    // Upsert candidate profile
    const updated = await db.upsertSeekerProfile(session.id, {
      headline: parsed.data.headline,
      bio: parsed.data.bio,
      location: parsed.data.location,
      skills: parsed.data.skills,
      portfolioUrl: parsed.data.portfolioUrl,
      linkedInUrl: parsed.data.linkedInUrl,
      gitHubUrl: parsed.data.gitHubUrl,
      education: parsed.data.education,
      experience: parsed.data.experience,
    });

    return NextResponse.json({
      success: true,
      message: "Candidate profile updated successfully",
      profile: updated,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
