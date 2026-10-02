import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getInsightSlugs } from "@/viewmodels/insight.viewmodel";
import { getProjectSlugs } from "@/viewmodels/project.viewmodel";

const staticRoutes = [
  "/",
  "/projects",
  "/about",
  "/shariah-compliant",
  "/insights",
  "/live",
  "/contact",
  "/privacy-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, insights] = await Promise.all([getProjectSlugs(), getInsightSlugs()]);
  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...projects.map((slug) => ({
      url: absoluteUrl(`/projects/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...insights.map((slug) => ({
      url: absoluteUrl(`/insights/${slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
