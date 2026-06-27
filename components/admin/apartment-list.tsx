"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatAreaValue } from "@/lib/format-area";

import { fetchAdminApi } from "./admin-api";

type ApartmentItem = {
  id: string;
  name: string;
  slug: string;
  area: string;
  projectName: string | null;
  projectSlug: string | null;
  price: string;
  status: string;
  isSold: boolean;
  size?: string | null;
  rentalType?: string | null;
};

type ProjectOption = {
  id: string;
  name: string;
  slug: string;
};

export function ApartmentList() {
  const [items, setItems] = useState<ApartmentItem[]>([]);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadItems() {
    setErrorMessage("");
    try {
      const query = selectedProjectSlug ? `?projectSlug=${encodeURIComponent(selectedProjectSlug)}` : "";
      const response = await fetchAdminApi(`/api/apartments${query}`);
      if (!response.ok) {
        throw new Error("LOAD_FAILED");
      }

      const data = (await response.json()) as { items: ApartmentItem[] };
      setItems(data.items);
    } catch {
      setErrorMessage("Chưa thể tải danh sách căn hộ từ backend.");
    }
  }

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetchAdminApi("/api/projects");
        if (!response.ok) {
          throw new Error("LOAD_PROJECTS_FAILED");
        }

        const data = (await response.json()) as { items: ProjectOption[] };
        setProjectOptions(data.items);
      } catch {
        setProjectOptions([]);
      }
    }

    void loadProjects();
  }, []);

  useEffect(() => {
    void loadItems();
  }, [selectedProjectSlug]);

  async function handleDelete(item: ApartmentItem) {
    const confirmed = window.confirm(`Xóa căn hộ "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setErrorMessage("");

    try {
      const response = await fetchAdminApi(`/api/apartments/${item.slug}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorData?.message || "DELETE_FAILED");
      }

      await loadItems();
    } catch {
      setErrorMessage("Chưa thể xóa căn hộ.");
    } finally {
      setDeletingId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    return [item.name, item.slug, item.projectName ?? "", item.area, item.price, item.rentalType ?? "", item.status].some((value) =>
      value.toLowerCase().includes(normalizedSearchTerm)
    );
  });

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Danh sách căn hộ</p>
            <h1 className="mt-2 font-display text-4xl text-ink">Quản lý căn hộ</h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedProjectSlug}
              onChange={(event) => setSelectedProjectSlug(event.target.value)}
              className="h-11 rounded-full border border-line px-4 text-sm outline-none"
            >
              <option value="">Tất cả dự án</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.slug}>
                  {project.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => void loadItems()} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
              Tải lại
            </button>
            <Link href="/dashboard/apartments/new" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
              Tạo mới
            </Link>
          </div>
        </div>

        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}

        <div className="mt-6">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm theo tên, mã căn, dự án, khu vực, giá hoặc trạng thái"
            className="h-11 w-full rounded-full border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-ink"
          />
        </div>

        <div className="mt-6 grid gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-line bg-mist p-5 transition hover:-translate-y-0.5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link href={`/dashboard/apartments/${item.slug}`} className="text-lg font-semibold text-ink hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-steel">
                    {item.projectName ?? "Chưa gắn dự án"} • {item.price}
                    {item.size ? ` • ${formatAreaValue(item.size)}` : ""}
                    {item.rentalType ? ` • ${item.rentalType}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.isSold ? <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Đã bán</span> : null}
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
              {items.length ? "Không tìm thấy căn hộ phù hợp." : "Chưa có căn hộ nào."}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
