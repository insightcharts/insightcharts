"use client";

import type { CSSProperties } from "react";
import { useContainerWidth } from "insightcharts/core";
import { _InfographicStat, type InfographicFigure } from "@/components/insightcharts/templates/_infographic-layout";

// The row of large figures shared by radial-poster, timeline-poster, profile-poster and
// network-poster. The leading underscore keeps this file out of the generated index.

/** A large figure with an optional small tag over it: the period, place or condition it belongs to. */
export interface PosterFigure extends InfographicFigure {
  /** Small capitals over the figure, e.g. "2021" or "At full load". */
  tag?: string;
}

const TAG: CSSProperties = { margin: 0, fontSize: 11.5, lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--_ic-ink-2)" };

/** How many figures fit side by side in a strip `width` px wide. */
export function _figureColumns(count: number, width: number): number {
  const fit = Math.max(1, Math.min(count, 4, Math.floor(width / (width < 420 ? 130 : 165))));
  // Balance the rows: four figures that do not fit on one line make two rows of two, not three and one.
  return Math.ceil(count / Math.ceil(count / fit));
}

/** Figures set in `columns` equal columns; rows after the first are ruled off with the poster's dotted rule. */
export function _PosterFigures({ figures, columns, max = 84, slot }: { figures: PosterFigure[]; columns: number; max?: number; slot: string }) {
  const [ref, width] = useContainerWidth<HTMLDivElement>(columns * 220);
  // One size for the whole strip, set by its longest figure, so figures on a line share a baseline.
  // 0.64 em per glyph leaves room for the monospaced display face of `blueprint`.
  const longest = Math.max(2, ...figures.map((f) => f.value.length));
  const column = (width - 28 * (columns - 1)) / columns;
  const size = Math.round(Math.max(40, Math.min(max, column / (longest * 0.64))));
  return (
    <div ref={ref} data-slot={slot} style={{ minWidth: 0, display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "26px 28px", alignItems: "start" }}>
      {figures.map((fig, i) => (
        <div key={i} data-slot={`${slot}-item`} style={{ minWidth: 0, display: "grid", gap: 10, alignContent: "start", borderTop: i < columns ? undefined : "2px dotted var(--_ic-axis)", paddingTop: i < columns ? 0 : 22 }}>
          {fig.tag ? <p style={TAG}>{fig.tag}</p> : null}
          <_InfographicStat value={fig.value} label={fig.label} context={fig.context} icon={fig.icon} max={size} />
        </div>
      ))}
    </div>
  );
}

export const figureDoc = "{ value: string; label: string; context?: string; icon?: string; tag?: string }[]";
