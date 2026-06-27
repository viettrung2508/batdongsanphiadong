"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminAuth = requireAdminAuth;
const auth_utils_js_1 = require("../modules/auth/auth.utils.js");
function requireAdminAuth(request, response, next) {
    if (!(0, auth_utils_js_1.hasValidAdminSession)(request.headers.cookie)) {
        response.status(401).json({
            message: "UNAUTHORIZED"
        });
        return;
    }
    next();
}
