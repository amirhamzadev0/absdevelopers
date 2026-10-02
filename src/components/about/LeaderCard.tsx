import type { Leader } from "@/models/leader";

function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <article className="leader-card">
      <span className="leader-card__monogram" aria-hidden="true">
        {initials(leader.name)}
      </span>
      <div>
        <h3 className="leader-card__name">{leader.name}</h3>
        <p className="leader-card__role">{leader.role}</p>
        <p className="leader-card__bio">{leader.bio}</p>
      </div>
    </article>
  );
}
