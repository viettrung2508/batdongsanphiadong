import type { Request, Response } from "express";

import { ZodError } from "zod";

import { createProject, deleteProject, getProjectBySlug, getProjectList, updateProject } from "./project.service.js";
import { listProjectsQuerySchema, projectBodySchema } from "./project.schema.js";

function handleProjectError(error: unknown, response: Response) {
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

export async function listProjects(request: Request, response: Response) {
  const query = listProjectsQuerySchema.parse(request.query);
  const data = await getProjectList(query);

  response.json({
    items: data
  });
}

export async function getProjectDetail(request: Request, response: Response) {
  const item = await getProjectBySlug(getSlugParam(request));

  if (!item) {
    return response.status(404).json({
      message: "Không tìm thấy dự án"
    });
  }

  response.json(item);
}

export async function createProjectHandler(request: Request, response: Response) {
  try {
    const input = projectBodySchema.parse(request.body);
    const item = await createProject(input);

    response.status(201).json(item);
  } catch (error) {
    handleProjectError(error, response);
  }
}

export async function updateProjectHandler(request: Request, response: Response) {
  try {
    const input = projectBodySchema.parse(request.body);
    const item = await updateProject(getSlugParam(request), input);

    if (!item) {
      return response.status(404).json({
        message: "Không tìm thấy dự án"
      });
    }

    response.json(item);
  } catch (error) {
    handleProjectError(error, response);
  }
}

export async function deleteProjectHandler(request: Request, response: Response) {
  const deleted = await deleteProject(getSlugParam(request));

  if (!deleted) {
    return response.status(404).json({
      message: "Không tìm thấy dự án"
    });
  }

  response.status(204).send();
}
