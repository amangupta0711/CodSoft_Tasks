import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

const ToggleStatusSchema = z.object({
  userId: z.string(),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Administrative access required." },
        { status: 403 }
      );
    }

    const users = await db.getAllUsers();
    const safeUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      status: u.status,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error: any) {
    console.error("Admin users list error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Administrative access required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = ToggleStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    if (parsed.data.userId === session.id) {
      return NextResponse.json(
        { error: "Administrators cannot suspend their own account." },
        { status: 400 }
      );
    }

    const updated = await db.updateUserStatus(parsed.data.userId, parsed.data.status);

    return NextResponse.json({
      success: true,
      message: `User status changed to ${parsed.data.status}`,
      user: {
        id: updated?.id,
        name: updated?.name,
        email: updated?.email,
        status: updated?.status,
      },
    });
  } catch (error: any) {
    console.error("Admin user status update error:", error);
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
  }
}
