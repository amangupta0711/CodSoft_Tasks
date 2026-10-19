import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTeachers, createTeacher } from "@/lib/db";
import { teacherSchema } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const department = searchParams.get("department") || undefined;
    const status = searchParams.get("status") || undefined;

    const teachers = await getTeachers({ search, department, status });
    return NextResponse.json({ success: true, data: teachers });
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
    const validated = teacherSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const teacher = await createTeacher(validated.data);
    return NextResponse.json({ success: true, data: teacher }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
