"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { NearbyPlaces } from "@/components/shared/nearby-places";

type MapNearbyPanelProps = {
  area: string;
  center: {
    lat: number;
    lng: number;
  };
  title: string;
  defaultMapUrl?: string;
  hideNearbyPlaces?: boolean;
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

function buildGoogleEmbedUrl(mapUrl: string | undefined, fallbackArea: string) {
  if (!mapUrl) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(`${fallbackArea}, Hà Nội`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  }

  try {
    const parsedUrl = new URL(mapUrl);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (!hostname.includes("google.") && !hostname.includes("goo.gl")) {
      return mapUrl;
    }

    if (parsedUrl.searchParams.get("output") === "embed" || parsedUrl.pathname.includes("/maps/embed")) {
      return mapUrl;
    }

    const queryParam = parsedUrl.searchParams.get("q") || parsedUrl.searchParams.get("query");
    if (queryParam) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(queryParam)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
    const placeIndex = pathSegments.findIndex((segment) => segment === "place");
    if (placeIndex >= 0 && pathSegments[placeIndex + 1]) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(decodeURIComponent(pathSegments[placeIndex + 1]))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    const match = parsedUrl.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(`${match[1]},${match[2]}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  } catch {
    return mapUrl;
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(`${fallbackArea}, Hà Nội`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}

export function MapNearbyPanel({ area, center, title, defaultMapUrl, hideNearbyPlaces = false }: MapNearbyPanelProps) {
  const [activeTab, setActiveTab] = useState("schools");
  const [items, setItems] = useState<NearbyApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"mock" | "google">("mock");
  const embedMapUrl = buildGoogleEmbedUrl(defaultMapUrl, area);
  const shouldUseDashboardMap = Boolean(defaultMapUrl);

  useEffect(() => {
    let cancelled = false;

    async function loadNearbyPlaces() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/nearby?area=${encodeURIComponent(area)}&category=${encodeURIComponent(activeTab)}&lat=${encodeURIComponent(String(center.lat))}&lng=${encodeURIComponent(String(center.lng))}`
        );
        const data = (await response.json()) as {
          items?: NearbyApiItem[];
          source?: "mock" | "google";
        };

        if (cancelled) {
          return;
        }

        setItems(data.items ?? []);
        setSource(data.source ?? "mock");
      } catch {
        if (!cancelled) {
          setItems([]);
          setSource("mock");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadNearbyPlaces();

    return () => {
      cancelled = true;
    };
  }, [activeTab, area, center.lat, center.lng]);

  return (
    <div className="space-y-6">
      {shouldUseDashboardMap ? (
        <div className="overflow-hidden rounded-[32px] border border-line bg-white">
          <iframe title={`${title} map`} src={embedMapUrl} className="h-80 w-full" loading="lazy" />
          <div className="border-t border-line px-5 py-3">
            <Link
              href={defaultMapUrl!}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-ink transition hover:underline"
            >
              Mở Google Maps
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[32px] border border-line">
          <iframe
            title="Nearby map"
            src={embedMapUrl}
            className="h-80 w-full"
            loading="lazy"
          />
        </div>
      )}

      {hideNearbyPlaces ? null : (
        <NearbyPlaces
          area={area}
          center={center}
          activeTab={activeTab}
          onCategoryChange={setActiveTab}
          items={items}
          loading={loading}
          source={source}
        />
      )}
    </div>
  );
}
