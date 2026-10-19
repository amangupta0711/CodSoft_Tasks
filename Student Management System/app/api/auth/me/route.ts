import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const fullUser = await getUserById(session.id);
    return NextResponse.json({
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        avatar: session.avatar,
        student: fullUser?.student || null,
        teacher: fullUser?.teacher || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
