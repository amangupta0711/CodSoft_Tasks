import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "dinedesk-ultra-secure-jwt-secret-key-32charsmin-2026";
export const SESSION_COOKIE_NAME = "dinedesk_session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  phone?: string | null;
}

export function signToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = verifyToken(token);
  if (!session) return null;

  // Verify user still exists in database
  const user = await db.user.findById(session.id);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to continue");
  }
  return user;
}

export async function requireRole(allowedRoles: ("CUSTOMER" | "STAFF" | "ADMIN")[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: You do not have permission to access this resource");
  }
  return user;
}
