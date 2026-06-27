"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apartmentBodySchema = exports.listApartmentsQuerySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const apartmentTypeSchema = zod_1.z.enum(["Chung cư", "Biệt thự", "Shophouse", "Liền kề"]);
exports.listApartmentsQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
    area: zod_1.z.string().trim().optional(),
    projectSlug: zod_1.z.string().trim().optional(),
    featured: zod_1.z
        .string()
        .optional()
        .transform((value) => (value === "true" ? true : value === "false" ? false : undefined)),
    status: zod_1.z.nativeEnum(client_1.ContentStatus).optional()
});
exports.apartmentBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    projectSlug: zod_1.z.string().min(1),
    size: zod_1.z.string().optional(),
    rentalType: apartmentTypeSchema.optional(),
    price: zod_1.z.string().min(1),
    hotline: zod_1.z.string().min(1),
    thumbnail: zod_1.z.string().url(),
    bannerImage: zod_1.z.string().url().optional(),
    gallery: zod_1.z.array(zod_1.z.string().url()).default([]),
    description: zod_1.z.string().min(1),
    mapEmbedUrl: zod_1.z.string().url().optional(),
    isFeatured: zod_1.z.boolean().default(false),
    isSold: zod_1.z.boolean().default(false),
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.ContentStatus).default(client_1.ContentStatus.DRAFT),
    latitude: zod_1.z.coerce.number().optional(),
    longitude: zod_1.z.coerce.number().optional(),
    badge: zod_1.z.string().optional(),
    cardMeta: zod_1.z.string().optional()
});
