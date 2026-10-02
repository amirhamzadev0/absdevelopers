import type { Metadata } from "next";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { InterestSection } from "@/components/forms/InterestSection";
import { PageHero } from "@/components/layout/PageHero";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getContactViewModel } from "@/viewmodels/page.viewmodel";

export const metadata: Metadata = buildMetadata({ ...routeSeo.contact, path: "/contact" });

export default async function ContactPage() {
  const { content, site, projectOptions } = await getContactViewModel();
  return (
    <>
      <PageHero
        heading={content}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ]}
      />
      <section className="section">
        <div className="container">
          <ContactChannels channels={site.channels} office={site.headOffice} />
        </div>
      </section>
      <InterestSection
        heading={{
          eyebrow: "Register Interest",
          title: "Find your next address.",
          intro:
            "Tell us what you are looking for and our team can guide you toward the ABS development that best fits your needs.",
        }}
        projectOptions={projectOptions}
      />
    </>
  );
}
