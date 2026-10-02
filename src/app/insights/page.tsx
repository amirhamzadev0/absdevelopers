import type { Metadata } from "next";
import { InsightList } from "@/components/insights/InsightList";
import { PageHero } from "@/components/layout/PageHero";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getInsightListViewModel } from "@/viewmodels/insight.viewmodel";

export const metadata: Metadata = buildMetadata({ ...routeSeo.insights, path: "/insights" });

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function InsightsPage(props: PageProps<"/insights">) {
  const params = await props.searchParams;
  const { content, initialResult, initialSearch } = await getInsightListViewModel(
    first(params.search),
    first(params.page),
  );
  return (
    <>
      <PageHero
        heading={content}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ]}
      />
      <section className="section">
        <div className="container">
          <InsightList
            key={`${initialSearch}:${initialResult.page}`}
            initialResult={initialResult}
            initialSearch={initialSearch}
          />
        </div>
      </section>
    </>
  );
}
