import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink py-14 text-slate-300">
      <div className="shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-0.5 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
            <Image src="/favicon.jpeg" alt="Batdongsanphiadong" width={60} height={60} className="h-auto w-full object-contain" />
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            Chuyên giới thiệu dự án, chuyển nhượng và sản phẩm cho thuê tại phía Đông Hà Nội với định hướng sang trọng và rõ thông tin.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Danh mục</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/du-an">Dự án</Link>
            <Link href="/dat-nen">Chuyển nhượng</Link>
            <Link href="/cho-thue">Cho thuê</Link>
            <Link href="/tin-tuc">Tin tức</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Liên hệ</p>
          <div className="mt-4 space-y-3 text-sm">
            <p>Hotline / Zalo: 0377281119</p>
            <p>Email: viettrung2580@gmail.com</p>
            <p>Văn phòng: Bình Minh Garden, số 93 phố Đức Giang, phường Đức Giang, quận Long Biên, Hà Nội.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
