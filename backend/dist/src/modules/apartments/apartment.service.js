import { PropertyKind } from "@prisma/client";
import { deleteCloudinaryAssets, getCloudinaryPublicIdFromUrl, getRemovedAssetPublicIds } from "../../lib/cloudinary.js";
import { prisma } from "../../lib/prisma.js";
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
    const project = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.PROJECT,
            slug: projectSlug
        }
    });
    if (!project) {
        throw new Error("PROJECT_NOT_FOUND");
    }
    return project;
}
export async function getApartmentList(query = {}) {
    const where = {
        kind: PropertyKind.APARTMENT
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
    const items = await prisma.property.findMany({
        where,
        include: apartmentInclude,
        orderBy: [{ name: "asc" }, { createdAt: "desc" }]
    });
    return items.map(mapApartment);
}
export async function getApartmentBySlug(slug) {
    const item = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.APARTMENT,
            slug
        },
        include: apartmentInclude
    });
    if (!item) {
        return null;
    }
    return mapApartment(item);
}
export async function createApartment(input) {
    const project = await getProjectBySlug(input.projectSlug);
    const item = await prisma.property.create({
        data: {
            kind: PropertyKind.APARTMENT,
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
            thumbnailPublicId: getCloudinaryPublicIdFromUrl(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: getCloudinaryPublicIdFromUrl(input.bannerImage),
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
                    publicId: getCloudinaryPublicIdFromUrl(url),
                    sortOrder: index
                }))
            }
        },
        include: apartmentInclude
    });
    return mapApartment(item);
}
export async function updateApartment(slug, input) {
    const existing = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.APARTMENT,
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
    const removedAssetPublicIds = getRemovedAssetPublicIds([
        { url: existing.thumbnail, publicId: existing.thumbnailPublicId },
        { url: existing.bannerImage, publicId: existing.bannerImagePublicId },
        ...existing.gallery.map((media) => ({ url: media.url, publicId: media.publicId }))
    ], nextUrls);
    const item = await prisma.property.update({
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
            thumbnailPublicId: getCloudinaryPublicIdFromUrl(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: getCloudinaryPublicIdFromUrl(input.bannerImage),
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
                    publicId: getCloudinaryPublicIdFromUrl(url),
                    sortOrder: index
                }))
            }
        },
        include: apartmentInclude
    });
    await deleteCloudinaryAssets(removedAssetPublicIds);
    return mapApartment(item);
}
export async function deleteApartment(slug) {
    const existing = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.APARTMENT,
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
    await prisma.property.delete({
        where: {
            id: existing.id
        }
    });
    await deleteCloudinaryAssets(assetPublicIds);
    return true;
}
