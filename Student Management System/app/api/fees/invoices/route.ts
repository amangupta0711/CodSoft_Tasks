import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFeeInvoices, createFeeInvoice, getStudentById } from "@/lib/db";
import { feeInvoiceSchema } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    let studentId = searchParams.get("studentId") || undefined;

    // Strict role check: Student can only view their own fee records
    if (session.role === "STUDENT") {
      const studentProfile = await getStudentById(session.studentId || session.id);
      if (!studentProfile) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }
      studentId = studentProfile.id;
    }

    const invoices = await getFeeInvoices({ studentId, status });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const validated = feeInvoiceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const invoice = await createFeeInvoice(validated.data);
    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
