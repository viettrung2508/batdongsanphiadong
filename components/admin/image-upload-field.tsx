"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";

import { optimizeImageFile } from "@/lib/optimize-image-client";

import { FieldLabel } from "./field-label";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  folder: string;
  description?: string;
  required?: boolean;
  multiple?: boolean;
  onUploaded: (url: string) => void;
  onRemove?: (url: string) => void;
};

export function ImageUploadField({
  label,
  value,
  folder,
  description,
  required = false,
  multiple = false,
  onUploaded,
  onRemove
}: ImageUploadFieldProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const previewItems = useMemo(
    () =>
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [value]
  );

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      for (const file of files) {
        const optimizedFile = await optimizeImageFile(file);
        const formData = new FormData();
        formData.append("file", optimizedFile);

        const response = await fetch(`/api/admin/media/upload?folder=${folder}`, {
          method: "POST",
          credentials: "include",
          body: formData
        });

        if (!response.ok) {
          throw new Error("UPLOAD_FAILED");
        }

        const data = (await response.json()) as { url: string };
        onUploaded(data.url);
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Chưa thể upload ảnh.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-4 rounded-[24px] border border-dashed border-line bg-mist/70 p-4">
      <div>
        <FieldLabel label={label} required={required} />
        {description ? <p className="mt-1 text-xs leading-6 text-steel">{description}</p> : null}
      </div>

      <label className="inline-flex w-fit cursor-pointer items-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
        {multiple ? "Chọn nhiều ảnh từ máy" : "Chọn ảnh từ máy"}
        <input type="file" accept="image/*" multiple={multiple} onChange={handleFileChange} className="hidden" />
      </label>

      {status === "uploading" ? <p className="text-xs text-steel">Đang upload ảnh...</p> : null}
      {status === "success" ? <p className="text-xs font-medium text-green-700">Upload thành công.</p> : null}
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      {previewItems.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {previewItems.map((item, index) => (
            <div key={`${item}-${index}`} className="overflow-hidden rounded-[20px] border border-line bg-white">
              <div className="relative h-36 bg-slate-100">
                <Image src={item} alt={`${label} ${index + 1}`} fill className="object-cover" />
                {onRemove ? (
                  <button
                    type="button"
                    onClick={() => onRemove(item)}
                    className="absolute right-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                  >
                    Xóa
                  </button>
                ) : null}
              </div>
              <div className="border-t border-line px-3 py-2 text-xs font-medium text-steel">Ảnh {index + 1}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-line bg-white px-4 py-5 text-xs text-steel">
          Chưa có ảnh nào được chọn.
        </div>
      )}
    </div>
  );
}
