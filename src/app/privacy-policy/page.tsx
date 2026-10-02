import type { Metadata } from "next";
import { RichText } from "@/components/content/RichText";
import { PageHero } from "@/components/layout/PageHero";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getPrivacyViewModel } from "@/viewmodels/page.viewmodel";

export const metadata: Metadata = buildMetadata({ ...routeSeo.privacy, path: "/privacy-policy" });

export default async function PrivacyPolicyPage() {
  const content = await getPrivacyViewModel();
  return (
    <>
      <PageHero heading={content.hero} />
      <section className="section">
        <div className="container container--text">
          <RichText blocks={content.body} />
        </div>
      </section>
    </>
  );
}
