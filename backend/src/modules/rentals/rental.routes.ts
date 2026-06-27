import { Router } from "express";

import { requireAdminAuth } from "../../middlewares/require-admin-auth.js";
import {
  createRentalHandler,
  deleteRentalHandler,
  getRentalDetail,
  listRentals,
  updateRentalHandler
} from "./rental.controller.js";

export const rentalRouter = Router();

rentalRouter.get("/", listRentals);
rentalRouter.get("/:slug", getRentalDetail);
rentalRouter.post("/", requireAdminAuth, createRentalHandler);
rentalRouter.patch("/:slug", requireAdminAuth, updateRentalHandler);
rentalRouter.delete("/:slug", requireAdminAuth, deleteRentalHandler);
