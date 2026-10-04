import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone } =
      await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    if (
      ![firstName, lastName, email, password].every(
        (v) => typeof v === "string",
      ) ||
      !firstName.trim() ||
      !lastName.trim() ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      password.length < 12 ||
      password.length > 128 ||
      firstName.length > 80 ||
      lastName.length > 80 ||
      email.length > 254 ||
      (phone !== undefined && (typeof phone !== "string" || phone.length > 50))
    ) {
      return NextResponse.json(
        {
          error:
            "Enter valid names, email and a password of 12–128 characters.",
        },
        { status: 400 },
      );
    }
    const db = getDb();
    const existing = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email.trim().toLowerCase());
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 },
      );
    }

    const userId = `usr-p-${randomUUID()}`;
    const passwordHash = hashPassword(password);
    const now = new Date().toISOString();

    await db
      .transaction(async () => {
        await db
          .prepare(
            `
      INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, avatar_url, created_at)
      VALUES (?, ?, ?, 'PATIENT', ?, ?, ?, ?, ?)
    `,
          )
          .run(
            userId,
            email.trim().toLowerCase(),
            passwordHash,
            firstName.trim(),
            lastName.trim(),
            phone || null,
            null,
            now,
          );

        await db
          .prepare(
            `
      INSERT INTO patient_profiles (user_id) VALUES (?)
    `,
          )
          .run(userId);
      })
      .immediate();

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
    return NextResponse.json(
      { error: "Registration could not be completed. Please try again." },
      { status: 500 },
    );
  }
}
