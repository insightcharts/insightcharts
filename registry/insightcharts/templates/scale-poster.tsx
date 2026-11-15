"use client";

import type { CSSProperties, ReactNode } from "react";
import { ScaleLadder, type ScaleLadderProps } from "@/components/insightcharts/atoms/scale-ladder";
import { StatCircles, type StatCirclesProps } from "@/components/insightcharts/atoms/stat-circles";
import { makeFormatter, type FormatSpec, type IconInput, withMeta, isSpec, registerComponents, renderSlot, type InsightSpec, type Slot, useContainerWidth } from "insightcharts/core";
import { niceStep, toNumber, type Row } from "insightcharts/data";
import { Poster, type PosterPanel } from "@/components/insightcharts/molecules/poster";
import { _InfographicStat, frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFrameProps, type Region } from "@/components/insightcharts/templates/_infographic-layout";

// Specs in the regions resolve without the host calling registerAll().
registerComponents({ ScaleLadder, StatCircles });

/** One large figure in the side column, set level with the part of the scale it describes. */
export interface ScalePosterFigure {
  /** Position on the scale the figure belongs to, in the scale's units. The figure is set level with it. */
  at: number;
  /** The figure as printed, e.g. "1%" or "380 atm". */
  value: string;
  /** What it measures, in a few words. */
  label: string;
  /** A second short line: the comparison or the condition. */
  context?: string;
  /** Icon set beside the figure: a built-in name or `path://`. */
  icon?: IconInput;
}

export interface ScalePosterProps extends InfographicFrameProps {
  /** The scale: a compact `scale-ladder` config (`data`, `name`, `value`, `iconField`, `direction`, `scale`, `min`, `max`, `zones`, `scaleLabel`, `format`), or a full spec that replaces it. */
  scale: Region<Partial<ScaleLadderProps> & { format?: FormatSpec; highlight?: string | string[] }>;
  /** Up to about five large figures for the side column, each set level with its position on the scale. */
  figures?: ScalePosterFigure[];
  /** A small graphic in the side column: a compact `stat-circles` config (`data`, `name`, `value`, `unit`), or a full spec. */
  side?: Region<Partial<StatCirclesProps> & { format?: FormatSpec }>;
  /** Position on the scale where the `side` graphic starts. Default: under the last figure. */
  sideAt?: number;
  /** Height of the scale in px. Default: 68px per item, at least 920. */
  height?: number;
}

const BOX = 22; // Height of the ladder's boxed tick labels; the scale starts and ends half a box in.

interface Domain {
  lo: number;
  hi: number;
  log: boolean;
  down: boolean;
  heading: boolean;
}

/** The ends of the scale, found the way `scale-ladder` finds them, so the side column can be set level with it. */
function domainOf(cfg: Record<string, unknown>, rows: Row[]): Domain | null {
  const field = typeof cfg.value === "string" ? cfg.value : undefined;
  if (!field) return null;
  const log = cfg.scale === "log";
  const zones = (Array.isArray(cfg.zones) ? cfg.zones : []) as { from: number; to: number }[];
  const all = [...rows.map((r) => toNumber(r[field])), ...zones.flatMap((z) => [z.from, z.to])].filter((v) => Number.isFinite(v) && (!log || v > 0));
  if (!all.length) return null;
  const vMin = Math.min(...all);
  const vMax = Math.max(...all);
  const min = typeof cfg.min === "number" ? cfg.min : undefined;
  const max = typeof cfg.max === "number" ? cfg.max : undefined;
  let lo: number;
  let hi: number;
  if (log) {
    lo = min && min > 0 ? min : 10 ** Math.floor(Math.log10(vMin || 1));
    hi = max && max > lo ? max : 10 ** Math.ceil(Math.log10(vMax || 10));
    if (hi <= lo) hi = lo * 10;
  } else {
    const step = niceStep((vMax - vMin || Math.abs(vMax) || 1) / 5);
    lo = min ?? (vMin >= 0 && vMin < step ? 0 : Math.floor(vMin / step) * step);
    hi = max ?? Math.ceil(vMax / step) * step;
    if (hi <= lo) hi = lo + step;
  }
  return { lo, hi, log, down: cfg.direction === "down", heading: !!cfg.scaleLabel || log };
}

type Cell = { at?: number; tag?: string; body: ReactNode; key: string };

const TAG: CSSProperties = { margin: 0, fontSize: 11.5, lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--_ic-ink-2)" };

/**
 * The side column. Beside the scale each cell starts at the height of its scale position, under
 * a dotted rule that runs back to the scale; a cell whose content is taller than the room to the
 * next one pushes the rest down rather than overlapping. Stacked under the scale it is a plain grid.
 */
function _ScaleSide({ cells, height, domain, reach, columns }: { cells: Cell[]; height?: number; domain: Domain | null; reach: number; columns: number }) {
  const aligned = height != null && domain != null && cells.some((c) => c.at != null);
  if (!aligned) {
    return (
      <div data-slot="ic-scale-poster-side" style={{ minWidth: 0, display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "28px 24px", alignItems: "start" }}>
        {cells.map((c, i) => (
          // The poster already rules off the panel, so the first row carries no rule of its own.
          <div key={c.key} data-slot="ic-scale-poster-figure" style={{ minWidth: 0, display: "grid", gap: 10, alignContent: "start", borderTop: i < columns ? undefined : "2px dotted var(--_ic-axis)", paddingTop: i < columns ? 0 : 12 }}>
            {c.tag ? <p style={TAG}>{c.tag}</p> : null}
            {c.body}
          </div>
        ))}
      </div>
    );
  }
  const { lo, hi, log, down, heading } = domain;
  const f = (v: number) => (log ? Math.log10(Math.max(v, 1e-12)) : v);
  const top = (heading ? 24 : 2) + BOX / 2;
  const bottom = height - BOX / 2 - 2;
  const pos = (v: number) => {
    const u = Math.min(1, Math.max(0, (f(v) - f(lo)) / (f(hi) - f(lo) || 1)));
    return down ? top + u * (bottom - top) : bottom - u * (bottom - top);
  };
  // Cells with a position are set level with it; the rest follow the last of them.
  const fixed = cells.filter((c) => c.at != null).map((c) => ({ ...c, y: pos(c.at!) })).sort((a, b) => a.y - b.y);
  const placed = [...fixed, ...cells.filter((c) => c.at == null).map((c) => ({ ...c, y: NaN }))];
  const rows = [`${Math.max(0, Math.round(fixed[0]?.y ?? 0))}px`, ...placed.map((c, i) => (i < fixed.length - 1 ? `minmax(min-content, ${Math.round(fixed[i + 1].y - c.y)}px)` : "auto"))];
  return (
    <div data-slot="ic-scale-poster-side" style={{ minWidth: 0, minHeight: height, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gridTemplateRows: rows.join(" ") }}>
      <span aria-hidden />
      {placed.map((c) => (
        <div key={c.key} data-slot="ic-scale-poster-figure" style={{ minWidth: 0, position: "relative", display: "grid", gap: 10, alignContent: "start", paddingTop: 12, paddingBottom: 20 }}>
          {/* The rule starts in the gap between the columns, so it reads as coming off the scale. */}
          <span aria-hidden data-slot="ic-scale-poster-rule" style={{ position: "absolute", top: -1, left: -reach, right: 0, borderTop: "2px dotted var(--_ic-axis)" }} />
          {c.tag ? <p style={TAG}>{c.tag}</p> : null}
          {c.body}
        </div>
      ))}
    </div>
  );
}

function ScalePosterImpl({ scale, figures, side, sideAt, height, kicker, title, subtitle, theme = "ocean", mode = "light", download, maxWidth = 980, linked, data, sources, note, credit, level, className, style }: ScalePosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(980);
  const width = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const beside = width >= 760;
  const phone = width < 600;
  const gap = phone ? 28 : width < 900 ? 28 : 40;
  const { bind, wrap } = useInfographicLink(linked, data);

  const cfg = (scale && typeof scale === "object" && !("$$typeof" in scale) ? scale : {}) as Record<string, unknown>;
  const rows = (Array.isArray(cfg.data) ? cfg.data : Array.isArray(data) ? data : []) as Row[];
  const domain = domainOf(cfg, rows);
  const ladderHeight = height ?? (typeof cfg.height === "number" ? cfg.height : Math.max(beside ? 920 : 760, rows.length * 68 + 80));
  // The ends are passed on explicitly so the scale and the side column cannot disagree.
  const ladder = regionPanel(scale, "scale-ladder", { direction: "up" }, { id: "scale", span: beside ? 8 : 12 }, { height: ladderHeight, ...(domain ? { min: domain.lo, max: domain.hi } : null) });

  const fmt = makeFormatter(cfg.format as FormatSpec | undefined);
  const sideRegion = regionPanel(side, "stat-circles", { colorBy: "item" }, { id: "side" });
  const sideSpec = sideRegion ? bind("side", isSpec(sideRegion.content) ? ({ height: 260, ...(sideRegion.content as InsightSpec) } as Slot) : sideRegion.content) : null;
  const list = figures ?? [];
  const cells: Cell[] = list.map((fig, i) => ({ key: `f${i}`, at: fig.at, tag: `At ${fmt(fig.at)}`, body: <_InfographicStat value={fig.value} label={fig.label} context={fig.context} icon={fig.icon} max={beside ? 60 : 52} /> }));
  if (sideSpec != null) {
    cells.push({
      key: "side",
      at: sideAt,
      tag: sideRegion?.title,
      body: (
        <div data-slot="ic-scale-poster-side-graphic" style={{ minWidth: 0, display: "grid", gap: 6 }}>
          {sideRegion?.subtitle ? <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4, color: "var(--_ic-ink-2)" }}>{sideRegion.subtitle}</p> : null}
          {renderSlot(sideSpec)}
        </div>
      ),
    });
  }
  const panels: (PosterPanel | null)[] = [
    ladder,
    cells.length
      ? {
          id: "figures",
          span: beside ? 4 : 12,
          content: <_ScaleSide cells={cells} height={beside ? ladderHeight : undefined} domain={domain} reach={Math.round(gap * 0.75)} columns={phone ? (width < 420 ? 1 : 2) : 3} />,
        }
      : null,
  ];

  return (
    <div ref={ref} data-slot="ic-scale-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={linkPanels(panels, (id, slot) => (id === "figures" ? slot : bind(id, slot)))} columns={12} gap={gap} maxWidth={maxWidth} theme={theme} mode={mode} rules="dotted" sources={sources} note={note} credit={credit} level={level} download={download} />)}
    </div>
  );
}

// Example data. The Meridian Deep survey, Mount Aldra and their figures are invented; the orbital altitudes are rounded public figures.
const dive = [
  { sighting: "Survey ship hull", m: 8, icon: "ship" },
  { sighting: "Kelp canopy", m: 120, icon: "leaf" },
  { sighting: "Sardine shoal", m: 310, icon: "fish" },
  { sighting: "Lanternfish layer", m: 560, icon: "fish" },
  { sighting: "Swordfish", m: 820, icon: "fish" },
  { sighting: "Coral mound", m: 1150, icon: "tree" },
  { sighting: "Sperm whale", m: 1480, icon: "wave" },
  { sighting: "Anglerfish", m: 1900, icon: "fish" },
  { sighting: "Sensor array", m: 2300, icon: "satellite" },
  { sighting: "Dumbo octopus", m: 2750, icon: "star" },
  { sighting: "Sea cucumbers", m: 3200, icon: "circle" },
  { sighting: "Seabed lander", m: 3750, icon: "pin" },
];
const speciesByZone = [
  { zone: "species in the sunlit zone", species: 148 },
  { zone: "species in the twilight zone", species: 61 },
  { zone: "species in the dark zone", species: 23 },
];
export const ScalePoster = withMeta(ScalePosterImpl, {
  name: "scale-poster",
  component: "ScalePoster",
  title: "Scale poster",
  level: "template",
  category: "infographic",
  description: "A tall poster that is one illustrated scale: a full-height `scale-ladder` with icons, leader-labelled items and named zones, and a narrow side column of large figures and one small graphic, each set level with the part of the scale it describes.",
  whenToUse: "Use it when the positions of 6 to about 16 named things on one scale are the whole subject: depths, altitudes, temperatures, distances, ages. Give the scale's rows and zones in `scale`, up to five `figures` with the scale position each belongs to, and optionally a `side` graphic of two to four magnitudes. Beside the scale the figures line up with their positions; under 760px they move below it.",
  avoid: "Comparing sizes rather than positions (use `ranking-poster` or `count-poster`); change over time (use `timeline-poster`); more than about 16 items, because the labels run together; several unrelated graphics (use `poster` and lay the panels out yourself).",
  composes: ["poster", "scale-ladder", "stat-circles"],
  props: [
    { name: "scale", type: "ScaleLadderConfig | Slot", required: true, description: "The scale. A compact `scale-ladder` config: `{ data, name, value, iconField?, icon?, direction?, scale?, min?, max?, ticks?, zones?, scaleLabel?, format?, highlight? }`. Or a full spec, which replaces the ladder." },
    { name: "figures", type: "{ at: number; value: string; label: string; context?: string; icon?: string }[]", description: "Large figures for the side column. `at` is the position on the scale the figure belongs to; beside the scale the figure is set level with it under a dotted rule." },
    { name: "side", type: "StatCirclesConfig | Slot", description: "One small graphic in the side column. A compact `stat-circles` config: `{ data, name, value, unit?, format?, title?, subtitle? }`. Or a full spec." },
    { name: "sideAt", type: "number", description: "Position on the scale where the `side` graphic starts. Default: under the last figure." },
    { name: "height", type: "number", description: "Height of the scale in px. Default: 68px per item, at least 920 (760 when stacked)." },
    ...frameDocs("ocean", 980),
  ],
  example: {
    type: "scale-poster",
    theme: "ocean",
    kicker: "Oceans",
    title: "The Meridian Deep survey logged 12 sightings between 8 m and 3,750 m",
    subtitle: "Depth of each sighting on one research dive, metres below the surface.",
    scale: {
      data: dive,
      name: "sighting",
      value: "m",
      iconField: "icon",
      direction: "down",
      min: 0,
      max: 4000,
      format: "{value} m",
      scaleLabel: "Depth, metres",
      zones: [
        { from: 0, to: 200, label: "Sunlit" },
        { from: 200, to: 1000, label: "Twilight zone" },
        { from: 1000, to: 4000, label: "Dark zone" },
      ],
    },
    figures: [
      { at: 200, value: "1%", label: "of surface light is left" },
      { at: 1000, value: "4°C", label: "water temperature" },
      { at: 3000, value: "376 atm", label: "pressure at the lander, 3,750 m down" },
    ],
    side: { data: speciesByZone, name: "zone", value: "species", title: "Species logged", height: 250 },
    sideAt: 1900,
    sources: "Meridian Deep survey log",
    note: "The Meridian Deep survey is invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
});
