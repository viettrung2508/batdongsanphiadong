"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLandListingList = getLandListingList;
exports.getLandListingBySlug = getLandListingBySlug;
exports.createLandListing = createLandListing;
exports.updateLandListing = updateLandListing;
exports.deleteLandListing = deleteLandListing;
const client_1 = require("@prisma/client");
const cloudinary_js_1 = require("../../lib/cloudinary.js");
const prisma_js_1 = require("../../lib/prisma.js");
const landListingInclude = {
    area: true,
    gallery: {
        orderBy: {
            sortOrder: "asc"
        }
    }
};
function parsePriceValue(price) {
    const digits = price.replace(/[^\d]/g, "");
    return digits ? Number(digits) : null;
}
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
        isSold: item.isSold,
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
    const area = await prisma_js_1.prisma.area.findUnique({
        where: { slug: areaSlug }
    });
    if (!area) {
        throw new Error("AREA_NOT_FOUND");
    }
    return area.id;
}
async function getLandListingList(query = {}) {
    const where = {
        kind: client_1.PropertyKind.LAND
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
    if (query.propertyType) {
        where.badge = {
            equals: query.propertyType,
            mode: "insensitive"
        };
    }
    if (typeof query.featured === "boolean") {
        where.isFeatured = query.featured;
    }
    if (query.status) {
        where.status = query.status;
    }
    const items = await prisma_js_1.prisma.property.findMany({
        where,
        include: landListingInclude,
        orderBy: [{ createdAt: "desc" }]
    });
    const mappedItems = items.map(mapLandListing);
    if (query.sort === "price_desc" || query.sort === "price_asc") {
        const direction = query.sort === "price_desc" ? -1 : 1;
        return mappedItems.sort((a, b) => {
            const aPrice = parsePriceValue(a.price);
            const bPrice = parsePriceValue(b.price);
            if (aPrice === null && bPrice === null)
                return 0;
            if (aPrice === null)
                return 1;
            if (bPrice === null)
                return -1;
            return (aPrice - bPrice) * direction;
        });
    }
    return mappedItems;
}
async function getLandListingBySlug(slug) {
    const item = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.LAND,
            slug
        },
        include: landListingInclude
    });
    if (!item) {
        return null;
    }
    return mapLandListing(item);
}
async function createLandListing(input) {
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const item = await prisma_js_1.prisma.property.create({
        data: {
            kind: client_1.PropertyKind.LAND,
            name: input.name,
            slug: input.slug,
            areaId,
            address: input.address,
            acreage: input.acreage,
            legal: input.legal,
            price: input.price,
            hotline: input.hotline,
            thumbnail: input.thumbnail,
            thumbnailPublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.bannerImage),
            description: input.description,
            mapEmbedUrl: input.mapEmbedUrl,
            isFeatured: input.isFeatured,
            isSold: input.isSold,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            status: input.status,
            latitude: input.latitude,
            longitude: input.longitude,
            badge: input.badge,
            cardMeta: input.cardMeta,
            gallery: {
                create: input.gallery.map((url, index) => ({
                    url,
                    publicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(url),
                    sortOrder: index
                }))
            }
        },
        include: landListingInclude
    });
    return mapLandListing(item);
}
async function updateLandListing(slug, input) {
    const existing = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.LAND,
            slug
        },
        include: {
            gallery: true
        }
    });
    if (!existing) {
        return null;
    }
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const nextUrls = [input.thumbnail, input.bannerImage, ...input.gallery].filter((value) => Boolean(value));
    const removedAssetPublicIds = (0, cloudinary_js_1.getRemovedAssetPublicIds)([
        { url: existing.thumbnail, publicId: existing.thumbnailPublicId },
        { url: existing.bannerImage, publicId: existing.bannerImagePublicId },
        ...existing.gallery.map((media) => ({ url: media.url, publicId: media.publicId }))
    ], nextUrls);
    const item = await prisma_js_1.prisma.property.update({
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
            thumbnailPublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.bannerImage),
            description: input.description,
            mapEmbedUrl: input.mapEmbedUrl,
            isFeatured: input.isFeatured,
            isSold: input.isSold,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            status: input.status,
            latitude: input.latitude,
            longitude: input.longitude,
            badge: input.badge,
            cardMeta: input.cardMeta,
            gallery: {
                deleteMany: {},
                create: input.gallery.map((url, index) => ({
                    url,
                    publicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(url),
                    sortOrder: index
                }))
            }
        },
        include: landListingInclude
    });
    await (0, cloudinary_js_1.deleteCloudinaryAssets)(removedAssetPublicIds);
    return mapLandListing(item);
}
async function deleteLandListing(slug) {
    const existing = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.LAND,
            slug
        },
        include: {
            gallery: true
        }
    });
    if (!existing) {
        return false;
    }
    const assetPublicIds = [
        existing.thumbnailPublicId,
        existing.bannerImagePublicId,
        ...existing.gallery.map((media) => media.publicId)
    ].filter((value) => Boolean(value));
    await prisma_js_1.prisma.property.delete({
        where: {
            id: existing.id
        }
    });
    await (0, cloudinary_js_1.deleteCloudinaryAssets)(assetPublicIds);
    return true;
}
