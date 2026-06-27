import { PropertyKind } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
const landListingInclude = {
    area: true,
    gallery: {
        orderBy: {
            sortOrder: "asc"
        }
    }
};
function mapLandListing(item) {
    return {
        id: item.id,
        kind: item.kind,
        name: item.name,
        slug: item.slug,
        area: item.area.name,
        areaSlug: item.area.slug,
        address: item.address,
        acreage: item.acreage,
        legal: item.legal,
        price: item.price,
        hotline: item.hotline,
        badge: item.badge,
        cardMeta: item.cardMeta,
        thumbnail: item.thumbnail,
        bannerImage: item.bannerImage,
        gallery: item.gallery.map((media) => media.url),
        description: item.description,
        mapEmbedUrl: item.mapEmbedUrl,
        isFeatured: item.isFeatured,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        status: item.status,
        coordinates: item.latitude !== null && item.longitude !== null
            ? {
                lat: Number(item.latitude),
                lng: Number(item.longitude)
            }
            : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    };
}
async function getAreaIdBySlug(areaSlug) {
    const area = await prisma.area.findUnique({
        where: { slug: areaSlug }
    });
    if (!area) {
        throw new Error("AREA_NOT_FOUND");
    }
    return area.id;
}
export async function getLandListingList(query = {}) {
    const where = {
        kind: PropertyKind.LAND
    };
    if (query.search) {
        where.OR = [
            {
                name: {
                    contains: query.search,
                    mode: "insensitive"
                }
            },
            {
                address: {
                    contains: query.search,
                    mode: "insensitive"
                }
            }
        ];
    }
    if (query.area) {
        where.area = {
            slug: query.area
        };
    }
    if (typeof query.featured === "boolean") {
        where.isFeatured = query.featured;
    }
    if (query.status) {
        where.status = query.status;
    }
    const items = await prisma.property.findMany({
        where,
        include: landListingInclude,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
    });
    return items.map(mapLandListing);
}
export async function getLandListingBySlug(slug) {
    const item = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.LAND,
            slug
        },
        include: landListingInclude
    });
    if (!item) {
        return null;
    }
    return mapLandListing(item);
}
export async function createLandListing(input) {
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const item = await prisma.property.create({
        data: {
            kind: PropertyKind.LAND,
            name: input.name,
            slug: input.slug,
            areaId,
            address: input.address,
            acreage: input.acreage,
            legal: input.legal,
            price: input.price,
            hotline: input.hotline,
            thumbnail: input.thumbnail,
            bannerImage: input.bannerImage,
            description: input.description,
            mapEmbedUrl: input.mapEmbedUrl,
            isFeatured: input.isFeatured,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            status: input.status,
            latitude: input.latitude,
            longitude: input.longitude,
            badge: input.badge,
            cardMeta: input.cardMeta,
            gallery: {
                create: input.gallery.map((url, index) => ({ url, sortOrder: index }))
            }
        },
        include: landListingInclude
    });
    return mapLandListing(item);
}
export async function updateLandListing(slug, input) {
    const existing = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.LAND,
            slug
        }
    });
    if (!existing) {
        return null;
    }
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const item = await prisma.property.update({
        where: {
            id: existing.id
        },
        data: {
            name: input.name,
            slug: input.slug,
            areaId,
            address: input.address,
            acreage: input.acreage,
            legal: input.legal,
            price: input.price,
            hotline: input.hotline,
            thumbnail: input.thumbnail,
            bannerImage: input.bannerImage,
            description: input.description,
            mapEmbedUrl: input.mapEmbedUrl,
            isFeatured: input.isFeatured,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            status: input.status,
            latitude: input.latitude,
            longitude: input.longitude,
            badge: input.badge,
            cardMeta: input.cardMeta,
            gallery: {
                deleteMany: {},
                create: input.gallery.map((url, index) => ({ url, sortOrder: index }))
            }
        },
        include: landListingInclude
    });
    return mapLandListing(item);
}
export async function deleteLandListing(slug) {
    const existing = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.LAND,
            slug
        }
    });
    if (!existing) {
        return false;
    }
    await prisma.property.delete({
        where: {
            id: existing.id
        }
    });
    return true;
}
