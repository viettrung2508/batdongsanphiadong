"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postBodySchema = exports.listPostsQuerySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.listPostsQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
    category: zod_1.z.string().trim().optional(),
    area: zod_1.z.string().trim().optional(),
    status: zod_1.z.nativeEnum(client_1.ContentStatus).optional()
});
exports.postBodySchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    thumbnail: zod_1.z.string().url(),
    bannerImage: zod_1.z.string().url().optional(),
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
    publishedAt: zod_1.z.string().datetime().optional(),
    status: zod_1.z.nativeEnum(client_1.ContentStatus).default(client_1.ContentStatus.DRAFT),
    relatedPostIds: zod_1.z.array(zod_1.z.string()).default([]),
    areaSlug: zod_1.z.string().min(1).optional()
});
