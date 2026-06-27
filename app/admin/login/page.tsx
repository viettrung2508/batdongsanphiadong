import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";

import { isAdminAuthenticated } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams: _searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/dashboard/projects");
  }

  return (
    <main className="min-h-screen bg-[#f3f5f8] px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[36px] bg-ink p-8 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sand">Admin CMS</p>
          <h1 className="mt-5 font-display text-5xl leading-tight">Đăng nhập khu quản trị Batdongsanphiadong</h1>
          <p className="mt-5 max-w-md text-sm leading-8 text-slate-300">
            Khu vực này dùng để quản lý dự án, chuyển nhượng, cho thuê, tin tức và dữ liệu khách hàng từ website.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Quay về website
          </Link>
        </section>

        <section className="rounded-[36px] border border-line bg-white p-8 shadow-soft">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Bảo mật truy cập</p>
            <h2 className="mt-3 font-display text-4xl text-ink">Đăng nhập</h2>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  );
}
