import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { getSiteUrl } from "@/lib/seo";
import { buildLocalBusinessSchema, buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Batdongsanphiadong | Bất động sản phía Đông Hà Nội",
    template: "%s | Batdongsanphiadong"
  },
  description: "Chuyên trang dự án, chuyển nhượng, cho thuê và tin tức bất động sản phía Đông Hà Nội.",
  applicationName: "Batdongsanphiadong",
  keywords: ["bất động sản phía Đông Hà Nội", "dự án Gia Lâm", "chuyển nhượng Long Biên", "cho thuê shophouse"],
  icons: {
    icon: "/favicon.jpeg",
    shortcut: "/favicon.jpeg",
    apple: "/favicon.jpeg"
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Batdongsanphiadong | Bất động sản phía Đông Hà Nội",
    description: "Chuyên trang dự án, chuyển nhượng, cho thuê và tin tức bất động sản phía Đông Hà Nội.",
    url: "/",
    siteName: "Batdongsanphiadong",
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/hero-hanoi.jpg" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Batdongsanphiadong | Bất động sản phía Đông Hà Nội",
    description: "Chuyên trang dự án, chuyển nhượng, cho thuê và tin tức bất động sản phía Đông Hà Nội.",
    images: ["/hero-hanoi.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <JsonLd data={[buildWebSiteSchema(), buildOrganizationSchema(), buildLocalBusinessSchema()]} />
        {children}
      </body>
    </html>
  );
}
