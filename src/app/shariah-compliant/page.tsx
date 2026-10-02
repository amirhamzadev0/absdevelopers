import type { Metadata } from "next";
import { InsightsPreview } from "@/components/insights/InsightsPreview";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { PrincipleGrid } from "@/components/shariah/PrincipleGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routeSeo } from "@/config/seo";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getShariahViewModel } from "@/viewmodels/page.viewmodel";

export const metadata: Metadata = buildMetadata({
  ...routeSeo.shariah,
  path: "/shariah-compliant",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Shariah Compliant", path: "/shariah-compliant" },
];

export default async function ShariahPage() {
  const { content, insights } = await getShariahViewModel();
  return (
    <>
      <PageHero heading={content.hero} breadcrumbs={breadcrumbs} />

      <section className="section" aria-labelledby="principles-title">
        <div className="container">
          <SectionHeading heading={content.principles.heading} id="principles-title" />
          <PrincipleGrid principles={content.principles.items} />
        </div>
      </section>

      <Reveal as="section" className="section section--dark" aria-labelledby="commitment-title">
        <div className="container statement">
          <span className="eyebrow">{content.commitment.eyebrow}</span>
          <h2 className="statement__title" id="commitment-title">
            {content.commitment.title}
          </h2>
          <p className="statement__text">{content.commitment.intro}</p>
        </div>
      </Reveal>

      <InsightsPreview
        heading={{ eyebrow: "ABS Journal", title: "Latest insights" }}
        insights={insights}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
