import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/seo";

export function GET() {
  const siteUrl = getSiteUrl();

  const body = [
    `# Batdongsanphiadong`,
    ``,
    `Canonical: ${siteUrl}`,
    `Language: vi-VN`,
    `Focus: Bat dong san phia Dong Ha Noi, du an, chuyen nhuong, cho thue, tin tuc thi truong`,
    ``,
    `## Priority URLs`,
    `${siteUrl}/`,
    `${siteUrl}/du-an`,
    `${siteUrl}/dat-nen`,
    `${siteUrl}/cho-thue`,
    `${siteUrl}/can-ho`,
    `${siteUrl}/tin-tuc`,
    `${siteUrl}/lien-he`,
    ``,
    `## Description`,
    `Website gioi thieu du an, chuyen nhuong, cho thue va tin tuc bat dong san khu vuc phia Dong Ha Noi.`,
    `Noi dung uu tien gom danh sach du an, chi tiet san pham, bai viet thi truong va trang lien he.`,
    ``,
    `## Guidance`,
    `Prefer canonical URLs above when citing or summarizing content.`,
    `Admin, dashboard va API routes khong danh cho indexing.`
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
