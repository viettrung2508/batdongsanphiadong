import { LandListing, Post, Project, RentalListing } from "@/types";

export const projects: Project[] = [
  {
    id: "p1",
    slug: "vinhomes-ocean-park-gia-lam",
    name: "Vinhomes Ocean Park Gia Lâm",
    kind: "project",
    investor: "Vinhomes",
    area: "Gia Lâm",
    address: "Thị trấn Trâu Quỳ, Gia Lâm, Hà Nội",
    coordinates: { lat: 20.9974, lng: 105.9438 },
    scale: "420 ha đại đô thị tích hợp",
    productTypes: ["Biệt thự", "Shophouse", "Căn hộ"],
    villaInfo: "Phân khu biệt thự ven hồ và thấp tầng khép kín",
    shophouseInfo: "Shophouse thương mại dọc các trục phố lớn",
    startTime: "Q3/2026",
    handoverTime: "Q4/2028",
    ownership: "Sở hữu lâu dài",
    price: "Từ 12 tỷ/căn",
    hotline: "0377281119",
    badge: "Đại đô thị",
    cardMeta: "420 ha • Biệt thự, shophouse, căn hộ",
    thumbnail:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "Đại đô thị phía Đông Hà Nội nổi bật với quy hoạch đồng bộ, hệ tiện ích lớn và khả năng khai thác ở thực lẫn đầu tư dài hạn.",
    utilities: ["Hồ trung tâm", "VinUni", "Vinmec", "Phố thương mại", "Công viên thể thao"],
    floorPlanImages: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
    ],
    mapEmbedUrl: "https://maps.google.com/maps?q=gia%20lam%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    seoTitle: "Vinhomes Ocean Park Gia Lâm",
    seoDescription: "Đại đô thị nổi bật tại Gia Lâm, phía Đông Hà Nội."
  },
  {
    id: "p2",
    slug: "eurowindow-twin-parks-dong-tru",
    name: "Eurowindow Twin Parks",
    kind: "project",
    investor: "Eurowindow Holding",
    area: "Đông Anh",
    address: "Đông Trù, Đông Hội, Đông Anh, Hà Nội",
    coordinates: { lat: 21.1028, lng: 105.8894 },
    scale: "9.6 ha, khu thấp tầng compound",
    productTypes: ["Nhà phố", "Shophouse", "Biệt thự"],
    startTime: "Q1/2026",
    handoverTime: "Q2/2027",
    ownership: "Sở hữu lâu dài",
    price: "Từ 11.5 tỷ/căn",
    hotline: "0377281119",
    badge: "Compound thấp tầng",
    cardMeta: "9.6 ha • Nhà phố, shophouse, biệt thự",
    thumbnail:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80",
    gallery: [],
    description: "Dự án thấp tầng gần cầu Đông Trù, phù hợp nhu cầu an cư chất lượng và đón sóng kết nối nhanh sang trung tâm.",
    utilities: ["Phố đi bộ", "Vườn cảnh quan", "Clubhouse", "Khu thể thao"],
    isFeatured: true
  },
  {
    id: "p3",
    slug: "him-lam-thuong-thanh-long-bien",
    name: "Him Lam Thượng Thanh",
    kind: "project",
    investor: "Him Lam",
    area: "Long Biên",
    address: "Thượng Thanh, Long Biên, Hà Nội",
    coordinates: { lat: 21.0705, lng: 105.9027 },
    scale: "6.1 ha",
    productTypes: ["Biệt thự", "Nhà liền kề", "Shophouse"],
    price: "Từ 8.6 tỷ/căn",
    hotline: "0377281119",
    badge: "Khu thấp tầng",
    cardMeta: "6.1 ha • Biệt thự, liền kề, shophouse",
    thumbnail:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1600607687644-c7f34a106d86?auto=format&fit=crop&w=1600&q=80",
    gallery: [],
    description: "Dự án thấp tầng tại Long Biên, hưởng lợi từ hạ tầng hoàn thiện và nhu cầu ở thực tăng mạnh phía Đông Hà Nội.",
    utilities: ["Công viên nội khu", "Khu vui chơi trẻ em", "Shophouse khối đế"],
    isFeatured: false
  }
];

export const landListings: LandListing[] = [
  {
    id: "l1",
    slug: "dat-nen-duong-co-linh-long-bien",
    name: "Đất nền gần đường Cổ Linh",
    kind: "land",
    area: "Long Biên",
    address: "Phúc Đồng, Long Biên, Hà Nội",
    coordinates: { lat: 21.0318, lng: 105.9236 },
    acreage: "100 m2",
    legal: "Sổ riêng từng nền",
    price: "10.8 tỷ",
    hotline: "0377281119",
    badge: "Đất nền",
    cardMeta: "100 m2 • Sổ riêng từng nền",
    thumbnail:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    description: "Vị trí gần trục Cổ Linh, thuận tiện di chuyển sang nội đô và khu vực cầu Vĩnh Tuy.",
    mapEmbedUrl: "https://maps.google.com/maps?q=phuc%20dong%20long%20bien%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    isSold: false
  },
  {
    id: "l2",
    slug: "dat-nen-trau-quy-gia-lam",
    name: "Đất nền Trâu Quỳ trung tâm",
    kind: "land",
    area: "Gia Lâm",
    address: "Trâu Quỳ, Gia Lâm, Hà Nội",
    coordinates: { lat: 21.0068, lng: 105.9366 },
    acreage: "120 m2",
    legal: "Đầy đủ pháp lý",
    price: "9.6 tỷ",
    hotline: "0377281119",
    badge: "Đất nền",
    cardMeta: "120 m2 • Pháp lý đầy đủ",
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    description: "Tiềm năng tăng giá theo tiến độ hạ tầng, quy hoạch lên quận và nhu cầu ở thực tăng cao.",
    mapEmbedUrl: "https://maps.google.com/maps?q=trau%20quy%20gia%20lam%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    isSold: false
  }
];

export const rentals: RentalListing[] = [
  {
    id: "r1",
    slug: "shophouse-ocean-park-gia-lam",
    name: "Shophouse trục chính Ocean Park",
    kind: "rental",
    area: "Gia Lâm",
    address: "Vinhomes Ocean Park, Gia Lâm, Hà Nội",
    coordinates: { lat: 20.9958, lng: 105.9449 },
    size: "180 m2",
    price: "95 triệu/tháng",
    hotline: "0377281119",
    badge: "Cho thuê",
    cardMeta: "180 m2 • Shophouse thương mại",
    thumbnail:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    description: "Phù hợp showroom, cafe, văn phòng giao dịch hoặc mô hình kinh doanh dịch vụ.",
    mapEmbedUrl: "https://maps.google.com/maps?q=vinhomes%20ocean%20park%20gia%20lam&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    isSold: false,
    rentalType: "Shophouse"
  },
  {
    id: "r2",
    slug: "mat-bang-nguyen-van-linh-long-bien",
    name: "Mặt bằng góc Nguyễn Văn Linh",
    kind: "rental",
    area: "Long Biên",
    address: "Nguyễn Văn Linh, Long Biên, Hà Nội",
    coordinates: { lat: 21.0419, lng: 105.8898 },
    size: "220 m2",
    price: "110 triệu/tháng",
    hotline: "0377281119",
    badge: "Cho thuê",
    cardMeta: "220 m2 • Mặt bằng góc 2 mặt tiền",
    thumbnail:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    description: "Mặt bằng góc 2 mặt tiền, lưu lượng phương tiện cao, phù hợp thương hiệu bán lẻ.",
    mapEmbedUrl: "https://maps.google.com/maps?q=nguyen%20van%20linh%20long%20bien%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    isSold: false,
    rentalType: "Mặt bằng"
  }
];

export const posts: Post[] = [
  {
    id: "n1",
    slug: "xu-huong-bat-dong-san-2026",
    title: "Xu hướng bất động sản cao cấp năm 2026",
    category: "Thị trường",
    publishedAt: "02/05/2026",
    excerpt: "Dòng tiền đang dịch chuyển về những dự án có pháp lý rõ ràng, khai thác được cả ở và đầu tư.",
    bannerImage:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    content:
      "<p>Phía Đông Hà Nội đang là điểm đến của dòng tiền khi hạ tầng giao thông, quy hoạch đô thị và mặt bằng tiện ích được đẩy nhanh trong cùng một giai đoạn.</p><p>Những khu vực như Gia Lâm, Long Biên và Đông Anh đang ghi nhận mức độ quan tâm lớn nhờ lợi thế kết nối, tốc độ đô thị hóa và sự xuất hiện của các đại dự án quy mô lớn.</p><p>Trong bối cảnh đó, người mua ưu tiên những dự án có pháp lý rõ ràng, chủ đầu tư uy tín và khả năng khai thác ở thực hoặc cho thuê ổn định.</p>",
    relatedPostSlugs: ["5-tieu-chi-chon-du-an", "ha-tang-va-gia-tri-dat-nen"],
    seoTitle: "Xu hướng bất động sản cao cấp năm 2026",
    seoDescription: "Góc nhìn thị trường và dòng tiền đang dịch chuyển về khu Đông Hà Nội."
  },
  {
    id: "n2",
    slug: "5-tieu-chi-chon-du-an",
    title: "5 tiêu chí chọn dự án để ở và giữ tài sản",
    category: "Kinh nghiệm",
    publishedAt: "28/04/2026",
    excerpt: "Nhà đầu tư nên nhìn vào vị trí, pháp lý, chủ đầu tư, nhịp hạ tầng và tính thanh khoản thực tế.",
    bannerImage:
      "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1200&q=80",
    content:
      "<p>Tiêu chí đầu tiên luôn là vị trí và khả năng kết nối thực tế tới các trục giao thông lớn, trung tâm hành chính và khu dịch vụ.</p><p>Tiếp theo là pháp lý và uy tín chủ đầu tư, bởi đây là nền tảng để bảo toàn dòng tiền trong dài hạn.</p><p>Ngoài ra, người mua nên nhìn thêm vào nhịp phát triển hạ tầng, mật độ cư dân hiện hữu và khả năng thanh khoản ở từng phân khúc cụ thể.</p>",
    relatedPostSlugs: ["xu-huong-bat-dong-san-2026", "ha-tang-va-gia-tri-dat-nen"],
    seoTitle: "5 tiêu chí chọn dự án để ở và giữ tài sản",
    seoDescription: "Các tiêu chí quan trọng khi chọn dự án bất động sản tại phía Đông Hà Nội."
  },
  {
    id: "n3",
    slug: "ha-tang-va-gia-tri-dat-nen",
    title: "Hạ tầng tác động thế nào đến giá trị đất nền",
    category: "Phân tích",
    publishedAt: "21/04/2026",
    excerpt: "Những khu vực bám theo vành đai, metro và logistic hub đang dẫn đầu chu kỳ tăng trưởng mới.",
    bannerImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    content:
      "<p>Giá trị đất nền thường thay đổi mạnh khi khu vực xuất hiện các công trình hạ tầng có khả năng rút ngắn thời gian di chuyển và tăng mật độ sử dụng thực tế.</p><p>Tại phía Đông Hà Nội, các cây cầu mới, trục vành đai và khu đô thị quy mô lớn đang tạo ra kỳ vọng rõ ràng về mặt bằng giá trong trung hạn.</p><p>Tuy nhiên, nhà đầu tư vẫn cần chọn những vị trí có pháp lý chắc chắn và thanh khoản tốt thay vì chỉ chạy theo tin tức ngắn hạn.</p>",
    relatedPostSlugs: ["xu-huong-bat-dong-san-2026", "5-tieu-chi-chon-du-an"],
    seoTitle: "Hạ tầng tác động thế nào đến giá trị đất nền",
    seoDescription: "Phân tích tác động của hạ tầng tới mặt bằng giá đất nền khu Đông Hà Nội."
  }
];
