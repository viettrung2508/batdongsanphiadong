import type { Request, Response } from "express";
import { ZodError } from "zod";

import { createApartment, deleteApartment, getApartmentBySlug, getApartmentList, updateApartment } from "./apartment.service.js";
import { apartmentBodySchema, listApartmentsQuerySchema } from "./apartment.schema.js";

function handleApartmentError(error: unknown, response: Response) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Dữ liệu không hợp lệ",
      issues: error.flatten()
    });
  }

  if (error instanceof Error && error.message === "PROJECT_NOT_FOUND") {
    return response.status(400).json({
      message: "Dự án không tồn tại"
    });
  }

  throw error;
}

function getSlugParam(request: Request) {
  return Array.isArray(request.params.slug) ? request.params.slug[0] : request.params.slug;
}

export async function listApartments(request: Request, response: Response) {
  const query = listApartmentsQuerySchema.parse(request.query);
  const data = await getApartmentList(query);

  response.json({
    items: data
  });
}

export async function getApartmentDetail(request: Request, response: Response) {
  const item = await getApartmentBySlug(getSlugParam(request));

  if (!item) {
    return response.status(404).json({
      message: "Không tìm thấy căn hộ"
    });
  }

  response.json(item);
}

export async function createApartmentHandler(request: Request, response: Response) {
  try {
    const input = apartmentBodySchema.parse(request.body);
    const item = await createApartment(input);

    response.status(201).json(item);
  } catch (error) {
    handleApartmentError(error, response);
  }
}

export async function updateApartmentHandler(request: Request, response: Response) {
  try {
    const input = apartmentBodySchema.parse(request.body);
    const item = await updateApartment(getSlugParam(request), input);

    if (!item) {
      return response.status(404).json({
        message: "Không tìm thấy căn hộ"
      });
    }

    response.json(item);
  } catch (error) {
    handleApartmentError(error, response);
  }
}

export async function deleteApartmentHandler(request: Request, response: Response) {
  const deleted = await deleteApartment(getSlugParam(request));

  if (!deleted) {
    return response.status(404).json({
      message: "Không tìm thấy căn hộ"
    });
  }

  response.status(204).send();
}
