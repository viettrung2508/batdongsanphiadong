import type { Metadata } from "next";

import { ListingCard } from "@/components/cards/listing-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { ListingShortcuts } from "@/components/shared/listing-shortcuts";
import { getPublicLandListings, getPublicPosts, getPublicProjects, getPublicRentals } from "@/lib/public-api";
import { toRentalCardItem } from "@/lib/real-estate";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Mặt bằng và shophouse cho thuê phía Đông Hà Nội",
  description: "Khám phá mặt bằng, shophouse và sản phẩm cho thuê tại Long Biên, Gia Lâm, Đông Anh với thông tin diện tích và khả năng khai thác.",
  path: "/cho-thue",
  keywords: ["cho thuê shophouse long biên", "mặt bằng gia lâm", "cho thuê bất động sản phía đông hà nội"]
});

export default async function RentalPage({
  searchParams
}: {
  searchParams: Promise<{ area?: string; featured?: string; propertyType?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [filteredRentals, featuredProjects, featuredLandListings, featuredRentals, latestPosts] = await Promise.all([
    getPublicRentals({
      area: params.area,
      featured: params.featured === "true" ? true : params.featured === "false" ? false : undefined,
      propertyType: params.propertyType || undefined,
      sort: params.sort || undefined
    }),
    getPublicProjects({ featured: true }),
    getPublicLandListings({ featured: true }),
    getPublicRentals({ featured: true }),
    getPublicPosts()
  ]);
  const projectShortcutLinks = featuredProjects.map((project) => ({
    label: project.name,
    href: `/du-an/${project.slug}`
  }));
  const postShortcutLinks = latestPosts.slice(0, 5).map((post) => ({
    label: post.title,
    href: `/tin-tuc/${post.slug}`
  }));
  const featuredLandCounts = Array.from(
    featuredLandListings.reduce((map, item) => {
      const key = item.areaSlug ?? item.area;
      const current = map.get(key);
      map.set(key, { area: item.area, areaSlug: item.areaSlug ?? "", count: (current?.count ?? 0) + 1 });
      return map;
    }, new Map<string, { area: string; areaSlug: string; count: number }>())
      .values()
  );
  const featuredRentalCounts = Array.from(
    featuredRentals.reduce((map, item) => {
      const key = item.areaSlug ?? item.area;
      const current = map.get(key);
      map.set(key, { area: item.area, areaSlug: item.areaSlug ?? "", count: (current?.count ?? 0) + 1 });
      return map;
    }, new Map<string, { area: string; areaSlug: string; count: number }>())
      .values()
  );

  return (
    <main className="bg-mist pb-16">
      <section className="shell pt-8 sm:pt-10">
        <FilterBar
          action="/cho-thue"
          showSearch={false}
          filters={[
            {
              name: "area",
              label: "Khu vực",
              defaultValue: params.area ?? "",
              options: [
                { label: "Tất cả khu vực", value: "" },
                { label: "Gia Lâm", value: "gia-lam" },
                { label: "Long Biên", value: "long-bien" },
                { label: "Đông Anh", value: "dong-anh" }
              ]
            },
            {
              name: "featured",
              label: "Nổi bật",
              defaultValue: params.featured ?? "",
              options: [
                { label: "Tất cả sản phẩm", value: "" },
                { label: "Cho thuê nổi bật", value: "true" }
              ]
            },
            {
              name: "propertyType",
              label: "Loại hình",
              defaultValue: params.propertyType ?? "",
              options: [
                { label: "Tất cả loại hình", value: "" },
                { label: "Shophouse", value: "Shophouse" },
                { label: "Mặt bằng", value: "Mặt bằng" },
                { label: "Văn phòng", value: "Văn phòng" },
                { label: "Cho thuê", value: "Cho thuê" }
              ]
            },
            {
              name: "sort",
              label: "Sắp xếp",
              defaultValue: params.sort ?? "latest",
              options: [
                { label: "Mới nhất", value: "latest" },
                { label: "Giá cao nhất", value: "price_desc" },
                { label: "Giá thấp nhất", value: "price_asc" }
              ]
            }
          ]}
        />
        <p className="mt-3 text-sm font-medium text-steel">
          Hiện đang có {filteredRentals.length.toLocaleString("vi-VN")} sản phẩm cho thuê
        </p>
      </section>

      <section className="shell pb-12 pt-5 sm:pb-14 sm:pt-6">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_248px]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRentals.map((item) => {
              const cardItem = toRentalCardItem(item);

              return (
                <ListingCard
                  key={item.id}
                  href={cardItem.href}
                  title={cardItem.name}
                  address={cardItem.address}
                  area={cardItem.area}
                  badge={cardItem.badge}
                  isSold={cardItem.isSold}
                  metric={cardItem.cardMeta}
                  price={cardItem.price}
                  image={cardItem.thumbnail}
                  description={cardItem.description}
                />
              );
            })}
          </div>
          <ListingShortcuts
            sections={[
              {
                title: "Dự án nổi bật",
                links: projectShortcutLinks
              },
              {
                title: "Chuyển nhượng nổi bật",
                links: featuredLandCounts.map((item) => ({
                  label: `${item.area} (${item.count})`,
                  href: `/dat-nen?featured=true${item.areaSlug ? `&area=${item.areaSlug}` : ""}`
                }))
              },
              {
                title: "Cho thuê nổi bật",
                links: featuredRentalCounts.map((item) => ({
                  label: `${item.area} (${item.count})`,
                  href: `/cho-thue?featured=true${item.areaSlug ? `&area=${item.areaSlug}` : ""}`
                }))
              },
              {
                title: "Tin tức nổi bật",
                links: postShortcutLinks
              }
            ]}
          />
        </div>
      </section>
    </main>
  );
}
