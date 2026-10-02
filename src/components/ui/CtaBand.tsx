import Link from "next/link";

interface CtaBandProps {
  eyebrow: string;
  title: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function CtaBand({ eyebrow, title, primary, secondary }: CtaBandProps) {
  return (
    <div className="cta-band">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="cta-band__title">{title}</h2>
      </div>
      <div className="cta-band__actions">
        <Link className="btn btn--gold" href={primary.href}>
          {primary.label}
        </Link>
        {secondary ? (
          <a className="btn btn--ghost" href={secondary.href}>
            {secondary.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}
