"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { formatAreaValue } from "@/lib/format-area";
import type { Project } from "@/types";

const PAGE_SIZE = 9;

type ApartmentItem = NonNullable<Project["apartments"]>[number];

export function ProjectApartmentList({ apartments }: { apartments: ApartmentItem[] }) {
  const [availableOnly, setAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApartments = useMemo(
    () => apartments.filter((apartment) => (availableOnly ? !apartment.isSold : true)),
    [apartments, availableOnly]
  );

  const totalPages = Math.max(1, Math.ceil(filteredApartments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleApartments = filteredApartments.slice(startIndex, startIndex + PAGE_SIZE);

  function handleToggleAvailableOnly(checked: boolean) {
    setAvailableOnly(checked);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-steel">
          Hiển thị {visibleApartments.length ? startIndex + 1 : 0}-{Math.min(startIndex + PAGE_SIZE, filteredApartments.length)} /{" "}
          {filteredApartments.length} căn
        </p>
        <label className="inline-flex w-fit items-center gap-2 rounded-[8px] border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => handleToggleAvailableOnly(event.target.checked)}
            className="h-4 w-4 accent-[#8f2d1f]"
          />
          Chỉ hiện căn chưa bán
        </label>
      </div>

      {visibleApartments.length ? (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleApartments.map((apartment) => (
              <Link
                key={apartment.id}
                href={`/can-ho/${apartment.slug}`}
                className="content-lift group overflow-hidden rounded-[12px] border border-line bg-white transition hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={apartment.bannerImage ?? apartment.thumbnail}
                    alt={apartment.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,31,0.04)_0%,rgba(7,16,31,0.2)_48%,rgba(7,16,31,0.84)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="rounded-[10px] bg-[rgba(7,16,31,0.46)] px-3.5 py-2.5 font-display text-[2.2rem] leading-[1] shadow-[0_10px_24px_rgba(7,16,31,0.22)] backdrop-blur-[3px]">
                        {apartment.name}
                      </p>
                      {apartment.isSold ? (
                        <span className="rounded-[8px] bg-[#ffe0dc] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f2d1f]">
                          Đã bán
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="space-y-3.5 p-5">
                  <div className="space-y-2.5 text-[15px] text-steel">
                    <p>
                      <span className="font-semibold text-ink">Giá:</span> {apartment.price}
                    </p>
                    <p className="line-clamp-2">
                      <span className="font-semibold text-ink">Loại hình:</span> {apartment.rentalType ?? "Căn hộ thuộc dự án"}
                    </p>
                    <p>
                      <span className="font-semibold text-ink">Diện tích:</span> {formatAreaValue(apartment.size ?? "Đang cập nhật")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                const isActive = page === safePage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={
                      isActive
                        ? "rounded-[8px] border border-ink bg-ink px-3.5 py-1.5 text-[13px] font-semibold text-white"
                        : "rounded-[8px] border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink transition hover:border-ink/30"
                    }
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-sm leading-7 text-steel">Không có căn hộ nào phù hợp với bộ lọc hiện tại.</p>
      )}
    </div>
  );
}
