import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  createLandListing,
  deleteLandListing,
  getLandListingBySlug,
  getLandListingList,
  updateLandListing
} from "./land-listing.service.js";
import { landListingBodySchema, listLandListingsQuerySchema } from "./land-listing.schema.js";

function handleLandListingError(error: unknown, response: Response) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Dữ liệu không hợp lệ",
      issues: error.flatten()
    });
  }

  if (error instanceof Error && error.message === "AREA_NOT_FOUND") {
    return response.status(400).json({
      message: "Khu vực không tồn tại"
    });
  }

  throw error;
}

function getSlugParam(request: Request) {
  return Array.isArray(request.params.slug) ? request.params.slug[0] : request.params.slug;
}

export async function listLandListings(request: Request, response: Response) {
  const query = listLandListingsQuerySchema.parse(request.query);
  const data = await getLandListingList(query);

  response.json({
    items: data
  });
}

export async function getLandListingDetail(request: Request, response: Response) {
  const item = await getLandListingBySlug(getSlugParam(request));

  if (!item) {
    return response.status(404).json({
      message: "Không tìm thấy đất nền"
    });
  }

  response.json(item);
}

export async function createLandListingHandler(request: Request, response: Response) {
  try {
    const input = landListingBodySchema.parse(request.body);
    const item = await createLandListing(input);

    response.status(201).json(item);
  } catch (error) {
    handleLandListingError(error, response);
  }
}

export async function updateLandListingHandler(request: Request, response: Response) {
  try {
    const input = landListingBodySchema.parse(request.body);
    const item = await updateLandListing(getSlugParam(request), input);

    if (!item) {
      return response.status(404).json({
        message: "Không tìm thấy đất nền"
      });
    }

    response.json(item);
  } catch (error) {
    handleLandListingError(error, response);
  }
}

export async function deleteLandListingHandler(request: Request, response: Response) {
  const deleted = await deleteLandListing(getSlugParam(request));

  if (!deleted) {
    return response.status(404).json({
      message: "Không tìm thấy đất nền"
    });
  }

  response.status(204).send();
}
