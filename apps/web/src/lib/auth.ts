import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fluo-super-secret-jwt-signing-key-2026";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function signJWT(payload: AuthUser): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyJWT(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: (payload.role as string) || "admin",
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(request?: Request): Promise<AuthUser | null> {
  let token: string | undefined;

  // 1. Try from cookies
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("fluo_token")?.value;
  } catch {
    // cookies() may throw outside request scope
  }

  // 2. Try from Authorization header if available
  if (!token && request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;
  return await verifyJWT(token);
}
