import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

import type { Request } from "express";
import multer from "multer";

import { env } from "../../config/env.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024
  }
});
const MAX_IMAGE_WIDTH = 2000;
const MAX_IMAGE_HEIGHT = 2000;
const WEBP_QUALITY = 82;

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

function sanitizeFolder(folder: string) {
  return folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "general";
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-z0-9.-_]/gi, "-").toLowerCase();
}

async function optimizeImageBuffer(fileBuffer: Buffer, mimeType: string) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    return fileBuffer;
  }

  return sharp(fileBuffer)
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

function uploadToCloudinary(fileBuffer: Buffer, options: { folder: string; publicId: string }) {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: "image"
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("CLOUDINARY_UPLOAD_FAILED"));
          return;
        }

        resolve({ secure_url: result.secure_url });
      }
    );

    stream.end(fileBuffer);
  });
}

function runUpload(request: Request) {
  return new Promise<void>((resolve, reject) => {
    upload.single("file")(request, {} as never, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export async function handleMediaUpload(request: Request) {
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
