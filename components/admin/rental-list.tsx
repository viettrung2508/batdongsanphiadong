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
  size?: string | null;
  rentalType?: string | null;
};

export function RentalList() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  async function loadItems() {
    setErrorMessage("");
    try {
      const response = await fetchAdminApi("/api/rentals");
      if (!response.ok) throw new Error("LOAD_FAILED");
      const data = (await response.json()) as { items: Item[] };
      setItems(data.items);
    } catch {
      setErrorMessage("Chưa thể tải danh sách cho thuê từ backend.");
    }
  }
  useEffect(() => { void loadItems(); }, []);

  async function handleDelete(item: Item) {
    const confirmed = window.confirm(`Xóa sản phẩm cho thuê "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setErrorMessage("");

    try {
      const response = await fetchAdminApi(`/api/rentals/${item.slug}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorData?.message || "DELETE_FAILED");
      }

      await loadItems();
    } catch {
      setErrorMessage("Chưa thể xóa sản phẩm cho thuê.");
    } finally {
      setDeletingId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    return [item.name, item.slug, item.area, item.price, item.rentalType ?? "", item.status].some((value) =>
      value.toLowerCase().includes(normalizedSearchTerm)
    );
  });
  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Danh sách cho thuê</p><h1 className="mt-2 font-display text-4xl text-ink">Quản lý cho thuê</h1></div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void loadItems()} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">Tải lại</button>
            <Link href="/dashboard/rentals/new" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Tạo mới</Link>
          </div>
        </div>
        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        <div className="mt-6">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm theo tên, slug, khu vực, giá, loại hình hoặc trạng thái"
            className="h-11 w-full rounded-full border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-ink"
          />
        </div>
        <div className="mt-6 grid gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-line bg-mist p-5 transition hover:-translate-y-0.5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link href={`/dashboard/rentals/${item.slug}`} className="text-lg font-semibold text-ink hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-steel">{item.area} • {item.price}{item.size ? ` • ${formatAreaValue(item.size)}` : ""}{item.rentalType ? ` • ${item.rentalType}` : ""}</p>
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
          {!filteredItems.length ? (
            <div className="rounded-[24px] border border-dashed border-line bg-mist p-5 text-sm text-steel">
              {items.length ? "Không tìm thấy sản phẩm cho thuê phù hợp." : "Chưa có sản phẩm cho thuê nào."}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
