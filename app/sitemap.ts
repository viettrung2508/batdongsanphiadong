import type { MetadataRoute } from "next";

import { getPublicApartments, getPublicLandListings, getPublicPosts, getPublicProjects, getPublicRentals } from "@/lib/public-api";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [projects, landListings, rentals, apartments, posts] = await Promise.all([
    getPublicProjects(),
    getPublicLandListings(),
    getPublicRentals(),
    getPublicApartments(),
    getPublicPosts()
  ]);

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/du-an"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/dat-nen"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/cho-thue"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/tin-tuc"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/lien-he"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((item) => ({
      url: absoluteUrl(`/du-an/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...landListings.map((item) => ({
      url: absoluteUrl(`/dat-nen/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.85
    })),
    ...rentals.map((item) => ({
      url: absoluteUrl(`/cho-thue/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.85
    })),
    ...apartments.map((item) => ({
      url: absoluteUrl(`/can-ho/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...posts.map((item) => ({
      url: absoluteUrl(`/tin-tuc/${item.slug}`),
      lastModified: item.updatedAtIso ? new Date(item.updatedAtIso) : item.publishedAtIso ? new Date(item.publishedAtIso) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75
    }))
  ];
}
