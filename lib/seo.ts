import type { Metadata } from "next";

type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];
type JsonLdObject = {
  [key: string]: JsonLdValue | undefined;
};

const defaultSiteUrl = "https://batdongsanphiadong.vn";
const defaultOgImage = absoluteUrl("/hero-hanoi.jpg");

export function getSiteUrl() {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    defaultSiteUrl;

  return value.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function normalizeImageUrl(image?: string) {
  if (!image) {
    return defaultOgImage;
  }

  return image.startsWith("http://") || image.startsWith("https://") ? image : absoluteUrl(image);
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  keywords
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = [normalizeImageUrl(image)];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Batdongsanphiadong",
      locale: "vi_VN",
      type,
      images: ogImage.map((item) => ({ url: item }))
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage
    }
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  } satisfies JsonLdObject;
}

export function buildWebSiteSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Batdongsanphiadong",
    alternateName: "Bất động sản phía Đông Hà Nội",
    url: siteUrl
  } satisfies JsonLdObject;
}

export function buildOrganizationSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Batdongsanphiadong",
    url: siteUrl,
    logo: absoluteUrl("/favicon.jpeg"),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+84-377281119",
        contactType: "sales",
        areaServed: "VN",
        availableLanguage: ["vi"]
      }
    ]
  } satisfies JsonLdObject;
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Batdongsanphiadong",
    image: absoluteUrl("/hero-hanoi.jpg"),
    url: getSiteUrl(),
    telephone: "+84-377281119",
    email: "viettrung2580@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bình Minh Garden, số 93 phố Đức Giang",
      addressLocality: "Long Biên",
      addressRegion: "Hà Nội",
      addressCountry: "VN"
    },
    areaServed: {
      "@type": "City",
      name: "Hà Nội"
    }
  } satisfies JsonLdObject;
}

export function buildArticleSchema({
  title,
  description,
  path,
  image,
  publishedAt,
  modifiedAt,
  section
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedAt?: string;
  modifiedAt?: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [normalizeImageUrl(image)],
    mainEntityOfPage: absoluteUrl(path),
    datePublished: publishedAt,
    dateModified: modifiedAt ?? publishedAt,
    articleSection: section,
    author: {
      "@type": "Organization",
      name: "Batdongsanphiadong"
    },
    publisher: {
      "@type": "Organization",
      name: "Batdongsanphiadong",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.jpeg")
      }
    }
  } satisfies JsonLdObject;
}

export function buildRealEstateWebPageSchema({
  title,
  description,
  path,
  image,
  price,
  address,
  area,
  hotline
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  price: string;
  address: string;
  area: string;
  hotline: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: normalizeImageUrl(image)
    },
    about: {
      "@type": "Place",
      name: title,
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
        addressLocality: area,
        addressRegion: "Hà Nội",
        addressCountry: "VN"
      }
    },
    mainEntity: {
      "@type": "Offer",
      name: title,
      description,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "VND",
        description: price
      },
      seller: {
        "@type": "Organization",
        name: "Batdongsanphiadong",
        telephone: hotline
      },
      url: absoluteUrl(path)
    }
  } satisfies JsonLdObject;
}

export function buildContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Liên hệ Batdongsanphiadong",
    url: absoluteUrl("/lien-he"),
    description: "Trang liên hệ tư vấn dự án, chuyển nhượng và cho thuê bất động sản phía Đông Hà Nội."
  } satisfies JsonLdObject;
}
