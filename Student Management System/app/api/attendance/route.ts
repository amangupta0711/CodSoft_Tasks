import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAttendance, saveAttendance, getStudentById } from "@/lib/db";
import { saveAttendanceSchema } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId") || undefined;
    const date = searchParams.get("date") || undefined;
    let studentId = searchParams.get("studentId") || undefined;

    // Strict role check: Student can ONLY view their own attendance
    if (session.role === "STUDENT") {
      const studentProfile = await getStudentById(session.studentId || session.id);
      if (!studentProfile) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }
      studentId = studentProfile.id;
    }

    const attendanceRecords = await getAttendance({ classId, date, studentId });
    return NextResponse.json({ success: true, data: attendanceRecords });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json(
        { error: "Forbidden: Only teachers and administrators can mark attendance" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = saveAttendanceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await saveAttendance({
      classId: validated.data.classId,
      date: validated.data.date,
      records: validated.data.records,
      markedById: session.id,
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
