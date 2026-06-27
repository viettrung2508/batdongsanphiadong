import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
function mapArea(item) {
    return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        propertyCount: item._count.properties,
        postCount: item._count.posts,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    };
}
export async function getAreaList() {
    const items = await prisma.area.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    properties: true,
                    posts: true
                }
            }
        }
    });
    return items.map(mapArea);
}
export async function createArea(input) {
    const item = await prisma.area.create({
        data: {
            name: input.name,
            slug: input.slug,
            description: input.description || undefined
        },
        include: {
            _count: {
                select: {
                    properties: true,
                    posts: true
                }
            }
        }
    });
    return mapArea(item);
}
export async function updateArea(id, input) {
    const existing = await prisma.area.findUnique({
        where: { id }
    });
    if (!existing) {
        return null;
    }
    const item = await prisma.area.update({
        where: { id },
        data: {
            name: input.name,
            slug: input.slug,
            description: input.description || null
        },
        include: {
            _count: {
                select: {
                    properties: true,
                    posts: true
                }
            }
        }
    });
    return mapArea(item);
}
export async function deleteArea(id) {
    const existing = await prisma.area.findUnique({
        where: { id }
    });
    if (!existing) {
        return null;
    }
    await prisma.area.delete({
        where: { id }
    });
    return true;
}
export function isPrismaKnownError(error) {
    return error instanceof Prisma.PrismaClientKnownRequestError;
}
