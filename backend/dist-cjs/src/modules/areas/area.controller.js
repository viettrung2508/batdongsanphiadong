"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAreas = listAreas;
exports.createAreaHandler = createAreaHandler;
exports.updateAreaHandler = updateAreaHandler;
exports.deleteAreaHandler = deleteAreaHandler;
const zod_1 = require("zod");
const area_schema_js_1 = require("./area.schema.js");
const area_service_js_1 = require("./area.service.js");
function handleAreaError(error, response) {
    if (error instanceof zod_1.ZodError) {
        return response.status(400).json({
            message: "Dữ liệu không hợp lệ",
            issues: error.flatten()
        });
    }
    if ((0, area_service_js_1.isPrismaKnownError)(error) && error.code === "P2002") {
        return response.status(400).json({
            message: "Tên hoặc slug khu vực đã tồn tại"
        });
    }
    if ((0, area_service_js_1.isPrismaKnownError)(error) && error.code === "P2003") {
        return response.status(400).json({
            message: "Không thể xóa khu vực đang được sử dụng trong dữ liệu khác"
        });
    }
    throw error;
}
function getIdParam(request) {
    return Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
}
async function listAreas(_request, response) {
    const items = await (0, area_service_js_1.getAreaList)();
    response.json({
        items
    });
}
async function createAreaHandler(request, response) {
    try {
        const input = area_schema_js_1.areaBodySchema.parse(request.body);
        const item = await (0, area_service_js_1.createArea)(input);
        response.status(201).json(item);
    }
    catch (error) {
        handleAreaError(error, response);
    }
}
async function updateAreaHandler(request, response) {
    try {
        const input = area_schema_js_1.areaBodySchema.parse(request.body);
        const item = await (0, area_service_js_1.updateArea)(getIdParam(request), input);
        if (!item) {
            return response.status(404).json({
                message: "Không tìm thấy khu vực"
            });
        }
        response.json(item);
    }
    catch (error) {
        handleAreaError(error, response);
    }
}
async function deleteAreaHandler(request, response) {
    try {
        const deleted = await (0, area_service_js_1.deleteArea)(getIdParam(request));
        if (!deleted) {
            return response.status(404).json({
                message: "Không tìm thấy khu vực"
            });
        }
        response.status(204).send();
    }
    catch (error) {
        handleAreaError(error, response);
    }
}
