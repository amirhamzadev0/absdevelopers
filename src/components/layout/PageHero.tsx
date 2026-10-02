import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { SectionHeading } from "@/models/content";

interface PageHeroProps {
  heading: SectionHeading;
  breadcrumbs?: { name: string; path: string }[];
  image?: { src: string; alt: string };
  meta?: ReactNode;
  children?: ReactNode;
}

/** Inner-page hero in the home hero's language: text left, clipped image right (optional). */
export function PageHero({ heading, breadcrumbs, image, meta, children }: PageHeroProps) {
  return (
    <section className={`container page-hero${image ? " page-hero--media" : ""}`}>
      <div className="page-hero__content">
        {breadcrumbs ? (
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path}>
                  {index < breadcrumbs.length - 1 ? (
                    <Link href={crumb.path}>{crumb.name}</Link>
                  ) : (
                    <span aria-current="page">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <span className="pill-badge">● {heading.eyebrow}</span>
        <h1 className="page-hero__title">{heading.title}</h1>
        {heading.intro ? <p className="page-hero__intro">{heading.intro}</p> : null}
        {meta ? <div className="page-hero__meta">{meta}</div> : null}
        {children}
      </div>
      {image ? (
        <div className="page-hero__visual">
          <div className="clipped-frame clipped-frame--short">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              sizes="(max-width: 991px) 100vw, 600px"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
