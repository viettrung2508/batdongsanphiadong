import type { Request, Response } from "express";

import { handleMediaUpload } from "./media.service.js";

export async function uploadMediaHandler(request: Request, response: Response) {
  const result = await handleMediaUpload(request);
  response.status(201).json(result);
}
