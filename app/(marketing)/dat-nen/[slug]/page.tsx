import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { MapNearbyPanel } from "@/components/shared/map-nearby-panel";
import { formatAreaValue } from "@/lib/format-area";
import { getPublicLandListingBySlug } from "@/lib/public-api";
import { buildBreadcrumbSchema, buildMetadata, buildRealEstateWebPageSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicLandListingBySlug(slug);

  if (!item) {
    return buildMetadata({
      title: "Sản phẩm không tồn tại",
      description: "Không tìm thấy sản phẩm chuyển nhượng bạn đang quan tâm.",
      path: `/dat-nen/${slug}`
    });
  }

  return buildMetadata({
    title: item.seoTitle ?? item.name,
    description:
      item.seoDescription ??
      `${item.name} tại ${item.area}. Giá ${item.price}, pháp lý ${item.legal}. Xem chi tiết vị trí, diện tích và thông tin chuyển nhượng.`,
    path: `/dat-nen/${item.slug}`,
    image: item.bannerImage ?? item.thumbnail
  });
}

export default async function LandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicLandListingBySlug(slug);

  if (!item) {
    notFound();
  }
  return (
    <main className="bg-[#fcfaf4]">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Chuyển nhượng", path: "/dat-nen" },
            { name: item.name, path: `/dat-nen/${item.slug}` }
          ]),
          buildRealEstateWebPageSchema({
            title: item.seoTitle ?? item.name,
            description:
              item.seoDescription ??
              `${item.name} tại ${item.area}. Giá ${item.price}, pháp lý ${item.legal}. Xem chi tiết vị trí, diện tích và thông tin chuyển nhượng.`,
            path: `/dat-nen/${item.slug}`,
            image: item.bannerImage ?? item.thumbnail,
            price: item.price,
            address: item.address,
            area: item.area,
            hotline: item.hotline
          })
        ]}
      />
      <section className="relative isolate overflow-hidden border-b border-[#223552] bg-[linear-gradient(135deg,#12233c_0%,#1b3456_48%,#294a72_100%)] py-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(106,140,188,0.24),transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(77,111,159,0.3),transparent_34%)]" />
        <div className="shell relative z-10">
          <p className="hero-animate hero-animate-delay-1 text-[11px] uppercase tracking-[0.18em] text-[#b9cbe3] sm:text-xs">
            <Link href="/dat-nen">Chuyển nhượng</Link> / {item.name}
          </p>
          {item.isSold ? (
            <span className="hero-animate hero-animate-delay-1 mt-3 inline-flex rounded-full bg-red-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">
              Đã bán
            </span>
          ) : null}
          <h1 className="hero-animate hero-animate-delay-2 mt-2 max-w-4xl font-display text-[2.15rem] leading-none text-white sm:text-[2.85rem]">
            {item.name}
          </h1>
        </div>
      </section>

      <section className="shell pb-[var(--space-section-y-tight)] pt-7 sm:pt-8">
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="section-reveal rounded-[30px] border border-line bg-[linear-gradient(135deg,#ffffff,#f4f7fb)] p-6 shadow-[0_18px_36px_rgba(24,39,75,0.08)]">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-navy">Giá bán tham khảo</p>
              <p className="mt-3 font-display text-5xl leading-none text-ink">
                {item.price}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-mist px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-navy ring-1 ring-line">
                Giá theo từng vị trí
              </div>
              <p className="mt-3 text-sm leading-7 text-steel">
                Liên hệ để nhận thêm vị trí cụ thể, pháp lý và mức giá cập nhật theo từng lô.
              </p>
            </div>

            <div className="section-reveal grid gap-2.5 sm:grid-cols-2">
              {[
                ["Khu vực", item.area],
                ["Địa chỉ", item.address],
                ["Diện tích", formatAreaValue(item.acreage)],
                ["Pháp lý", item.legal],
                ["Tình trạng", item.isSold ? "Đã bán" : "Còn hàng"],
                ["Loại hình", item.badge ?? "Chuyển nhượng"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-line bg-white/90 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
                  <p className="mt-1.5 text-[15px] font-semibold leading-6 text-ink">{value}</p>
                </div>
              ))}
            </div>

            <div className="section-reveal rounded-[32px] border border-line bg-white p-6">
              <h2 className="font-display text-4xl text-ink">Thông tin chi tiết</h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-steel">
                <HtmlContent html={item.description} className="max-w-none" />
                <p>Thông tin nhanh: {item.cardMeta}.</p>
                <p>Khu vực quan tâm: {item.area}, phù hợp nhu cầu giữ tài sản và theo dõi hạ tầng khu Đông Hà Nội.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="section-reveal rounded-[32px] border border-[#30465d] bg-[#233449] p-6 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-[#dbe4ef]">Hotline / Zalo</p>
              <p className="mt-3 text-4xl font-semibold">{item.hotline}</p>
              <p className="mt-3 text-sm leading-6 text-[#dbe4ef]">
                Liên hệ để nhận vị trí chi tiết, pháp lý và tư vấn phù hợp với nhu cầu đầu tư hoặc giữ tài sản.
              </p>
            </div>

            <div className="section-reveal">
              <DetailGallery title={item.name} images={item.gallery.length ? item.gallery : [item.thumbnail]} />
            </div>

            <div className="section-reveal">
              <MapNearbyPanel
                area={item.area}
                center={item.coordinates}
                title={item.name}
                defaultMapUrl={item.mapEmbedUrl}
                hideNearbyPlaces
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
