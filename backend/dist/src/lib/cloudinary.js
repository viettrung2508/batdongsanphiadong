import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
});
export function getCloudinaryPublicIdFromUrl(url) {
    if (!url) {
        return null;
    }
    try {
        const parsedUrl = new URL(url);
        if (!parsedUrl.hostname.includes("res.cloudinary.com")) {
            return null;
        }
        const uploadIndex = parsedUrl.pathname.indexOf("/upload/");
        if (uploadIndex < 0) {
            return null;
        }
        const assetPath = parsedUrl.pathname.slice(uploadIndex + "/upload/".length).split("/");
        const cleanedPath = [...assetPath];
        while (cleanedPath.length > 0 && (cleanedPath[0].startsWith("v") || cleanedPath[0].includes(","))) {
            const [segment] = cleanedPath;
            if (segment.startsWith("v") && /^\d+$/.test(segment.slice(1))) {
                cleanedPath.shift();
                break;
            }
            cleanedPath.shift();
        }
        if (!cleanedPath.length) {
            return null;
        }
        const lastSegment = cleanedPath[cleanedPath.length - 1] ?? "";
        cleanedPath[cleanedPath.length - 1] = lastSegment.replace(/\.[^.]+$/, "");
        return cleanedPath.join("/");
    }
    catch {
        return null;
    }
}
export function resolveCloudinaryPublicId(asset) {
    return asset.publicId ?? getCloudinaryPublicIdFromUrl(asset.url);
}
export function getRemovedAssetPublicIds(oldAssets, nextUrls) {
    const nextUrlSet = new Set(nextUrls.filter(Boolean));
    return Array.from(new Set(oldAssets
        .filter((asset) => asset.url && !nextUrlSet.has(asset.url))
        .map((asset) => resolveCloudinaryPublicId(asset))
        .filter((value) => Boolean(value))));
}
export async function deleteCloudinaryAssets(publicIds) {
    const uniqueIds = Array.from(new Set(publicIds.filter(Boolean)));
    await Promise.all(uniqueIds.map(async (publicId) => {
        try {
            await cloudinary.uploader.destroy(publicId, {
                resource_type: "image"
            });
        }
        catch (error) {
            console.error(`Failed to delete Cloudinary asset: ${publicId}`, error);
        }
    }));
}
