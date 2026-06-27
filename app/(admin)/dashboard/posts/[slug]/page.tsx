import { PostEditor } from "@/components/admin/post-editor";

export default async function AdminPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostEditor slug={slug} />;
}
