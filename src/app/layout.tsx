import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { routeSeo } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { organizationSchema, siteUrl } from "@/lib/seo";
import { getShellViewModel } from "@/viewmodels/layout.viewmodel";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: routeSeo.home.title, template: `%s · ${siteConfig.name}` },
  description: routeSeo.home.description,
  applicationName: siteConfig.name,
};

export const viewport: Viewport = {
  themeColor: "#f7f5f1",
  width: "device-width",
  initialScale: 1,
};

// Marks the document as JS-enabled before paint so scroll-reveal styles never hide content without JS.
const jsFlag = "document.documentElement.classList.add('js')";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const shell = await getShellViewModel();
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader
          navigation={shell.navigation}
          registerInterestHref={shell.registerInterestHref}
        />
        <main id="main">{children}</main>
        <SiteFooter
          site={shell.site}
          navigation={shell.footerNavigation}
          registerInterestHref={shell.registerInterestHref}
          year={shell.year}
        />
        <JsonLd data={organizationSchema(shell.site)} />
      </body>
    </html>
  );
}
