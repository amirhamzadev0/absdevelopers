import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/models/project";

interface LiveFeedProps {
  project: Project | null;
  note: string;
}

/** Placeholder frame for the live construction stream (camera embed is wired up in Phase 2). */
export function LiveFeed({ project, note }: LiveFeedProps) {
  return (
    <div>
      <div className="live-panel">
        {project ? (
          <Image src={project.image} alt="" fill sizes="(max-width: 1320px) 100vw, 1264px" />
        ) : null}
        <div className="live-panel__overlay">
          <span className="live-panel__badge">
            <span className="live-panel__dot" /> Live
          </span>
          <h2 className="live-panel__title">{project ? project.name : "Construction feed"}</h2>
          <p>Loading live construction feed…</p>
          {project ? (
            <Link className="btn btn--gold btn--small" href={`/projects/${project.slug}`}>
              View project
            </Link>
          ) : null}
        </div>
      </div>
      <p className="live-note">{note}</p>
    </div>
  );
}
