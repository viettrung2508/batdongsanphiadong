import { prisma } from "../../lib/prisma.js";
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
    const area = await prisma.area.findUnique({
        where: { slug: areaSlug }
    });
    if (!area) {
        throw new Error("AREA_NOT_FOUND");
    }
    return area.id;
}
export async function getPostList(query = {}) {
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
    const items = await prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });
    return items.map(mapPost);
}
export async function getPostBySlug(slug) {
    const item = await prisma.post.findUnique({
        where: { slug },
        include: postInclude
    });
    return item ? mapPost(item) : null;
}
export async function createPost(input) {
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const item = await prisma.post.create({
        data: {
            title: input.title,
            slug: input.slug,
            excerpt: input.excerpt,
            content: input.content,
            category: input.category,
            thumbnail: input.thumbnail,
            bannerImage: input.bannerImage,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
            status: input.status,
            relatedPostIds: input.relatedPostIds,
            areaId
        },
        include: postInclude
    });
    return mapPost(item);
}
export async function updatePost(slug, input) {
    const existing = await prisma.post.findUnique({
        where: { slug }
    });
    if (!existing) {
        return null;
    }
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const item = await prisma.post.update({
        where: { id: existing.id },
        data: {
            title: input.title,
            slug: input.slug,
            excerpt: input.excerpt,
            content: input.content,
            category: input.category,
            thumbnail: input.thumbnail,
            bannerImage: input.bannerImage,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
            status: input.status,
            relatedPostIds: input.relatedPostIds,
            areaId
        },
        include: postInclude
    });
    return mapPost(item);
}
export async function deletePost(slug) {
    const existing = await prisma.post.findUnique({
        where: { slug }
    });
    if (!existing) {
        return false;
    }
    await prisma.post.delete({
        where: { id: existing.id }
    });
    return true;
}
