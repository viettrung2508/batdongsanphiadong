"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaRouter = void 0;
const express_1 = require("express");
const media_controller_js_1 = require("./media.controller.js");
exports.mediaRouter = (0, express_1.Router)();
exports.mediaRouter.post("/upload", media_controller_js_1.uploadMediaHandler);
