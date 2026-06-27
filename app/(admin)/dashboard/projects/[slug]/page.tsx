import { ProjectEditor } from "@/components/admin/project-editor";

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectEditor slug={slug} />;
}
