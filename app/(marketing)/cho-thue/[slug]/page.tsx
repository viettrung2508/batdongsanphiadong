import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { formatAreaValue } from "@/lib/format-area";
import { getPublicRentalBySlug } from "@/lib/public-api";
import { buildBreadcrumbSchema, buildMetadata, buildRealEstateWebPageSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicRentalBySlug(slug);

  if (!item) {
    return buildMetadata({
      title: "Sản phẩm không tồn tại",
      description: "Không tìm thấy sản phẩm cho thuê bạn đang quan tâm.",
      path: `/cho-thue/${slug}`
    });
  }

  return buildMetadata({
    title: item.seoTitle ?? item.name,
    description:
      item.seoDescription ??
      `${item.name} tại ${item.area}. Giá thuê ${item.price}, diện tích ${item.size}. Xem chi tiết vị trí và khả năng khai thác.`,
    path: `/cho-thue/${item.slug}`,
    image: item.bannerImage ?? item.thumbnail
  });
}

export default async function RentalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicRentalBySlug(slug);

  if (!item) {
    notFound();
  }
  return (
    <main className="bg-[#fffaf2]">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Cho thuê", path: "/cho-thue" },
            { name: item.name, path: `/cho-thue/${item.slug}` }
          ]),
          buildRealEstateWebPageSchema({
            title: item.seoTitle ?? item.name,
            description:
              item.seoDescription ??
              `${item.name} tại ${item.area}. Giá thuê ${item.price}, diện tích ${item.size}. Xem chi tiết vị trí và khả năng khai thác.`,
            path: `/cho-thue/${item.slug}`,
            image: item.bannerImage ?? item.thumbnail,
            price: item.price,
            address: item.address,
            area: item.area,
            hotline: item.hotline
          })
        ]}
      />
      <section className="relative isolate overflow-hidden border-b border-[#223552] bg-[linear-gradient(135deg,#11213a_0%,#193253_48%,#28486f_100%)] py-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(102,136,183,0.24),transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(75,109,156,0.3),transparent_34%)]" />
        <div className="shell relative z-10">
          <p className="hero-animate hero-animate-delay-1 text-[11px] uppercase tracking-[0.18em] text-[#b9cbe3] sm:text-xs">
            <Link href="/cho-thue">Cho thuê</Link> / {item.name}
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
            <div className="section-reveal rounded-[26px] border border-line bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.6),transparent_34%),linear-gradient(135deg,#ffffff,#f3f7fc)] px-5 py-5 shadow-[0_18px_34px_rgba(24,39,75,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-navy">Giá thuê tham khảo</p>
              <p className="mt-2.5 font-display text-[2.6rem] leading-[0.95] text-ink sm:text-[2.9rem]">
                {item.price}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-mist px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-navy ring-1 ring-line">
                Điều kiện thuê linh hoạt
              </div>
            </div>

            <div className="section-reveal grid gap-2.5 sm:grid-cols-2">
              {[
                ["Khu vực", item.area],
                ["Địa chỉ", item.address],
                ["Diện tích", formatAreaValue(item.size)],
                ["Loại hình", item.rentalType ?? item.badge ?? "Cho thuê"],
                ["Tình trạng", item.isSold ? "Đã bán" : "Còn hàng"],
                ["Hình thức", item.cardMeta]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-line bg-white px-4 py-3">
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
                <p>Phù hợp nhu cầu khai thác thương mại, văn phòng giao dịch hoặc mở rộng điểm kinh doanh tại khu Đông Hà Nội.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="section-reveal rounded-[26px] border border-[#34475b] bg-[#213143] px-5 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-[#dbe4ef]">Hotline / Zalo</p>
              <p className="mt-2.5 text-[2rem] font-semibold leading-none">{item.hotline}</p>
              <p className="mt-3 text-sm leading-6 text-[#dae4ef]">
                Liên hệ ngay để nhận mặt bằng phù hợp, điều kiện thuê và thông tin khai thác chi tiết.
              </p>
            </div>

            <div className="section-reveal">
              <DetailGallery title={item.name} images={item.gallery.length ? item.gallery : [item.thumbnail]} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
