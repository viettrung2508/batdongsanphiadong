import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

import { isAdminAuthenticated } from "@/lib/admin-session";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 2000;
const MAX_IMAGE_HEIGHT = 2000;
const WEBP_QUALITY = 82;

function getRequiredEnvValue(name: "CLOUDINARY_CLOUD_NAME" | "CLOUDINARY_API_KEY" | "CLOUDINARY_API_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name}_MISSING`);
  }

  return value;
}

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

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  cloudinary.config({
    cloud_name: getRequiredEnvValue("CLOUDINARY_CLOUD_NAME"),
    api_key: getRequiredEnvValue("CLOUDINARY_API_KEY"),
    api_secret: getRequiredEnvValue("CLOUDINARY_API_SECRET")
  });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "FILE_REQUIRED" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: "FILE_TOO_LARGE" }, { status: 400 });
  }

  const folder = sanitizeFolder(request.nextUrl.searchParams.get("folder") ?? "general");
  const originalName = file.name.replace(/\.[^.]+$/, "");
  const publicId = `${Date.now()}-${sanitizeFileName(originalName) || "image"}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const optimizedBuffer = await optimizeImageBuffer(buffer, file.type);
    const result = await uploadToCloudinary(optimizedBuffer, {
      folder: `whitespace/${folder}`,
      publicId
    });

    return NextResponse.json({
      fileName: publicId,
      folder,
      url: result.secure_url
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "UPLOAD_FAILED" }, { status: 500 });
  }
}
