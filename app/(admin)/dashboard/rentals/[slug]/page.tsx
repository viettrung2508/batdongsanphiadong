import { RentalEditor } from "@/components/admin/rental-editor";

export default async function AdminRentalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RentalEditor slug={slug} />;
}
