import "server-only";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Insight } from "@/models/insight";
import type { Project } from "@/models/project";
import type { SiteInfo } from "@/models/site";

export function siteUrl(): string {
  return (process.env.SITE_URL ?? "http://127.0.0.1:3120").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteUrl()}/`).toString();
}

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  /** Use the title as-is instead of the "%s · ABS Developers" template. */
  absoluteTitle?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage,
  type = "website",
  absoluteTitle = false,
}: MetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

type JsonLd = Record<string, unknown>;

export function organizationSchema(site: SiteInfo): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: siteUrl(),
    logo: absoluteUrl(siteConfig.logo.src),
    email: site.email,
    telephone: site.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.headOffice.address,
      addressLocality: site.headOffice.city,
      addressCountry: "PK",
    },
    sameAs: site.social.map((link) => link.href),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(insight: Insight): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    image: absoluteUrl(insight.image),
    datePublished: insight.publishedAt,
    author: { "@type": "Organization", name: insight.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: absoluteUrl(siteConfig.logo.src),
    },
    mainEntityOfPage: absoluteUrl(`/insights/${insight.slug}`),
  };
}

export function projectSchema(project: Project): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": project.category === "residential" ? "ApartmentComplex" : "Place",
    name: project.name,
    description: project.summary,
    image: absoluteUrl(project.image),
    url: absoluteUrl(`/projects/${project.slug}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: project.location,
      addressLocality: project.city,
      addressCountry: "PK",
    },
  };
}
