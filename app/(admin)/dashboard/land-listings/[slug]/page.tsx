import { LandListingEditor } from "@/components/admin/land-listing-editor";

export default async function AdminLandListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LandListingEditor slug={slug} />;
}
