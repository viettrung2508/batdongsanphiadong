import { ApartmentEditor } from "@/components/admin/apartment-editor";

export default async function AdminApartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ApartmentEditor slug={slug} />;
}
