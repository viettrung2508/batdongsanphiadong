"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchAdminApi } from "./admin-api";

type ContactItem = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source?: string | null;
  createdAt: string;
};

export function ContactManager() {
  const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
  const [items, setItems] = useState<ContactItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsErrorMessage, setSettingsErrorMessage] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "today" | "7d" | "30d">("all");
  const [selectedMessage, setSelectedMessage] = useState<{ name: string; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadItems() {
    setErrorMessage("");
    try {
      const response = await fetchAdminApi("/api/contacts");
      if (!response.ok) throw new Error("LOAD_FAILED");
      const data = (await response.json()) as { items: ContactItem[] };
      setItems(data.items);
    } catch {
      setErrorMessage("Chưa thể tải dữ liệu liên hệ từ backend.");
    }
  }

  async function loadSettings() {
    setSettingsErrorMessage("");

    try {
      const response = await fetchAdminApi("/api/contacts/settings");
      if (!response.ok) throw new Error("LOAD_SETTINGS_FAILED");
      const data = (await response.json()) as { notificationEmail?: string | null };
      setNotificationEmail(data.notificationEmail ?? "");
    } catch {
      setSettingsErrorMessage("Chưa thể tải email nhận thông báo.");
    }
  }

  useEffect(() => {
    void loadItems();
    void loadSettings();
  }, []);

  async function handleSaveSettings() {
    setIsSavingSettings(true);
    setSettingsMessage("");
    setSettingsErrorMessage("");

    try {
      const response = await fetchAdminApi("/api/contacts/settings", {
        method: "PATCH",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          notificationEmail
        })
      });

      if (!response.ok) {
        throw new Error("SAVE_SETTINGS_FAILED");
      }

      const data = (await response.json()) as { notificationEmail?: string | null };
      setNotificationEmail(data.notificationEmail ?? "");
      setSettingsMessage("Đã lưu email nhận thông báo thành công.");
    } catch {
      setSettingsErrorMessage("Chưa thể lưu email nhận thông báo.");
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function handleDeleteContact(item: ContactItem) {
    const confirmed = window.confirm(`Xóa liên hệ của "${item.name}"? Hành động này không thể hoàn tác.`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setErrorMessage("");

    try {
      const response = await fetchAdminApi(`/api/contacts/${item.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("DELETE_FAILED");
      }

      setItems((current) => current.filter((contact) => contact.id !== item.id));
      if (selectedMessage?.name === item.name && selectedMessage.message === (item.message ?? "")) {
        setSelectedMessage(null);
      }
    } catch {
      setErrorMessage("Chưa thể xóa liên hệ này.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const createdAt = new Date(item.createdAt);
      const normalizedSearch = searchTerm.trim().toLowerCase();

      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);
        if (createdAt < start) {
          return false;
        }
      }

      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999`);
        if (createdAt > end) {
          return false;
        }
      }

      if (normalizedSearch) {
        const haystack = `${item.name} ${item.phone}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }

      return true;
    });
  }, [endDate, items, searchTerm, startDate]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, searchTerm, quickFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function formatDateInput(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function applyQuickFilter(filter: "all" | "today" | "7d" | "30d") {
    setQuickFilter(filter);

    if (filter === "all") {
      setStartDate("");
      setEndDate("");
      return;
    }

    const now = new Date();
    const end = formatDateInput(now);
    const startDateValue = new Date(now);

    if (filter === "today") {
      const today = formatDateInput(now);
      setStartDate(today);
      setEndDate(today);
      return;
    }

    startDateValue.setDate(now.getDate() - (filter === "7d" ? 6 : 29));
    setStartDate(formatDateInput(startDateValue));
    setEndDate(end);
  }

  function escapeCsvValue(value: string) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }

  function handleExportExcel() {
    setIsExporting(true);

    try {
      const headers = ["Họ tên", "Số điện thoại", "Email", "Nguồn", "Thời gian", "Nội dung"];
      const rows = filteredItems.map((item) => [
        item.name,
        item.phone,
        item.email ?? "",
        item.source ?? "website",
        new Date(item.createdAt).toLocaleString("vi-VN"),
        item.message ?? ""
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => escapeCsvValue(cell)).join(","))
        .join("\n");

      const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `khach-hang-lien-he-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
      <div className="mb-6 rounded-[24px] border border-line bg-mist/60 p-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Cấu hình thông báo</p>
          <h3 className="mt-2 font-display text-2xl text-ink">Email nhận khách hàng mới</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-steel">
            Mỗi khi có khách gửi form liên hệ trên website, hệ thống sẽ gửi email thông báo đến địa chỉ này.
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Email nhận thông báo
            <input
              type="email"
              value={notificationEmail}
              onChange={(event) => setNotificationEmail(event.target.value)}
              className="h-11 rounded-full border border-line bg-white px-4 text-sm outline-none"
              placeholder="vi-du@domain.com"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => void handleSaveSettings()}
              disabled={isSavingSettings}
              className="h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSavingSettings ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
          </div>
        </div>
        {settingsMessage ? <p className="mt-3 text-sm font-medium text-emerald-700">{settingsMessage}</p> : null}
        {settingsErrorMessage ? <p className="mt-3 text-sm font-medium text-red-600">{settingsErrorMessage}</p> : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Yêu cầu liên hệ</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Danh sách khách hàng gửi tư vấn</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!filteredItems.length || isExporting}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isExporting ? "Đang xuất file..." : "Export Excel"}
          </button>
          <button type="button" onClick={() => void loadItems()} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
            Tải lại
          </button>
        </div>
      </div>
      {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
      <div className="mt-6 grid gap-4 rounded-[24px] border border-line bg-mist/60 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Tất cả" },
            { value: "today", label: "Hôm nay" },
            { value: "7d", label: "7 ngày qua" },
            { value: "30d", label: "30 ngày qua" }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => applyQuickFilter(option.value as "all" | "today" | "7d" | "30d")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                quickFilter === option.value ? "bg-ink text-white" : "border border-line bg-white text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Tìm theo tên / số điện thoại
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-11 rounded-full border border-line bg-white px-4 text-sm outline-none"
              placeholder="Nhập tên hoặc số điện thoại"
            />
          </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Từ ngày
          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setQuickFilter("all");
              setStartDate(event.target.value);
            }}
            className="h-11 rounded-full border border-line bg-white px-4 text-sm outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Đến ngày
          <input
            type="date"
            value={endDate}
            onChange={(event) => {
              setQuickFilter("all");
              setEndDate(event.target.value);
            }}
            className="h-11 rounded-full border border-line bg-white px-4 text-sm outline-none"
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              setQuickFilter("all");
              setStartDate("");
              setEndDate("");
              setSearchTerm("");
            }}
            className="h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink"
          >
            Xóa lọc
          </button>
        </div>
      </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-line">
        <div className="flex flex-col gap-3 border-b border-line bg-mist/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-steel">
            Hiển thị {filteredItems.length ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, filteredItems.length)} / {filteredItems.length} liên hệ
          </p>
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <span>Record / page</span>
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="h-10 rounded-[8px] border border-line bg-white px-3 text-sm outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-mist text-xs uppercase tracking-[0.16em] text-steel">
              <tr>
                <th className="px-4 py-4 font-semibold">Họ tên</th>
                <th className="px-4 py-4 font-semibold">Số điện thoại</th>
                <th className="px-4 py-4 font-semibold">Email</th>
                <th className="px-4 py-4 font-semibold">Nguồn</th>
                <th className="px-4 py-4 font-semibold">Thời gian</th>
                <th className="px-4 py-4 font-semibold">Nội dung</th>
                <th className="px-4 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedItems.length ? (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="border-t border-line align-top">
                    <td className="px-4 py-4 text-sm font-semibold text-ink">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-ink">{item.phone}</td>
                    <td className="px-4 py-4 text-sm text-steel">{item.email || "-"}</td>
                    <td className="px-4 py-4 text-sm text-steel">{item.source ?? "website"}</td>
                    <td className="px-4 py-4 text-sm text-steel">{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                    <td className="max-w-xl px-4 py-4 text-sm text-steel">
                      {item.message ? (
                        <button
                          type="button"
                          onClick={() => setSelectedMessage({ name: item.name, message: item.message ?? "" })}
                          className="block w-full text-left"
                        >
                          <span className="block overflow-hidden text-sm leading-7 text-steel [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                            {item.message}
                          </span>
                          <span className="mt-2 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-navy">
                            Xem đầy đủ
                          </span>
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDeleteContact(item)}
                        disabled={deletingId === item.id}
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-60"
                      >
                        {deletingId === item.id ? "Đang xóa..." : "Xóa"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-steel">
                    Không có khách hàng nào phù hợp bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-line bg-white px-4 py-4">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
              const isActive = page === safePage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={
                    isActive
                      ? "rounded-[8px] border border-ink bg-ink px-3.5 py-1.5 text-sm font-semibold text-white"
                      : "rounded-[8px] border border-line bg-white px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:border-ink/30"
                  }
                >
                  {page}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {selectedMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 px-4 py-8">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(8,18,37,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-steel">Nội dung liên hệ</p>
                <h3 className="mt-2 font-display text-3xl text-ink">{selectedMessage.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink"
              >
                Đóng
              </button>
            </div>
            <div className="mt-6 max-h-[70vh] overflow-y-auto rounded-[24px] border border-line bg-mist/60 p-5 text-sm leading-8 text-steel whitespace-pre-wrap">
              {selectedMessage.message}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
