import type { Metadata } from "next";
import { InterestSection } from "@/components/forms/InterestSection";
import { HomeHero } from "@/components/home/HomeHero";
import { ProjectIndex } from "@/components/home/ProjectIndex";
import { StatsBand } from "@/components/home/StatsBand";
import { InsightsPreview } from "@/components/insights/InsightsPreview";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getHomeViewModel } from "@/viewmodels/home.viewmodel";

export const metadata: Metadata = buildMetadata({
  ...routeSeo.home,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const { content, projects, insights, projectOptions } = await getHomeViewModel();
  return (
    <>
      <HomeHero hero={content.hero} />
      <StatsBand stats={content.stats} />
      <Reveal as="section" className="section section--tight-top" aria-labelledby="projects-title">
        <div className="container">
          <SectionHeading heading={content.projects} id="projects-title" />
          <ProjectIndex projects={projects} />
        </div>
      </Reveal>
      <InterestSection heading={content.interest} projectOptions={projectOptions} />
      <InsightsPreview heading={content.insights} insights={insights} />
    </>
  );
}
