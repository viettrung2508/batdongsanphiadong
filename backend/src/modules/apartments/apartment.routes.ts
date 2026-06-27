import { Router } from "express";

import { requireAdminAuth } from "../../middlewares/require-admin-auth.js";
import {
  createApartmentHandler,
  deleteApartmentHandler,
  getApartmentDetail,
  listApartments,
  updateApartmentHandler
} from "./apartment.controller.js";

export const apartmentRouter = Router();

apartmentRouter.get("/", listApartments);
apartmentRouter.get("/:slug", getApartmentDetail);
apartmentRouter.post("/", requireAdminAuth, createApartmentHandler);
apartmentRouter.patch("/:slug", requireAdminAuth, updateApartmentHandler);
apartmentRouter.delete("/:slug", requireAdminAuth, deleteApartmentHandler);
