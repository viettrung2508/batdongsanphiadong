import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { PostCard } from "@/components/cards/post-card";
import { HtmlContent } from "@/components/shared/html-content";
import { getPublicPostBySlug, getPublicPosts } from "@/lib/public-api";
import { buildArticleSchema, buildBreadcrumbSchema, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Bài viết không tồn tại",
      description: "Không tìm thấy bài viết bạn đang quan tâm.",
      path: `/tin-tuc/${slug}`
    });
  }

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/tin-tuc/${post.slug}`,
    image: post.bannerImage ?? post.thumbnail,
    type: "article"
  });
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPublicPostBySlug(slug), getPublicPosts()]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts.filter((item) => post.relatedPostSlugs?.includes(item.slug));
  const heroImage = post.bannerImage ?? post.thumbnail;

  return (
    <main className="bg-white">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Tin tức", path: "/tin-tuc" },
            { name: post.title, path: `/tin-tuc/${post.slug}` }
          ]),
          buildArticleSchema({
            title: post.seoTitle ?? post.title,
            description: post.seoDescription ?? post.excerpt,
            path: `/tin-tuc/${post.slug}`,
            image: post.bannerImage ?? post.thumbnail,
            publishedAt: post.publishedAtIso,
            modifiedAt: post.publishedAtIso,
            section: post.category
          })
        ]}
      />
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={post.title} fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.52)_0%,rgba(8,18,37,0.68)_48%,rgba(8,18,37,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(8,18,37,0.12),transparent_32%)]" />
        <div className="shell relative z-10">
          <div className="max-w-5xl rounded-[32px] bg-[linear-gradient(180deg,rgba(8,18,37,0.42),rgba(8,18,37,0.24))] p-6 shadow-[0_20px_50px_rgba(8,18,37,0.18)] backdrop-blur-[6px] sm:p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-sand">
              <Link href="/tin-tuc">Tin tức</Link> / {post.category}
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-5xl leading-[1.08] sm:text-6xl">{post.title}</h1>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-200">
              <span>{post.publishedAt}</span>
              <span>{post.category}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="space-y-8">
            <div className="relative h-[420px] overflow-hidden rounded-[32px]">
              <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
            </div>

            <div className="rounded-[32px] border border-line p-8">
              <div className="space-y-5 text-base leading-8 text-steel">
                <p className="text-lg font-medium text-ink">{post.excerpt}</p>
                <HtmlContent
                  html={post.content}
                  className="prose prose-slate max-w-none prose-p:leading-8 prose-headings:font-display prose-headings:text-ink prose-strong:text-ink"
                />
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-line bg-mist p-8">
              <p className="text-sm uppercase tracking-[0.22em] text-steel">Chuyên mục</p>
              <p className="mt-3 text-2xl font-semibold text-ink">{post.category}</p>
              <p className="mt-6 text-sm uppercase tracking-[0.22em] text-steel">Ngày đăng</p>
              <p className="mt-3 text-lg font-semibold text-ink">{post.publishedAt}</p>
            </div>

            <div className="rounded-[32px] border border-line bg-ink p-8 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-sand">Nhận tư vấn nhanh</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Cần thêm thông tin về dự án, chuyển nhượng hoặc sản phẩm cho thuê tại phía Đông Hà Nội, liên hệ ngay để được hỗ trợ.
              </p>
              <a
                href="tel:0377281119"
                className="mt-6 inline-flex rounded-full bg-sand px-5 py-3 text-sm font-semibold text-ink"
              >
                Hotline 0377281119
              </a>
            </div>
          </aside>
        </div>
      </section>

      {relatedPosts.length ? (
        <section className="section-gap bg-mist">
          <div className="shell">
            <div className="mb-10">
              <p className="eyebrow">Bài viết liên quan</p>
              <h2 className="section-title mt-3">Tiếp tục theo dõi thị trường</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {relatedPosts.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
