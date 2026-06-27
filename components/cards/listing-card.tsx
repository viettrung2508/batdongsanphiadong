import Image from "next/image";
import Link from "next/link";

import { HtmlContent } from "@/components/shared/html-content";

type ListingCardProps = {
  href?: string;
  title: string;
  address: string;
  area: string;
  metric: string;
  price: string;
  image: string;
  badge?: string;
  isSold?: boolean;
  description?: string;
};

export function ListingCard({ href, title, address, area, metric, price, image, badge, isSold, description }: ListingCardProps) {
  const content = (
    <article className="content-lift group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-soft transition duration-500 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <div className="relative h-44 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgba(8,18,37,0.18)_100%)] opacity-80" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy">{badge ?? area}</span>
          <div className="rounded-xl bg-[linear-gradient(135deg,#fff5e1,#ffebbb)] px-3 py-2 text-right shadow-[0_10px_20px_rgba(191,138,38,0.12)] ring-1 ring-[#ecd39c]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f6a13]">
              {badge?.toLowerCase().includes("thuê") ? "Giá thuê" : "Giá bán"}
            </p>
            <p className="mt-1 text-base font-black leading-none text-[#8b5a16]">{price}</p>
          </div>
        </div>
        <div className="flex min-h-[3.1rem] flex-wrap items-start gap-2">
          <h3 className="font-display text-[1.25rem] leading-tight text-ink">{title}</h3>
          {isSold ? (
            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
              Đã bán
            </span>
          ) : null}
        </div>
        <p className="min-h-[2.25rem] text-sm leading-5 text-steel">{address}</p>
        <p className="text-sm leading-5 font-medium text-navy">{metric}</p>
        {description ? (
          <div className="min-h-[5rem] overflow-hidden">
            <HtmlContent
              html={description}
              className="prose prose-sm max-w-none overflow-hidden text-steel prose-p:my-0 prose-p:leading-6 prose-li:leading-6 prose-strong:text-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
            />
          </div>
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
