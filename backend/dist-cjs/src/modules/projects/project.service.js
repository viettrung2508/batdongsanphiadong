"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectList = getProjectList;
exports.getProjectBySlug = getProjectBySlug;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
const client_1 = require("@prisma/client");
const cloudinary_js_1 = require("../../lib/cloudinary.js");
const prisma_js_1 = require("../../lib/prisma.js");
const projectInclude = {
    area: true,
    apartments: {
        where: {
            kind: client_1.PropertyKind.APARTMENT
        },
        orderBy: {
            name: "asc"
        }
    },
    utilities: {
        orderBy: {
            createdAt: "asc"
        }
    },
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
function mapProject(item) {
    return {
        id: item.id,
        kind: item.kind,
        name: item.name,
        slug: item.slug,
        investor: item.investor,
        area: item.area.name,
        areaSlug: item.area.slug,
        address: item.address,
        scale: item.scale,
        productTypes: item.productTypes,
        villaInfo: item.villaInfo,
        shophouseInfo: item.shophouseInfo,
        startTime: item.startTime,
        handoverTime: item.handoverTime,
        ownership: item.ownership,
        price: item.price,
        hotline: item.hotline,
        badge: item.badge,
        cardMeta: item.cardMeta,
        projectStatusTag: item.projectStatusTag,
        apartments: item.apartments.map((apartment) => ({
            id: apartment.id,
            name: apartment.name,
            slug: apartment.slug,
            price: apartment.price,
            size: apartment.size,
            rentalType: apartment.rentalType,
            thumbnail: apartment.thumbnail,
            bannerImage: apartment.bannerImage,
            status: apartment.status,
            isFeatured: apartment.isFeatured,
            isSold: apartment.isSold
        })),
        thumbnail: item.thumbnail,
        bannerImage: item.bannerImage,
        gallery: item.gallery.map((media) => media.url),
        description: item.description,
        utilities: item.utilities.map((utility) => utility.label),
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
    const area = await prisma_js_1.prisma.area.findUnique({
        where: { slug: areaSlug }
    });
    if (!area) {
        throw new Error("AREA_NOT_FOUND");
    }
    return area.id;
}
async function getProjectList(query = {}) {
    const where = {
        kind: client_1.PropertyKind.PROJECT
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
                investor: {
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
        where.productTypes = {
            has: query.propertyType
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
        include: projectInclude,
        orderBy: [{ createdAt: "desc" }]
    });
    const mappedItems = items.map(mapProject);
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
async function getProjectBySlug(slug) {
    const item = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.PROJECT,
            slug
        },
        include: projectInclude
    });
    if (!item) {
        return null;
    }
    return mapProject(item);
}
async function createProject(input) {
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const item = await prisma_js_1.prisma.property.create({
        data: {
            kind: client_1.PropertyKind.PROJECT,
            name: input.name,
            slug: input.slug,
            investor: input.investor,
            areaId,
            address: input.address,
            scale: input.scale,
            productTypes: input.productTypes,
            villaInfo: input.villaInfo,
            shophouseInfo: input.shophouseInfo,
            startTime: input.startTime,
            handoverTime: input.handoverTime,
            ownership: input.ownership,
            price: input.price,
            hotline: input.hotline,
            thumbnail: input.thumbnail,
            thumbnailPublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.bannerImage),
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
            projectStatusTag: input.projectStatusTag === "NONE" ? null : input.projectStatusTag,
            utilities: {
                create: input.utilities.map((label) => ({ label }))
            },
            gallery: {
                create: input.gallery.map((url, index) => ({
                    url,
                    publicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(url),
                    sortOrder: index
                }))
            }
        },
        include: projectInclude
    });
    return mapProject(item);
}
async function updateProject(slug, input) {
    const existing = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.PROJECT,
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
            investor: input.investor,
            areaId,
            address: input.address,
            scale: input.scale,
            productTypes: input.productTypes,
            villaInfo: input.villaInfo,
            shophouseInfo: input.shophouseInfo,
            startTime: input.startTime,
            handoverTime: input.handoverTime,
            ownership: input.ownership,
            price: input.price,
            hotline: input.hotline,
            thumbnail: input.thumbnail,
            thumbnailPublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(input.bannerImage),
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
            projectStatusTag: input.projectStatusTag === "NONE" ? null : input.projectStatusTag,
            utilities: {
                deleteMany: {},
                create: input.utilities.map((label) => ({ label }))
            },
            gallery: {
                deleteMany: {},
                create: input.gallery.map((url, index) => ({
                    url,
                    publicId: (0, cloudinary_js_1.getCloudinaryPublicIdFromUrl)(url),
                    sortOrder: index
                }))
            }
        },
        include: projectInclude
    });
    await (0, cloudinary_js_1.deleteCloudinaryAssets)(removedAssetPublicIds);
    return mapProject(item);
}
async function deleteProject(slug) {
    const existing = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.PROJECT,
            slug
        },
        include: {
            gallery: true,
            apartments: {
                where: {
                    kind: client_1.PropertyKind.APARTMENT
                },
                include: {
                    gallery: true
                }
            }
        }
    });
    if (!existing) {
        return false;
    }
    const assetPublicIds = [
        existing.thumbnailPublicId,
        existing.bannerImagePublicId,
        ...existing.gallery.map((media) => media.publicId),
        ...existing.apartments.flatMap((apartment) => [
            apartment.thumbnailPublicId,
            apartment.bannerImagePublicId,
            ...apartment.gallery.map((media) => media.publicId)
        ])
    ].filter((value) => Boolean(value));
    await prisma_js_1.prisma.property.deleteMany({
        where: {
            parentProjectId: existing.id,
            kind: client_1.PropertyKind.APARTMENT
        }
    });
    await prisma_js_1.prisma.property.delete({
        where: {
            id: existing.id
        }
    });
    await (0, cloudinary_js_1.deleteCloudinaryAssets)(assetPublicIds);
    return true;
}
