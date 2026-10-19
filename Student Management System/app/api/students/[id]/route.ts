import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStudentById, updateStudent, deleteStudent } from "@/lib/db";
import { studentSchema } from "@/lib/types";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await getStudentById(params.id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Role-based protection: Student can only view their own profile
    if (session.role === "STUDENT") {
      if (student.userId !== session.id && student.id !== session.studentId) {
        return NextResponse.json(
          { error: "Forbidden: You may only view your own student record" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const validated = studentSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateStudent(params.id, validated.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    await deleteStudent(params.id);
    return NextResponse.json({ success: true, message: "Student deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
