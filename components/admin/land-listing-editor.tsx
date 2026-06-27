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

const initialForm = {
  name: "",
  slug: "",
  areaSlug: "gia-lam",
  address: "",
  acreage: "",
  legal: "",
  price: "",
  hotline: "0377281119",
  thumbnail: "",
  bannerImage: "",
  gallery: "",
  description: "",
  mapEmbedUrl: "",
  isFeatured: true,
  isSold: false,
  seoTitle: "",
  seoDescription: "",
  status: "PUBLISHED",
  latitude: "",
  longitude: "",
  badge: "Chuyển nhượng",
  cardMeta: ""
};

export function LandListingEditor({ slug }: { slug?: string }) {
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
        const response = await fetchAdminApi(`/api/land-listings/${slug}`);
        if (!response.ok) throw new Error("LOAD_FAILED");
        const item = (await response.json()) as any;
        const nextForm = {
          name: item.name,
          slug: item.slug,
          areaSlug: item.areaSlug,
          address: item.address,
          acreage: item.acreage ?? "",
          legal: item.legal ?? "",
          price: item.price,
          hotline: item.hotline,
          thumbnail: item.thumbnail,
          bannerImage: item.bannerImage ?? "",
          gallery: item.gallery?.join("\n") ?? "",
          description: item.description,
          mapEmbedUrl: item.mapEmbedUrl ?? "",
          isFeatured: item.isFeatured,
          isSold: item.isSold ?? false,
          seoTitle: item.seoTitle ?? "",
          seoDescription: item.seoDescription ?? "",
          status: item.status,
          latitude: item.coordinates?.lat?.toString() ?? "",
          longitude: item.coordinates?.lng?.toString() ?? "",
          badge: item.badge ?? "Chuyển nhượng",
          cardMeta: item.cardMeta ?? ""
        };
        setForm(nextForm);
        setInitialSnapshot(JSON.stringify(nextForm));
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMessage("Chưa thể tải chi tiết sản phẩm chuyển nhượng.");
      }
    }
    void loadItem();
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const response = await fetchAdminApi(isEditing ? `/api/land-listings/${slug}` : "/api/land-listings", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          gallery: form.gallery.split("\n").map((item) => item.trim()).filter(Boolean),
          latitude: form.latitude || undefined,
          longitude: form.longitude || undefined,
          bannerImage: form.bannerImage || undefined,
          mapEmbedUrl: form.mapEmbedUrl || undefined,
          seoTitle: form.seoTitle || undefined,
          seoDescription: form.seoDescription || undefined,
          acreage: form.acreage || undefined,
          legal: form.legal || undefined,
          badge: form.badge || undefined,
          cardMeta: form.cardMeta || undefined
        })
      });
      if (!response.ok) throw new Error("SAVE_FAILED");
      setStatus("success");
      allowNavigation();
      router.push("/dashboard/land-listings");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Chưa thể lưu sản phẩm chuyển nhượng.");
    }
  }

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">{isEditing ? "Chi tiết chuyển nhượng" : "Tạo chuyển nhượng"}</p>
            <h1 className="mt-2 font-display text-4xl text-ink">{isEditing ? "Chỉnh sửa sản phẩm chuyển nhượng" : "Tạo mới chuyển nhượng"}</h1>
          </div>
          <Link href="/dashboard/land-listings" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">Quay lại danh sách</Link>
        </div>
        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        {status === "success" ? <p className="mt-4 text-sm font-medium text-green-700">Lưu dữ liệu thành công.</p> : null}
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 xl:grid-cols-2">
          <input type="hidden" value={form.slug} readOnly />
          <label className={fieldClassName}><FieldLabel label="Tên sản phẩm" required className={labelClassName} /><input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value, slug: slugify(e.target.value) }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Tên sản phẩm" required /></label>
          <label className={fieldClassName}><FieldLabel label="Khu vực" className={labelClassName} /><select value={form.areaSlug} onChange={(e) => setForm((c) => ({ ...c, areaSlug: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none">{areaOptions.map((area) => (<option key={area.id} value={area.slug}>{area.name}</option>))}</select></label>
          <label className={fieldClassName}><FieldLabel label="Địa chỉ" required className={labelClassName} /><LocationAutocompleteInput value={form.address} onChange={(value) => setForm((c) => ({ ...c, address: value }))} onLocationSelect={handleLocationSelect} className="h-12 w-full rounded-full border border-line px-5 text-sm outline-none" placeholder="Địa chỉ" required /></label>
          <label className={`${fieldClassName} xl:col-span-2`}><FieldLabel label="Link Google Map" className={labelClassName} /><input value={form.mapEmbedUrl} onChange={(e) => setForm((c) => ({ ...c, mapEmbedUrl: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Dán link Google Map hoặc link embed" /></label>
          <label className={fieldClassName}><FieldLabel label="Giá bán" required className={labelClassName} /><input value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Giá bán" required /></label>
          <label className={fieldClassName}><FieldLabel label="Diện tích" className={labelClassName} /><input value={form.acreage} onChange={(e) => setForm((c) => ({ ...c, acreage: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Diện tích" /></label>
          <div className="grid gap-2 xl:col-span-2">
            <FieldLabel label="Trạng thái hiển thị" className={labelClassName} />
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-[20px] border border-line px-5 py-3 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((c) => ({ ...c, isFeatured: e.target.checked }))}
                  className="h-4 w-4 rounded border-line"
                />
                Chuyển nhượng nổi bật
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
            </div>
          </div>
          <label className={fieldClassName}><FieldLabel label="Pháp lý" className={labelClassName} /><input value={form.legal} onChange={(e) => setForm((c) => ({ ...c, legal: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Pháp lý" /></label>
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Ảnh đại diện"
              required
              value={form.thumbnail}
              folder="land-listings"
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
              label="Bộ ảnh chuyển nhượng"
              value={form.gallery}
              folder="land-listings"
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
          <button disabled={status === "submitting" || status === "loading"} className="h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70 xl:col-span-2">{status === "submitting" ? "Đang lưu..." : isEditing ? "Cập nhật chuyển nhượng" : "Tạo chuyển nhượng"}</button>
        </form>
      </div>
    </main>
  );
}
