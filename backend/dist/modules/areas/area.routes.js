import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth.js";
import { createAreaHandler, deleteAreaHandler, listAreas, updateAreaHandler } from "./area.controller.js";
export const areaRouter = Router();
areaRouter.get("/", listAreas);
areaRouter.post("/", requireAdminAuth, createAreaHandler);
areaRouter.patch("/:id", requireAdminAuth, updateAreaHandler);
areaRouter.delete("/:id", requireAdminAuth, deleteAreaHandler);
