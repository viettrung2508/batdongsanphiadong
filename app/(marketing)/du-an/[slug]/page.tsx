import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { MapNearbyPanel } from "@/components/shared/map-nearby-panel";
import { ProjectApartmentList } from "@/components/shared/project-apartment-list";
import { getPublicProjectBySlug } from "@/lib/public-api";
import { getProjectDisplayStatusClassName, getProjectDisplayStatusLabel } from "@/lib/project-display-status";
import { buildBreadcrumbSchema, buildMetadata, buildRealEstateWebPageSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: "Dự án không tồn tại",
      description: "Không tìm thấy dự án bạn đang quan tâm.",
      path: `/du-an/${slug}`
    });
  }

  return buildMetadata({
    title: project.seoTitle ?? project.name,
    description:
      project.seoDescription ??
      `${project.name} tại ${project.area}. Giá tham khảo ${project.price}. Xem chi tiết vị trí, tiện ích, pháp lý và danh sách căn hộ.`,
    path: `/du-an/${project.slug}`,
    image: project.bannerImage ?? project.thumbnail
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-white">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Dự án", path: "/du-an" },
            { name: project.name, path: `/du-an/${project.slug}` }
          ]),
          buildRealEstateWebPageSchema({
            title: project.seoTitle ?? project.name,
            description:
              project.seoDescription ??
              `${project.name} tại ${project.area}. Giá tham khảo ${project.price}. Xem chi tiết vị trí, tiện ích, pháp lý và danh sách căn hộ.`,
            path: `/du-an/${project.slug}`,
            image: project.bannerImage ?? project.thumbnail,
            price: project.price,
            address: project.address,
            area: project.area,
            hotline: project.hotline
          })
        ]}
      />
      <section className="relative isolate overflow-hidden border-b border-[#223552] bg-[linear-gradient(135deg,#12233c_0%,#1c3558_48%,#2a4a73_100%)] py-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,142,191,0.24),transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(78,113,162,0.32),transparent_34%)]" />
        <div className="shell relative z-10">
          <p className="hero-animate hero-animate-delay-1 text-[11px] uppercase tracking-[0.18em] text-[#b9cbe3] sm:text-xs">
            <Link href="/du-an">Dự án</Link> / {project.name}
          </p>
          {project.projectStatusTag ? (
            <span className={`hero-animate hero-animate-delay-1 mt-3 inline-flex rounded-[8px] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${getProjectDisplayStatusClassName(project.projectStatusTag)}`}>
              {getProjectDisplayStatusLabel(project.projectStatusTag)}
            </span>
          ) : null}
          <h1 className="hero-animate hero-animate-delay-2 mt-2 max-w-4xl font-display text-[2.15rem] leading-none text-white sm:text-[2.85rem]">
            {project.name}
          </h1>
        </div>
      </section>

      <section className="shell pb-[var(--space-section-y-tight)] pt-7 sm:pt-8">
        <div className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div className="section-reveal rounded-[16px] border border-[#e4c58a] bg-[radial-gradient(circle_at_top_left,#fff8e8,transparent_45%),linear-gradient(135deg,#fff4dc,#ffe6aa)] px-5 py-4 shadow-[0_16px_28px_rgba(191,138,38,0.14)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9f6a13]">Giá bán tham khảo</p>
              <p className="mt-2 font-display text-[2.35rem] leading-[0.95] text-[#7f4f10] drop-shadow-[0_8px_18px_rgba(191,138,38,0.14)] sm:text-[2.6rem]">
                {project.price}
              </p>
              <div className="mt-2.5 inline-flex rounded-[8px] bg-white/78 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9f6a13] ring-1 ring-[#e7c06d]">
                Bảng giá cập nhật liên tục
              </div>
            </div>

            <div className="section-reveal rounded-[16px] border border-line bg-mist px-5 py-5">
              <h2 className="font-display text-[2rem] text-ink sm:text-[2.2rem]">Tổng quan dự án</h2>
              <div className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-2">
                {[
                  ["Chủ đầu tư", project.investor],
                  ["Địa chỉ", project.address],
                  ["Quy mô", project.scale],
                  ["Khởi công", project.startTime ?? "Đang cập nhật"],
                  ["Bàn giao", project.handoverTime ?? "Đang cập nhật"],
                  ["Pháp lý", project.ownership ?? "Đang cập nhật"]
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-line/70 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
                    <p className="mt-1.5 text-[15px] font-semibold leading-6 text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-reveal rounded-[18px] border border-line p-6">
              <h2 className="font-display text-4xl text-ink">Thông tin chi tiết</h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-steel">
                <HtmlContent html={project.description} className="max-w-none" />
                <p>Sản phẩm: {project.productTypes.join(", ")}.</p>
                {project.villaInfo ? <p>Biệt thự: {project.villaInfo}.</p> : null}
                {project.shophouseInfo ? <p>Shophouse: {project.shophouseInfo}.</p> : null}
              </div>
            </div>

          </div>

          <aside className="space-y-5">
            <div className="section-reveal rounded-[18px] border border-line p-6">
              <h2 className="font-display text-4xl text-ink">Tiện ích nổi bật</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {project.utilities.map((utility) => (
                  <span key={utility} className="rounded-[8px] bg-mist px-3.5 py-1.5 text-sm font-medium text-navy">
                    {utility}
                  </span>
                ))}
              </div>
            </div>

            <div className="section-reveal">
              <DetailGallery title={project.name} images={project.gallery.length ? project.gallery : [project.thumbnail]} />
            </div>

            <div className="section-reveal">
              <MapNearbyPanel
                area={project.area}
                center={project.coordinates}
                title={project.name}
                defaultMapUrl={project.mapEmbedUrl}
                hideNearbyPlaces
              />
            </div>
          </aside>
        </div>

        <div className="section-reveal mt-7 rounded-[18px] border border-line p-6">
          <h2 className="font-display text-4xl text-ink">Danh sách căn hộ</h2>
          {project.apartments?.length ? (
            <ProjectApartmentList apartments={project.apartments} />
          ) : (
            <p className="mt-6 text-sm leading-7 text-steel">Dự án này chưa có căn hộ nào được cập nhật.</p>
          )}
        </div>
      </section>
    </main>
  );
}
