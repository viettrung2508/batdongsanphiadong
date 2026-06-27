import { Router } from "express";

import { requireAdminAuth } from "../../middlewares/require-admin-auth.js";
import {
  createLandListingHandler,
  deleteLandListingHandler,
  getLandListingDetail,
  listLandListings,
  updateLandListingHandler
} from "./land-listing.controller.js";

export const landListingRouter = Router();

landListingRouter.get("/", listLandListings);
landListingRouter.get("/:slug", getLandListingDetail);
landListingRouter.post("/", requireAdminAuth, createLandListingHandler);
landListingRouter.patch("/:slug", requireAdminAuth, updateLandListingHandler);
landListingRouter.delete("/:slug", requireAdminAuth, deleteLandListingHandler);
