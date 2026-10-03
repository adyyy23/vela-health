import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { User, UserRole } from "@/types";

const SESSION_COOKIE_NAME = "vela_session_token";
const SESSION_MAX_AGE_DAYS = 30;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_DAYS * 86400000,
  ).toISOString();

  db.prepare(
    `
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `,
  ).run(
    `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    token,
    expiresAt,
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_DAYS * 86400,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const db = getDb();
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const db = getDb();
    const row = db
      .prepare(
        `
      SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.phone, u.avatar_url, u.created_at, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
    `,
      )
      .get(token) as
      | {
          id: string;
          email: string;
          role: UserRole;
          first_name: string;
          last_name: string;
          phone: string;
          avatar_url: string;
          created_at: string;
          expires_at: string;
        }
      | undefined;

    if (!row) return null;

    if (new Date(row.expires_at) < new Date()) {
      db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      role: row.role,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
    };
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect(`/${user.role.toLowerCase()}`);
  }
  return user;
}
