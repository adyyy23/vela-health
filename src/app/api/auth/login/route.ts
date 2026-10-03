import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password ||
      email.length > 254 ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const db = getDb();
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email.trim().toLowerCase()) as any;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const isMatch = verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    await createSession(user.id);

    // Determine redirect
    let redirectUrl = "/patient";
    if (user.role === "DOCTOR") redirectUrl = "/doctor";
    if (user.role === "ADMIN") redirectUrl = "/admin";

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatarUrl: user.avatar_url,
      },
      redirectUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Authentication error." },
      { status: 500 },
    );
  }
}
