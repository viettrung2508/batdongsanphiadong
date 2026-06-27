"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const node_path_1 = __importDefault(require("node:path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_js_1 = require("./config/env.js");
const error_handler_js_1 = require("./middlewares/error-handler.js");
const index_js_1 = require("./routes/index.js");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: env_js_1.env.CORS_ORIGIN,
        credentials: true
    }));
    app.use(express_1.default.json());
    if (process.env.VERCEL !== "1") {
        app.use("/uploads", express_1.default.static(node_path_1.default.resolve(process.cwd(), "uploads")));
    }
    app.get("/health", (_request, response) => {
        response.json({ status: "ok" });
    });
    app.use("/api", index_js_1.apiRouter);
    app.use(error_handler_js_1.errorHandler);
    return app;
}
