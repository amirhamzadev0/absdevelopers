import type { NextConfig } from "next";

// Legacy Shopify project URLs (/pages/<slug>) → new /projects/<slug>.
const legacyProjectSlugs: Record<string, string> = {
  "burj-quaid": "burj-quaid",
  "abs-executive-y": "abs-executive",
  "abs-central-y": "abs-central",
  "pearl-one-courtyard": "pearl-one-courtyard-1",
  "pearl-one-courtyard-2": "pearl-one-courtyard-2",
  "pearl-one-courtyard-3-y": "pearl-one-courtyard-3",
  "pearl-one-premium": "pearl-one-premium",
  "pearl-one-capital": "pearl-one-capital",
  "sialkot-central-y": "sialkot-central",
  "pearl-one-royal": "pearl-one-royal",
  "mall-residency-2": "abs-mall-residency-2",
  "mall-residency": "abs-mall-residency-1",
  "pearl-one-tower": "pearl-one-tower",
  "pearl-one-tower-yy": "pearl-one-tower",
};

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the workspace root (a stray lockfile in the user's home dir otherwise confuses root detection).
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  outputFileTracingExcludes: {
    "*": ["./.private/**/*", "./.env*", "./.tmp/**/*", "./tests/**/*"],
  },
  images: {
    qualities: [75, 85],
  },
  async redirects() {
    return [
      { source: "/pages/all-projects", destination: "/projects", permanent: true },
      { source: "/pages/about", destination: "/about", permanent: true },
      { source: "/pages/shariah-compliant", destination: "/shariah-compliant", permanent: true },
      { source: "/pages/live", destination: "/live", permanent: true },
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/blogs/news", destination: "/insights", permanent: true },
      { source: "/blogs/news/:slug", destination: "/insights/:slug", permanent: true },
      ...Object.entries(legacyProjectSlugs).map(([from, to]) => ({
        source: `/pages/${from}`,
        destination: `/projects/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
