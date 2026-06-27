"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactNotificationSettingsSchema = void 0;
const zod_1 = require("zod");
exports.contactNotificationSettingsSchema = zod_1.z.object({
    notificationEmail: zod_1.z.string().email().or(zod_1.z.literal("")).nullable().optional()
});
