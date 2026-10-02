"use client";

import { useMemo, useState } from "react";
import type { ProjectCardView } from "@/models/project";

export const ALL = "all";

/** Client-side city/category filtering over the already-loaded project list. */
export function useProjectFilterViewModel(projects: ProjectCardView[]) {
  const [city, setCity] = useState(ALL);
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(
    () => [...new Set(projects.map((project) => project.category))],
    [projects],
  );
  const visible = useMemo(
    () =>
      projects.filter(
        (project) =>
          (city === ALL || project.city === city) &&
          (category === ALL || project.category === category),
      ),
    [projects, city, category],
  );

  return {
    city,
    category,
    categories,
    visible,
    setCity,
    setCategory,
    reset: () => {
      setCity(ALL);
      setCategory(ALL);
    },
  };
}
