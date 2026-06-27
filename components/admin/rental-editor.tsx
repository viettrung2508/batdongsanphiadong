"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ImageUploadField } from "./image-upload-field";
import { FieldLabel } from "./field-label";
import { LocationAutocompleteInput } from "./location-autocomplete-input";
import type { LocationSelection } from "./location-selection";
import { RichTextEditor } from "./rich-text-editor";
import { slugify } from "./slug";
import { fetchAdminApi } from "./admin-api";
import type { AreaOption } from "./area-options";
import { useUnsavedChangesRegistration } from "./unsaved-changes-provider";
const initialForm = { name: "", slug: "", areaSlug: "gia-lam", address: "", size: "", rentalType: "Shophouse", price: "", hotline: "0377281119", thumbnail: "", bannerImage: "", gallery: "", description: "", isFeatured: true, isSold: false, seoTitle: "", seoDescription: "", status: "PUBLISHED", latitude: "", longitude: "", badge: "Cho thuê", cardMeta: "" };

export function RentalEditor({ slug }: { slug?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "submitting" | "success" | "error">(slug ? "loading" : "idle");
  const [errorMessage, setErrorMessage] = useState("");
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

  useEffect(() => {
    async function loadAreas() {
      try {
        const response = await fetchAdminApi("/api/areas");
        if (!response.ok) throw new Error("LOAD_AREAS_FAILED");
        const data = (await response.json()) as { items: AreaOption[] };
        setAreaOptions(data.items);
      } catch {
        setAreaOptions([]);
      }
    }
    void loadAreas();
  }, []);

  useEffect(() => {
    async function loadItem() {
      if (!slug) return;
      try {
        const response = await fetchAdminApi(`/api/rentals/${slug}`);
        if (!response.ok) throw new Error("LOAD_FAILED");
        const item = (await response.json()) as any;
        const nextForm = { name: item.name, slug: item.slug, areaSlug: item.areaSlug, address: item.address, size: item.size ?? "", rentalType: item.rentalType ?? "", price: item.price, hotline: item.hotline, thumbnail: item.thumbnail, bannerImage: item.bannerImage ?? "", gallery: item.gallery?.join("\n") ?? "", description: item.description, isFeatured: item.isFeatured, isSold: item.isSold ?? false, seoTitle: item.seoTitle ?? "", seoDescription: item.seoDescription ?? "", status: item.status, latitude: item.coordinates?.lat?.toString() ?? "", longitude: item.coordinates?.lng?.toString() ?? "", badge: item.badge ?? "Cho thuê", cardMeta: item.cardMeta ?? "" };
        setForm(nextForm);
        setInitialSnapshot(JSON.stringify(nextForm));
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMessage("Chưa thể tải chi tiết sản phẩm cho thuê.");
      }
    }
    void loadItem();
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const response = await fetchAdminApi(isEditing ? `/api/rentals/${slug}` : "/api/rentals", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, gallery: form.gallery.split("\n").map((item) => item.trim()).filter(Boolean), size: form.size || undefined, rentalType: form.rentalType || undefined, latitude: form.latitude || undefined, longitude: form.longitude || undefined, bannerImage: form.bannerImage || undefined, seoTitle: form.seoTitle || undefined, seoDescription: form.seoDescription || undefined, badge: form.badge || undefined, cardMeta: form.cardMeta || undefined })
      });
      if (!response.ok) throw new Error("SAVE_FAILED");
      setStatus("success");
      allowNavigation();
      router.push("/dashboard/rentals");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Chưa thể lưu sản phẩm cho thuê.");
    }
  }

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">{isEditing ? "Chi tiết cho thuê" : "Tạo sản phẩm"}</p><h1 className="mt-2 font-display text-4xl text-ink">{isEditing ? "Chỉnh sửa sản phẩm cho thuê" : "Tạo mới sản phẩm cho thuê"}</h1></div>
          <Link href="/dashboard/rentals" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">Quay lại danh sách</Link>
        </div>
        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        {status === "success" ? <p className="mt-4 text-sm font-medium text-green-700">Lưu dữ liệu thành công.</p> : null}
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 xl:grid-cols-2">
          <input type="hidden" value={form.slug} readOnly />
          <label className={fieldClassName}><FieldLabel label="Tên sản phẩm" required className={labelClassName} /><input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value, slug: slugify(e.target.value) }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Tên sản phẩm" required /></label>
          <label className={fieldClassName}><FieldLabel label="Khu vực" className={labelClassName} /><select value={form.areaSlug} onChange={(e) => setForm((c) => ({ ...c, areaSlug: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none">{areaOptions.map((area) => (<option key={area.id} value={area.slug}>{area.name}</option>))}</select></label>
          <label className={fieldClassName}><FieldLabel label="Địa chỉ" required className={labelClassName} /><LocationAutocompleteInput value={form.address} onChange={(value) => setForm((c) => ({ ...c, address: value }))} onLocationSelect={handleLocationSelect} className="h-12 w-full rounded-full border border-line px-5 text-sm outline-none" placeholder="Địa chỉ" required /></label>
          <label className={fieldClassName}><FieldLabel label="Giá thuê" required className={labelClassName} /><input value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Giá thuê" required /></label>
          <label className={fieldClassName}><FieldLabel label="Diện tích" className={labelClassName} /><input value={form.size} onChange={(e) => setForm((c) => ({ ...c, size: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Diện tích" /></label>
          <label className="flex items-center gap-3 rounded-[20px] border border-line px-5 py-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((c) => ({ ...c, isFeatured: e.target.checked }))}
              className="h-4 w-4 rounded border-line"
            />
            Sản phẩm nổi bật
          </label>
          <label className="flex items-center gap-3 rounded-[20px] border border-line px-5 py-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={form.isSold}
              onChange={(e) => setForm((c) => ({ ...c, isSold: e.target.checked }))}
              className="h-4 w-4 rounded border-line"
            />
            Đã bán
          </label>
          <label className={fieldClassName}><FieldLabel label="Loại hình" className={labelClassName} /><input value={form.rentalType} onChange={(e) => setForm((c) => ({ ...c, rentalType: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Loại hình" /></label>
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Ảnh đại diện"
              required
              value={form.thumbnail}
              folder="rentals"
              description="Chọn một ảnh đại diện để hiển thị ở danh sách và trang chi tiết."
              onRemove={() => setForm((c) => ({ ...c, thumbnail: "" }))}
              onUploaded={(url) => setForm((c) => ({ ...c, thumbnail: url }))}
            />
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
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Bộ ảnh cho thuê"
              value={form.gallery}
              folder="rentals"
              multiple
              description="Có thể chọn nhiều ảnh một lần để thêm vào bộ ảnh của sản phẩm."
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
          <button disabled={status === "submitting" || status === "loading"} className="h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70 xl:col-span-2">{status === "submitting" ? "Đang lưu..." : isEditing ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}</button>
        </form>
      </div>
    </main>
  );
}
