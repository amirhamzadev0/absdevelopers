import { Reveal } from "@/components/ui/Reveal";
import type { Principle } from "@/models/content";
import { padIndex } from "@/utils/format";

export function PrincipleGrid({ principles }: { principles: Principle[] }) {
  return (
    <Reveal as="ol" stagger className="principle-grid">
      {principles.map((principle, index) => (
        <li key={principle.id} className="principle-card">
          <span className="principle-card__number">{padIndex(index + 1)}</span>
          <h3 className="principle-card__title">{principle.title}</h3>
          <p className="principle-card__text">{principle.text}</p>
        </li>
      ))}
    </Reveal>
  );
}
