import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.trim().toLowerCase());
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const userId = `usr-p-${Date.now()}`;
    const passwordHash = hashPassword(password);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, avatar_url, created_at)
      VALUES (?, ?, ?, 'PATIENT', ?, ?, ?, ?, ?)
    `).run(
      userId,
      email.trim().toLowerCase(),
      passwordHash,
      firstName.trim(),
      lastName.trim(),
      phone || null,
      `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
      now
    );

    db.prepare(`
      INSERT INTO patient_profiles (user_id) VALUES (?)
    `).run(userId);

    await createSession(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        role: "PATIENT",
        firstName,
        lastName,
        phone,
      },
      redirectUrl: "/patient",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed." }, { status: 500 });
  }
}
