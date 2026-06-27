import { LandListing, Project, RentalListing } from "@/types";

export type RealEstateCardItem = {
  id: string;
  slug: string;
  kind: "project" | "land" | "rental";
  name: string;
  area: string;
  address: string;
  price: string;
  thumbnail: string;
  badge?: string;
  isSold?: boolean;
  cardMeta: string;
  description: string;
  href: string;
};

export function toProjectCardItem(project: Project): RealEstateCardItem {
  return {
    id: project.id,
    slug: project.slug,
    kind: "project",
    name: project.name,
    area: project.area,
    address: project.address,
    price: project.price,
    thumbnail: project.thumbnail,
    badge: project.badge,
    cardMeta: project.cardMeta,
    description: project.description,
    href: `/du-an/${project.slug}`
  };
}

export function toLandCardItem(item: LandListing): RealEstateCardItem {
  return {
    id: item.id,
    slug: item.slug,
    kind: "land",
    name: item.name,
    area: item.area,
    address: item.address,
    price: item.price,
    thumbnail: item.thumbnail,
    badge: item.badge,
    isSold: item.isSold,
    cardMeta: item.cardMeta,
    description: item.description,
    href: `/dat-nen/${item.slug}`
  };
}

export function toRentalCardItem(item: RentalListing): RealEstateCardItem {
  return {
    id: item.id,
    slug: item.slug,
    kind: "rental",
    name: item.name,
    area: item.area,
    address: item.address,
    price: item.price,
    thumbnail: item.thumbnail,
    badge: item.badge,
    isSold: item.isSold,
    cardMeta: item.cardMeta,
    description: item.description,
    href: `/cho-thue/${item.slug}`
  };
}
