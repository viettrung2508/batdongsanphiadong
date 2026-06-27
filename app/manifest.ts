import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Batdongsanphiadong",
    short_name: "Batdongsanphiadong",
    description: "Nền tảng bất động sản phía Đông Hà Nội với dự án, chuyển nhượng, cho thuê và tin tức thị trường.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0066cc",
    lang: "vi",
    icons: [
      {
        src: "/favicon.jpeg",
        sizes: "192x192",
        type: "image/jpeg"
      },
      {
        src: "/favicon.jpeg",
        sizes: "512x512",
        type: "image/jpeg"
      }
    ]
  };
}
