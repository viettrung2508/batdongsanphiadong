import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { ContactForm } from "@/components/shared/contact-form";
import { buildContactPageSchema, buildLocalBusinessSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Liên hệ tư vấn bất động sản phía Đông Hà Nội",
  description: "Liên hệ Batdongsanphiadong để nhận tư vấn nhanh về dự án, chuyển nhượng, cho thuê và thông tin thị trường phía Đông Hà Nội.",
  path: "/lien-he",
  keywords: ["liên hệ bất động sản phía đông hà nội", "tư vấn dự án gia lâm", "hotline bất động sản long biên"]
});

export default function ContactPage() {
  return (
    <main className="shell section-gap">
      <JsonLd data={[buildContactPageSchema(), buildLocalBusinessSchema()]} />
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Liên hệ</p>
          <h1 className="mt-4 font-display text-6xl text-ink">Liên hệ để nhận tư vấn nhanh và thông tin phù hợp</h1>
          <div className="mt-8 space-y-4 text-sm leading-8 text-steel">
            <p>Hotline / Zalo: 0377281119</p>
            <p>Email: viettrung2580@gmail.com</p>
            <p>Văn phòng: Bình Minh Garden, số 93 phố Đức Giang, phường Đức Giang, quận Long Biên, Hà Nội.</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-line bg-mist p-8">
          <h2 className="font-display text-4xl text-ink">Gửi yêu cầu tư vấn</h2>
          <ContactForm />
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-[32px] border border-line">
        <iframe
          title="Office map"
          src="https://maps.google.com/maps?q=B%C3%ACnh%20Minh%20Garden%2C%20s%E1%BB%91%2093%20ph%E1%BB%91%20%C4%90%E1%BB%A9c%20Giang%2C%20ph%C6%B0%E1%BB%9Dng%20%C4%90%E1%BB%A9c%20Giang%2C%20qu%E1%BA%ADn%20Long%20Bi%C3%AAn%2C%20H%C3%A0%20N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="h-[420px] w-full"
          loading="lazy"
        />
      </div>
    </main>
  );
}
