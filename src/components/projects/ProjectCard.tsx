import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectCardView } from "@/models/project";

export function ProjectCard({ project }: { project: ProjectCardView }) {
  return (
    <Link href={`/projects/${project.slug}`} className="project-card">
      <div className="project-card__media">
        <Image
          src={project.image}
          alt={`${project.name} rendering`}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1180px) 50vw, 420px"
        />
        <span className="project-card__number">{project.number}</span>
        <span
          className={`tag project-card__status${project.status === "Completed" ? " tag--gold" : ""}`}
        >
          {project.status}
        </span>
      </div>
      <div className="project-card__body">
        <span className="project-card__meta">
          {project.city} · {project.category}
        </span>
        <h2 className="project-card__title">
          {project.name}
          <ArrowUpRight size={20} aria-hidden="true" />
        </h2>
        <p className="project-card__summary">{project.summary}</p>
      </div>
    </Link>
  );
}
