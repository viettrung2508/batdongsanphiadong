import { PrismaClient, PropertyKind, ContentStatus } from "@prisma/client";

const prisma = new PrismaClient();

const areas = [
  {
    slug: "gia-lam",
    name: "Gia Lâm",
    description: "Khu vực tăng trưởng mạnh với đại đô thị và hạ tầng kết nối mới."
  },
  {
    slug: "long-bien",
    name: "Long Biên",
    description: "Khu vực phát triển ổn định, thuận tiện kết nối nội đô."
  },
  {
    slug: "dong-anh",
    name: "Đông Anh",
    description: "Khu vực hưởng lợi từ các trục cầu và quy hoạch mở rộng đô thị."
  }
];

const projectSeeds = [
  {
    slug: "vinhomes-ocean-park-gia-lam",
    name: "Vinhomes Ocean Park Gia Lâm",
    investor: "Vinhomes",
    areaSlug: "gia-lam",
    address: "Thị trấn Trâu Quỳ, Gia Lâm, Hà Nội",
    price: "Từ 12 tỷ/căn",
    hotline: "0234235344",
    badge: "Đại đô thị",
    cardMeta: "420 ha • Biệt thự, shophouse, căn hộ",
    description:
      "Đại đô thị phía Đông Hà Nội nổi bật với quy hoạch đồng bộ, hệ tiện ích lớn và khả năng khai thác ở thực lẫn đầu tư dài hạn.",
    thumbnail:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    mapEmbedUrl: "https://maps.google.com/maps?q=gia%20lam%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    seoTitle: "Vinhomes Ocean Park Gia Lâm",
    seoDescription: "Đại đô thị nổi bật tại Gia Lâm, phía Đông Hà Nội.",
    isFeatured: true,
    status: ContentStatus.PUBLISHED,
    scale: "420 ha đại đô thị tích hợp",
    productTypes: ["Biệt thự", "Shophouse", "Căn hộ"],
    villaInfo: "Phân khu biệt thự ven hồ và thấp tầng khép kín",
    shophouseInfo: "Shophouse thương mại dọc các trục phố lớn",
    startTime: "Q3/2026",
    handoverTime: "Q4/2028",
    ownership: "Sở hữu lâu dài",
    latitude: "20.9974",
    longitude: "105.9438",
    utilities: ["Hồ trung tâm", "VinUni", "Vinmec", "Phố thương mại", "Công viên thể thao"],
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "eurowindow-twin-parks-dong-tru",
    name: "Eurowindow Twin Parks",
    investor: "Eurowindow Holding",
    areaSlug: "dong-anh",
    address: "Đông Trù, Đông Hội, Đông Anh, Hà Nội",
    price: "Từ 11.5 tỷ/căn",
    hotline: "0234235344",
    badge: "Compound thấp tầng",
    cardMeta: "9.6 ha • Nhà phố, shophouse, biệt thự",
    description:
      "Dự án thấp tầng gần cầu Đông Trù, phù hợp nhu cầu an cư chất lượng và đón sóng kết nối nhanh sang trung tâm.",
    thumbnail:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    status: ContentStatus.PUBLISHED,
    scale: "9.6 ha, khu thấp tầng compound",
    productTypes: ["Nhà phố", "Shophouse", "Biệt thự"],
    startTime: "Q1/2026",
    handoverTime: "Q2/2027",
    ownership: "Sở hữu lâu dài",
    latitude: "21.1028",
    longitude: "105.8894",
    utilities: ["Phố đi bộ", "Vườn cảnh quan", "Clubhouse", "Khu thể thao"],
    gallery: []
  },
  {
    slug: "him-lam-thuong-thanh-long-bien",
    name: "Him Lam Thượng Thanh",
    investor: "Him Lam",
    areaSlug: "long-bien",
    address: "Thượng Thanh, Long Biên, Hà Nội",
    price: "Từ 8.6 tỷ/căn",
    hotline: "0234235344",
    badge: "Khu thấp tầng",
    cardMeta: "6.1 ha • Biệt thự, liền kề, shophouse",
    description:
      "Dự án thấp tầng tại Long Biên, hưởng lợi từ hạ tầng hoàn thiện và nhu cầu ở thực tăng mạnh phía Đông Hà Nội.",
    thumbnail:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1600607687644-c7f34a106d86?auto=format&fit=crop&w=1600&q=80",
    isFeatured: false,
    status: ContentStatus.PUBLISHED,
    scale: "6.1 ha",
    productTypes: ["Biệt thự", "Nhà liền kề", "Shophouse"],
    latitude: "21.0705",
    longitude: "105.9027",
    utilities: ["Công viên nội khu", "Khu vui chơi trẻ em", "Shophouse khối đế"],
    gallery: []
  }
];

const landListingSeeds = [
  {
    slug: "dat-nen-duong-co-linh-long-bien",
    name: "Đất nền gần đường Cổ Linh",
    areaSlug: "long-bien",
    address: "Phúc Đồng, Long Biên, Hà Nội",
    acreage: "100 m2",
    legal: "Sổ riêng từng nền",
    price: "10.8 tỷ",
    hotline: "0234235344",
    badge: "Đất nền",
    cardMeta: "100 m2 • Sổ riêng từng nền",
    description: "Vị trí gần trục Cổ Linh, thuận tiện di chuyển sang nội đô và khu vực cầu Vĩnh Tuy.",
    thumbnail:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    mapEmbedUrl: "https://maps.google.com/maps?q=phuc%20dong%20long%20bien%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    status: ContentStatus.PUBLISHED,
    latitude: "21.0318",
    longitude: "105.9236",
    gallery: []
  },
  {
    slug: "dat-nen-trau-quy-gia-lam",
    name: "Đất nền Trâu Quỳ trung tâm",
    areaSlug: "gia-lam",
    address: "Trâu Quỳ, Gia Lâm, Hà Nội",
    acreage: "120 m2",
    legal: "Đầy đủ pháp lý",
    price: "9.6 tỷ",
    hotline: "0234235344",
    badge: "Đất nền",
    cardMeta: "120 m2 • Pháp lý đầy đủ",
    description: "Tiềm năng tăng giá theo tiến độ hạ tầng, quy hoạch lên quận và nhu cầu ở thực tăng cao.",
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    mapEmbedUrl: "https://maps.google.com/maps?q=trau%20quy%20gia%20lam%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    status: ContentStatus.PUBLISHED,
    latitude: "21.0068",
    longitude: "105.9366",
    gallery: []
  }
];

const rentalSeeds = [
  {
    slug: "shophouse-ocean-park-gia-lam",
    name: "Shophouse trục chính Ocean Park",
    areaSlug: "gia-lam",
    address: "Vinhomes Ocean Park, Gia Lâm, Hà Nội",
    size: "180 m2",
    rentalType: "Shophouse",
    price: "95 triệu/tháng",
    hotline: "0234235344",
    badge: "Cho thuê",
    cardMeta: "180 m2 • Shophouse thương mại",
    description: "Phù hợp showroom, cafe, văn phòng giao dịch hoặc mô hình kinh doanh dịch vụ.",
    thumbnail:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    mapEmbedUrl: "https://maps.google.com/maps?q=vinhomes%20ocean%20park%20gia%20lam&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    status: ContentStatus.PUBLISHED,
    latitude: "20.9958",
    longitude: "105.9449",
    gallery: []
  },
  {
    slug: "mat-bang-nguyen-van-linh-long-bien",
    name: "Mặt bằng góc Nguyễn Văn Linh",
    areaSlug: "long-bien",
    address: "Nguyễn Văn Linh, Long Biên, Hà Nội",
    size: "220 m2",
    rentalType: "Mặt bằng",
    price: "110 triệu/tháng",
    hotline: "0234235344",
    badge: "Cho thuê",
    cardMeta: "220 m2 • Mặt bằng góc 2 mặt tiền",
    description: "Mặt bằng góc 2 mặt tiền, lưu lượng phương tiện cao, phù hợp thương hiệu bán lẻ.",
    thumbnail:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    mapEmbedUrl: "https://maps.google.com/maps?q=nguyen%20van%20linh%20long%20bien%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed",
    isFeatured: true,
    status: ContentStatus.PUBLISHED,
    latitude: "21.0419",
    longitude: "105.8898",
    gallery: []
  }
];

const apartmentSeeds = [
  {
    slug: "can-102-ocean-park",
    name: "102",
    projectSlug: "vinhomes-ocean-park-gia-lam",
    address: "Tòa S2.01, Vinhomes Ocean Park, Gia Lâm, Hà Nội",
    size: "72 m2",
    rentalType: "Căn hộ 2PN",
    price: "4.2 tỷ",
    hotline: "0234235344",
    badge: "Căn hộ",
    cardMeta: "72 m2 • 2PN • Full nội thất",
    description: "Căn hộ mã 102 phù hợp ở thực và khai thác cho thuê dài hạn.",
    thumbnail:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    status: ContentStatus.PUBLISHED,
    latitude: "20.9958",
    longitude: "105.9449",
    gallery: []
  },
  {
    slug: "can-103-ocean-park",
    name: "103",
    projectSlug: "vinhomes-ocean-park-gia-lam",
    address: "Tòa S2.01, Vinhomes Ocean Park, Gia Lâm, Hà Nội",
    size: "81 m2",
    rentalType: "Căn hộ 3PN",
    price: "4.9 tỷ",
    hotline: "0234235344",
    badge: "Căn hộ",
    cardMeta: "81 m2 • 3PN • Ban công Đông Nam",
    description: "Căn hộ mã 103 có diện tích lớn hơn, phù hợp hộ gia đình.",
    thumbnail:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    status: ContentStatus.PUBLISHED,
    latitude: "20.9958",
    longitude: "105.9449",
    gallery: []
  }
];

const postSeeds = [
  {
    slug: "xu-huong-bat-dong-san-2026",
    title: "Xu hướng bất động sản cao cấp năm 2026",
    excerpt: "Dòng tiền đang dịch chuyển về những dự án có pháp lý rõ ràng, khai thác được cả ở và đầu tư.",
    content:
      "<p>Phía Đông Hà Nội đang là điểm đến của dòng tiền khi hạ tầng giao thông, quy hoạch đô thị và mặt bằng tiện ích được đẩy nhanh trong cùng một giai đoạn.</p><p>Những khu vực như Gia Lâm, Long Biên và Đông Anh đang ghi nhận mức độ quan tâm lớn nhờ lợi thế kết nối, tốc độ đô thị hóa và sự xuất hiện của các đại dự án quy mô lớn.</p><p>Trong bối cảnh đó, người mua ưu tiên những dự án có pháp lý rõ ràng, chủ đầu tư uy tín và khả năng khai thác ở thực hoặc cho thuê ổn định.</p>",
    category: "Thị trường",
    thumbnail:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "Xu hướng bất động sản cao cấp năm 2026",
    seoDescription: "Góc nhìn thị trường và dòng tiền đang dịch chuyển về khu Đông Hà Nội.",
    publishedAt: new Date("2026-05-02T00:00:00.000Z"),
    status: ContentStatus.PUBLISHED,
    relatedPostSlugs: ["5-tieu-chi-chon-du-an", "ha-tang-va-gia-tri-dat-nen"],
    areaSlug: "gia-lam"
  },
  {
    slug: "5-tieu-chi-chon-du-an",
    title: "5 tiêu chí chọn dự án để ở và giữ tài sản",
    excerpt: "Nhà đầu tư nên nhìn vào vị trí, pháp lý, chủ đầu tư, nhịp hạ tầng và tính thanh khoản thực tế.",
    content:
      "<p>Tiêu chí đầu tiên luôn là vị trí và khả năng kết nối thực tế tới các trục giao thông lớn, trung tâm hành chính và khu dịch vụ.</p><p>Tiếp theo là pháp lý và uy tín chủ đầu tư, bởi đây là nền tảng để bảo toàn dòng tiền trong dài hạn.</p><p>Ngoài ra, người mua nên nhìn thêm vào nhịp phát triển hạ tầng, mật độ cư dân hiện hữu và khả năng thanh khoản ở từng phân khúc cụ thể.</p>",
    category: "Kinh nghiệm",
    thumbnail:
      "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "5 tiêu chí chọn dự án để ở và giữ tài sản",
    seoDescription: "Các tiêu chí quan trọng khi chọn dự án bất động sản tại phía Đông Hà Nội.",
    publishedAt: new Date("2026-04-28T00:00:00.000Z"),
    status: ContentStatus.PUBLISHED,
    relatedPostSlugs: ["xu-huong-bat-dong-san-2026", "ha-tang-va-gia-tri-dat-nen"],
    areaSlug: "long-bien"
  },
  {
    slug: "ha-tang-va-gia-tri-dat-nen",
    title: "Hạ tầng tác động thế nào đến giá trị đất nền",
    excerpt: "Những khu vực bám theo vành đai, metro và logistic hub đang dẫn đầu chu kỳ tăng trưởng mới.",
    content:
      "<p>Giá trị đất nền thường thay đổi mạnh khi khu vực xuất hiện các công trình hạ tầng có khả năng rút ngắn thời gian di chuyển và tăng mật độ sử dụng thực tế.</p><p>Tại phía Đông Hà Nội, các cây cầu mới, trục vành đai và khu đô thị quy mô lớn đang tạo ra kỳ vọng rõ ràng về mặt bằng giá trong trung hạn.</p><p>Tuy nhiên, nhà đầu tư vẫn cần chọn những vị trí có pháp lý chắc chắn và thanh khoản tốt thay vì chỉ chạy theo tin tức ngắn hạn.</p>",
    category: "Phân tích",
    thumbnail:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "Hạ tầng tác động thế nào đến giá trị đất nền",
    seoDescription: "Phân tích tác động của hạ tầng tới mặt bằng giá đất nền khu Đông Hà Nội.",
    publishedAt: new Date("2026-04-21T00:00:00.000Z"),
    status: ContentStatus.PUBLISHED,
    relatedPostSlugs: ["xu-huong-bat-dong-san-2026", "5-tieu-chi-chon-du-an"],
    areaSlug: "dong-anh"
  }
];

async function main() {
  for (const area of areas) {
    await prisma.area.upsert({
      where: { slug: area.slug },
      update: {
        name: area.name,
        description: area.description
      },
      create: area
    });
  }

  for (const project of projectSeeds) {
    const area = await prisma.area.findUniqueOrThrow({
      where: { slug: project.areaSlug }
    });

    await prisma.property.upsert({
      where: { slug: project.slug },
      update: {
        kind: PropertyKind.PROJECT,
        name: project.name,
        address: project.address,
        price: project.price,
        hotline: project.hotline,
        badge: project.badge,
        cardMeta: project.cardMeta,
        description: project.description,
        thumbnail: project.thumbnail,
        bannerImage: project.bannerImage,
        mapEmbedUrl: project.mapEmbedUrl,
        seoTitle: project.seoTitle,
        seoDescription: project.seoDescription,
        isFeatured: project.isFeatured,
        status: project.status,
        areaId: area.id,
        investor: project.investor,
        scale: project.scale,
        productTypes: project.productTypes,
        villaInfo: project.villaInfo,
        shophouseInfo: project.shophouseInfo,
        startTime: project.startTime,
        handoverTime: project.handoverTime,
        ownership: project.ownership,
        latitude: project.latitude,
        longitude: project.longitude,
        utilities: {
          deleteMany: {},
          create: project.utilities.map((label) => ({ label }))
        },
        gallery: {
          deleteMany: {},
          create: project.gallery.map((url, index) => ({
            url,
            sortOrder: index
          }))
        }
      },
      create: {
        kind: PropertyKind.PROJECT,
        slug: project.slug,
        name: project.name,
        address: project.address,
        price: project.price,
        hotline: project.hotline,
        badge: project.badge,
        cardMeta: project.cardMeta,
        description: project.description,
        thumbnail: project.thumbnail,
        bannerImage: project.bannerImage,
        mapEmbedUrl: project.mapEmbedUrl,
        seoTitle: project.seoTitle,
        seoDescription: project.seoDescription,
        isFeatured: project.isFeatured,
        status: project.status,
        areaId: area.id,
        investor: project.investor,
        scale: project.scale,
        productTypes: project.productTypes,
        villaInfo: project.villaInfo,
        shophouseInfo: project.shophouseInfo,
        startTime: project.startTime,
        handoverTime: project.handoverTime,
        ownership: project.ownership,
        latitude: project.latitude,
        longitude: project.longitude,
        utilities: {
          create: project.utilities.map((label) => ({ label }))
        },
        gallery: {
          create: project.gallery.map((url, index) => ({
            url,
            sortOrder: index
          }))
        }
      }
    });
  }

  for (const landListing of landListingSeeds) {
    const area = await prisma.area.findUniqueOrThrow({
      where: { slug: landListing.areaSlug }
    });

    await prisma.property.upsert({
      where: { slug: landListing.slug },
      update: {
        kind: PropertyKind.LAND,
        name: landListing.name,
        address: landListing.address,
        acreage: landListing.acreage,
        legal: landListing.legal,
        price: landListing.price,
        hotline: landListing.hotline,
        badge: landListing.badge,
        cardMeta: landListing.cardMeta,
        description: landListing.description,
        thumbnail: landListing.thumbnail,
        mapEmbedUrl: landListing.mapEmbedUrl,
        isFeatured: landListing.isFeatured,
        status: landListing.status,
        areaId: area.id,
        latitude: landListing.latitude,
        longitude: landListing.longitude,
        gallery: {
          deleteMany: {},
          create: landListing.gallery.map((url, index) => ({
            url,
            sortOrder: index
          }))
        }
      },
      create: {
        kind: PropertyKind.LAND,
        slug: landListing.slug,
        name: landListing.name,
        areaId: area.id,
        address: landListing.address,
        acreage: landListing.acreage,
        legal: landListing.legal,
        price: landListing.price,
        hotline: landListing.hotline,
        badge: landListing.badge,
        cardMeta: landListing.cardMeta,
        description: landListing.description,
        thumbnail: landListing.thumbnail,
        mapEmbedUrl: landListing.mapEmbedUrl,
        isFeatured: landListing.isFeatured,
        status: landListing.status,
        latitude: landListing.latitude,
        longitude: landListing.longitude,
        gallery: {
          create: landListing.gallery.map((url, index) => ({
            url,
            sortOrder: index
          }))
        }
      }
    });
  }

  for (const rental of rentalSeeds) {
    const area = await prisma.area.findUniqueOrThrow({
      where: { slug: rental.areaSlug }
    });

    await prisma.property.upsert({
      where: { slug: rental.slug },
      update: {
        kind: PropertyKind.RENTAL,
        name: rental.name,
        address: rental.address,
        size: rental.size,
        rentalType: rental.rentalType,
        price: rental.price,
        hotline: rental.hotline,
        badge: rental.badge,
        cardMeta: rental.cardMeta,
        description: rental.description,
        thumbnail: rental.thumbnail,
        mapEmbedUrl: rental.mapEmbedUrl,
        isFeatured: rental.isFeatured,
        status: rental.status,
        areaId: area.id,
        latitude: rental.latitude,
        longitude: rental.longitude,
        gallery: {
          deleteMany: {},
          create: rental.gallery.map((url, index) => ({
            url,
            sortOrder: index
          }))
        }
      },
      create: {
        kind: PropertyKind.RENTAL,
        slug: rental.slug,
        name: rental.name,
        areaId: area.id,
        address: rental.address,
        size: rental.size,
        rentalType: rental.rentalType,
        price: rental.price,
        hotline: rental.hotline,
        badge: rental.badge,
        cardMeta: rental.cardMeta,
        description: rental.description,
        thumbnail: rental.thumbnail,
        mapEmbedUrl: rental.mapEmbedUrl,
        isFeatured: rental.isFeatured,
        status: rental.status,
        latitude: rental.latitude,
        longitude: rental.longitude,
        gallery: {
          create: rental.gallery.map((url, index) => ({
            url,
            sortOrder: index
          }))
        }
      }
    });
  }

  for (const apartment of apartmentSeeds) {
    const project = await prisma.property.findUniqueOrThrow({
      where: { slug: apartment.projectSlug }
    });

    await prisma.property.upsert({
      where: { slug: apartment.slug },
      update: {
        kind: PropertyKind.APARTMENT,
        name: apartment.name,
        areaId: project.areaId,
        parentProjectId: project.id,
        address: apartment.address,
        size: apartment.size,
        rentalType: apartment.rentalType,
        price: apartment.price,
        hotline: apartment.hotline,
        badge: apartment.badge,
        cardMeta: apartment.cardMeta,
        description: apartment.description,
        thumbnail: apartment.thumbnail,
        isFeatured: apartment.isFeatured,
        status: apartment.status,
        latitude: apartment.latitude,
        longitude: apartment.longitude,
        gallery: {
          deleteMany: {},
          create: apartment.gallery.map((url, index) => ({
            url,
            sortOrder: index
          }))
        }
      },
      create: {
        kind: PropertyKind.APARTMENT,
        slug: apartment.slug,
        name: apartment.name,
        areaId: project.areaId,
        parentProjectId: project.id,
        address: apartment.address,
        size: apartment.size,
        rentalType: apartment.rentalType,
        price: apartment.price,
        hotline: apartment.hotline,
        badge: apartment.badge,
        cardMeta: apartment.cardMeta,
        description: apartment.description,
        thumbnail: apartment.thumbnail,
        isFeatured: apartment.isFeatured,
        status: apartment.status,
        latitude: apartment.latitude,
        longitude: apartment.longitude,
        gallery: {
          create: apartment.gallery.map((url, index) => ({
            url,
            sortOrder: index
          }))
        }
      }
    });
  }

  for (const post of postSeeds) {
    const area = post.areaSlug
      ? await prisma.area.findUniqueOrThrow({
          where: { slug: post.areaSlug }
        })
      : null;

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        thumbnail: post.thumbnail,
        bannerImage: post.bannerImage,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        publishedAt: post.publishedAt,
        status: post.status,
        relatedPostIds: post.relatedPostSlugs,
        areaId: area?.id ?? null
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        thumbnail: post.thumbnail,
        bannerImage: post.bannerImage,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        publishedAt: post.publishedAt,
        status: post.status,
        relatedPostIds: post.relatedPostSlugs,
        areaId: area?.id ?? null
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
