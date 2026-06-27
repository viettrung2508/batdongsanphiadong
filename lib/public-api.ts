import type { ApartmentListing, LandListing, Post, Project, RentalListing } from "@/types";

const backendUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type BackendCoordinates =
  | {
      lat: number;
      lng: number;
    }
  | null
  | undefined;

type BackendProject = {
  id: string;
  slug: string;
  kind?: string;
  name: string;
  area: string;
  areaSlug?: string;
  address: string;
  price: string;
  hotline: string;
  thumbnail: string;
  gallery: string[];
  description: string;
  mapEmbedUrl?: string | null;
  isFeatured: boolean;
  badge?: string | null;
  cardMeta?: string | null;
  projectStatusTag?: string | null;
  coordinates?: BackendCoordinates;
  investor?: string | null;
  bannerImage?: string | null;
  scale?: string | null;
  productTypes?: string[];
  villaInfo?: string | null;
  shophouseInfo?: string | null;
  startTime?: string | null;
  handoverTime?: string | null;
  ownership?: string | null;
  utilities?: string[];
  apartments?: {
    id: string;
    slug: string;
    name: string;
    price: string;
    size?: string | null;
    rentalType?: string | null;
    thumbnail: string;
    bannerImage?: string | null;
    status: string;
    isFeatured: boolean;
    isSold: boolean;
  }[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt?: string;
};

type BackendLandListing = {
  id: string;
  slug: string;
  kind?: string;
  name: string;
  area: string;
  areaSlug?: string;
  address: string;
  acreage?: string | null;
  legal?: string | null;
  price: string;
  hotline: string;
  thumbnail: string;
  bannerImage?: string | null;
  gallery: string[];
  description: string;
  mapEmbedUrl?: string | null;
  isFeatured: boolean;
  isSold: boolean;
  badge?: string | null;
  cardMeta?: string | null;
  coordinates?: BackendCoordinates;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt?: string;
};

type BackendRental = {
  id: string;
  slug: string;
  kind?: string;
  name: string;
  area: string;
  areaSlug?: string;
  address: string;
  size?: string | null;
  rentalType?: string | null;
  price: string;
  hotline: string;
  thumbnail: string;
  bannerImage?: string | null;
  gallery: string[];
  description: string;
  mapEmbedUrl?: string | null;
  isFeatured: boolean;
  isSold: boolean;
  badge?: string | null;
  cardMeta?: string | null;
  coordinates?: BackendCoordinates;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt?: string;
};

type BackendApartment = BackendRental & {
  projectName?: string | null;
  projectSlug?: string | null;
  isSold: boolean;
};

type BackendPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  thumbnail: string;
  bannerImage?: string | null;
  content: string;
  relatedPostIds?: string[];
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type BackendArea = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

function withFallbackCoordinates(coordinates: BackendCoordinates) {
  return coordinates ?? { lat: 21.028511, lng: 105.804817 };
}

function formatPublishedDate(value?: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("vi-VN");
}

function normalizeOptionalText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function mapProject(item: BackendProject): Project {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    kind: "project",
    area: item.area,
    areaSlug: item.areaSlug,
    address: item.address,
    coordinates: withFallbackCoordinates(item.coordinates),
    price: item.price,
    hotline: item.hotline,
    thumbnail: item.thumbnail,
    gallery: item.gallery ?? [],
    description: item.description,
    mapEmbedUrl: item.mapEmbedUrl ?? undefined,
    isFeatured: item.isFeatured,
    badge: item.badge ?? undefined,
    cardMeta: item.cardMeta ?? "",
    projectStatusTag: item.projectStatusTag && item.projectStatusTag !== "NONE" ? (item.projectStatusTag as Project["projectStatusTag"]) : undefined,
    updatedAt: item.updatedAt ?? undefined,
    investor: normalizeOptionalText(item.investor) ?? "Đang cập nhật",
    bannerImage: item.bannerImage ?? item.thumbnail,
    scale: normalizeOptionalText(item.scale) ?? "Đang cập nhật",
    productTypes: item.productTypes ?? [],
    villaInfo: normalizeOptionalText(item.villaInfo),
    shophouseInfo: normalizeOptionalText(item.shophouseInfo),
    startTime: normalizeOptionalText(item.startTime),
    handoverTime: normalizeOptionalText(item.handoverTime),
    ownership: normalizeOptionalText(item.ownership),
    utilities: item.utilities ?? [],
    apartments: (item.apartments ?? []).map((apartment) => ({
      id: apartment.id,
      slug: apartment.slug,
      name: apartment.name,
      price: apartment.price,
      size: apartment.size ?? undefined,
      rentalType: apartment.rentalType ?? undefined,
      thumbnail: apartment.thumbnail,
      bannerImage: apartment.bannerImage ?? undefined,
      status: apartment.status,
      isFeatured: apartment.isFeatured,
      isSold: apartment.isSold
    })),
    seoTitle: item.seoTitle ?? undefined,
    seoDescription: item.seoDescription ?? undefined
  };
}

function mapLandListing(item: BackendLandListing): LandListing {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    kind: "land",
    area: item.area,
    areaSlug: item.areaSlug,
    address: item.address,
    coordinates: withFallbackCoordinates(item.coordinates),
    price: item.price,
    hotline: item.hotline,
    thumbnail: item.thumbnail,
    gallery: item.gallery ?? [],
    description: item.description,
    mapEmbedUrl: item.mapEmbedUrl ?? undefined,
    isFeatured: item.isFeatured,
    isSold: item.isSold,
    badge: item.badge ?? undefined,
    cardMeta: item.cardMeta ?? "",
    updatedAt: item.updatedAt ?? undefined,
    acreage: item.acreage ?? "Đang cập nhật",
    legal: item.legal ?? "Đang cập nhật",
    bannerImage: item.bannerImage ?? item.thumbnail,
    seoTitle: item.seoTitle ?? undefined,
    seoDescription: item.seoDescription ?? undefined
  };
}

function mapRental(item: BackendRental): RentalListing {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    kind: "rental",
    area: item.area,
    areaSlug: item.areaSlug,
    address: item.address,
    coordinates: withFallbackCoordinates(item.coordinates),
    price: item.price,
    hotline: item.hotline,
    thumbnail: item.thumbnail,
    gallery: item.gallery ?? [],
    description: item.description,
    mapEmbedUrl: item.mapEmbedUrl ?? undefined,
    isFeatured: item.isFeatured,
    isSold: item.isSold,
    badge: item.badge ?? undefined,
    cardMeta: item.cardMeta ?? "",
    updatedAt: item.updatedAt ?? undefined,
    size: item.size ?? "Đang cập nhật",
    rentalType: item.rentalType ?? undefined,
    bannerImage: item.bannerImage ?? item.thumbnail,
    seoTitle: item.seoTitle ?? undefined,
    seoDescription: item.seoDescription ?? undefined
  };
}

function mapApartment(item: BackendApartment): ApartmentListing {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    kind: "apartment",
    area: item.area,
    areaSlug: item.areaSlug,
    address: item.address,
    coordinates: withFallbackCoordinates(item.coordinates),
    price: item.price,
    hotline: item.hotline,
    thumbnail: item.thumbnail,
    gallery: item.gallery ?? [],
    description: item.description,
    mapEmbedUrl: item.mapEmbedUrl ?? undefined,
    isFeatured: item.isFeatured,
    badge: item.badge ?? undefined,
    cardMeta: item.cardMeta ?? "",
    updatedAt: item.updatedAt ?? undefined,
    size: item.size ?? "Đang cập nhật",
    rentalType: item.rentalType ?? undefined,
    bannerImage: item.bannerImage ?? item.thumbnail,
    projectName: item.projectName ?? undefined,
    projectSlug: item.projectSlug ?? undefined,
    isSold: item.isSold,
    seoTitle: item.seoTitle ?? undefined,
    seoDescription: item.seoDescription ?? undefined
  };
}

function mapPost(item: BackendPost): Post {
  const publishedDate = item.publishedAt ?? item.createdAt;
  const updatedDate = item.updatedAt ?? publishedDate;

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    publishedAt: formatPublishedDate(publishedDate),
    publishedAtIso: publishedDate ?? undefined,
    updatedAtIso: updatedDate ?? undefined,
    excerpt: item.excerpt,
    thumbnail: item.thumbnail,
    bannerImage: item.bannerImage ?? item.thumbnail,
    content: item.content ?? "",
    relatedPostSlugs: item.relatedPostIds,
    seoTitle: item.seoTitle ?? undefined,
    seoDescription: item.seoDescription ?? undefined
  };
}

function mapArea(item: BackendArea) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description ?? undefined
  };
}

async function fetchJson<T>(path: string) {
  const response = await fetch(`${backendUrl}${path}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`FETCH_FAILED:${path}`);
  }

  return (await response.json()) as T;
}

async function fetchList<T>(path: string) {
  const data = await fetchJson<{ items: T[] } | T[]>(path);

  return Array.isArray(data) ? data : data.items;
}

export async function getPublicProjects(params?: {
  featured?: boolean;
  area?: string;
  propertyType?: string;
  sort?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();

  if (typeof params?.featured === "boolean") {
    searchParams.set("featured", String(params.featured));
  }

  if (params?.area) {
    searchParams.set("area", params.area);
  }

  if (params?.propertyType) {
    searchParams.set("propertyType", params.propertyType);
  }

  if (params?.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const items = await fetchList<BackendProject>(`/api/projects${suffix}`);
  return items.map(mapProject);
}

export async function getPublicProjectBySlug(slug: string) {
  const item = await fetchJson<BackendProject>(`/api/projects/${slug}`);
  return mapProject(item);
}

export async function getPublicLandListings(params?: {
  area?: string;
  featured?: boolean;
  propertyType?: string;
  sort?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.area) {
    searchParams.set("area", params.area);
  }

  if (typeof params?.featured === "boolean") {
    searchParams.set("featured", String(params.featured));
  }

  if (params?.propertyType) {
    searchParams.set("propertyType", params.propertyType);
  }

  if (params?.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const items = await fetchList<BackendLandListing>(`/api/land-listings${suffix}`);
  return items.map(mapLandListing);
}

export async function getPublicLandListingBySlug(slug: string) {
  const item = await fetchJson<BackendLandListing>(`/api/land-listings/${slug}`);
  return mapLandListing(item);
}

export async function getPublicRentals(params?: {
  area?: string;
  featured?: boolean;
  propertyType?: string;
  sort?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.area) {
    searchParams.set("area", params.area);
  }

  if (typeof params?.featured === "boolean") {
    searchParams.set("featured", String(params.featured));
  }

  if (params?.propertyType) {
    searchParams.set("propertyType", params.propertyType);
  }

  if (params?.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const items = await fetchList<BackendRental>(`/api/rentals${suffix}`);
  return items.map(mapRental);
}

export async function getPublicRentalBySlug(slug: string) {
  const item = await fetchJson<BackendRental>(`/api/rentals/${slug}`);
  return mapRental(item);
}

export async function getPublicApartments(params?: {
  projectSlug?: string;
  area?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.projectSlug) {
    searchParams.set("projectSlug", params.projectSlug);
  }

  if (params?.area) {
    searchParams.set("area", params.area);
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const items = await fetchList<BackendApartment>(`/api/apartments${suffix}`);
  return items.map(mapApartment);
}

export async function getPublicApartmentBySlug(slug: string) {
  const item = await fetchJson<BackendApartment>(`/api/apartments/${slug}`);
  return mapApartment(item);
}

export async function getPublicAreas() {
  const items = await fetchList<BackendArea>("/api/areas");
  return items.map(mapArea);
}

export async function getPublicPosts(params?: { category?: string; search?: string }) {
  const searchParams = new URLSearchParams();

  if (params?.category) {
    searchParams.set("category", params.category);
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const items = await fetchList<BackendPost>(`/api/posts${suffix}`);
  return items.map(mapPost);
}

export async function getPublicPostBySlug(slug: string) {
  const item = await fetchJson<BackendPost>(`/api/posts/${slug}`);
  return mapPost(item);
}
