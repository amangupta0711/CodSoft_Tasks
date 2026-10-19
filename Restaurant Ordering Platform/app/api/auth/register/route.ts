import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { signToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = parsed.data;

    // Check if email already registered
    const existing = await db.user.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      name,
      email,
      passwordHash,
      phone,
      role: "CUSTOMER",
    });

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    };

    const token = signToken(sessionUser);

    const res = NextResponse.json({
      success: true,
      user: sessionUser,
      message: "Account created successfully!",
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 });
  }
}
