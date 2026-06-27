"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRentals = listRentals;
exports.getRentalDetail = getRentalDetail;
exports.createRentalHandler = createRentalHandler;
exports.updateRentalHandler = updateRentalHandler;
exports.deleteRentalHandler = deleteRentalHandler;
const zod_1 = require("zod");
const rental_service_js_1 = require("./rental.service.js");
const rental_schema_js_1 = require("./rental.schema.js");
function handleRentalError(error, response) {
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
async function listRentals(request, response) {
    const query = rental_schema_js_1.listRentalsQuerySchema.parse(request.query);
    const data = await (0, rental_service_js_1.getRentalList)(query);
    response.json({
        items: data
    });
}
async function getRentalDetail(request, response) {
    const item = await (0, rental_service_js_1.getRentalBySlug)(getSlugParam(request));
    if (!item) {
        return response.status(404).json({
            message: "Không tìm thấy sản phẩm cho thuê"
        });
    }
    response.json(item);
}
async function createRentalHandler(request, response) {
    try {
        const input = rental_schema_js_1.rentalBodySchema.parse(request.body);
        const item = await (0, rental_service_js_1.createRental)(input);
        response.status(201).json(item);
    }
    catch (error) {
        handleRentalError(error, response);
    }
}
async function updateRentalHandler(request, response) {
    try {
        const input = rental_schema_js_1.rentalBodySchema.parse(request.body);
        const item = await (0, rental_service_js_1.updateRental)(getSlugParam(request), input);
        if (!item) {
            return response.status(404).json({
                message: "Không tìm thấy sản phẩm cho thuê"
            });
        }
        response.json(item);
    }
    catch (error) {
        handleRentalError(error, response);
    }
}
async function deleteRentalHandler(request, response) {
    const deleted = await (0, rental_service_js_1.deleteRental)(getSlugParam(request));
    if (!deleted) {
        return response.status(404).json({
            message: "Không tìm thấy sản phẩm cho thuê"
        });
    }
    response.status(204).send();
}
