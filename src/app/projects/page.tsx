import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/ui/CtaBand";
import { routeSeo } from "@/config/seo";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getProjectListViewModel } from "@/viewmodels/project.viewmodel";

export const metadata: Metadata = buildMetadata({ ...routeSeo.projects, path: "/projects" });

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Our Projects", path: "/projects" },
];

export default async function ProjectsPage() {
  const { content, projects, cities } = await getProjectListViewModel();
  return (
    <>
      <PageHero heading={content} breadcrumbs={breadcrumbs} />
      <section className="section">
        <div className="container">
          <ProjectExplorer projects={projects} cities={cities} />
        </div>
      </section>
      <section className="section section--tight-top">
        <div className="container">
          <CtaBand
            eyebrow="Not sure where to start?"
            title="Tell us what you need and we’ll match you with the right development."
            primary={{ label: "Register Interest", href: "/contact#register-interest" }}
          />
        </div>
      </section>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
