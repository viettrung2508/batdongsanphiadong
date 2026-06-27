"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_SESSION_COOKIE = void 0;
exports.getAdminSessionToken = getAdminSessionToken;
exports.validateAdminCredentials = validateAdminCredentials;
exports.readSessionCookie = readSessionCookie;
exports.hasValidAdminSession = hasValidAdminSession;
const node_crypto_1 = require("node:crypto");
const env_js_1 = require("../../config/env.js");
exports.ADMIN_SESSION_COOKIE = "whitespace_admin_session";
function safeEqual(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }
    return (0, node_crypto_1.timingSafeEqual)(leftBuffer, rightBuffer);
}
function getAdminSessionToken() {
    return (0, node_crypto_1.createHash)("sha256").update(`${env_js_1.env.ADMIN_USERNAME}:${env_js_1.env.ADMIN_AUTH_SECRET}`).digest("hex");
}
function validateAdminCredentials(username, password) {
    return safeEqual(username, env_js_1.env.ADMIN_USERNAME) && safeEqual(password, env_js_1.env.ADMIN_PASSWORD);
}
function readSessionCookie(cookieHeader) {
    if (!cookieHeader) {
        return "";
    }
    const cookieEntry = cookieHeader
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${exports.ADMIN_SESSION_COOKIE}=`));
    if (!cookieEntry) {
        return "";
    }
    return decodeURIComponent(cookieEntry.slice(`${exports.ADMIN_SESSION_COOKIE}=`.length));
}
function hasValidAdminSession(cookieHeader) {
    const sessionCookie = readSessionCookie(cookieHeader);
    if (!sessionCookie) {
        return false;
    }
    return safeEqual(sessionCookie, getAdminSessionToken());
}
