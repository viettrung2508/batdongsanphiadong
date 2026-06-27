"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatAreaValue } from "@/lib/format-area";

import { fetchAdminApi } from "./admin-api";

type Item = {
  id: string;
  name: string;
  slug: string;
  area: string;
  price: string;
  status: string;
  isFeatured: boolean;
  isSold: boolean;
  acreage?: string | null;
};

export function LandListingList() {
  const [items, setItems] = useState<Item[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadItems() {
    setErrorMessage("");
    try {
      const response = await fetchAdminApi("/api/land-listings");
      if (!response.ok) throw new Error("LOAD_FAILED");
      const data = (await response.json()) as { items: Item[] };
      setItems(data.items);
    } catch {
      setErrorMessage("Chưa thể tải danh sách chuyển nhượng từ backend.");
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  async function handleDelete(item: Item) {
    const confirmed = window.confirm(`Xóa sản phẩm chuyển nhượng "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setErrorMessage("");

    try {
      const response = await fetchAdminApi(`/api/land-listings/${item.slug}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorData?.message || "DELETE_FAILED");
      }

      await loadItems();
    } catch {
      setErrorMessage("Chưa thể xóa sản phẩm chuyển nhượng.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Danh sách chuyển nhượng</p>
            <h1 className="mt-2 font-display text-4xl text-ink">Quản lý chuyển nhượng</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void loadItems()} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">Tải lại</button>
            <Link href="/dashboard/land-listings/new" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Tạo mới</Link>
          </div>
        </div>
        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-line bg-mist p-5 transition hover:-translate-y-0.5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link href={`/dashboard/land-listings/${item.slug}`} className="text-lg font-semibold text-ink hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-steel">{item.area} • {item.price}{item.acreage ? ` • ${formatAreaValue(item.acreage)}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.isFeatured ? <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink">Nổi bật</span> : null}
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
        </div>
      </div>
    </main>
  );
}
