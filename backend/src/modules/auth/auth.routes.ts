import { Router } from "express";
import type { Request, Response } from "express";

export const authRouter = Router();

import { env } from "../../config/env.js";
import { ADMIN_SESSION_COOKIE, getAdminSessionToken, hasValidAdminSession, validateAdminCredentials } from "./auth.utils.js";

function setSessionCookie(response: Response, maxAge: number) {
  response.cookie(ADMIN_SESSION_COOKIE, getAdminSessionToken(), {
    httpOnly: true,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge
  });
}

authRouter.post("/login", (request: Request, response: Response) => {
  const username = `${request.body?.username ?? ""}`.trim();
  const password = `${request.body?.password ?? ""}`;

  if (!validateAdminCredentials(username, password)) {
    response.status(401).json({
      message: "INVALID_CREDENTIALS"
    });
    return;
  }

  setSessionCookie(response, 60 * 60 * 8 * 1000);

  response.json({
    ok: true,
    user: {
      username: env.ADMIN_USERNAME
    }
  });
});

authRouter.post("/logout", (_request: Request, response: Response) => {
  response.cookie(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  response.json({ ok: true });
});

authRouter.get("/me", (request: Request, response: Response) => {
  if (!hasValidAdminSession(request.headers.cookie)) {
    response.status(401).json({
      message: "UNAUTHORIZED"
    });
    return;
  }

  response.json({
    user: {
      username: env.ADMIN_USERNAME
    }
  });
});
