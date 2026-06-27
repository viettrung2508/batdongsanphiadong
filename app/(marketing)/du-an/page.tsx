import type { Metadata } from "next";

import { ProjectCard } from "@/components/cards/project-card";
import { FeaturedProjectHeroCarousel } from "@/components/shared/featured-project-hero-carousel";
import { FilterBar } from "@/components/shared/filter-bar";
import { ListingShortcuts } from "@/components/shared/listing-shortcuts";
import { getPublicLandListings, getPublicPosts, getPublicProjects, getPublicRentals } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Danh sách dự án",
  description: "Danh sách dự án bất động sản đáng chú ý tại khu Đông Hà Nội, cập nhật theo khu vực và mức độ nổi bật.",
  path: "/du-an"
});

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ featured?: string; area?: string; propertyType?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [featuredProjects, filteredProjects, featuredLandListings, featuredRentals, latestPosts] = await Promise.all([
    getPublicProjects({ featured: true }),
    getPublicProjects({
      featured: params.featured === "true" ? true : params.featured === "false" ? false : undefined,
      area: params.area || undefined,
      propertyType: params.propertyType || undefined,
      sort: params.sort || undefined
    }),
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
      {featuredProjects.length ? (
        <section>
          <FeaturedProjectHeroCarousel projects={featuredProjects} />
        </section>
      ) : null}

      <section className="shell pt-5 sm:pt-6">
        <FilterBar
          action="/du-an"
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
                { label: "Tất cả dự án", value: "" },
                { label: "Dự án nổi bật", value: "true" }
              ]
            },
            {
              name: "propertyType",
              label: "Loại hình",
              defaultValue: params.propertyType ?? "",
              options: [
                { label: "Tất cả loại hình", value: "" },
                { label: "Chung cư", value: "Chung cư" },
                { label: "Biệt thự", value: "Biệt thự" },
                { label: "Shophouse", value: "Shophouse" },
                { label: "Liền kề", value: "Liền kề" }
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
          Hiện đang có {filteredProjects.length.toLocaleString("vi-VN")} dự án
        </p>
      </section>

      <section className="shell pb-12 pt-5 sm:pb-14 sm:pt-6">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_248px]">
          <div className="grid gap-5 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
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
