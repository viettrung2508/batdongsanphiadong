"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactBodySchema = void 0;
const zod_1 = require("zod");
exports.contactBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    message: zod_1.z.string().optional(),
    source: zod_1.z.string().optional()
});
