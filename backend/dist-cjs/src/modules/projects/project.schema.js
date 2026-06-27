"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectBodySchema = exports.listProjectsQuerySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const projectDisplayStatusSchema = zod_1.z.enum(["NONE", "ON_SALE", "COMING_SOON", "HANDED_OVER"]);
const listSortSchema = zod_1.z.enum(["latest", "price_desc", "price_asc"]);
exports.listProjectsQuerySchema = zod_1.z.object({
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
exports.projectBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    investor: zod_1.z.string().min(1).optional(),
    areaSlug: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    scale: zod_1.z.string().optional(),
    productTypes: zod_1.z.array(zod_1.z.string().min(1)).min(1, "Vui lòng chọn ít nhất 1 loại sản phẩm"),
    villaInfo: zod_1.z.string().optional(),
    shophouseInfo: zod_1.z.string().optional(),
    startTime: zod_1.z.string().optional(),
    handoverTime: zod_1.z.string().optional(),
    ownership: zod_1.z.string().optional(),
    price: zod_1.z.string().min(1),
    hotline: zod_1.z.string().min(1),
    thumbnail: zod_1.z.string().url(),
    bannerImage: zod_1.z.string().url().optional(),
    gallery: zod_1.z.array(zod_1.z.string().url()).default([]),
    description: zod_1.z.string().min(1),
    utilities: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    mapEmbedUrl: zod_1.z.string().url().optional(),
    isFeatured: zod_1.z.boolean().default(false),
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.ContentStatus).default(client_1.ContentStatus.DRAFT),
    latitude: zod_1.z.coerce.number().optional(),
    longitude: zod_1.z.coerce.number().optional(),
    badge: zod_1.z.string().optional(),
    cardMeta: zod_1.z.string().optional(),
    projectStatusTag: projectDisplayStatusSchema.optional()
});
