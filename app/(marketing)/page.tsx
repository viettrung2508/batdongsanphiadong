import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { FeaturedProjectCarousel } from "@/components/shared/featured-project-carousel";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatAreaValue } from "@/lib/format-area";
import { getPublicLandListings, getPublicPosts, getPublicProjects, getPublicRentals } from "@/lib/public-api";
import { toLandCardItem } from "@/lib/real-estate";
import { buildBreadcrumbSchema, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Bất động sản phía Đông Hà Nội",
  description: "Khám phá dự án, chuyển nhượng, cho thuê và tin tức thị trường bất động sản phía Đông Hà Nội.",
  path: "/",
  keywords: ["bất động sản phía đông hà nội", "dự án gia lâm", "đất nền long biên", "cho thuê shophouse"]
});

export default async function HomePage() {
  const [featuredProjects, landListings, rentals, posts] = await Promise.all([
    getPublicProjects({ featured: true }),
    getPublicLandListings({ featured: true }),
    getPublicRentals({ featured: true }),
    getPublicPosts()
  ]);
  const featuredLandListings = landListings.slice(0, 6);
  const latestPost = posts[0];
  const secondaryPosts = posts.slice(1, 5);
  const featuredRentals = rentals.slice(0, 10);
  const sectionClassName = "py-14 sm:py-16";
  const sectionInnerClassName = "shell";
  const primaryCtaClassName =
    "inline-flex rounded-full bg-[#0066cc] px-6 py-3 text-sm font-medium tracking-[-0.224px] text-white transition active:scale-95 hover:bg-[#0071e3]";
  const secondaryCtaClassName =
    "inline-flex rounded-full border border-[#0066cc] px-6 py-3 text-sm font-medium tracking-[-0.224px] text-[#0066cc] transition active:scale-95 hover:bg-[#0066cc] hover:text-white";
  const cardCtaClassName =
    "inline-flex rounded-[8px] border border-[#0066cc] px-4 py-2.5 text-sm font-medium tracking-[-0.224px] text-[#0066cc] transition hover:bg-[#0066cc] hover:text-white";

  return (
    <main>
      <JsonLd
        data={buildBreadcrumbSchema([{ name: "Trang chủ", path: "/" }])}
      />
      <section className="relative isolate overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <Image
            src="/hero-hanoi.jpg"
            alt="Toàn cảnh đô thị phía Đông Hà Nội"
            fill
            priority
            className="hero-image-motion object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.62)_44%,rgba(0,0,0,0.42)_100%)]" />
        <div className="shell relative z-10 grid min-h-[calc(100vh-80px)] items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <p className="hero-animate hero-animate-delay-1 text-sm font-medium tracking-[-0.12px] text-[#f5f5f7]">
              Danh mục nhà đất chọn lọc tại khu Đông Hà Nội
            </p>
            <h1 className="hero-animate hero-animate-delay-2 mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.04] tracking-[-0.32px] sm:text-7xl">
              Bất Động Sản Phía Đông Hà Nội
            </h1>
            <p className="hero-animate hero-animate-delay-3 mt-4 max-w-2xl text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-[#f5f5f7]">
              Chọn lọc dự án, chuyển nhượng và sản phẩm khai thác thực tế tại Gia Lâm, Long Biên, Đông Anh. Tập trung vào khu vực có câu chuyện hạ tầng rõ, khả năng giữ giá tốt và quỹ hàng đủ sạch để giao dịch.
            </p>
            <div className="hero-animate hero-animate-delay-4 mt-6 flex flex-wrap gap-2.5">
              {["Dự án", "Chuyển nhượng", "Cho thuê", "Theo dõi khu vực"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/18 bg-white/6 px-4 py-2 text-[12px] font-medium tracking-[-0.12px] text-[#f5f5f7]"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="hero-animate hero-animate-delay-4 mt-8 flex flex-wrap gap-3">
              <Link href="/du-an" className={primaryCtaClassName}>
                Xem dự án
              </Link>
              <Link href="/dat-nen" className={secondaryCtaClassName}>
                Xem chuyển nhượng
              </Link>
            </div>
          </div>

          <div className="hero-animate hero-animate-delay-4 rounded-[28px] bg-[#1d1d1f]/78 p-6 backdrop-blur-sm">
            <p className="text-[14px] font-medium tracking-[-0.224px] text-[#f5f5f7]">Nhịp thị trường hiện tại</p>
            <div className="mt-5 grid gap-4">
              <div className="border-b border-white/10 pb-4">
                <p className="text-[12px] font-medium tracking-[-0.12px] text-[#cccccc]">Khu vực theo dõi sát</p>
                <p className="mt-2 font-display text-[34px] font-semibold tracking-[-0.374px] text-white">Long Biên, Gia Lâm</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <p className="text-[12px] font-medium tracking-[-0.12px] text-[#cccccc]">Nhóm tài sản nổi bật</p>
                <p className="mt-2 text-[21px] font-semibold tracking-[0.231px] text-white">Dự án, shophouse, đất nền</p>
              </div>
              <div>
                <p className="text-[12px] font-medium tracking-[-0.12px] text-[#cccccc]">Tiêu chí chọn hàng</p>
                <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-[#f5f5f7]">
                  Pháp lý đủ rõ, vị trí dễ đọc giá trị khai thác, và mức giá còn dư địa cho giao dịch thực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`bg-white ${sectionClassName}`}>
        <div className={sectionInnerClassName}>
          <SectionHeading eyebrow="Dự án nổi bật" title="Những dự án đáng quan tâm tại khu Đông Hà Nội" />
          <FeaturedProjectCarousel projects={featuredProjects} />
        </div>
      </section>

      <section className={`bg-[#f5f5f7] ${sectionClassName}`}>
        <div className={sectionInnerClassName}>
          <SectionHeading eyebrow="Chuyển nhượng hot" title="Sản phẩm nổi bật theo từng khu vực tiềm năng" />
          <div className="grid gap-4">
            {featuredLandListings.map((item) => {
              const cardItem = toLandCardItem(item);

              return (
                <Link
                  key={item.id}
                  href={cardItem.href}
                  className="group grid gap-4 overflow-hidden rounded-[28px] border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:grid-cols-[260px_1fr]"
                >
                  <div className="relative h-52 overflow-hidden rounded-[24px] bg-mist md:h-full">
                    <Image
                      src={cardItem.thumbnail}
                      alt={cardItem.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-3 md:py-1">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-navy">
                          {cardItem.area}
                        </span>
                        {item.isSold ? (
                          <span className="ml-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-700">
                            Đã bán
                          </span>
                        ) : null}
                        <h3 className="mt-3 font-display text-[34px] leading-[1.08] tracking-[-0.28px] text-ink">{cardItem.name}</h3>
                        <p className="mt-1 text-sm leading-5 text-steel">{cardItem.address}</p>
                      </div>
                      <div className="rounded-2xl bg-[linear-gradient(135deg,#fff5e1,#ffebbb)] px-4 py-3 text-right shadow-[0_12px_24px_rgba(191,138,38,0.12)] ring-1 ring-[#ecd39c]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f6a13]">Giá bán</p>
                        <p className="mt-1 text-2xl font-black leading-none text-[#8b5a16]">{cardItem.price}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-navy">{cardItem.cardMeta}</p>
                    <p className="line-clamp-3 max-w-3xl text-[17px] leading-[1.42] tracking-[-0.374px] text-steel">
                      {cardItem.description.replace(/<[^>]+>/g, " ")}
                    </p>
                    <span className={`mt-auto self-start ${cardCtaClassName}`}>
                      Xem chi tiết
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 flex justify-center">
            <Link href="/dat-nen" className={secondaryCtaClassName}>
              Xem tất cả chuyển nhượng
            </Link>
          </div>
        </div>
      </section>

      <section className={`bg-white ${sectionClassName} text-ink`}>
        <div className={sectionInnerClassName}>
          <SectionHeading eyebrow="Cho thuê nổi bật" title="Mặt bằng và shophouse phù hợp khai thác thương mại" />
          <div className="overflow-hidden rounded-[18px] border border-line bg-white">
            <div className="hidden grid-cols-[88px_1.1fr_0.95fr_0.9fr_0.8fr_0.7fr] gap-4 border-b border-line bg-[#fbfbfd] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-steel lg:grid">
              <span>Ảnh</span>
              <span>Khu vực</span>
              <span>Diện tích</span>
              <span>Loại hình</span>
              <span>Giá thuê</span>
              <span className="text-right">Chi tiết</span>
            </div>
            <div className="divide-y divide-line">
              {featuredRentals.length ? (
                featuredRentals.map((item) => (
                  <Link
                    key={item.id}
                    href={`/cho-thue/${item.slug}`}
                    className="group block transition hover:bg-[#f8f8fb]"
                  >
                    <div className="grid gap-3 px-5 py-4 lg:grid-cols-[88px_1.1fr_0.95fr_0.9fr_0.8fr_0.7fr] lg:items-center">
                      <div className="relative h-20 overflow-hidden rounded-[8px] border border-line bg-mist">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Khu vực</p>
                        <p className="text-lg font-semibold text-ink">{item.name}</p>
                        <p className="mt-1 text-sm font-medium text-[#2997ff]">{item.area}</p>
                        <p className="mt-0.5 text-sm leading-5 text-steel">{item.address}</p>
                        {item.isSold ? (
                          <span className="mt-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-700">
                            Đã bán
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Diện tích</p>
                        <p className="text-sm font-medium text-ink">{formatAreaValue(item.size)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Loại hình</p>
                        <p className="text-sm text-ink">{item.rentalType ?? item.cardMeta}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Giá thuê</p>
                        <p className="text-lg font-semibold text-ink">{item.price}</p>
                      </div>
                      <div className="flex lg:justify-end">
                        <span className={cardCtaClassName}>
                          Xem chi tiết
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-steel">
                    Chưa có sản phẩm cho thuê nổi bật nào được cập nhật.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Link href="/cho-thue" className={secondaryCtaClassName}>
              Xem thêm
            </Link>
          </div>
        </div>
      </section>

      <section className={`bg-[#f5f5f7] ${sectionClassName}`}>
        <div className={sectionInnerClassName}>
          <SectionHeading eyebrow="Tin tức thị trường" title="Góc nhìn thị trường và thông tin đáng chú ý" />
          {latestPost ? (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <Link
                href={`/tin-tuc/${latestPost.slug}`}
                className="group relative block overflow-hidden rounded-[32px] bg-[#1d1d1f] transition hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="relative min-h-[500px]">
                  <Image
                    src={latestPost.thumbnail}
                    alt={latestPost.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.08),rgba(8,18,37,0.82))]" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-sand">
                      <span>{latestPost.category}</span>
                      <span>{latestPost.publishedAt}</span>
                    </div>
                    <h3 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
                      {latestPost.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">{latestPost.excerpt}</p>
                    <span className="mt-5 inline-flex rounded-[8px] border border-[#2997ff] px-5 py-3 text-sm font-medium tracking-[-0.224px] text-[#2997ff] transition group-hover:bg-[#0066cc] group-hover:text-white">
                      Xem chi tiết
                    </span>
                  </div>
                </div>
              </Link>

              <div className="grid content-start gap-x-5 gap-y-8 sm:grid-cols-2">
                {secondaryPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="group relative block overflow-hidden rounded-[28px] bg-[#1d1d1f] transition hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.12),rgba(8,18,37,0.86))]" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sand">{post.publishedAt}</p>
                        <h3 className="mt-2.5 font-display text-2xl leading-tight">{post.title}</h3>
                        <span className="mt-3 inline-flex rounded-[8px] border border-[#2997ff] px-4 py-2 text-sm font-medium tracking-[-0.224px] text-[#2997ff] transition group-hover:bg-[#0066cc] group-hover:text-white">
                          Xem chi tiết
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className={sectionInnerClassName}>
          <div className="rounded-[32px] border border-line bg-[#f5f5f7] p-8 sm:p-10">
            <p className="eyebrow">Liên hệ nhanh</p>
            <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="font-display text-5xl text-ink">Cần tư vấn nhanh về dự án phía Đông Hà Nội?</h2>
                <p className="mt-3 text-[17px] leading-[1.47] tracking-[-0.374px] text-steel">
                  Liên hệ ngay để nhận thông tin dự án, chuyển nhượng và sản phẩm cho thuê phù hợp với nhu cầu đầu tư hoặc khai thác thực tế.
                </p>
              </div>
              <Link href="/lien-he" className={primaryCtaClassName}>
                Liên hệ tư vấn ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
