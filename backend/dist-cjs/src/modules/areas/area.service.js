"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAreaList = getAreaList;
exports.createArea = createArea;
exports.updateArea = updateArea;
exports.deleteArea = deleteArea;
exports.isPrismaKnownError = isPrismaKnownError;
const client_1 = require("@prisma/client");
const prisma_js_1 = require("../../lib/prisma.js");
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
async function getAreaList() {
    const items = await prisma_js_1.prisma.area.findMany({
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
async function createArea(input) {
    const item = await prisma_js_1.prisma.area.create({
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
async function updateArea(id, input) {
    const existing = await prisma_js_1.prisma.area.findUnique({
        where: { id }
    });
    if (!existing) {
        return null;
    }
    const item = await prisma_js_1.prisma.area.update({
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
async function deleteArea(id) {
    const existing = await prisma_js_1.prisma.area.findUnique({
        where: { id }
    });
    if (!existing) {
        return null;
    }
    await prisma_js_1.prisma.area.delete({
        where: { id }
    });
    return true;
}
function isPrismaKnownError(error) {
    return error instanceof client_1.Prisma.PrismaClientKnownRequestError;
}
