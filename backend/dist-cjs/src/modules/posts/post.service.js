"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostList = getPostList;
exports.getPostBySlug = getPostBySlug;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
const cloudinary_js_1 = require("../../lib/cloudinary.js");
const prisma_js_1 = require("../../lib/prisma.js");
const postInclude = {
    area: true
};
function mapPost(item) {
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
async function getAreaIdBySlug(areaSlug) {
    if (!areaSlug) {
        return null;
    }
    const area = await prisma_js_1.prisma.area.findUnique({
        where: { slug: areaSlug }
    });
    if (!area) {
        throw new Error("AREA_NOT_FOUND");
    }
    return area.id;
}
async function getPostList(query = {}) {
    const where = {};
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
    const items = await prisma_js_1.prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });
    return items.map(mapPost);
}
async function getPostBySlug(slug) {
    const item = await prisma_js_1.prisma.post.findUnique({
        where: { slug },
        include: postInclude
    });
    return item ? mapPost(item) : null;
}
async function createPost(input) {
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const item = await prisma_js_1.prisma.post.create({
        data: {
            title: input.title,
            slug: input.slug,
            excerpt: input.excerpt,
            content: input.content,
            category: input.category,
            thumbnail: input.thumbnail,
            thumbnailPublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.bannerImage),
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
async function updatePost(slug, input) {
    const existing = await prisma_js_1.prisma.post.findUnique({
        where: { slug }
    });
    if (!existing) {
        return null;
    }
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const nextUrls = [input.thumbnail, input.bannerImage].filter((value) => Boolean(value));
    const removedAssetPublicIds = (0, cloudinary_js_1.getRemovedAssetPublicIds)([
        { url: existing.thumbnail, publicId: existing.thumbnailPublicId },
        { url: existing.bannerImage, publicId: existing.bannerImagePublicId }
    ], nextUrls);
    const item = await prisma_js_1.prisma.post.update({
        where: { id: existing.id },
        data: {
            title: input.title,
            slug: input.slug,
            excerpt: input.excerpt,
            content: input.content,
            category: input.category,
            thumbnail: input.thumbnail,
            thumbnailPublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.bannerImage),
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
            status: input.status,
            relatedPostIds: input.relatedPostIds,
            areaId
        },
        include: postInclude
    });
    await (0, cloudinary_js_1.deleteCloudinaryAssets)(removedAssetPublicIds);
    return mapPost(item);
}
async function deletePost(slug) {
    const existing = await prisma_js_1.prisma.post.findUnique({
        where: { slug }
    });
    if (!existing) {
        return false;
    }
    const assetPublicIds = [existing.thumbnailPublicId, existing.bannerImagePublicId].filter((value) => Boolean(value));
    await prisma_js_1.prisma.post.delete({
        where: { id: existing.id }
    });
    await (0, cloudinary_js_1.deleteCloudinaryAssets)(assetPublicIds);
    return true;
}
