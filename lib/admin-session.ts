import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "whitespace_admin_session";

function getRequiredEnvValue(name: "ADMIN_USERNAME" | "ADMIN_PASSWORD" | "ADMIN_AUTH_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name}_MISSING`);
  }

  return value;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminSessionToken() {
  return createHash("sha256")
    .update(`${getRequiredEnvValue("ADMIN_USERNAME")}:${getRequiredEnvValue("ADMIN_AUTH_SECRET")}`)
    .digest("hex");
}

export function validateAdminCredentials(username: string, password: string) {
  return safeEqual(username, getRequiredEnvValue("ADMIN_USERNAME")) && safeEqual(password, getRequiredEnvValue("ADMIN_PASSWORD"));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return false;
  }

  return safeEqual(sessionCookie, getAdminSessionToken());
}
