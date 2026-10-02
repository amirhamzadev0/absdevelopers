import { Check, MapPin } from "lucide-react";
import Link from "next/link";
import { RichText } from "@/components/content/RichText";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/models/project";
import type { SiteInfo } from "@/models/site";

interface ProjectDetailProps {
  project: Project;
  status: string;
  category: string;
  site: Pick<SiteInfo, "phone" | "phoneHref" | "whatsappHref">;
}

export function ProjectFacts({ project }: { project: Project }) {
  if (!project.facts.length) return null;
  return (
    <dl className="fact-strip">
      {project.facts.map((fact) => (
        <div key={fact.label} className="fact">
          <dt className="fact__label">{fact.label}</dt>
          <dd className="fact__value">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProjectDetail({ project, status, category, site }: ProjectDetailProps) {
  return (
    <div className="detail-layout">
      <div className="detail-layout__main">
        <Reveal as="section" aria-labelledby="overview-title">
          <span className="eyebrow">01 / Overview</span>
          <h2 className="detail-block__title" id="overview-title">
            {project.tagline}
          </h2>
          <RichText blocks={project.body} />
        </Reveal>

        {project.highlights.length ? (
          <Reveal as="section" aria-labelledby="highlights-title">
            <span className="eyebrow">02 / Highlights</span>
            <h2 className="detail-block__title" id="highlights-title">
              What sets it apart
            </h2>
            <ul className="check-list">
              {project.highlights.map((item) => (
                <li key={item} className="check-list__item">
                  <Check size={16} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {project.unitTypes.length ? (
          <Reveal as="section" aria-labelledby="units-title">
            <span className="eyebrow">03 / Residences</span>
            <h2 className="detail-block__title" id="units-title">
              Unit types
            </h2>
            <table className="unit-table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Net / Gross area</th>
                </tr>
              </thead>
              <tbody>
                {project.unitTypes.map((unit) => (
                  <tr key={unit.name}>
                    <td>{unit.name}</td>
                    <td>{unit.area ?? "On request"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        ) : null}

        {project.amenities.length ? (
          <Reveal as="section" aria-labelledby="amenities-title">
            <span className="eyebrow">04 / Amenities</span>
            <h2 className="detail-block__title" id="amenities-title">
              Life inside {project.name}
            </h2>
            <ul className="check-list">
              {project.amenities.map((item) => (
                <li key={item} className="check-list__item">
                  <Check size={16} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {project.connectivity.length ? (
          <Reveal as="section" aria-labelledby="location-title">
            <span className="eyebrow">05 / Location</span>
            <h2 className="detail-block__title" id="location-title">
              {project.location}
            </h2>
            <ul className="route-list">
              {project.connectivity.map((item) => (
                <li key={item}>
                  <MapPin size={16} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>

      <aside className="detail-aside" aria-label="Enquire">
        <span className="eyebrow">Enquire</span>
        <h2 className="detail-aside__title">Interested in {project.name}?</h2>
        <p className="detail-aside__text">
          Our team can share prices, payment plans and availability.
        </p>
        <div className="detail-aside__actions">
          <Link className="btn btn--gold btn--block" href="#register-interest">
            Register Interest
          </Link>
          <a
            className="btn btn--ghost btn--block"
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Us
          </a>
          <a className="btn btn--ghost btn--block" href={site.phoneHref}>
            Call {site.phone}
          </a>
        </div>
        <ul className="detail-aside__list">
          <li>
            <span>City</span>
            <span>{project.city}</span>
          </li>
          <li>
            <span>Type</span>
            <span>{category}</span>
          </li>
          <li>
            <span>Status</span>
            <span>{status}</span>
          </li>
          <li>
            <span>Shariah compliant</span>
            <span>Yes</span>
          </li>
        </ul>
      </aside>
    </div>
  );
}
