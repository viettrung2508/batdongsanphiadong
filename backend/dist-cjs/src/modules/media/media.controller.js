"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMediaHandler = uploadMediaHandler;
const media_service_js_1 = require("./media.service.js");
async function uploadMediaHandler(request, response) {
    const result = await (0, media_service_js_1.handleMediaUpload)(request);
    response.status(201).json(result);
}
