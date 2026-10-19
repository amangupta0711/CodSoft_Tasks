import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Refresh user data from db
  const user = await db.findUserById(session.id);
  if (!user || user.status === "SUSPENDED") {
    return NextResponse.json({ user: null });
  }

  let company = null;
  if (user.role === "RECRUITER") {
    const recProfile = await db.getRecruiterProfile(user.id);
    if (recProfile?.companyId) {
      company = await db.getCompanyById(recProfile.companyId);
    }
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      company,
    },
  });
}
