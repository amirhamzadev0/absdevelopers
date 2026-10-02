import type { Metadata } from "next";
import { LeaderCard } from "@/components/about/LeaderCard";
import { RichText } from "@/components/content/RichText";
import { StatsBand } from "@/components/home/StatsBand";
import { InsightsPreview } from "@/components/insights/InsightsPreview";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { PrincipleGrid } from "@/components/shariah/PrincipleGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routeSeo } from "@/config/seo";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getAboutViewModel } from "@/viewmodels/page.viewmodel";

export const metadata: Metadata = buildMetadata({ ...routeSeo.about, path: "/about" });

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
];

export default async function AboutPage() {
  const { content, leaders, insights } = await getAboutViewModel();
  return (
    <>
      <PageHero
        heading={content.hero}
        breadcrumbs={breadcrumbs}
        image={{
          src: "/assets/projects/pearl-one-tower.webp",
          alt: "Pearl One Tower, Bahria Town Lahore",
        }}
      />

      <Reveal as="section" className="section" aria-labelledby="story-title">
        <div className="container split">
          <div>
            <span className="eyebrow">{content.story.heading.eyebrow}</span>
            <h2 className="split__title" id="story-title">
              {content.story.heading.title}
            </h2>
          </div>
          <RichText blocks={content.story.body} lead />
        </div>
      </Reveal>

      <StatsBand stats={content.stats} />

      <Reveal as="section" className="section section--dark" aria-labelledby="leadership-title">
        <div className="container">
          <SectionHeading heading={content.leadership} id="leadership-title" />
          <div className="leader-grid">
            {leaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        </div>
      </Reveal>

      <section className="section" aria-labelledby="values-title">
        <div className="container">
          <SectionHeading heading={content.values.heading} id="values-title" />
          <PrincipleGrid principles={content.values.items} />
        </div>
      </section>

      <InsightsPreview
        heading={{ eyebrow: "ABS Journal", title: "Ideas shaping better places." }}
        insights={insights}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
