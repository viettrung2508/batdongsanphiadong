import { ContentStatus } from "@prisma/client";
import { z } from "zod";
export const listPostsQuerySchema = z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    area: z.string().trim().optional(),
    status: z.nativeEnum(ContentStatus).optional()
});
export const postBodySchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    excerpt: z.string().min(1),
    content: z.string().min(1),
    category: z.string().min(1),
    thumbnail: z.string().url(),
    bannerImage: z.string().url().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    publishedAt: z.string().datetime().optional(),
    status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
    relatedPostIds: z.array(z.string()).default([]),
    areaSlug: z.string().min(1).optional()
});
