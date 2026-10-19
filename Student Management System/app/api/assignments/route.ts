import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createTeacherAssignment } from "@/lib/db";
import { teacherAssignmentSchema } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const validated = teacherAssignmentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const assignment = await createTeacherAssignment(validated.data);
    return NextResponse.json({ success: true, data: assignment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
