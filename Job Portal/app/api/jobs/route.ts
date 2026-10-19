import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

const CreateJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  responsibilities: z.string().min(10, "Responsibilities are required"),
  requirements: z.string().min(10, "Requirements are required"),
  skills: z.string().min(2, "At least one skill required"),
  category: z.string().default("Engineering"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"]),
  experienceLevel: z.enum(["ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "LEAD_EXECUTIVE"]),
  workArrangement: z.enum(["REMOTE", "HYBRID", "ON_SITE"]),
  location: z.string().min(2, "Location is required"),
  salaryMin: z.number().nullable().optional(),
  salaryMax: z.number().nullable().optional(),
  salaryCurrency: z.string().default("INR"),
  deadline: z.string().nullable().optional(),
  featured: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const employmentType = searchParams.get("employmentType") || undefined;
    const workArrangement = searchParams.get("workArrangement") || undefined;
    const experienceLevel = searchParams.get("experienceLevel") || undefined;
    const location = searchParams.get("location") || undefined;
    const status = searchParams.get("status") || undefined;
    const recruiterId = searchParams.get("recruiterId") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const jobs = await db.getAllJobs({
      query,
      category,
      employmentType,
      workArrangement,
      experienceLevel,
      location,
      status,
      recruiterId,
      sort,
    });

    const companies = await db.getAllCompanies();
    const companyMap = new Map(companies.map((c) => [c.id, c]));

    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        const apps = await db.getApplicationsForJob(job.id);
        return {
          ...job,
          company: companyMap.get(job.companyId) || {
            name: "Enterprise Partner",
            logo: null,
            location: job.location,
          },
          applicationCount: apps.length,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: enrichedJobs.length,
      jobs: enrichedJobs,
    });
  } catch (error: any) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job listings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Only recruiters can post job listings." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = CreateJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    // Determine recruiter company
    let companyId = session.companyId;
    if (!companyId) {
      const rec = await db.getRecruiterProfile(session.id);
      companyId = rec?.companyId || null;
    }

    if (!companyId) {
      const companies = await db.getAllCompanies();
      companyId = companies[0]?.id || "comp-techcorp";
    }

    const slug =
      parsed.data.title.toLowerCase().replace(/[^a-z0-9]/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 6);

    const newJob = await db.createJob({
      title: parsed.data.title,
      slug,
      companyId,
      recruiterId: session.id,
      description: parsed.data.description,
      responsibilities: parsed.data.responsibilities,
      requirements: parsed.data.requirements,
      skills: parsed.data.skills,
      category: parsed.data.category,
      employmentType: parsed.data.employmentType,
      experienceLevel: parsed.data.experienceLevel,
      workArrangement: parsed.data.workArrangement,
      location: parsed.data.location,
      salaryMin: parsed.data.salaryMin ?? null,
      salaryMax: parsed.data.salaryMax ?? null,
      salaryCurrency: parsed.data.salaryCurrency,
      deadline: parsed.data.deadline ?? null,
      status: "PUBLISHED",
      featured: parsed.data.featured,
    });

    return NextResponse.json({
      success: true,
      message: "Job listing published successfully",
      job: newJob,
    });
  } catch (error: any) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create job listing" },
      { status: 500 }
    );
  }
}
