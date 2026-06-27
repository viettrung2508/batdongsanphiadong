"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listApartments = listApartments;
exports.getApartmentDetail = getApartmentDetail;
exports.createApartmentHandler = createApartmentHandler;
exports.updateApartmentHandler = updateApartmentHandler;
exports.deleteApartmentHandler = deleteApartmentHandler;
const zod_1 = require("zod");
const apartment_service_js_1 = require("./apartment.service.js");
const apartment_schema_js_1 = require("./apartment.schema.js");
function handleApartmentError(error, response) {
    if (error instanceof zod_1.ZodError) {
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
function getSlugParam(request) {
    return Array.isArray(request.params.slug) ? request.params.slug[0] : request.params.slug;
}
async function listApartments(request, response) {
    const query = apartment_schema_js_1.listApartmentsQuerySchema.parse(request.query);
    const data = await (0, apartment_service_js_1.getApartmentList)(query);
    response.json({
        items: data
    });
}
async function getApartmentDetail(request, response) {
    const item = await (0, apartment_service_js_1.getApartmentBySlug)(getSlugParam(request));
    if (!item) {
        return response.status(404).json({
            message: "Không tìm thấy căn hộ"
        });
    }
    response.json(item);
}
async function createApartmentHandler(request, response) {
    try {
        const input = apartment_schema_js_1.apartmentBodySchema.parse(request.body);
        const item = await (0, apartment_service_js_1.createApartment)(input);
        response.status(201).json(item);
    }
    catch (error) {
        handleApartmentError(error, response);
    }
}
async function updateApartmentHandler(request, response) {
    try {
        const input = apartment_schema_js_1.apartmentBodySchema.parse(request.body);
        const item = await (0, apartment_service_js_1.updateApartment)(getSlugParam(request), input);
        if (!item) {
            return response.status(404).json({
                message: "Không tìm thấy căn hộ"
            });
        }
        response.json(item);
    }
    catch (error) {
        handleApartmentError(error, response);
    }
}
async function deleteApartmentHandler(request, response) {
    const deleted = await (0, apartment_service_js_1.deleteApartment)(getSlugParam(request));
    if (!deleted) {
        return response.status(404).json({
            message: "Không tìm thấy căn hộ"
        });
    }
    response.status(204).send();
}
