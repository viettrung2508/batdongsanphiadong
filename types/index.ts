export type RealEstateKind = "project" | "land" | "rental" | "apartment";
export type ProjectDisplayStatus = "NONE" | "ON_SALE" | "COMING_SOON" | "HANDED_OVER";

export type RealEstateBase = {
  id: string;
  slug: string;
  name: string;
  kind: RealEstateKind;
  area: string;
  areaSlug?: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price: string;
  hotline: string;
  thumbnail: string;
  gallery: string[];
  description: string;
  mapEmbedUrl?: string;
  isFeatured: boolean;
  badge?: string;
  cardMeta: string;
  updatedAt?: string;
};

export type Project = RealEstateBase & {
  investor: string;
  bannerImage: string;
  scale: string;
  productTypes: string[];
  villaInfo?: string;
  shophouseInfo?: string;
  startTime?: string;
  handoverTime?: string;
  ownership?: string;
  utilities: string[];
  apartments?: {
    id: string;
    slug: string;
    name: string;
    price: string;
    size?: string;
    rentalType?: string;
    thumbnail: string;
    bannerImage?: string;
    status: string;
    isFeatured: boolean;
    isSold: boolean;
  }[];
  floorPlanImages?: string[];
  seoTitle?: string;
  seoDescription?: string;
  projectStatusTag?: Exclude<ProjectDisplayStatus, "NONE">;
};

export type LandListing = RealEstateBase & {
  acreage: string;
  legal: string;
  isSold: boolean;
  bannerImage?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type RentalListing = RealEstateBase & {
  size: string;
  rentalType?: string;
  isSold: boolean;
  bannerImage?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type ApartmentListing = RealEstateBase & {
  size: string;
  rentalType?: string;
  bannerImage?: string;
  projectName?: string;
  projectSlug?: string;
  isSold: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  publishedAtIso?: string;
  updatedAtIso?: string;
  excerpt: string;
  thumbnail: string;
  bannerImage?: string;
  content: string;
  relatedPostSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
};
