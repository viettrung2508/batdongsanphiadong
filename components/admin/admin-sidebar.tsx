"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { adminApiBaseUrl } from "./admin-api";
import { useUnsavedChangesNavigation } from "./unsaved-changes-provider";

const adminLinks = [
  { href: "/dashboard/areas", label: "Khu vực" },
  { href: "/dashboard/projects", label: "Dự án" },
  { href: "/dashboard/apartments", label: "Căn hộ" },
  { href: "/dashboard/land-listings", label: "Chuyển nhượng" },
  { href: "/dashboard/rentals", label: "Cho thuê" },
  { href: "/dashboard/posts", label: "Tin tức" },
  { href: "/dashboard/contacts", label: "Liên hệ" }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { confirmNavigation, allowNavigation } = useUnsavedChangesNavigation();

  async function handleLogout() {
    if (!confirmNavigation()) {
      return;
    }

    allowNavigation();

    await Promise.all([
      fetch("/api/admin-auth/logout", {
        method: "POST",
        credentials: "include"
      }),
      fetch(`${adminApiBaseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      })
    ]);

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="rounded-[32px] bg-ink p-6 text-white">
      <Link href="/dashboard" className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-0.5 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
        <Image src="/favicon.jpeg" alt="Batdongsanphiadong" width={60} height={60} className="h-auto w-full object-contain" />
      </Link>
      <p className="mt-2 text-sm leading-7 text-slate-300">Khu quản trị nội dung cho dự án, chuyển nhượng, cho thuê và tin tức.</p>

      <nav className="mt-8 flex flex-col gap-2">
        {adminLinks.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-white text-ink" : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => void handleLogout()}
        className="mt-8 inline-flex rounded-full border border-white/15 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
      >
        Đăng xuất
      </button>
    </aside>
  );
}
