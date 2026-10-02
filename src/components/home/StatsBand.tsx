"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { Stat } from "@/models/content";

function StatValue({ stat, start }: { stat: Stat; start: boolean }) {
  const count = useCountUp(stat.value ?? 0, start && stat.value !== null);
  if (stat.value === null) return <>{stat.display}</>;
  return (
    <>
      <span aria-hidden="true">
        {count}
        {stat.suffix}
      </span>
      <span className="visually-hidden">
        {stat.value}
        {stat.suffix}
      </span>
    </>
  );
}

export function StatsBand({ stats, label = "ABS in numbers" }: { stats: Stat[]; label?: string }) {
  const { ref, revealed } = useScrollReveal<HTMLElement>(0.2);
  return (
    <section
      ref={ref}
      className={`container stats reveal--stagger${revealed ? " is-revealed" : ""}`}
      aria-label={label}
    >
      {stats.map((stat, index) => (
        <div key={stat.id} className="stat" style={{ ["--i" as string]: index }}>
          <div className="stat__value">
            <StatValue stat={stat} start={revealed} />
          </div>
          <div className="stat__label">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
