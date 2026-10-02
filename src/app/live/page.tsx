import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LiveFeed } from "@/components/live/LiveFeed";
import { CtaBand } from "@/components/ui/CtaBand";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getLiveViewModel } from "@/viewmodels/page.viewmodel";

export const metadata: Metadata = buildMetadata({ ...routeSeo.live, path: "/live" });

export default async function LivePage() {
  const { content, project } = await getLiveViewModel();
  return (
    <>
      <PageHero
        heading={content.hero}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Live", path: "/live" },
        ]}
      />
      <section className="section">
        <div className="container">
          <LiveFeed project={project} note={content.note} />
        </div>
      </section>
      <section className="section section--tight-top">
        <div className="container">
          <CtaBand
            eyebrow="Visit in person"
            title="See the progress for yourself — book a site visit with our team."
            primary={{ label: "Register Interest", href: "/contact#register-interest" }}
          />
        </div>
      </section>
    </>
  );
}
