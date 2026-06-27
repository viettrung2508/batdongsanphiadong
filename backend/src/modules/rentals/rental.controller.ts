import type { Request, Response } from "express";
import { ZodError } from "zod";

import { createRental, deleteRental, getRentalBySlug, getRentalList, updateRental } from "./rental.service.js";
import { listRentalsQuerySchema, rentalBodySchema } from "./rental.schema.js";

function handleRentalError(error: unknown, response: Response) {
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

export async function listRentals(request: Request, response: Response) {
  const query = listRentalsQuerySchema.parse(request.query);
  const data = await getRentalList(query);

  response.json({
    items: data
  });
}

export async function getRentalDetail(request: Request, response: Response) {
  const item = await getRentalBySlug(getSlugParam(request));

  if (!item) {
    return response.status(404).json({
      message: "Không tìm thấy sản phẩm cho thuê"
    });
  }

  response.json(item);
}

export async function createRentalHandler(request: Request, response: Response) {
  try {
    const input = rentalBodySchema.parse(request.body);
    const item = await createRental(input);

    response.status(201).json(item);
  } catch (error) {
    handleRentalError(error, response);
  }
}

export async function updateRentalHandler(request: Request, response: Response) {
  try {
    const input = rentalBodySchema.parse(request.body);
    const item = await updateRental(getSlugParam(request), input);

    if (!item) {
      return response.status(404).json({
        message: "Không tìm thấy sản phẩm cho thuê"
      });
    }

    response.json(item);
  } catch (error) {
    handleRentalError(error, response);
  }
}

export async function deleteRentalHandler(request: Request, response: Response) {
  const deleted = await deleteRental(getSlugParam(request));

  if (!deleted) {
    return response.status(404).json({
      message: "Không tìm thấy sản phẩm cho thuê"
    });
  }

  response.status(204).send();
}
