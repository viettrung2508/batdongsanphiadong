import { ContentStatus } from "@prisma/client";
import { z } from "zod";
const projectDisplayStatusSchema = z.enum(["NONE", "ON_SALE", "COMING_SOON", "HANDED_OVER"]);
const listSortSchema = z.enum(["latest", "price_desc", "price_asc"]);
export const listProjectsQuerySchema = z.object({
    search: z.string().trim().optional(),
    area: z.string().trim().optional(),
    propertyType: z.string().trim().optional(),
    sort: listSortSchema.optional(),
    featured: z
        .string()
        .optional()
        .transform((value) => (value === "true" ? true : value === "false" ? false : undefined)),
    status: z.nativeEnum(ContentStatus).optional()
});
export const projectBodySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    investor: z.string().min(1).optional(),
    areaSlug: z.string().min(1),
    address: z.string().min(1),
    scale: z.string().optional(),
    productTypes: z.array(z.string().min(1)).min(1, "Vui lòng chọn ít nhất 1 loại sản phẩm"),
    villaInfo: z.string().optional(),
    shophouseInfo: z.string().optional(),
    startTime: z.string().optional(),
    handoverTime: z.string().optional(),
    ownership: z.string().optional(),
    price: z.string().min(1),
    hotline: z.string().min(1),
    thumbnail: z.string().url(),
    bannerImage: z.string().url().optional(),
    gallery: z.array(z.string().url()).default([]),
    description: z.string().min(1),
    utilities: z.array(z.string().min(1)).default([]),
    mapEmbedUrl: z.string().url().optional(),
    isFeatured: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    badge: z.string().optional(),
    cardMeta: z.string().optional(),
    projectStatusTag: projectDisplayStatusSchema.optional()
});
