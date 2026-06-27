"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ImageUploadField } from "./image-upload-field";
import { LocationAutocompleteInput } from "./location-autocomplete-input";
import type { LocationSelection } from "./location-selection";
import { FieldLabel } from "./field-label";
import { RichTextEditor } from "./rich-text-editor";
import { slugify } from "./slug";
import { fetchAdminApi } from "./admin-api";
import type { AreaOption } from "./area-options";
import { useUnsavedChangesRegistration } from "./unsaved-changes-provider";
import { PROJECT_DISPLAY_STATUS_OPTIONS } from "@/lib/project-display-status";

const PRODUCT_TYPE_OPTIONS = ["Chung cư", "Biệt thự", "Shophouse", "Liền kề"] as const;

const initialForm = {
  name: "",
  slug: "",
  investor: "",
  areaSlug: "gia-lam",
  address: "",
  scale: "",
  productTypes: ["Chung cư", "Biệt thự", "Shophouse", "Liền kề"],
  villaInfo: "",
  shophouseInfo: "",
  startTime: "",
  handoverTime: "",
  ownership: "",
  price: "",
  hotline: "0377281119",
  thumbnail: "",
  bannerImage: "",
  gallery: "",
  description: "",
  utilities: "",
  mapEmbedUrl: "",
  isFeatured: true,
  seoTitle: "",
  seoDescription: "",
  status: "PUBLISHED",
  projectStatusTag: "NONE",
  latitude: "",
  longitude: "",
  badge: "",
  cardMeta: ""
};

type ProjectEditorProps = {
  slug?: string;
};

export function ProjectEditor({ slug }: ProjectEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "submitting" | "success" | "error">(
    slug ? "loading" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [productTypesError, setProductTypesError] = useState("");
  const [areaOptions, setAreaOptions] = useState<AreaOption[]>([]);
  const [initialSnapshot, setInitialSnapshot] = useState(() => JSON.stringify(initialForm));
  const isEditing = Boolean(slug);
  const fieldClassName = "grid gap-2";
  const labelClassName = "text-sm font-medium text-ink";
  const hasUnsavedChanges = JSON.stringify(form) !== initialSnapshot;
  const allowNavigation = useUnsavedChangesRegistration(hasUnsavedChanges && status !== "submitting" && status !== "loading");

  function handleLocationSelect(location: LocationSelection) {
    setForm((current) => ({
      ...current,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude
    }));
  }

  function toggleProductType(productType: (typeof PRODUCT_TYPE_OPTIONS)[number], checked: boolean) {
    setForm((current) => ({
      ...current,
      productTypes: checked
        ? [...current.productTypes, productType]
        : current.productTypes.filter((item) => item !== productType)
    }));
    setProductTypesError("");
  }

  useEffect(() => {
    async function loadAreas() {
      try {
        const response = await fetchAdminApi("/api/areas");
        if (!response.ok) {
          throw new Error("LOAD_AREAS_FAILED");
        }

        const data = (await response.json()) as { items: AreaOption[] };
        setAreaOptions(data.items);
      } catch {
        setAreaOptions([]);
      }
    }

    void loadAreas();
  }, []);

  useEffect(() => {
    async function loadProject() {
      if (!slug) {
        return;
      }

      try {
        const response = await fetchAdminApi(`/api/projects/${slug}`);
        if (!response.ok) {
          throw new Error("LOAD_FAILED");
        }

        const item = (await response.json()) as {
          name: string;
          slug: string;
          investor?: string | null;
          area: string;
          areaSlug: string;
          address: string;
          scale?: string | null;
          productTypes?: string[];
          villaInfo?: string | null;
          shophouseInfo?: string | null;
          startTime?: string | null;
          handoverTime?: string | null;
          ownership?: string | null;
          price: string;
          hotline: string;
          thumbnail: string;
          bannerImage?: string | null;
          gallery?: string[];
          description: string;
          utilities?: string[];
          mapEmbedUrl?: string | null;
          isFeatured: boolean;
          seoTitle?: string | null;
          seoDescription?: string | null;
          status: string;
          projectStatusTag?: string | null;
          coordinates?: { lat: number; lng: number } | null;
          badge?: string | null;
          cardMeta?: string | null;
        };

        const nextForm = {
          name: item.name,
          slug: item.slug,
          investor: item.investor ?? "",
          areaSlug: item.areaSlug,
          address: item.address,
          scale: item.scale ?? "",
          productTypes: item.productTypes?.filter((type) => PRODUCT_TYPE_OPTIONS.includes(type as (typeof PRODUCT_TYPE_OPTIONS)[number])) ?? [],
          villaInfo: item.villaInfo ?? "",
          shophouseInfo: item.shophouseInfo ?? "",
          startTime: item.startTime ?? "",
          handoverTime: item.handoverTime ?? "",
          ownership: item.ownership ?? "",
          price: item.price,
          hotline: item.hotline,
          thumbnail: item.thumbnail,
          bannerImage: item.bannerImage ?? "",
          gallery: item.gallery?.join("\n") ?? "",
          description: item.description,
          utilities: item.utilities?.join("\n") ?? "",
          mapEmbedUrl: item.mapEmbedUrl ?? "",
          isFeatured: item.isFeatured,
          seoTitle: item.seoTitle ?? "",
          seoDescription: item.seoDescription ?? "",
          status: item.status,
          projectStatusTag: item.projectStatusTag ?? "NONE",
          latitude: item.coordinates?.lat?.toString() ?? "",
          longitude: item.coordinates?.lng?.toString() ?? "",
          badge: item.badge ?? "",
          cardMeta: item.cardMeta ?? ""
        };
        setForm(nextForm);
        setInitialSnapshot(JSON.stringify(nextForm));
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMessage("Chưa thể tải chi tiết dự án.");
      }
    }

    void loadProject();
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    setProductTypesError("");

    if (!form.productTypes.length) {
      setStatus("error");
      setProductTypesError("Vui lòng chọn ít nhất 1 loại sản phẩm.");
      return;
    }

    try {
      const payload = {
        ...form,
        productTypes: form.productTypes,
        gallery: form.gallery.split("\n").map((item) => item.trim()).filter(Boolean),
        utilities: form.utilities
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
        bannerImage: form.bannerImage || undefined,
        mapEmbedUrl: form.mapEmbedUrl || undefined,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        investor: form.investor.trim() || undefined,
        scale: form.scale.trim() || undefined,
        villaInfo: form.villaInfo.trim() || undefined,
        shophouseInfo: form.shophouseInfo.trim() || undefined,
        startTime: form.startTime.trim() || undefined,
        handoverTime: form.handoverTime.trim() || undefined,
        ownership: form.ownership.trim() || undefined,
        projectStatusTag: form.projectStatusTag || "NONE",
        badge: form.badge.trim() || undefined,
        cardMeta: form.cardMeta.trim() || undefined
      };

      const response = await fetchAdminApi(isEditing ? `/api/projects/${slug}` : "/api/projects", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("SAVE_FAILED");
      }

      setStatus("success");
      allowNavigation();
      router.push("/dashboard/projects");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Chưa thể lưu dự án.");
    }
  }

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">
              {isEditing ? "Chi tiết dự án" : "Tạo dự án"}
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink">
              {isEditing ? "Chỉnh sửa thông tin dự án" : "Tạo mới dự án"}
            </h1>
          </div>

          <Link href="/dashboard/projects" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
            Quay lại danh sách
          </Link>
        </div>

        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        {status === "success" ? <p className="mt-4 text-sm font-medium text-green-700">Lưu dữ liệu thành công.</p> : null}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 xl:grid-cols-2">
          <input type="hidden" value={form.slug} readOnly />
          <label className={fieldClassName}>
            <FieldLabel label="Tên dự án" required className={labelClassName} />
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: slugify(event.target.value)
                }))
              }
              className="h-12 rounded-full border border-line px-5 text-sm outline-none"
              placeholder="Tên dự án"
              required
            />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Chủ đầu tư" className={labelClassName} />
            <input value={form.investor} onChange={(e) => setForm((c) => ({ ...c, investor: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Chủ đầu tư" />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Khu vực" className={labelClassName} />
            <select value={form.areaSlug} onChange={(e) => setForm((c) => ({ ...c, areaSlug: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none">
              {areaOptions.map((area) => (
                <option key={area.id} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
          <label className={`${fieldClassName} xl:col-span-2`}>
            <FieldLabel label="Địa chỉ" required className={labelClassName} />
            <LocationAutocompleteInput
              value={form.address}
              onChange={(value) => setForm((current) => ({ ...current, address: value }))}
              onLocationSelect={handleLocationSelect}
              className="h-12 w-full rounded-full border border-line px-5 text-sm outline-none"
              placeholder="Địa chỉ"
              required
            />
          </label>
          <label className={`${fieldClassName} xl:col-span-2`}>
            <FieldLabel label="Link Google Map" className={labelClassName} />
            <input
              value={form.mapEmbedUrl}
              onChange={(e) => setForm((c) => ({ ...c, mapEmbedUrl: e.target.value }))}
              className="h-12 rounded-full border border-line px-5 text-sm outline-none"
              placeholder="Dán link Google Map hoặc link embed"
            />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Giá bán" required className={labelClassName} />
            <input value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Giá bán" required />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Quy mô" className={labelClassName} />
            <input value={form.scale} onChange={(e) => setForm((c) => ({ ...c, scale: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Quy mô" />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Khởi công" className={labelClassName} />
            <input value={form.startTime} onChange={(e) => setForm((c) => ({ ...c, startTime: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Ví dụ: Q3/2026" />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Bàn giao" className={labelClassName} />
            <input value={form.handoverTime} onChange={(e) => setForm((c) => ({ ...c, handoverTime: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Ví dụ: Q4/2028" />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Pháp lý" className={labelClassName} />
            <input value={form.ownership} onChange={(e) => setForm((c) => ({ ...c, ownership: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Ví dụ: Sở hữu lâu dài" />
          </label>
          <label className="flex items-center gap-3 rounded-[20px] border border-line px-5 py-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((c) => ({ ...c, isFeatured: e.target.checked }))}
              className="h-4 w-4 rounded border-line"
            />
            Dự án nổi bật
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Trạng thái hiển thị" className={labelClassName} />
            <select
              value={form.projectStatusTag}
              onChange={(e) => setForm((c) => ({ ...c, projectStatusTag: e.target.value }))}
              className="h-12 rounded-full border border-line px-5 text-sm outline-none"
            >
              {PROJECT_DISPLAY_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className={`${fieldClassName} xl:col-span-2`}>
            <FieldLabel label="Loại sản phẩm" required className={labelClassName} />
            <div className="grid gap-3 rounded-[24px] border border-line px-5 py-4 sm:grid-cols-2">
              {PRODUCT_TYPE_OPTIONS.map((productType) => (
                <label key={productType} className="flex items-center gap-3 text-sm font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={form.productTypes.includes(productType)}
                    onChange={(event) => toggleProductType(productType, event.target.checked)}
                    className="h-4 w-4 rounded border-line"
                  />
                  {productType}
                </label>
              ))}
            </div>
            {productTypesError ? <p className="text-sm font-medium text-red-600">{productTypesError}</p> : null}
          </label>
          <div className="xl:col-span-2">
            <ImageUploadField label="Ảnh đại diện" required value={form.thumbnail} folder="projects" description="Chọn một ảnh đại diện để hiển thị ở card và trang chi tiết." onUploaded={(url) => setForm((c) => ({ ...c, thumbnail: url }))} />
          </div>
          <div className="xl:col-span-2">
            <RichTextEditor
              label="Mô tả"
              required
              value={form.description}
              onChange={(value) => setForm((c) => ({ ...c, description: value }))}
              placeholder="Mô tả"
            />
          </div>
          <label className={`${fieldClassName} xl:col-span-2`}>
            <FieldLabel label="Tiện ích" className={labelClassName} />
            <textarea
              value={form.utilities}
              onChange={(e) => setForm((c) => ({ ...c, utilities: e.target.value }))}
              className="min-h-24 rounded-[24px] border border-line px-5 py-4 text-sm outline-none"
              placeholder={"Mỗi tiện ích một dòng\nVí dụ:\nBể bơi\nCông viên, đường dạo bộ"}
            />
          </label>
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Bộ ảnh dự án"
              value={form.gallery}
              folder="projects"
              multiple
              description="Có thể chọn nhiều ảnh một lần để thêm vào bộ gallery của dự án."
              onRemove={(url) =>
                setForm((c) => ({
                  ...c,
                  gallery: c.gallery
                    .split("\n")
                    .map((item) => item.trim())
                    .filter((item) => item && item !== url)
                    .join("\n")
                }))
              }
              onUploaded={(url) => setForm((c) => ({ ...c, gallery: c.gallery ? `${c.gallery}\n${url}` : url }))}
            />
          </div>
          <button disabled={status === "submitting" || status === "loading"} className="h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70 xl:col-span-2">
            {status === "submitting" ? "Đang lưu..." : isEditing ? "Cập nhật dự án" : "Tạo dự án"}
          </button>
        </form>
      </div>
    </main>
  );
}
