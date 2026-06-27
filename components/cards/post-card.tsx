import Image from "next/image";
import Link from "next/link";

import { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className="content-lift group block transition duration-500 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
        <div className="relative h-56 overflow-hidden">
          <Image src={post.thumbnail} alt={post.title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgba(8,18,37,0.2)_100%)] opacity-80" />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-navy">
              {post.category}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">{post.publishedAt}</span>
          </div>
          <h3 className="min-h-[3.5rem] font-display text-2xl leading-tight text-ink">{post.title}</h3>
          <p className="min-h-[6.5rem] text-sm leading-7 text-steel">{post.excerpt}</p>
          <span className="mt-auto inline-flex self-start rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink transition group-hover:bg-ink group-hover:text-white">
            Xem chi tiết
          </span>
        </div>
      </article>
    </Link>
  );
}
