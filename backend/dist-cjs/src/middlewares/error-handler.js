"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(error, _request, response, _next) {
    console.error(error);
    response.status(500).json({
        message: "Internal server error"
    });
}
