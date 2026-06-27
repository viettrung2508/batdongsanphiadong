"use client";

import { useEffect, useRef, useState } from "react";

import { loadGoogleMapsApi } from "@/lib/google-maps";

type MapMarkerItem = {
  name: string;
  address: string;
  googleMapsUri?: string;
  location?: {
    lat: number;
    lng: number;
  } | null;
};

type InteractiveNearbyMapProps = {
  center: {
    lat: number;
    lng: number;
  };
  title: string;
  items: MapMarkerItem[];
};

export function InteractiveNearbyMap({ center, title, items }: InteractiveNearbyMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let cleanupMarkers: Array<{ map: null }> = [];

    async function initMap() {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        setError("missing-key");
        return;
      }

      try {
        const google = await loadGoogleMapsApi(apiKey);
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

        if (!mapRef.current || disposed) {
          return;
        }

        const map = new Map(mapRef.current, {
          center,
          zoom: 14,
          mapId: "whitespace-nearby-map",
          disableDefaultUI: false
        });

        const infoWindow = new InfoWindow();

        const propertyPin = new PinElement({
          background: "#0f2747",
          borderColor: "#ffffff",
          glyphColor: "#ffffff"
        });

        const propertyMarker = new AdvancedMarkerElement({
          map,
          position: center,
          title,
          content: propertyPin.element
        });

        cleanupMarkers = [propertyMarker as unknown as { map: null }];

        items.forEach((item) => {
          if (!item.location) {
            return;
          }

          const pin = new PinElement({
            background: "#d6c4a0",
            borderColor: "#0f2747",
            glyphColor: "#0f2747"
          });

          const marker = new AdvancedMarkerElement({
            map,
            position: item.location,
            title: item.name,
            content: pin.element
          });

          marker.addListener("click", () => {
            infoWindow.setContent(
              `<div style="max-width:220px"><strong>${item.name}</strong><br/>${item.address}</div>`
            );
            infoWindow.open({
              map,
              anchor: marker
            });
          });

          cleanupMarkers.push(marker as unknown as { map: null });
        });
      } catch {
        if (!disposed) {
          setError("load-failed");
        }
      }
    }

    void initMap();

    return () => {
      disposed = true;
      cleanupMarkers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [center, items, title]);

  if (error) {
    return (
      <div className="flex h-80 items-center justify-center rounded-[32px] border border-line bg-mist text-sm font-medium text-steel">
        Chưa cấu hình Google Maps JavaScript API.
      </div>
    );
  }

  return <div ref={mapRef} className="h-80 w-full rounded-[32px]" />;
}
