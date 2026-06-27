import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env.js";
export const ADMIN_SESSION_COOKIE = "whitespace_admin_session";
function safeEqual(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }
    return timingSafeEqual(leftBuffer, rightBuffer);
}
export function getAdminSessionToken() {
    return createHash("sha256").update(`${env.ADMIN_USERNAME}:${env.ADMIN_AUTH_SECRET}`).digest("hex");
}
export function validateAdminCredentials(username, password) {
    return safeEqual(username, env.ADMIN_USERNAME) && safeEqual(password, env.ADMIN_PASSWORD);
}
export function readSessionCookie(cookieHeader) {
    if (!cookieHeader) {
        return "";
    }
    const cookieEntry = cookieHeader
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`));
    if (!cookieEntry) {
        return "";
    }
    return decodeURIComponent(cookieEntry.slice(`${ADMIN_SESSION_COOKIE}=`.length));
}
export function hasValidAdminSession(cookieHeader) {
    const sessionCookie = readSessionCookie(cookieHeader);
    if (!sessionCookie) {
        return false;
    }
    return safeEqual(sessionCookie, getAdminSessionToken());
}
