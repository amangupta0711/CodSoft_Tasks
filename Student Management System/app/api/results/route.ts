import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveExamResults, getExaminations, getStudentById } from "@/lib/db";
import { saveExamResultsSchema } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examinationId");
    let studentId = searchParams.get("studentId") || undefined;

    // Strict role check: Student can only view their own results
    if (session.role === "STUDENT") {
      const studentProfile = await getStudentById(session.studentId || session.id);
      if (!studentProfile) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }
      studentId = studentProfile.id;
    }

    const exams = await getExaminations();
    const allResults = exams.flatMap((e: any) =>
      (e.results || []).map((r: any) => ({
        ...r,
        examination: {
          id: e.id,
          name: e.name,
          term: e.term,
          academicYear: e.academicYear,
          maxMarks: e.maxMarks,
          passingMarks: e.passingMarks,
          examDate: e.examDate,
          subject: e.subject,
          class: e.class,
        },
      }))
    );

    let filtered = allResults;
    if (examId) filtered = filtered.filter((r) => r.examinationId === examId);
    if (studentId) filtered = filtered.filter((r) => r.studentId === studentId);

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json(
        { error: "Forbidden: Only teachers and administrators can enter marks" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = saveExamResultsSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await saveExamResults({
      examinationId: validated.data.examinationId,
      entries: validated.data.entries,
      gradedById: session.id,
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
