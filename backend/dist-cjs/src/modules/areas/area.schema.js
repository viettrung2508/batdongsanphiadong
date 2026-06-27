"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areaBodySchema = void 0;
const zod_1 = require("zod");
exports.areaBodySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1),
    slug: zod_1.z.string().trim().min(1),
    description: zod_1.z.string().trim().optional()
});
