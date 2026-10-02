import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/content/RichText";
import type { Insight } from "@/models/insight";
import { formatDate } from "@/utils/format";

export function InsightArticle({ insight }: { insight: Insight }) {
  return (
    <article>
      <header className="container container--text article__header">
        <nav aria-label="Breadcrumb">
          <Link className="eyebrow eyebrow--rule" href="/insights">
            ABS Journal
          </Link>
        </nav>
        <h1 className="article__title">{insight.title}</h1>
        <div className="article__meta">
          <time dateTime={insight.publishedAt}>{formatDate(insight.publishedAt)}</time>
          <span>{insight.category}</span>
          <span>{insight.author}</span>
        </div>
      </header>

      <div className="container">
        <div className="article__media">
          <Image
            src={insight.image}
            alt=""
            fill
            preload
            sizes="(max-width: 1320px) 100vw, 1264px"
          />
        </div>
      </div>

      <div className="container container--text article__body">
        <RichText blocks={insight.body} lead />
        <footer className="article__footer">
          <Link className="text-link" href="/insights">
            ← All insights
          </Link>
          <Link className="text-link" href="/contact#register-interest">
            Talk to our team →
          </Link>
        </footer>
      </div>
    </article>
  );
}
