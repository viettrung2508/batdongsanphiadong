import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { FilterBar } from "@/components/shared/filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublicPosts } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Tin tức bất động sản phía Đông Hà Nội",
  description: "Cập nhật tin tức thị trường, kinh nghiệm đầu tư và phân tích dự án tại khu Đông Hà Nội.",
  path: "/tin-tuc",
  keywords: ["tin tức bất động sản hà nội", "thị trường gia lâm", "phân tích long biên"]
});

export default async function NewsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const posts = await getPublicPosts({
    category: params.category || undefined,
    search: params.search || undefined
  });
  const latestPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="bg-mist">
      <section className="shell section-gap">
        <SectionHeading
          eyebrow="Tin tức"
          title="Cập nhật thị trường và kinh nghiệm đầu tư thực tế"
        />
        <FilterBar
          action="/tin-tuc"
          searchPlaceholder="Tìm kiếm bài viết"
          searchDefaultValue={params.search ?? ""}
          filters={[
            {
              name: "category",
              label: "Danh mục",
              defaultValue: params.category ?? "",
              options: [
                { label: "Tất cả danh mục", value: "" },
                { label: "Thị trường", value: "Thị trường" },
                { label: "Kinh nghiệm", value: "Kinh nghiệm" },
                { label: "Phân tích", value: "Phân tích" }
              ]
            }
          ]}
        />
        {latestPost ? (
          <div className="mt-8 space-y-5">
            <Link
              href={`/tin-tuc/${latestPost.slug}`}
              className="group relative block overflow-hidden rounded-[32px] bg-[#1d1d1f] transition hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
            >
              <div className="relative min-h-[420px] sm:min-h-[480px]">
                <Image
                  src={latestPost.thumbnail}
                  alt={latestPost.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.08),rgba(8,18,37,0.82))]" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-sand">
                    <span>{latestPost.category}</span>
                    <span>{latestPost.publishedAt}</span>
                  </div>
                  <h2 className="mt-3 max-w-4xl font-display text-[2rem] leading-tight sm:text-[2.7rem]">
                    {latestPost.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-[15px]">
                    {latestPost.excerpt}
                  </p>
                  <span className="mt-5 inline-flex rounded-[8px] border border-[#2997ff] px-5 py-2.5 text-sm font-medium text-[#d8ebff] transition group-hover:bg-[#0066cc] group-hover:text-white">
                    Xem chi tiết
                  </span>
                </div>
              </div>
            </Link>

            {remainingPosts.length ? (
              <div className="overflow-hidden rounded-[24px] border border-line bg-white">
                <div className="hidden grid-cols-[120px_1.25fr_0.85fr_0.7fr] gap-4 border-b border-line bg-[#fbfbfd] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-steel lg:grid">
                  <span>Ảnh</span>
                  <span>Bài viết</span>
                  <span>Danh mục</span>
                  <span className="text-right">Chi tiết</span>
                </div>
                <div className="divide-y divide-line">
                  {remainingPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/tin-tuc/${post.slug}`}
                      className="group block transition hover:bg-[#f8f8fb]"
                    >
                      <div className="grid gap-3 px-5 py-4 lg:grid-cols-[120px_1.25fr_0.85fr_0.7fr] lg:items-center">
                        <div className="relative h-24 overflow-hidden rounded-[10px] border border-line bg-mist">
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Bài viết</p>
                          <p className="text-xl font-semibold leading-tight text-ink">{post.title}</p>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-steel">{post.excerpt}</p>
                          <p className="mt-1.5 text-[12px] font-medium text-steel">{post.publishedAt}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Danh mục</p>
                          <span className="inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-navy">
                            {post.category}
                          </span>
                        </div>
                        <div className="flex lg:justify-end">
                          <span className="inline-flex rounded-[8px] border border-ink px-4 py-2 text-sm font-semibold text-ink transition group-hover:bg-ink group-hover:text-white">
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
        ) : null}
      </section>
    </main>
  );
}
