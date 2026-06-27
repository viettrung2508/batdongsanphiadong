"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getProjectDisplayStatusClassName, getProjectDisplayStatusLabel } from "@/lib/project-display-status";
import { fetchAdminApi } from "./admin-api";

type ProjectItem = {
  id: string;
  name: string;
  slug: string;
  area: string;
  price: string;
  status: string;
  isFeatured: boolean;
  projectStatusTag?: "ON_SALE" | "COMING_SOON" | "HANDED_OVER" | null;
};

export function ProjectList() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadProjects() {
    setErrorMessage("");
    try {
      const response = await fetchAdminApi("/api/projects");
      if (!response.ok) {
        throw new Error("LOAD_FAILED");
      }
      const data = (await response.json()) as { items: ProjectItem[] };
      setItems(data.items);
    } catch {
      setErrorMessage("Chưa thể tải danh sách dự án từ backend.");
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function handleDelete(item: ProjectItem) {
    const confirmed = window.confirm(`Xóa dự án "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setErrorMessage("");

    try {
      const response = await fetchAdminApi(`/api/projects/${item.slug}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorData?.message || "DELETE_FAILED");
      }

      await loadProjects();
    } catch {
      setErrorMessage("Chưa thể xóa dự án.");
    } finally {
      setDeletingId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    return [item.name, item.slug, item.area, item.status].some((value) =>
      value.toLowerCase().includes(normalizedSearchTerm)
    );
  });

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Danh sách dự án</p>
            <h1 className="mt-2 font-display text-4xl text-ink">Quản lý dự án</h1>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void loadProjects()} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
              Tải lại
            </button>
            <Link href="/dashboard/projects/new" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
              Tạo dự án mới
            </Link>
          </div>
        </div>

        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}

        <div className="mt-6">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm theo tên, slug, khu vực hoặc trạng thái"
            className="h-11 w-full rounded-full border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-ink"
          />
        </div>

        <div className="mt-6 grid gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-line bg-mist p-5 transition hover:-translate-y-0.5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link href={`/dashboard/projects/${item.slug}`} className="text-lg font-semibold text-ink hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-steel">
                    {item.area} • {item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.isFeatured ? <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink">Nổi bật</span> : null}
                  {item.projectStatusTag ? (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getProjectDisplayStatusClassName(item.projectStatusTag)}`}>
                      {getProjectDisplayStatusLabel(item.projectStatusTag)}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingId === item.id ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!filteredItems.length ? (
            <div className="rounded-[24px] border border-dashed border-line bg-mist p-5 text-sm text-steel">
              {items.length ? "Không tìm thấy dự án phù hợp." : "Chưa có dự án nào."}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
