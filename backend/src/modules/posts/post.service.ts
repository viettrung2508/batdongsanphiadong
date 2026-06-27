import type { Prisma } from "@prisma/client";

import { deleteCloudinaryAssets, getCloudinaryPublicIdFromUrl, getRemovedAssetPublicIds } from "../../lib/cloudinary.js";
import { prisma } from "../../lib/prisma.js";
import type { ListPostsQueryInput, PostBodyInput } from "./post.schema.js";

const postInclude = {
  area: true
};

function mapPost(item: Prisma.PostGetPayload<{ include: typeof postInclude }>) {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    category: item.category,
    thumbnail: item.thumbnail,
    bannerImage: item.bannerImage,
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
    publishedAt: item.publishedAt,
    status: item.status,
    relatedPostIds: item.relatedPostIds,
    area: item.area
      ? {
          id: item.area.id,
          name: item.area.name,
          slug: item.area.slug
        }
      : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

async function getAreaIdBySlug(areaSlug?: string) {
  if (!areaSlug) {
    return null;
  }

  const area = await prisma.area.findUnique({
    where: { slug: areaSlug }
  });

  if (!area) {
    throw new Error("AREA_NOT_FOUND");
  }

  return area.id;
}

export async function getPostList(query: ListPostsQueryInput = {}) {
  const where: Prisma.PostWhereInput = {};

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive"
        }
      },
      {
        excerpt: {
          contains: query.search,
          mode: "insensitive"
        }
      }
    ];
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.area) {
    where.area = {
      slug: query.area
    };
  }

  if (query.status) {
    where.status = query.status;
  }

  const items = await prisma.post.findMany({
    where,
    include: postInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
  });

  return items.map(mapPost);
}

export async function getPostBySlug(slug: string) {
  const item = await prisma.post.findUnique({
    where: { slug },
    include: postInclude
  });

  return item ? mapPost(item) : null;
}

export async function createPost(input: PostBodyInput) {
  const areaId = await getAreaIdBySlug(input.areaSlug);

  const item = await prisma.post.create({
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      thumbnail: input.thumbnail,
      thumbnailPublicId: getCloudinaryPublicIdFromUrl(input.thumbnail),
      bannerImage: input.bannerImage,
      bannerImagePublicId: getCloudinaryPublicIdFromUrl(input.bannerImage),
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
      status: input.status,
      relatedPostIds: input.relatedPostIds,
      areaId
    },
    include: postInclude
  });

  return mapPost(item);
}

export async function updatePost(slug: string, input: PostBodyInput) {
  const existing = await prisma.post.findUnique({
    where: { slug }
  });

  if (!existing) {
    return null;
  }

  const areaId = await getAreaIdBySlug(input.areaSlug);
  const nextUrls = [input.thumbnail, input.bannerImage].filter((value): value is string => Boolean(value));
  const removedAssetPublicIds = getRemovedAssetPublicIds(
    [
      { url: existing.thumbnail, publicId: existing.thumbnailPublicId },
      { url: existing.bannerImage, publicId: existing.bannerImagePublicId }
    ],
    nextUrls
  );

  const item = await prisma.post.update({
    where: { id: existing.id },
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      thumbnail: input.thumbnail,
      thumbnailPublicId: getCloudinaryPublicIdFromUrl(input.thumbnail),
      bannerImage: input.bannerImage,
      bannerImagePublicId: getCloudinaryPublicIdFromUrl(input.bannerImage),
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
      status: input.status,
      relatedPostIds: input.relatedPostIds,
      areaId
    },
    include: postInclude
  });

  await deleteCloudinaryAssets(removedAssetPublicIds);

  return mapPost(item);
}

export async function deletePost(slug: string) {
  const existing = await prisma.post.findUnique({
    where: { slug }
  });

  if (!existing) {
    return false;
  }

  const assetPublicIds = [existing.thumbnailPublicId, existing.bannerImagePublicId].filter(
    (value): value is string => Boolean(value)
  );

  await prisma.post.delete({
    where: { id: existing.id }
  });

  await deleteCloudinaryAssets(assetPublicIds);

  return true;
}
