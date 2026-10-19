import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const app = await db.getApplicationById(params.id);
    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Verify candidate owns this application
    if (app.applicantId !== session.id) {
      return NextResponse.json(
        { error: "Forbidden. You can only withdraw your own applications." },
        { status: 403 }
      );
    }

    if (app.status === "HIRED") {
      return NextResponse.json(
        { error: "Hired applications cannot be withdrawn online. Please contact the recruiter directly." },
        { status: 400 }
      );
    }

    if (app.status === "WITHDRAWN") {
      return NextResponse.json(
        { error: "This application has already been withdrawn." },
        { status: 400 }
      );
    }

    const updated = await db.updateApplicationStatus(
      params.id,
      "WITHDRAWN",
      session.id,
      "Application withdrawn by applicant."
    );

    return NextResponse.json({
      success: true,
      message: "Application withdrawn successfully.",
      application: updated,
    });
  } catch (error: any) {
    console.error("Withdraw error:", error);
    return NextResponse.json({ error: "Failed to withdraw application" }, { status: 500 });
  }
}
