"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLandListings = listLandListings;
exports.getLandListingDetail = getLandListingDetail;
exports.createLandListingHandler = createLandListingHandler;
exports.updateLandListingHandler = updateLandListingHandler;
exports.deleteLandListingHandler = deleteLandListingHandler;
const zod_1 = require("zod");
const land_listing_service_js_1 = require("./land-listing.service.js");
const land_listing_schema_js_1 = require("./land-listing.schema.js");
function handleLandListingError(error, response) {
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
async function listLandListings(request, response) {
    const query = land_listing_schema_js_1.listLandListingsQuerySchema.parse(request.query);
    const data = await (0, land_listing_service_js_1.getLandListingList)(query);
    response.json({
        items: data
    });
}
async function getLandListingDetail(request, response) {
    const item = await (0, land_listing_service_js_1.getLandListingBySlug)(getSlugParam(request));
    if (!item) {
        return response.status(404).json({
            message: "Không tìm thấy đất nền"
        });
    }
    response.json(item);
}
async function createLandListingHandler(request, response) {
    try {
        const input = land_listing_schema_js_1.landListingBodySchema.parse(request.body);
        const item = await (0, land_listing_service_js_1.createLandListing)(input);
        response.status(201).json(item);
    }
    catch (error) {
        handleLandListingError(error, response);
    }
}
async function updateLandListingHandler(request, response) {
    try {
        const input = land_listing_schema_js_1.landListingBodySchema.parse(request.body);
        const item = await (0, land_listing_service_js_1.updateLandListing)(getSlugParam(request), input);
        if (!item) {
            return response.status(404).json({
                message: "Không tìm thấy đất nền"
            });
        }
        response.json(item);
    }
    catch (error) {
        handleLandListingError(error, response);
    }
}
async function deleteLandListingHandler(request, response) {
    const deleted = await (0, land_listing_service_js_1.deleteLandListing)(getSlugParam(request));
    if (!deleted) {
        return response.status(404).json({
            message: "Không tìm thấy đất nền"
        });
    }
    response.status(204).send();
}
