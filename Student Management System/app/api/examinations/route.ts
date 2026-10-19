import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getExaminations, createExamination } from "@/lib/db";
import { examinationSchema } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId") || undefined;
    const subjectId = searchParams.get("subjectId") || undefined;

    const exams = await getExaminations({ classId, subjectId });
    return NextResponse.json({ success: true, data: exams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json(
        { error: "Forbidden: Only teachers and administrators can create examinations" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = examinationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const exam = await createExamination({
      ...validated.data,
      createdById: session.id,
    });

    return NextResponse.json({ success: true, data: exam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
