import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

const CompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  size: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recProfile = await db.getRecruiterProfile(session.id);
    const companyId = recProfile?.companyId || session.companyId;

    if (!companyId) {
      return NextResponse.json({ company: null });
    }

    const company = await db.getCompanyById(companyId);
    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    console.error("Get company error:", error);
    return NextResponse.json({ error: "Failed to load company" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CompanySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    let recProfile = await db.getRecruiterProfile(session.id);
    let companyId = recProfile?.companyId;

    if (!companyId) {
      const slug =
        parsed.data.name.toLowerCase().replace(/[^a-z0-9]/g, "-") +
        "-" +
        Math.random().toString(36).substring(2, 6);
      const newCompany = await db.createCompany({
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        industry: parsed.data.industry || null,
        website: parsed.data.website || null,
        location: parsed.data.location || null,
        size: parsed.data.size || null,
        logo: parsed.data.logo || null,
        foundedYear: new Date().getFullYear(),
      });
      await db.upsertRecruiterProfile(session.id, newCompany.id);
      return NextResponse.json({
        success: true,
        message: "Company created successfully",
        company: newCompany,
      });
    }

    const updated = await db.updateCompany(companyId, {
      name: parsed.data.name,
      description: parsed.data.description,
      industry: parsed.data.industry,
      website: parsed.data.website,
      location: parsed.data.location,
      size: parsed.data.size,
      logo: parsed.data.logo,
    });

    return NextResponse.json({
      success: true,
      message: "Company profile updated successfully",
      company: updated,
    });
  } catch (error: any) {
    console.error("Update company error:", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}
