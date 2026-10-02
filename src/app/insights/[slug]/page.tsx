import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightArticle } from "@/components/insights/InsightArticle";
import { InsightsPreview } from "@/components/insights/InsightsPreview";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getInsightDetailViewModel, getInsightSlugs } from "@/viewmodels/insight.viewmodel";

export async function generateStaticParams() {
  return (await getInsightSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const vm = await getInsightDetailViewModel(slug);
  if (!vm) return {};
  return buildMetadata({
    title: vm.insight.title,
    description: vm.insight.excerpt,
    path: `/insights/${slug}`,
    image: vm.insight.image,
    type: "article",
  });
}

export default async function InsightPage(props: PageProps<"/insights/[slug]">) {
  const { slug } = await props.params;
  const vm = await getInsightDetailViewModel(slug);
  if (!vm) notFound();
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: vm.insight.title, path: `/insights/${slug}` },
  ];
  return (
    <>
      <InsightArticle insight={vm.insight} />
      <InsightsPreview
        heading={{ eyebrow: "Keep reading", title: "More from the journal." }}
        insights={vm.related}
      />
      <JsonLd data={[articleSchema(vm.insight), breadcrumbSchema(breadcrumbs)]} />
    </>
  );
}
