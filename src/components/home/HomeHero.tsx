import Image from "next/image";
import Link from "next/link";
import type { HomePageContent } from "@/models/page";

export function HomeHero({ hero }: { hero: HomePageContent["hero"] }) {
  return (
    <section className="container hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <span className="pill-badge">● {hero.eyebrow}</span>
        <h1 className="hero__title" id="hero-title">
          {hero.title}
          <br />
          <span className="text-accent">{hero.titleAccent}</span>
        </h1>
        <p className="hero__text">{hero.text}</p>
        <div className="hero__actions">
          <Link className="btn btn--dark" href={hero.primary.href}>
            {hero.primary.label} ↗
          </Link>
          <Link className="btn btn--outline" href={hero.secondary.href}>
            {hero.secondary.label} →
          </Link>
        </div>
      </div>

      <div className="hero__visual">
        <div className="clipped-frame">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            sizes="(max-width: 991px) 100vw, 600px"
            quality={85}
          />
        </div>
        <div className="float-badge">
          <span className="float-badge__value">{hero.badge.value}</span>
          <span className="float-badge__label">{hero.badge.label}</span>
        </div>
      </div>
    </section>
  );
}
