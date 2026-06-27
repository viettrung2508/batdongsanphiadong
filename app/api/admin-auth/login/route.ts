import { NextRequest, NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, getAdminSessionToken, validateAdminCredentials } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | {
        username?: unknown;
        password?: unknown;
      }
    | null;

  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ message: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    user: {
      username
    }
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: getAdminSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
