"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NearbyCategory = {
  id: string;
  label: string;
  icon: string;
  items: Array<{
    name: string;
    address: string;
    distance: string;
    time: string;
  }>;
};

type NearbyApiItem = {
  name: string;
  address: string;
  distance: string;
  time: string;
  googleMapsUri?: string;
  location?: {
    lat: number;
    lng: number;
  } | null;
};

type NearbyPlacesProps = {
  area: string;
  center: {
    lat: number;
    lng: number;
  };
  activeTab: string;
  onCategoryChange: (categoryId: string) => void;
  items: NearbyApiItem[];
  loading: boolean;
  source: "mock" | "google";
};

function buildNearbyCategories(area: string): NearbyCategory[] {
  return [
    {
      id: "schools",
      label: "Trường học",
      icon: "⌘",
      items: [
        { name: `Trường liên cấp ${area}`, address: `${area}, Hà Nội`, distance: "650 m", time: "3 phút" },
        { name: `Trường mầm non trung tâm ${area}`, address: `${area}, Hà Nội`, distance: "1,1 km", time: "4 phút" },
        { name: `Học viện quốc tế ${area}`, address: `${area}, Hà Nội`, distance: "1,8 km", time: "6 phút" }
      ]
    },
    {
      id: "supermarkets",
      label: "Siêu thị",
      icon: "⌂",
      items: [
        { name: `Siêu thị tiện ích ${area}`, address: `${area}, Hà Nội`, distance: "700 m", time: "3 phút" },
        { name: `Trung tâm thương mại ${area}`, address: `${area}, Hà Nội`, distance: "1,6 km", time: "5 phút" }
      ]
    },
    {
      id: "parks",
      label: "Công viên",
      icon: "◌",
      items: [
        { name: `Công viên trung tâm ${area}`, address: `${area}, Hà Nội`, distance: "900 m", time: "4 phút" },
        { name: `Vườn hoa ven hồ ${area}`, address: `${area}, Hà Nội`, distance: "1,4 km", time: "5 phút" }
      ]
    },
    {
      id: "hospitals",
      label: "Bệnh viện",
      icon: "+",
      items: [
        { name: `Bệnh viện đa khoa ${area}`, address: `${area}, Hà Nội`, distance: "1,2 km", time: "5 phút" },
        { name: `Phòng khám quốc tế ${area}`, address: `${area}, Hà Nội`, distance: "2,1 km", time: "7 phút" }
      ]
    },
    {
      id: "restaurants",
      label: "Nhà hàng",
      icon: "×",
      items: [
        { name: `Nhà hàng trung tâm ${area}`, address: `${area}, Hà Nội`, distance: "500 m", time: "2 phút" },
        { name: `Khu ẩm thực ${area}`, address: `${area}, Hà Nội`, distance: "1,3 km", time: "5 phút" }
      ]
    },
    {
      id: "your-location",
      label: "Vị trí của bạn",
      icon: "◎",
      items: [
        { name: `Vị trí dự án tại ${area}`, address: `${area}, Hà Nội`, distance: "0 m", time: "Tại chỗ" }
      ]
    }
  ];
}

export function NearbyPlaces({ area, center, activeTab, onCategoryChange, items, loading, source }: NearbyPlacesProps) {
  const categories = buildNearbyCategories(area);
  const activeCategory = categories.find((category) => category.id === activeTab) ?? categories[0];
  const displayItems = items.length
    ? items
    : activeCategory.items.map((item) => ({
        ...item,
        googleMapsUri: "",
        location: center
      }));

  return (
    <div className="overflow-hidden rounded-[32px] border border-line bg-white">
      <div className="overflow-x-auto border-b border-line">
        <div className="flex min-w-max gap-1 px-4 pt-4">
          {categories.map((category) => {
            const isActive = category.id === activeCategory.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`rounded-t-[20px] px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-b-2 border-[#ef4444] text-ink"
                    : "border-b-2 border-transparent text-steel hover:text-ink"
                }`}
              >
                <span className="mr-2 inline-block text-base align-middle">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm font-semibold text-steel">
          Có {items.length} {activeCategory.label.toLowerCase()} trong khu vực gần {area}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-steel/70">
          {loading ? "Đang tải dữ liệu..." : source === "google" ? "Dữ liệu thật từ Google Places" : "Dữ liệu minh họa"}
        </p>

        <div className="mt-6 space-y-5">
          {displayItems.map((place) => (
            <div key={`${activeCategory.id}-${place.name}`} className="flex items-start justify-between gap-6 border-b border-line pb-5 last:border-b-0 last:pb-0">
              <div>
                {place.googleMapsUri ? (
                  <Link href={place.googleMapsUri} target="_blank" className="text-xl font-semibold text-ink hover:underline">
                    {place.name}
                  </Link>
                ) : (
                  <h3 className="text-xl font-semibold text-ink">{place.name}</h3>
                )}
                <p className="mt-2 text-sm leading-7 text-steel">{place.address}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xl font-semibold text-ink">{place.distance || "Google Maps"}</p>
                <p className="mt-2 text-sm text-steel">{place.time || "Mở bản đồ"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
