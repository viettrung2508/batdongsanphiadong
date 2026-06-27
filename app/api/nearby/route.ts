import { NextRequest, NextResponse } from "next/server";

type NearbyCategoryId =
  | "schools"
  | "supermarkets"
  | "parks"
  | "hospitals"
  | "restaurants"
  | "your-location";

const CATEGORY_TYPE: Record<Exclude<NearbyCategoryId, "your-location">, string> = {
  schools: "school",
  supermarkets: "supermarket",
  parks: "park",
  hospitals: "hospital",
  restaurants: "restaurant"
};

export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area");
  const category = request.nextUrl.searchParams.get("category") as NearbyCategoryId | null;
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));

  if (!area || !category || (category !== "your-location" && !(category in CATEGORY_TYPE))) {
    return NextResponse.json({ error: "Missing or invalid query parameters." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ items: [], source: "mock", reason: "missing_api_key" });
  }

  if (category === "your-location") {
    return NextResponse.json({
      items: [
        {
          name: `Vị trí tại ${area}`,
          address: `${area}, Hà Nội`,
          distance: "0 m",
          time: "Tại chỗ",
          googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`,
          location: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
        }
      ],
      source: "google"
    });
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ items: [], source: "mock", reason: "missing_coordinates" });
  }

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.googleMapsUri,places.location"
      },
      body: JSON.stringify({
        includedTypes: [CATEGORY_TYPE[category]],
        maxResultCount: 5,
        rankPreference: "DISTANCE",
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng
            },
            radius: 2500
          }
        },
        languageCode: "vi"
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { items: [], source: "mock", reason: "upstream_error", detail: errorText },
        { status: 200 }
      );
    }

    const data = (await response.json()) as {
      places?: Array<{
        displayName?: { text?: string };
        formattedAddress?: string;
        googleMapsUri?: string;
        location?: {
          latitude?: number;
          longitude?: number;
        };
      }>;
    };

    const items =
      data.places?.map((place, index) => ({
        name: place.displayName?.text ?? `Địa điểm ${index + 1}`,
        address: place.formattedAddress ?? `${area}, Hà Nội`,
        distance: "",
        time: "",
        googleMapsUri: place.googleMapsUri ?? "",
        location:
          place.location?.latitude != null && place.location?.longitude != null
            ? { lat: place.location.latitude, lng: place.location.longitude }
            : null
      })) ?? [];

    return NextResponse.json({ items, source: "google" });
  } catch (error) {
    return NextResponse.json(
      {
        items: [],
        source: "mock",
        reason: "network_error",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 200 }
    );
  }
}
