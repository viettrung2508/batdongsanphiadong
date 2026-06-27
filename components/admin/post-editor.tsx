"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ImageUploadField } from "./image-upload-field";
import { FieldLabel } from "./field-label";
import { RichTextEditor } from "./rich-text-editor";
import { slugify } from "./slug";
import { fetchAdminApi } from "./admin-api";
import type { AreaOption } from "./area-options";
import { useUnsavedChangesRegistration } from "./unsaved-changes-provider";

function getDefaultPublishedAtValue() {
  return new Date().toISOString().slice(0, 16);
}

const POST_CATEGORY_OPTIONS = [
  "Thị trường",
  "Dự án",
  "Pháp lý",
  "Quy hoạch",
  "Đầu tư",
  "Hạ tầng",
  "Cho thuê",
  "Kinh nghiệm mua bán"
] as const;

const initialForm = { title: "", slug: "", excerpt: "", content: "", category: "Thị trường", thumbnail: "", bannerImage: "", seoTitle: "", seoDescription: "", publishedAt: getDefaultPublishedAtValue(), status: "PUBLISHED", relatedPostIds: "", areaSlug: "gia-lam" };

export function PostEditor({ slug }: { slug?: string }) {
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
        const response = await fetchAdminApi(`/api/posts/${slug}`);
        if (!response.ok) throw new Error("LOAD_FAILED");
        const item = (await response.json()) as any;
        const nextForm = { title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content ?? "", category: item.category, thumbnail: item.thumbnail, bannerImage: item.bannerImage ?? "", seoTitle: item.seoTitle ?? "", seoDescription: item.seoDescription ?? "", publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : "", status: item.status, relatedPostIds: item.relatedPostIds?.join(", ") ?? "", areaSlug: item.area?.slug ?? "gia-lam" };
        setForm(nextForm);
        setInitialSnapshot(JSON.stringify(nextForm));
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMessage("Chưa thể tải chi tiết bài viết.");
      }
    }
    void loadItem();
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const normalizedPublishedAt = form.publishedAt ? new Date(form.publishedAt).toISOString() : new Date().toISOString();

      const response = await fetchAdminApi(isEditing ? `/api/posts/${slug}` : "/api/posts", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, relatedPostIds: form.relatedPostIds.split(",").map((item) => item.trim()).filter(Boolean), bannerImage: form.bannerImage || undefined, seoTitle: form.seoTitle || undefined, seoDescription: form.seoDescription || undefined, publishedAt: normalizedPublishedAt, areaSlug: form.areaSlug || undefined })
      });
      if (!response.ok) throw new Error("SAVE_FAILED");
      setStatus("success");
      allowNavigation();
      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Chưa thể lưu bài viết.");
    }
  }

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">{isEditing ? "Chi tiết bài viết" : "Tạo bài viết"}</p><h1 className="mt-2 font-display text-4xl text-ink">{isEditing ? "Chỉnh sửa bài viết" : "Tạo mới bài viết"}</h1></div>
          <Link href="/dashboard/posts" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">Quay lại danh sách</Link>
        </div>
        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        {status === "success" ? <p className="mt-4 text-sm font-medium text-green-700">Lưu dữ liệu thành công.</p> : null}
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 xl:grid-cols-2">
          <input type="hidden" value={form.slug} readOnly />
          <label className={`${fieldClassName} xl:col-span-2`}><FieldLabel label="Tiêu đề" required className={labelClassName} /><input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value, slug: slugify(e.target.value) }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Tiêu đề" required /></label>
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Ảnh đại diện"
              required
              value={form.thumbnail}
              folder="posts"
              description="Chọn một ảnh đại diện để hiển thị ở danh sách bài viết và trang chi tiết."
              onRemove={() => setForm((c) => ({ ...c, thumbnail: "" }))}
              onUploaded={(url) => setForm((c) => ({ ...c, thumbnail: url }))}
            />
          </div>
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Ảnh banner"
              value={form.bannerImage}
              folder="posts"
              description="Có thể thêm ảnh banner riêng cho phần đầu bài viết."
              onRemove={() => setForm((c) => ({ ...c, bannerImage: "" }))}
              onUploaded={(url) => setForm((c) => ({ ...c, bannerImage: url }))}
            />
          </div>
          <label className={`${fieldClassName} xl:col-span-2`}><FieldLabel label="Tóm tắt" required className={labelClassName} /><textarea value={form.excerpt} onChange={(e) => setForm((c) => ({ ...c, excerpt: e.target.value }))} className="min-h-24 rounded-[24px] border border-line px-5 py-4 text-sm outline-none" placeholder="Tóm tắt" required /></label>
          <label className={fieldClassName}><FieldLabel label="Chuyên mục" required className={labelClassName} /><select value={form.category} onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" required>{POST_CATEGORY_OPTIONS.map((category) => (<option key={category} value={category}>{category}</option>))}</select></label>
          <label className={fieldClassName}><FieldLabel label="Khu vực" className={labelClassName} /><select value={form.areaSlug} onChange={(e) => setForm((c) => ({ ...c, areaSlug: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none">{areaOptions.map((area) => (<option key={area.id} value={area.slug}>{area.name}</option>))}</select></label>
          <label className={fieldClassName}><FieldLabel label="Ngày đăng" className={labelClassName} /><input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm((c) => ({ ...c, publishedAt: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" /></label>
          <div className="xl:col-span-2">
            <RichTextEditor
              label="Nội dung"
              required
              value={form.content}
              onChange={(value) => setForm((c) => ({ ...c, content: value }))}
              placeholder="Nội dung bài viết"
            />
          </div>
          <button disabled={status === "submitting" || status === "loading"} className="h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70 xl:col-span-2">{status === "submitting" ? "Đang lưu..." : isEditing ? "Cập nhật bài viết" : "Tạo bài viết"}</button>
        </form>
      </div>
    </main>
  );
}
