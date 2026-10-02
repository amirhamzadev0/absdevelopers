import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InterestSection } from "@/components/forms/InterestSection";
import { PageHero } from "@/components/layout/PageHero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDetail, ProjectFacts } from "@/components/projects/ProjectDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbSchema, buildMetadata, projectSchema } from "@/lib/seo";
import { getShellViewModel } from "@/viewmodels/layout.viewmodel";
import { getProjectDetailViewModel, getProjectSlugs } from "@/viewmodels/project.viewmodel";

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const vm = await getProjectDetailViewModel(slug);
  if (!vm) return {};
  return buildMetadata({
    title: `${vm.project.name} — ${vm.project.city}`,
    description: vm.project.summary,
    path: `/projects/${slug}`,
    image: vm.project.image,
  });
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const [vm, shell] = await Promise.all([getProjectDetailViewModel(slug), getShellViewModel()]);
  if (!vm) notFound();
  const { project } = vm;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Our Projects", path: "/projects" },
    { name: project.name, path: `/projects/${project.slug}` },
  ];

  return (
    <>
      <PageHero
        heading={{
          eyebrow: `${project.city} · ${vm.category}`,
          title: project.name,
          intro: project.summary,
        }}
        breadcrumbs={breadcrumbs}
        image={{ src: project.image, alt: `${project.name} rendering` }}
        meta={
          <>
            <span className="tag">{vm.status}</span>
            <span className="tag">{project.location}</span>
          </>
        }
      />
      <div className="container">
        <ProjectFacts project={project} />
      </div>
      <section className="section">
        <div className="container">
          <ProjectDetail
            project={project}
            status={vm.status}
            category={vm.category}
            site={shell.site}
          />
        </div>
      </section>
      <InterestSection
        heading={{
          eyebrow: "Register Interest",
          title: `Find your address at ${project.name}.`,
          intro:
            "Share your details and our team will send prices, payment plans and availability.",
        }}
        projectOptions={vm.projectOptions}
        defaultProject={project.slug}
      />
      {vm.related.length ? (
        <section className="section" aria-labelledby="related-title">
          <div className="container">
            <SectionHeading
              heading={{ eyebrow: "Keep exploring", title: "More ABS developments" }}
              id="related-title"
            />
            <div className="project-grid">
              {vm.related.map((related) => (
                <ProjectCard key={related.slug} project={related} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd data={[projectSchema(project), breadcrumbSchema(breadcrumbs)]} />
    </>
  );
}
