import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";
import { hashPassword, signJWT } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existing = fluoStore.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = fluoStore.createUser(
      name || email.split("@")[0],
      email,
      passwordHash,
      "admin"
    );

    const token = await signJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set("fluo_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
