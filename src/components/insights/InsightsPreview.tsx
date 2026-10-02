import Link from "next/link";
import { InsightCard } from "@/components/insights/InsightCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SectionHeading as SectionHeadingContent } from "@/models/content";
import type { InsightSummary } from "@/models/insight";

interface InsightsPreviewProps {
  heading: SectionHeadingContent;
  insights: InsightSummary[];
}

export function InsightsPreview({ heading, insights }: InsightsPreviewProps) {
  return (
    <Reveal as="section" className="section" aria-labelledby="insights-preview-title">
      <div className="container">
        <SectionHeading
          heading={heading}
          id="insights-preview-title"
          action={
            <Link className="text-link" href="/insights">
              View all insights →
            </Link>
          }
        />
        <div className="insight-grid">
          {insights.map((insight) => (
            <InsightCard key={insight.slug} insight={insight} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
