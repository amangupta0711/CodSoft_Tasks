import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const JWT_SECRET =
  process.env.JWT_SECRET || "careerhub-production-jwt-session-secret-key-2026-codsoft-task3";
export const COOKIE_NAME = "careerhub_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "JOB_SEEKER" | "RECRUITER" | "ADMIN";
  avatar?: string | null;
  status: "ACTIVE" | "SUSPENDED";
  companyId?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      companyId: user.companyId,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): SessionUser | null {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      // Check Authorization header as fallback
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        return verifyToken(authHeader.substring(7));
      }
      return null;
    }
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };
}
