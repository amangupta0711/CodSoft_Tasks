import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { hashPassword, signToken, setSessionCookie, SessionUser } from "@/lib/auth";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["JOB_SEEKER", "RECRUITER"]),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  companyIndustry: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, password, role, phone, companyName, companyIndustry } = parsed.data;

    // Check if user already exists
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await db.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || null,
      avatar: null,
      status: "ACTIVE",
    });

    let companyId: string | null = null;

    if (role === "RECRUITER") {
      // Create or assign company
      const cName = companyName?.trim() || `${name}'s Organization`;
      const slug = cName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.random().toString(36).substring(2, 6);
      const company = await db.createCompany({
        name: cName,
        slug,
        industry: companyIndustry || "Technology",
        description: `Company profile for ${cName}`,
        location: "India / Global",
        website: "https://example.com",
        logo: null,
        size: "10 - 50 employees",
        foundedYear: new Date().getFullYear(),
      });
      companyId = company.id;
      await db.upsertRecruiterProfile(newUser.id, companyId, "Talent Acquisition Lead");
    } else {
      // Initialize blank candidate profile
      await db.upsertSeekerProfile(newUser.id, {
        headline: "Aspiring Professional",
        bio: "",
        location: "",
        skills: "",
        education: [],
        experience: [],
      });
    }

    const sessionUser: SessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
      status: newUser.status,
      companyId,
    };

    const token = signToken(sessionUser);
    const cookieConfig = setSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: sessionUser,
    });

    response.cookies.set(cookieConfig.name, cookieConfig.value, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: cookieConfig.maxAge,
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register account" },
      { status: 500 }
    );
  }
}
