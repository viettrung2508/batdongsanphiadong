"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(4000),
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: zod_1.z.string().min(1),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:3000"),
    BACKEND_PUBLIC_URL: zod_1.z.string().default("http://localhost:4000"),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().min(1),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1),
    ADMIN_USERNAME: zod_1.z.string().min(1),
    ADMIN_PASSWORD: zod_1.z.string().min(1),
    ADMIN_AUTH_SECRET: zod_1.z.string().min(1),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.coerce.number().optional(),
    SMTP_SECURE: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(["true", "false"])])
        .optional()
        .transform((value) => (typeof value === "string" ? value === "true" : value)),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    SMTP_FROM_EMAIL: zod_1.z.string().email().optional(),
    SMTP_FROM_NAME: zod_1.z.string().optional()
});
exports.env = envSchema.parse(process.env);
