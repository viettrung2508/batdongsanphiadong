import { PrismaClient } from "@prisma/client";
export const prisma = global.prismaGlobal ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
    });
if (process.env.NODE_ENV !== "production") {
    global.prismaGlobal = prisma;
}
