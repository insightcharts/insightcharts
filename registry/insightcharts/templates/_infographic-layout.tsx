"use client";

import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cssFallback, luminance, mix, type PropDoc, resolveIcon, type IconInput, type ModeInput, isSpec, renderSlot, type InsightSpec, type Slot, InsightData, type Selection, createTheme, type ThemeInput, type ThemeTokens, useContainerWidth } from "insightcharts/core";
import type { DataInput, Row } from "insightcharts/data";
import type { PosterPanel } from "@/components/insightcharts/molecules/poster";
import { themes, posterThemes, type PosterThemeName } from "insightcharts/themes";

// Shared plumbing for the layout posters (count-poster, flow-poster, ranking-poster,
// matrix-poster, atlas-poster). The leading underscore keeps this file out of the generated index.

/** Props every layout poster accepts. */
export interface InfographicFrameProps {
  /** Small label above the title: the topic. */
  kicker?: string;
  /** The poster's one fact, as a plain sentence with its number. */
  title: string;
  /** One line under the title: the measure, population and period. */
  subtitle?: string;
  /** A poster theme name, any other theme name, or a theme object. */
  theme?: PosterThemeName | (string & {}) | ThemeInput;
  /** Colour mode of the poster. Default `"light"`: a poster is one painted design and does not follow the page. */
  mode?: ModeInput;
  /** Show a "Download PNG" control that saves the whole poster as one image. */
  download?: boolean;
  /** Widest the poster is drawn. */
  maxWidth?: number | string;
  /** Clicking a mark in one graphic highlights the same name in the others, and filters panels that read the shared `data`. */
  linked?: boolean;
  /** Rows shared by every region whose config leaves out its own `data`. */
  data?: DataInput;
  /** Where the data comes from, shown in the footer. */
  sources?: string | string[];
  /** Caveat shown in the footer, e.g. "Illustrative data". */
  note?: string;
  /** Who made the poster. */
  credit?: string;
  /** Heading level of the title; panel headings are one level down. Default 2. */
  level?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  style?: CSSProperties;
}

/** PropDoc rows shared by the layout posters. */
export function frameDocs(theme: string, maxWidth: number): PropDoc[] {
  return [
    { name: "title", type: "string", required: true, description: "The poster's one fact, as a plain sentence with its number." },
    { name: "kicker", type: "string", description: "Small label above the title: the topic." },
    { name: "subtitle", type: "string", description: "One line under the title: the measure, population and period." },
    { name: "theme", type: "PosterThemeName | string | ThemeInput", default: `"${theme}"`, description: "Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object." },
    { name: "mode", type: '"light" | "dark" | "auto" | "system"', default: '"light"', description: "Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant." },
    { name: "download", type: "boolean", default: "false", description: 'Show a "Download PNG" control under the poster that saves the whole poster as one image.' },
    { name: "maxWidth", type: "number | string", default: String(maxWidth), description: "Widest the poster is drawn. It is centred in wider containers." },
    { name: "linked", type: "boolean", default: "false", description: "Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear." },
    { name: "data", type: "DataInput", description: "Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions." },
    { name: "sources", type: "string | string[]", description: "Where the data comes from, shown in the footer." },
    { name: "note", type: "string", description: 'Caveat shown in the footer, e.g. "Illustrative data".' },
    { name: "credit", type: "string", description: "Who made the poster, shown at the right of the footer." },
    { name: "level", type: "1 | 2 | 3 | 4 | 5", default: "2", description: "Heading level of the title. Panel headings are one level down." },
  ];
}

/** Text every region may carry: it becomes the panel's small heading and source line. */
export interface RegionText {
  /** Short heading over the graphic: one plain fact with its number, or a plain label. */
  title?: string;
  /** One line under the heading: the measure, unit and period. */
  subtitle?: string;
  /** Where this graphic's data comes from. */
  source?: string;
  /** Caveat shown after the source. */
  note?: string;
}

/** A region's compact config: the data, the field names and any other prop of the primitive that draws it. */
export type RegionConfig<P = unknown> = RegionText & { data?: Row[] } & P & { [prop: string]: unknown };

/** A region is a compact config for its intended primitive, or a full spec or element that replaces it. */
export type Region<P = unknown> = RegionConfig<P> | Slot;

const isElement = (value: unknown): boolean => typeof value !== "object" || value === null || "$$typeof" in (value as object) || Array.isArray(value);

/**
 * Turn a region prop into a poster panel. A compact config becomes a spec of `type` with the
 * template's `defaults` under it and `forced` over it; a full spec is kept as written. Either
 * way the heading and source move out of the chart and into the panel, so every panel of the
 * poster is set in the same type.
 */
export function regionPanel(region: Region | undefined, type: string, defaults: Record<string, unknown> = {}, panel: Partial<PosterPanel> = {}, forced: Record<string, unknown> = {}): PosterPanel | null {
  if (region == null || region === false) return null;
  if (isElement(region)) return { ...panel, content: region as ReactNode };
  const given = region as Record<string, unknown>;
  const full = isSpec(given);
  const { title, subtitle, source, note, ...rest } = given;
  const spec = (full ? rest : { type, ...defaults, ...rest, ...forced }) as InsightSpec;
  // A table sets its heading as a real <caption>; the panel heading already says it.
  return { ...panel, title: (title ?? given.caption) as string | undefined, subtitle: subtitle as string | undefined, source: source as string | undefined, note: note as string | undefined, content: full && given.caption ? { ...spec, caption: undefined } : spec };
}

/** The tokens of the theme a poster is painted with, as literal colours. */
export function posterTokens(theme: InfographicFrameProps["theme"], mode: ModeInput | undefined): ThemeTokens {
  const named = typeof theme === "string" ? (themes[theme] ?? posterThemes.noir) : theme ? createTheme(theme, posterThemes.noir) : posterThemes.noir;
  const t = named[mode === "dark" ? "dark" : "light"];
  const hex = (c: string) => cssFallback(c) || c;
  return { ...t, surface: hex(t.surface), ink: hex(t.ink), accent: hex(t.accent), context: hex(t.context), categorical: t.categorical.map(hex), sequential: t.sequential.map(hex) };
}

/**
 * A poster palette holds four or five colours. When a graphic needs one per entity, step each
 * colour once in lightness: away from the ground if it is close to it, towards it otherwise.
 * The hues stay the theme's own, so eight entities still read as one limited palette.
 */
export function extendPalette(tokens: ThemeTokens, count: number): string[] {
  const base = tokens.categorical;
  if (count <= base.length) return base.slice(0, Math.max(1, count));
  const ground = luminance(tokens.surface);
  const out = [...base];
  for (let i = 0; out.length < count; i++) {
    const c = base[i % base.length];
    const round = Math.floor(i / base.length);
    const near = Math.abs(luminance(c) - ground) < Math.abs(luminance(c) - luminance(tokens.ink));
    out.push(mix(c, near ? tokens.ink : tokens.surface, round === 0 ? 0.42 : 0.62));
  }
  return out;
}

const fieldsOf = (spec: InsightSpec) => [spec.name, spec.series, spec.x, spec.region, spec.group].filter((f): f is string => typeof f === "string");

function holds(spec: InsightSpec, values: string[]): boolean {
  const rows = (Array.isArray(spec.data) ? spec.data : Array.isArray(spec.rows) ? spec.rows : []) as Row[];
  const fields = fieldsOf(spec);
  return rows.some((row) => fields.some((f) => values.includes(String(row[f] ?? ""))));
}

/**
 * Cross-panel linking. The panels of a poster usually hold differently shaped data about the
 * same named things, so the link is by name: a click selects a name in its own graphic and
 * that name is passed to every other graphic that has it as `highlight`. Regions that read the
 * shared `data` are filtered through the `InsightData` store in the ordinary way.
 */
export function useInfographicLink(linked: boolean | undefined, data: DataInput | undefined) {
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const held = useRef(selections);
  held.current = selections;
  const [epoch, setEpoch] = useState(0);
  const tables = useRef(new Set<string>());

  // One owner at a time: a click in a second graphic replaces the first selection.
  const change = useCallback((next: Record<string, Selection>) => {
    const prev = held.current;
    const moved = Object.keys(next).find((k) => JSON.stringify(next[k]) !== JSON.stringify(prev[k]));
    const only = moved ? { [moved]: next[moved] } : next;
    // A table keeps its own picked rows; remount it when another graphic takes over.
    if (moved && Object.keys(prev).some((k) => k !== moved && tables.current.has(k))) setEpoch((n) => n + 1);
    held.current = only;
    setSelections(only);
  }, []);

  const owner = Object.keys(selections)[0];
  const picked = owner ? (selections[owner].values ?? []) : [];

  const bind = (id: string, slot: Slot): Slot => {
    if (!linked || !isSpec(slot)) return slot;
    const spec: InsightSpec = { ...slot };
    const fromOther = picked.length > 0 && owner !== id && holds(spec, picked);
    if (fromOther) spec.highlight = picked;
    if (spec.type === "glyph-table") {
      tables.current.add(id);
      const field = (spec.name as string | undefined) ?? "name";
      spec.select = true;
      spec.onSelect = (values: string[]) => {
        const rest = { ...held.current };
        if (values.length) rest[id] = { field, values };
        else delete rest[id];
        change(rest);
      };
      return renderSlot(spec, `${id}:${epoch}`);
    }
    if (spec.select === undefined) spec.select = true;
    if (spec.id === undefined) spec.id = id;
    return spec;
  };

  const wrap = (children: ReactNode): ReactNode =>
    linked || data !== undefined ? (
      <InsightData data={data ?? []} selections={linked ? selections : {}} onSelectionsChange={linked ? change : undefined}>
        {children}
      </InsightData>
    ) : (
      children
    );

  return { bind, wrap, picked };
}

/** Bind every panel's content to the link and drop the empty ones. */
export function linkPanels(panels: (PosterPanel | null | undefined | false)[], bind: (id: string, slot: Slot) => Slot): PosterPanel[] {
  return panels.filter((p): p is PosterPanel => !!p).map((p, i) => ({ ...p, content: bind(p.id ?? `panel-${i}`, p.content) }));
}

/** One large figure with a short label: the poster's way to state a number in type. */
export interface InfographicFigure {
  /** The figure as it should be printed, e.g. "4.2 million" or "38%". */
  value: string;
  /** What it measures, in a few words. */
  label: string;
  /** A second short line: the comparison or the period. */
  context?: string;
  /** Icon set beside the figure: a built-in name or `path://`. */
  icon?: IconInput;
}

export const isFigure = (value: unknown): value is InfographicFigure => typeof value === "object" && value !== null && !isSpec(value) && !("$$typeof" in value) && typeof (value as InfographicFigure).value === "string" && typeof (value as InfographicFigure).label === "string";

/**
 * A figure set as part of the graphic: light, in the display face, as large as its column
 * allows. The size follows the measured width and the length of the figure, so "4.2 million"
 * and "38%" both fill their panel without wrapping.
 */
export function _InfographicStat({ value, label, context, icon, max = 132, align = "left", tone = "ink" }: InfographicFigure & { max?: number; align?: "left" | "center"; tone?: "ink" | "accent" }) {
  const [ref, width] = useContainerWidth<HTMLDivElement>(320);
  const shape = icon ? resolveIcon(icon) : null;
  // Average glyph of a light display face is about 0.6 em wide. The icon is 0.82 em tall and the
  // gap 0.18 em, so the whole line is a multiple of the font size and can be solved for it.
  const ems = Math.max(2, value.length) * 0.6 + (shape ? 0.18 + 0.82 * Math.min(1.3, shape.aspect) : 0);
  const size = Math.round(Math.max(36, Math.min(max, width / ems)));
  const iconH = Math.round(size * 0.82);
  return (
    <div ref={ref} data-slot="ic-infographic-stat" style={{ minWidth: 0, display: "grid", gap: Math.round(size * 0.14) + 6, justifyItems: align === "center" ? "center" : "start", textAlign: align }}>
      <div style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.18), minWidth: 0 }}>
        {shape ? (
          <svg aria-hidden data-slot="ic-infographic-stat-icon" viewBox="0 0 24 24" width={Math.round(iconH * Math.min(1.3, shape.aspect))} height={iconH} preserveAspectRatio="xMidYMid meet" style={{ flex: "none", display: "block", fill: "var(--_ic-accent)" }}>
            <path d={shape.d} fillRule="evenodd" />
          </svg>
        ) : null}
        <p data-slot="ic-infographic-stat-value" style={{ margin: 0, fontFamily: "var(--_ic-font-display)", fontSize: size, lineHeight: 0.92, fontWeight: 300, letterSpacing: "-0.035em", color: tone === "accent" ? "var(--_ic-accent)" : "var(--_ic-ink)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{value}</p>
      </div>
      <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
        <p data-slot="ic-infographic-stat-label" style={{ margin: 0, fontSize: 15, lineHeight: 1.35, fontWeight: 500, color: "var(--_ic-ink)", maxWidth: "30ch", textWrap: "balance" }}>{label}</p>
        {context ? <p data-slot="ic-infographic-stat-context" style={{ margin: 0, fontSize: 13, lineHeight: 1.4, color: "var(--_ic-muted)", maxWidth: "34ch", textWrap: "pretty" }}>{context}</p> : null}
      </div>
    </div>
  );
}
