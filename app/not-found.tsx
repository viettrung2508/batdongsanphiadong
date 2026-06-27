import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-5xl text-ink">Trang không tồn tại</h1>
      <Link href="/" className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
        Quay về trang chủ
      </Link>
    </main>
  );
}
