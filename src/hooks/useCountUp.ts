"use client";

import { useEffect, useState } from "react";

/**
 * Shows `target` by default (server render, no JS, reduced motion) and replays a
 * 0 → target ease-out count once `start` becomes true.
 */
export function useCountUp(target: number, start: boolean, duration = 1400): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!start || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const began = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - began) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, duration]);

  return value;
}
