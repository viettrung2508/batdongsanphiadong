"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = listProjects;
exports.getProjectDetail = getProjectDetail;
exports.createProjectHandler = createProjectHandler;
exports.updateProjectHandler = updateProjectHandler;
exports.deleteProjectHandler = deleteProjectHandler;
const zod_1 = require("zod");
const project_service_js_1 = require("./project.service.js");
const project_schema_js_1 = require("./project.schema.js");
function handleProjectError(error, response) {
    if (error instanceof zod_1.ZodError) {
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
function getSlugParam(request) {
    return Array.isArray(request.params.slug) ? request.params.slug[0] : request.params.slug;
}
async function listProjects(request, response) {
    const query = project_schema_js_1.listProjectsQuerySchema.parse(request.query);
    const data = await (0, project_service_js_1.getProjectList)(query);
    response.json({
        items: data
    });
}
async function getProjectDetail(request, response) {
    const item = await (0, project_service_js_1.getProjectBySlug)(getSlugParam(request));
    if (!item) {
        return response.status(404).json({
            message: "Không tìm thấy dự án"
        });
    }
    response.json(item);
}
async function createProjectHandler(request, response) {
    try {
        const input = project_schema_js_1.projectBodySchema.parse(request.body);
        const item = await (0, project_service_js_1.createProject)(input);
        response.status(201).json(item);
    }
    catch (error) {
        handleProjectError(error, response);
    }
}
async function updateProjectHandler(request, response) {
    try {
        const input = project_schema_js_1.projectBodySchema.parse(request.body);
        const item = await (0, project_service_js_1.updateProject)(getSlugParam(request), input);
        if (!item) {
            return response.status(404).json({
                message: "Không tìm thấy dự án"
            });
        }
        response.json(item);
    }
    catch (error) {
        handleProjectError(error, response);
    }
}
async function deleteProjectHandler(request, response) {
    const deleted = await (0, project_service_js_1.deleteProject)(getSlugParam(request));
    if (!deleted) {
        return response.status(404).json({
            message: "Không tìm thấy dự án"
        });
    }
    response.status(204).send();
}
