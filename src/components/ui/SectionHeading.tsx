import type { ReactNode } from "react";
import type { SectionHeading as SectionHeadingContent } from "@/models/content";

interface SectionHeadingProps {
  heading: SectionHeadingContent;
  align?: "split" | "center";
  as?: "h1" | "h2";
  action?: ReactNode;
  id?: string;
}

export function SectionHeading({
  heading,
  align = "split",
  as: Tag = "h2",
  action,
  id,
}: SectionHeadingProps) {
  return (
    <div className={`section-head${align === "center" ? " section-head--center" : ""}`}>
      <div>
        <span className="eyebrow">{heading.eyebrow}</span>
        <Tag className="section-head__title" id={id}>
          {heading.title}
        </Tag>
        {align === "center" && heading.intro ? (
          <p className="section-head__intro">{heading.intro}</p>
        ) : null}
      </div>
      {align === "split" &&
        (action ?? (heading.intro ? <p className="section-head__intro">{heading.intro}</p> : null))}
    </div>
  );
}
