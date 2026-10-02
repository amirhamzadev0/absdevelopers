import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { ProjectCardView } from "@/models/project";

/** The numbered, hairline-divided project directory from the home design. */
export function ProjectIndex({ projects }: { projects: ProjectCardView[] }) {
  return (
    <Reveal as="ul" stagger className="project-index">
      {projects.map((project) => (
        <li key={project.slug} className="project-index__item">
          <Link href={`/projects/${project.slug}`} className="project-tile">
            <span className="project-tile__number">{project.number}</span>
            <span className="project-tile__name">
              {project.name}
              <ArrowUpRight className="project-tile__arrow" size={18} aria-hidden="true" />
            </span>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}
