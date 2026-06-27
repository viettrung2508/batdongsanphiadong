import { Router } from "express";

import { uploadMediaHandler } from "./media.controller.js";

export const mediaRouter = Router();

mediaRouter.post("/upload", uploadMediaHandler);
