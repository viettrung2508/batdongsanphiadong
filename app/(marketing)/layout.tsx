import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { FloatingContact } from "@/components/shared/floating-contact";
import { getPublicAreas, getPublicProjects } from "@/lib/public-api";

export default async function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const featuredProjects = await getPublicProjects({ featured: true });
  const areas = await getPublicAreas();

  return (
    <>
      <Header
        featuredProjects={featuredProjects.map((project) => ({
          slug: project.slug,
          name: project.name
        }))}
        areas={areas.map((area) => ({
          id: area.id,
          name: area.name,
          slug: area.slug
        }))}
      />
      {children}
      <FloatingContact />
      <Footer />
    </>
  );
}
