"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
exports.authRouter = (0, express_1.Router)();
const env_js_1 = require("../../config/env.js");
const auth_utils_js_1 = require("./auth.utils.js");
function setSessionCookie(response, maxAge) {
    response.cookie(auth_utils_js_1.ADMIN_SESSION_COOKIE, (0, auth_utils_js_1.getAdminSessionToken)(), {
        httpOnly: true,
        sameSite: env_js_1.env.NODE_ENV === "production" ? "none" : "lax",
        secure: env_js_1.env.NODE_ENV === "production",
        path: "/",
        maxAge
    });
}
exports.authRouter.post("/login", (request, response) => {
    const username = `${request.body?.username ?? ""}`.trim();
    const password = `${request.body?.password ?? ""}`;
    if (!(0, auth_utils_js_1.validateAdminCredentials)(username, password)) {
        response.status(401).json({
            message: "INVALID_CREDENTIALS"
        });
        return;
    }
    setSessionCookie(response, 60 * 60 * 8 * 1000);
    response.json({
        ok: true,
        user: {
            username: env_js_1.env.ADMIN_USERNAME
        }
    });
});
exports.authRouter.post("/logout", (_request, response) => {
    response.cookie(auth_utils_js_1.ADMIN_SESSION_COOKIE, "", {
        httpOnly: true,
        sameSite: env_js_1.env.NODE_ENV === "production" ? "none" : "lax",
        secure: env_js_1.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0
    });
    response.json({ ok: true });
});
exports.authRouter.get("/me", (request, response) => {
    if (!(0, auth_utils_js_1.hasValidAdminSession)(request.headers.cookie)) {
        response.status(401).json({
            message: "UNAUTHORIZED"
        });
        return;
    }
    response.json({
        user: {
            username: env_js_1.env.ADMIN_USERNAME
        }
    });
});
