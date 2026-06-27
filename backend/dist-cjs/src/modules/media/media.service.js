"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMediaUpload = handleMediaUpload;
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
const multer_1 = __importDefault(require("multer"));
const env_js_1 = require("../../config/env.js");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 8 * 1024 * 1024
    }
});
const MAX_IMAGE_WIDTH = 2000;
const MAX_IMAGE_HEIGHT = 2000;
const WEBP_QUALITY = 82;
cloudinary_1.v2.config({
    cloud_name: env_js_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_js_1.env.CLOUDINARY_API_KEY,
    api_secret: env_js_1.env.CLOUDINARY_API_SECRET
});
function sanitizeFolder(folder) {
    return folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "general";
}
function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-z0-9.-_]/gi, "-").toLowerCase();
}
async function optimizeImageBuffer(fileBuffer, mimeType) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
        return fileBuffer;
    }
    return (0, sharp_1.default)(fileBuffer)
        .rotate()
        .resize({
        width: MAX_IMAGE_WIDTH,
        height: MAX_IMAGE_HEIGHT,
        fit: "inside",
        withoutEnlargement: true
    })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
}
function uploadToCloudinary(fileBuffer, options) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder: options.folder,
            public_id: options.publicId,
            resource_type: "image"
        }, (error, result) => {
            if (error || !result?.secure_url) {
                reject(error ?? new Error("CLOUDINARY_UPLOAD_FAILED"));
                return;
            }
            resolve({ secure_url: result.secure_url });
        });
        stream.end(fileBuffer);
    });
}
function runUpload(request) {
    return new Promise((resolve, reject) => {
        upload.single("file")(request, {}, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}
async function handleMediaUpload(request) {
    await runUpload(request);
    if (!request.file) {
        throw new Error("FILE_REQUIRED");
    }
    const folder = sanitizeFolder(typeof request.query.folder === "string" ? request.query.folder : "general");
    const originalName = request.file.originalname.replace(/\.[^.]+$/, "");
    const baseName = sanitizeFileName(originalName);
    const publicId = `${Date.now()}-${baseName || "image"}`;
    const optimizedBuffer = await optimizeImageBuffer(request.file.buffer, request.file.mimetype);
    const result = await uploadToCloudinary(optimizedBuffer, {
        folder: `whitespace/${folder}`,
        publicId
    });
    return {
        fileName: publicId,
        folder,
        url: result.secure_url
    };
}
