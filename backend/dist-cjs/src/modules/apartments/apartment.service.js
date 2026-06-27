"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApartmentList = getApartmentList;
exports.getApartmentBySlug = getApartmentBySlug;
exports.createApartment = createApartment;
exports.updateApartment = updateApartment;
exports.deleteApartment = deleteApartment;
const client_1 = require("@prisma/client");
const cloudinary_js_1 = require("../../lib/cloudinary.js");
const prisma_js_1 = require("../../lib/prisma.js");
const apartmentInclude = {
    area: true,
    parentProject: true,
    gallery: {
        orderBy: {
            sortOrder: "asc"
        }
    }
};
function mapApartment(item) {
    return {
        id: item.id,
        kind: item.kind,
        name: item.name,
        slug: item.slug,
        area: item.area.name,
        areaSlug: item.area.slug,
        projectId: item.parentProject?.id ?? null,
        projectName: item.parentProject?.name ?? null,
        projectSlug: item.parentProject?.slug ?? null,
        address: item.address,
        size: item.size,
        rentalType: item.rentalType,
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
async function getProjectBySlug(projectSlug) {
    const project = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.PROJECT,
            slug: projectSlug
        }
    });
    if (!project) {
        throw new Error("PROJECT_NOT_FOUND");
    }
    return project;
}
async function getApartmentList(query = {}) {
    const where = {
        kind: client_1.PropertyKind.APARTMENT
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
    if (query.projectSlug) {
        where.parentProject = {
            slug: query.projectSlug
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
        include: apartmentInclude,
        orderBy: [{ name: "asc" }, { createdAt: "desc" }]
    });
    return items.map(mapApartment);
}
async function getApartmentBySlug(slug) {
    const item = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.APARTMENT,
            slug
        },
        include: apartmentInclude
    });
    if (!item) {
        return null;
    }
    return mapApartment(item);
}
async function createApartment(input) {
    const project = await getProjectBySlug(input.projectSlug);
    const item = await prisma_js_1.prisma.property.create({
        data: {
            kind: client_1.PropertyKind.APARTMENT,
            name: input.name,
            slug: input.slug,
            areaId: project.areaId,
            parentProjectId: project.id,
            address: project.address,
            size: input.size,
            rentalType: input.rentalType,
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
        include: apartmentInclude
    });
    return mapApartment(item);
}
async function updateApartment(slug, input) {
    const existing = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.APARTMENT,
            slug
        },
        include: {
            gallery: true
        }
    });
    if (!existing) {
        return null;
    }
    const project = await getProjectBySlug(input.projectSlug);
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
            areaId: project.areaId,
            parentProjectId: project.id,
            address: project.address,
            size: input.size,
            rentalType: input.rentalType,
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
        include: apartmentInclude
    });
    await (0, cloudinary_js_1.deleteCloudinaryAssets)(removedAssetPublicIds);
    return mapApartment(item);
}
async function deleteApartment(slug) {
    const existing = await prisma_js_1.prisma.property.findFirst({
        where: {
            kind: client_1.PropertyKind.APARTMENT,
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
