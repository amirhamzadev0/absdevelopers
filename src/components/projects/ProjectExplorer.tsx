"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectCardView } from "@/models/project";
import { ALL, useProjectFilterViewModel } from "@/viewmodels/useProjectFilterViewModel";

interface ProjectExplorerProps {
  projects: ProjectCardView[];
  cities: string[];
}

export function ProjectExplorer({ projects, cities }: ProjectExplorerProps) {
  const vm = useProjectFilterViewModel(projects);

  return (
    <>
      <div className="filter-bar">
        <div className="filter-bar__group" role="group" aria-label="Filter by city">
          {[ALL, ...cities].map((city) => (
            <button
              key={city}
              type="button"
              className="chip"
              aria-pressed={vm.city === city}
              onClick={() => vm.setCity(city)}
            >
              {city === ALL ? "All cities" : city}
            </button>
          ))}
        </div>
        <div className="filter-bar__group" role="group" aria-label="Filter by type">
          {[ALL, ...vm.categories].map((category) => (
            <button
              key={category}
              type="button"
              className="chip"
              aria-pressed={vm.category === category}
              onClick={() => vm.setCategory(category)}
            >
              {category === ALL ? "All types" : category}
            </button>
          ))}
        </div>
      </div>

      <p className="filter-bar__count" aria-live="polite">
        Showing {vm.visible.length} of {projects.length} developments
      </p>

      {vm.visible.length ? (
        <div className="project-grid">
          {vm.visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No developments match these filters.</p>
          <button type="button" className="text-link" onClick={vm.reset}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
