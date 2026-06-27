"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type HeaderProps = {
  featuredProjects: Array<{
    slug: string;
    name: string;
  }>;
  areas: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export function Header({ featuredProjects, areas }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navItems = [
    {
      href: "/du-an",
      label: "Dự án",
      children: featuredProjects.map((project) => ({
        href: `/du-an/${project.slug}`,
        label: project.name
      }))
    },
    {
      href: "/dat-nen",
      label: "Chuyển nhượng",
      children: areas.map((area) => ({
        href: `/dat-nen?area=${area.slug}`,
        label: area.name
      }))
    },
    {
      href: "/cho-thue",
      label: "Cho thuê",
      children: areas.map((area) => ({
        href: `/cho-thue?area=${area.slug}`,
        label: area.name
      }))
    },
    { href: "/tin-tuc", label: "Tin tức" },
    { href: "/lien-he", label: "Liên hệ" }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.1)]">
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.45),transparent)]" />
      <div className="shell flex min-h-20 items-center justify-between">
        <Link href="/" className="brand-link flex items-center gap-3 text-ink">
          <div className="brand-mark flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0.5 shadow-[0_16px_34px_rgba(15,23,42,0.12)]">
            <Image src="/favicon.jpeg" alt="Batdongsanphiadong" width={52} height={52} className="h-auto w-full object-contain" />
          </div>
          <div>
            <div className="font-display text-2xl leading-none">Batdongsanphiadong</div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-steel">Luxury Real Estate</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <div
              key={item.href}
              className="group relative"
              onMouseEnter={() => setActiveDropdown(item.children?.length ? item.href : null)}
              onMouseLeave={() => setActiveDropdown((current) => (current === item.href ? null : current))}
            >
              <div className="py-3">
                <Link
                  href={item.href}
                  onClick={() => {
                    if (item.children?.length) {
                      setActiveDropdown((current) => (current === item.href ? null : item.href));
                    } else {
                      setActiveDropdown(null);
                    }
                  }}
                  className="inline-flex min-h-10 items-center rounded-full px-3 text-sm text-ink transition hover:bg-slate-50 hover:text-[#8b5a16]"
                >
                  {item.label}
                </Link>
              </div>

              {item.children?.length ? (
                <div
                  className={`absolute left-0 top-full z-50 min-w-[220px] pt-2 transition duration-200 ${
                    activeDropdown === item.href
                      ? "visible translate-y-0 opacity-100"
                      : "invisible translate-y-2 opacity-0"
                  }`}
                >
                  <div className="rounded-[24px] border border-line bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-2xl px-4 py-3 text-sm text-ink transition hover:bg-mist hover:text-[#8b5a16]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          <a
            href="tel:0377281119"
            className="hotline-pulse inline-flex min-h-12 flex-col items-start justify-center rounded-full border border-[#0066cc] bg-[#0066cc] px-5 py-2.5 text-white transition hover:bg-[#0071e3]"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">Hotline 24/7</span>
            <span className="text-sm font-semibold tracking-[-0.224px] text-white">0377 281 119</span>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink md:hidden"
          aria-label="Open menu"
        >
          <span className="text-lg">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-white md:hidden">
          <div className="shell flex flex-col py-4">
            <a
              href="tel:0377281119"
              className="mb-4 inline-flex w-fit flex-col rounded-[20px] border border-[#0066cc] bg-[#0066cc] px-5 py-3 text-white"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">Hotline 24/7</span>
              <span className="mt-1 text-sm font-semibold tracking-[-0.224px]">0377 281 119</span>
            </a>
            {navItems.map((item) => (
              <div key={item.href} className="border-b border-line py-4">
                <Link href={item.href} onClick={() => setOpen(false)} className="text-sm text-ink">
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <div className="mt-3 flex flex-col gap-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="text-sm text-steel"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
