"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type LocationSuggestion = {
  id: string;
  mainText: string;
  secondaryText: string;
  description: string;
  latitude: string;
  longitude: string;
};

type LocationAutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { address: string; latitude: string; longitude: string }) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
};

export function LocationAutocompleteInput({
  value,
  onChange,
  onLocationSelect,
  className,
  placeholder,
  required
}: LocationAutocompleteInputProps) {
  const inputId = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const trimmedValue = value.trim();
  const shouldSearch = hasUserInteracted && trimmedValue.length >= 2;
  const normalizedClassName = useMemo(
    () => className ?? "h-12 rounded-full border border-line px-5 text-sm outline-none",
    [className]
  );

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!shouldSearch) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const currentRequestId = ++requestIdRef.current;
      setIsLoading(true);

      const searchParams = new URLSearchParams({
        q: trimmedValue,
        limit: "5"
      });

      void fetch(`https://photon.komoot.io/api/?${searchParams.toString()}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("PHOTON_REQUEST_FAILED");
          }

          const data = (await response.json()) as {
            features?: Array<{
              properties?: {
                name?: string;
                city?: string;
                district?: string;
                state?: string;
                country?: string;
                street?: string;
                housenumber?: string;
              };
              geometry?: {
                coordinates?: [number, number];
              };
            }>;
          };

          if (currentRequestId !== requestIdRef.current) {
            return;
          }

          const nextSuggestions = (data.features ?? [])
            .map((feature, index) => {
              const coordinates = feature.geometry?.coordinates;
              const latitude = coordinates?.[1];
              const longitude = coordinates?.[0];

              if (typeof latitude !== "number" || typeof longitude !== "number") {
                return null;
              }

              const name = feature.properties?.name?.trim();
              const street = feature.properties?.street?.trim();
              const houseNumber = feature.properties?.housenumber?.trim();
              const city = feature.properties?.city?.trim() || feature.properties?.district?.trim();
              const state = feature.properties?.state?.trim();
              const country = feature.properties?.country?.trim();

              const mainText =
                name || [street, houseNumber].filter(Boolean).join(" ").trim() || city || state || trimmedValue;
              const secondaryParts = [street, city, state, country]
                .filter((part) => part && part !== mainText)
                .filter((part, partIndex, allParts) => allParts.indexOf(part) === partIndex);
              const secondaryText = secondaryParts.join(", ");
              const description = [mainText, secondaryText].filter(Boolean).join(", ");

              return {
                id: `${mainText}-${latitude}-${longitude}-${index}`,
                mainText,
                secondaryText,
                description,
                latitude: String(latitude),
                longitude: String(longitude)
              };
            })
            .filter((item): item is LocationSuggestion => Boolean(item));

          if (nextSuggestions.length > 0) {
            setSuggestions(nextSuggestions);
            setIsOpen(true);
            return;
          }

          setIsOpen(false);
        })
        .catch(() => {
          if (currentRequestId !== requestIdRef.current) {
            return;
          }

          setIsOpen(false);
        })
        .finally(() => {
          if (currentRequestId === requestIdRef.current) {
            setIsLoading(false);
          }
        });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [shouldSearch, trimmedValue]);

  async function handleSelectSuggestion(suggestion: LocationSuggestion) {
    onChange(suggestion.description);
    setSuggestions([]);
    setIsOpen(false);
    onLocationSelect?.({
      address: suggestion.description,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    });
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        id={inputId}
        value={value}
        onChange={(event) => {
          setHasUserInteracted(true);
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (hasUserInteracted && suggestions.length) {
            setIsOpen(true);
          }
        }}
        className={normalizedClassName}
        placeholder={placeholder}
        autoComplete="off"
        required={required}
      />
      {isOpen && (suggestions.length > 0 || isLoading) ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
          {isLoading ? (
            <div className="px-5 py-4 text-sm text-steel">Đang tìm gợi ý vị trí...</div>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => void handleSelectSuggestion(suggestion)}
                className="flex w-full flex-col items-start gap-1 border-b border-line px-5 py-4 text-left transition last:border-b-0 hover:bg-mist"
              >
                <span className="text-sm font-semibold text-ink">{suggestion.mainText}</span>
                {suggestion.secondaryText ? <span className="text-sm text-steel">{suggestion.secondaryText}</span> : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
