"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudinaryPublicIdFromUrl = getCloudinaryPublicIdFromUrl;
exports.resolveCloudinaryPublicId = resolveCloudinaryPublicId;
exports.getRemovedAssetPublicIds = getRemovedAssetPublicIds;
exports.deleteCloudinaryAssets = deleteCloudinaryAssets;
const cloudinary_1 = require("cloudinary");
const env_js_1 = require("../config/env.js");
cloudinary_1.v2.config({
    cloud_name: env_js_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_js_1.env.CLOUDINARY_API_KEY,
    api_secret: env_js_1.env.CLOUDINARY_API_SECRET
});
function getCloudinaryPublicIdFromUrl(url) {
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
function resolveCloudinaryPublicId(asset) {
    return asset.publicId ?? getCloudinaryPublicIdFromUrl(asset.url);
}
function getRemovedAssetPublicIds(oldAssets, nextUrls) {
    const nextUrlSet = new Set(nextUrls.filter(Boolean));
    return Array.from(new Set(oldAssets
        .filter((asset) => asset.url && !nextUrlSet.has(asset.url))
        .map((asset) => resolveCloudinaryPublicId(asset))
        .filter((value) => Boolean(value))));
}
async function deleteCloudinaryAssets(publicIds) {
    const uniqueIds = Array.from(new Set(publicIds.filter(Boolean)));
    await Promise.all(uniqueIds.map(async (publicId) => {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId, {
                resource_type: "image"
            });
        }
        catch (error) {
            console.error(`Failed to delete Cloudinary asset: ${publicId}`, error);
        }
    }));
}
