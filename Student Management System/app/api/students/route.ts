import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStudents, createStudent } from "@/lib/db";
import { studentSchema } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const classId = searchParams.get("classId") || undefined;
    const status = searchParams.get("status") || undefined;

    // Students can only access their own record through this endpoint if desired, or allow read list
    const students = await getStudents({ search, classId, status });
    return NextResponse.json({ success: true, data: students });
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
    const validated = studentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const student = await createStudent(validated.data);
    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
