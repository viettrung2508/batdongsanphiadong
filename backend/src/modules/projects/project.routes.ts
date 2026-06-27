import { Router } from "express";

import { requireAdminAuth } from "../../middlewares/require-admin-auth.js";
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectDetail,
  listProjects,
  updateProjectHandler
} from "./project.controller.js";

export const projectRouter = Router();

projectRouter.get("/", listProjects);
projectRouter.get("/:slug", getProjectDetail);
projectRouter.post("/", requireAdminAuth, createProjectHandler);
projectRouter.patch("/:slug", requireAdminAuth, updateProjectHandler);
projectRouter.delete("/:slug", requireAdminAuth, deleteProjectHandler);
