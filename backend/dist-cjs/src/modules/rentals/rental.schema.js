"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalBodySchema = exports.listRentalsQuerySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const listSortSchema = zod_1.z.enum(["latest", "price_desc", "price_asc"]);
exports.listRentalsQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
    area: zod_1.z.string().trim().optional(),
    propertyType: zod_1.z.string().trim().optional(),
    sort: listSortSchema.optional(),
    featured: zod_1.z
        .string()
        .optional()
        .transform((value) => (value === "true" ? true : value === "false" ? false : undefined)),
    status: zod_1.z.nativeEnum(client_1.ContentStatus).optional()
});
exports.rentalBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    areaSlug: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    size: zod_1.z.string().optional(),
    rentalType: zod_1.z.string().optional(),
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
