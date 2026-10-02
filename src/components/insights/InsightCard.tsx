import Image from "next/image";
import Link from "next/link";
import type { InsightSummary } from "@/models/insight";
import { formatDate } from "@/utils/format";

interface InsightCardProps {
  insight: InsightSummary;
  showExcerpt?: boolean;
  headingLevel?: "h2" | "h3";
}

export function InsightCard({
  insight,
  showExcerpt = false,
  headingLevel: Heading = "h3",
}: InsightCardProps) {
  return (
    <Link href={`/insights/${insight.slug}`} className="insight-card">
      <div className="insight-card__media">
        <Image
          src={insight.image}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1180px) 50vw, 420px"
        />
      </div>
      <div className="insight-card__meta">
        <time dateTime={insight.publishedAt}>{formatDate(insight.publishedAt)}</time>
        <span>{insight.category}</span>
      </div>
      <Heading className="insight-card__title">{insight.title}</Heading>
      {showExcerpt ? <p className="insight-card__excerpt">{insight.excerpt}</p> : null}
    </Link>
  );
}
