import path from "node:path";
import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json());

  if (process.env.VERCEL !== "1") {
    app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
  }

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}
