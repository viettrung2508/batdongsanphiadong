import type { Request, Response } from "express";

import { ZodError } from "zod";

import { areaBodySchema } from "./area.schema.js";
import { createArea, deleteArea, getAreaList, isPrismaKnownError, updateArea } from "./area.service.js";

function handleAreaError(error: unknown, response: Response) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Dữ liệu không hợp lệ",
      issues: error.flatten()
    });
  }

  if (isPrismaKnownError(error) && error.code === "P2002") {
    return response.status(400).json({
      message: "Tên hoặc slug khu vực đã tồn tại"
    });
  }

  if (isPrismaKnownError(error) && error.code === "P2003") {
    return response.status(400).json({
      message: "Không thể xóa khu vực đang được sử dụng trong dữ liệu khác"
    });
  }

  throw error;
}

function getIdParam(request: Request) {
  return Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
}

export async function listAreas(_request: Request, response: Response) {
  const items = await getAreaList();

  response.json({
    items
  });
}

export async function createAreaHandler(request: Request, response: Response) {
  try {
    const input = areaBodySchema.parse(request.body);
    const item = await createArea(input);

    response.status(201).json(item);
  } catch (error) {
    handleAreaError(error, response);
  }
}

export async function updateAreaHandler(request: Request, response: Response) {
  try {
    const input = areaBodySchema.parse(request.body);
    const item = await updateArea(getIdParam(request), input);

    if (!item) {
      return response.status(404).json({
        message: "Không tìm thấy khu vực"
      });
    }

    response.json(item);
  } catch (error) {
    handleAreaError(error, response);
  }
}

export async function deleteAreaHandler(request: Request, response: Response) {
  try {
    const deleted = await deleteArea(getIdParam(request));

    if (!deleted) {
      return response.status(404).json({
        message: "Không tìm thấy khu vực"
      });
    }

    response.status(204).send();
  } catch (error) {
    handleAreaError(error, response);
  }
}
