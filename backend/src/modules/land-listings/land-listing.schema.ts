import { ContentStatus } from "@prisma/client";
import { z } from "zod";

const listSortSchema = z.enum(["latest", "price_desc", "price_asc"]);

export const listLandListingsQuerySchema = z.object({
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

export const landListingBodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  areaSlug: z.string().min(1),
  address: z.string().min(1),
  acreage: z.string().optional(),
  legal: z.string().optional(),
  price: z.string().min(1),
  hotline: z.string().min(1),
  thumbnail: z.string().url(),
  bannerImage: z.string().url().optional(),
  gallery: z.array(z.string().url()).default([]),
  description: z.string().min(1),
  mapEmbedUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
  isSold: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  badge: z.string().optional(),
  cardMeta: z.string().optional()
});

export type LandListingBodyInput = z.infer<typeof landListingBodySchema>;
export type ListLandListingsQueryInput = z.infer<typeof listLandListingsQuerySchema>;
