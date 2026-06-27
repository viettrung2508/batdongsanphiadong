import type { NextFunction, Request, Response } from "express";

import { hasValidAdminSession } from "../modules/auth/auth.utils.js";

export function requireAdminAuth(request: Request, response: Response, next: NextFunction) {
  if (!hasValidAdminSession(request.headers.cookie)) {
    response.status(401).json({
      message: "UNAUTHORIZED"
    });
    return;
  }

  next();
}
