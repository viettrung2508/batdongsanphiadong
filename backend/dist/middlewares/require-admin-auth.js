import { hasValidAdminSession } from "../modules/auth/auth.utils.js";
export function requireAdminAuth(request, response, next) {
    if (!hasValidAdminSession(request.headers.cookie)) {
        response.status(401).json({
            message: "UNAUTHORIZED"
        });
        return;
    }
    next();
}
