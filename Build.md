# Prompt: Build Website Bất Động Sản

Hãy xây dựng một website bất động sản hiện đại, chuyên nghiệp, responsive tốt trên mobile/desktop.

## 1. Mục tiêu website

Website dùng để giới thiệu:
- Dự án bất động sản
- Đất nền
- Nhà/ mặt bằng cho thuê
- Tin tức bất động sản
- Thông tin liên hệ

Phong cách giao diện:
- Sang, sạch, hiện đại
- Màu chủ đạo: xanh navy, trắng, xám nhạt
- Layout giống website bất động sản cao cấp
- Typography rõ ràng, dễ đọc
- Ưu tiên tốc độ tải nhanh và SEO tốt

---

## 2. Cấu trúc trang

Website cần có các trang:

### Home `/`
Gồm:
- Header + menu
- Hero section: tiêu đề lớn, mô tả ngắn, nút CTA
- Dự án nổi bật
- Đất nền hot
- Cho thuê hot
- Tin tức mới nhất
- CTA liên hệ nhanh
- Footer

### Dự án `/du-an`
Trang danh sách dự án:
- Grid card dự án
- Bộ lọc theo khu vực, loại sản phẩm, giá
- Search theo tên dự án

### Chi tiết dự án `/du-an/[slug]`
Hiển thị đầy đủ thông tin dự án:
- Breadcrumb
- Tên dự án
- Ảnh banner
- Album ảnh
- Tên dự án
- Chủ đầu tư
- Vị trí / địa chỉ
- Quy mô
- Sản phẩm
- Thông tin biệt thự / liền kề / shophouse
- Thời gian khởi công
- Thời gian bàn giao
- Sở hữu / pháp lý
- Giá bán
- Hotline/Zalo
- Mô tả chi tiết
- Tiện ích
- Mặt bằng
- Google Map
- Form liên hệ tư vấn

### Đất nền `/dat-nen`
Danh sách đất nền:
- Card đất nền
- Filter khu vực, giá, diện tích
- Search

### Chi tiết đất nền `/dat-nen/[slug]`
Fields:
- Tên
- Địa chỉ
- Khu vực
- Giá
- Diện tích
- Pháp lý
- Thông tin mô tả
- Thumbnail
- Album ảnh
- Hotline/Zalo
- Map
- Form liên hệ

### Cho thuê `/cho-thue`
Danh sách bất động sản cho thuê:
- Card cho thuê
- Filter khu vực, giá thuê, diện tích
- Search

### Chi tiết cho thuê `/cho-thue/[slug]`
Fields:
- Tên
- Địa chỉ
- Khu vực
- Giá thuê
- Diện tích
- Mô tả
- Thumbnail
- Album ảnh
- Hotline/Zalo
- Map
- Form liên hệ

### Tin tức `/tin-tuc`
- Danh sách bài viết
- Category
- Search

### Chi tiết tin tức `/tin-tuc/[slug]`
- Tiêu đề
- Ảnh đại diện
- Nội dung bài viết
- Ngày đăng
- Bài viết liên quan

### Liên hệ `/lien-he`
- Thông tin công ty
- Hotline
- Email
- Địa chỉ
- Google Map
- Form liên hệ

---

## 3. Header / Navigation

Menu chính:
- Dự án
- Đất nền
- Cho thuê
- Liên hệ
- Tin tức

Header cần:
- Logo bên trái
- Menu bên phải
- Mobile menu dạng hamburger
- Sticky header khi scroll

---

## 4. Data Model / CMS Structure

Tạo dữ liệu mock JSON hoặc CMS-ready structure.

### Project

```ts
type Project = {
  id: string
  slug: string
  name: string
  investor: string
  address: string
  area: string
  scale: string
  productTypes: string[]
  villaInfo?: string
  shophouseInfo?: string
  startTime?: string
  handoverTime?: string
  ownership?: string
  price: string
  hotline: string
  thumbnail: string
  bannerImage: string
  gallery: string[]
  description: string
  utilities: string[]
  floorPlanImages?: string[]
  mapEmbedUrl?: string
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
}



---

# Prompt: Build Fullstack Website with Next.js + Vercel Stack

Use the following modern fullstack stack:

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- ORM: Prisma
- Database: PostgreSQL (Neon or Supabase)
- Authentication: Auth.js (NextAuth)
- Image Upload: Cloudinary (or S3/R2)
- Deployment: Vercel

---

## Requirements

- Use Next.js as a fullstack framework (both frontend and backend)
- Use App Router (no Pages Router)
- Use server components by default, client components only when necessary
- Use Tailwind CSS for all styling (utility-first, modern UI)
- Do not use Bootstrap
- Use Prisma for all database operations
- Use PostgreSQL as the main database
- Use Auth.js for authentication (admin login)
- Use Cloudinary (or similar) for image upload and storage
- Follow clean architecture and modular structure

---

## Development Guidelines

- Write clean, readable, and maintainable code
- Use TypeScript
- Use reusable components
- Use proper folder structure:
  - /app
  - /components
  - /lib
  - /prisma
  - /api (route handlers)
- Separate business logic from UI
- Use environment variables for all secrets

### Safety Note

- Khi sửa code hoặc thêm tính năng mới, phải ưu tiên không làm hỏng các chức năng đang hoạt động.
- Không được tự ý thay đổi cấu trúc, luồng dữ liệu, route, UI hiện có nếu không thật sự cần thiết.
- Mọi thay đổi nên theo hướng mở rộng an toàn, tương thích ngược với phần đã build.
- Trước khi kết thúc, cần kiểm tra lại để tránh regression ở các màn hình và chức năng cũ.
- Không thêm vào giao diện public các đoạn text mang tính kỹ thuật như mô tả UI, mock data, database, API, CMS, framework, SEO, backend, admin hoặc cách triển khai hệ thống.
- Nội dung hiển thị cho người dùng cuối phải ưu tiên ngôn ngữ bán hàng, tư vấn, thương hiệu và giá trị sản phẩm.
- Khi thêm hoặc sửa text trên giao diện public, nội dung phải phù hợp ngữ cảnh bất động sản phía Đông Hà Nội, ưu tiên các khu vực như Gia Lâm, Long Biên, Đông Anh và câu chuyện tăng trưởng theo hạ tầng.

---

## Features

- SEO-friendly pages (server-rendered where needed)
- Dynamic routes (slug-based pages)
- Admin dashboard (protected routes)
- CRUD operations (projects, listings, posts)
- Image upload and gallery support
- Contact form (API route)
- Responsive design (mobile-first)

---

## Deployment

- The project must be optimized for deployment on Vercel
- Do not rely on local file storage
- Use external services for database and file storage
- Ensure environment variables are configurable

---

## Goal

Build a modern, scalable, and production-ready web application with:

- Clean UI (Tailwind)
- Strong backend (Next.js + Prisma)
- Easy deployment (Vercel)
- Good performance and SEO
