"use client";

import { FormEvent, useEffect, useState } from "react";

import { fetchAdminApi } from "./admin-api";
import { FieldLabel } from "./field-label";
import { slugify } from "./slug";
import { useUnsavedChangesRegistration } from "./unsaved-changes-provider";

type AreaItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  propertyCount: number;
  postCount: number;
};

const initialForm = {
  name: "",
  slug: "",
  description: ""
};

export function AreaManager() {
  const [items, setItems] = useState<AreaItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState(() => JSON.stringify(initialForm));
  const hasUnsavedChanges = JSON.stringify(form) !== initialSnapshot;
  useUnsavedChangesRegistration(hasUnsavedChanges && !isSubmitting);

  async function loadItems() {
    setErrorMessage("");

    try {
      const response = await fetchAdminApi("/api/areas");
      if (!response.ok) {
        throw new Error("LOAD_FAILED");
      }

      const data = (await response.json()) as { items: AreaItem[] };
      setItems(data.items);
    } catch {
      setErrorMessage("Chưa thể tải danh sách khu vực từ backend.");
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setForm(initialForm);
    setInitialSnapshot(JSON.stringify(initialForm));
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetchAdminApi(editingId ? `/api/areas/${editingId}` : "/api/areas", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description || undefined
        })
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorData?.message || "SAVE_FAILED");
      }

      resetForm();
      await loadItems();
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Chưa thể lưu khu vực.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(item: AreaItem) {
    const confirmed = window.confirm(`Xóa khu vực "${item.name}"?`);
    if (!confirmed) {
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetchAdminApi(`/api/areas/${item.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorData?.message || "DELETE_FAILED");
      }

      if (editingId === item.id) {
        resetForm();
      }

      await loadItems();
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Chưa thể xóa khu vực.");
      }
    }
  }

  function handleEdit(item: AreaItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description ?? ""
    });
    setInitialSnapshot(
      JSON.stringify({
        name: item.name,
        slug: item.slug,
        description: item.description ?? ""
      })
    );
  }

  return (
    <main className="py-4">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Khu vực</p>
              <h1 className="mt-2 font-display text-4xl text-ink">{editingId ? "Chỉnh sửa khu vực" : "Thêm khu vực mới"}</h1>
            </div>
            <button type="button" onClick={resetForm} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
              Làm mới form
            </button>
          </div>

          {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <input type="hidden" value={form.slug} readOnly />
            <label className="grid gap-2">
              <FieldLabel label="Tên khu vực" required />
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
                placeholder="Ví dụ: Gia Lâm"
                required
              />
            </label>

            <label className="grid gap-2">
              <FieldLabel label="Mô tả ngắn" />
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 rounded-[24px] border border-line px-5 py-4 text-sm outline-none"
                placeholder="Mô tả ngắn về khu vực"
              />
            </label>

            <button disabled={isSubmitting} className="h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70">
              {isSubmitting ? "Đang lưu..." : editingId ? "Cập nhật khu vực" : "Thêm khu vực"}
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Danh sách khu vực</p>
              <h2 className="mt-2 font-display text-4xl text-ink">Quản lý nhanh</h2>
            </div>
            <button type="button" onClick={() => void loadItems()} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
              Tải lại
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {items.length ? (
              items.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-line bg-mist p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
                      {item.description ? <p className="mt-3 text-sm leading-7 text-steel">{item.description}</p> : null}
                      <p className="mt-3 text-sm text-steel">
                        {item.propertyCount} bất động sản • {item.postCount} bài viết
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(item)}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-line bg-mist px-5 py-8 text-sm text-steel">Chưa có khu vực nào.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
