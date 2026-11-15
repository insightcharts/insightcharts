"use client";

import { resolveIcon, withMeta, isSpec, useContainerWidth } from "insightcharts/core";
import { type Row, toNumber } from "insightcharts/data";
import { Poster } from "@/components/insightcharts/molecules/poster";
import { frameDocs, linkPanels, posterTokens, regionPanel, useInfographicLink, type InfographicFrameProps, type Region } from "@/components/insightcharts/templates/_infographic-layout";

/** Config of a block of unit icons (`unit-blocks`). */
export interface CountPosterBlocks {
  /** Group field: one block of icons per row. */
  name?: string;
  /** Value field: the quantity each block counts out. */
  value?: string;
}

export interface CountPosterProps extends InfographicFrameProps {
  /** The hero: several groups counted out as blocks of unit icons (`unit-blocks`). Config `{ data, name, value, title?, source? }`, or a full spec. */
  hero: Region<CountPosterBlocks>;
  /** Units one icon stands for, shared by the hero and the reference band. Default: a round number that gives the hero about 2,000 icons. */
  unit?: number;
  /** What one icon stands for, e.g. "1,000 pupils". Printed as the key of both bands. */
  unitLabel?: string;
  /** Icon of both bands: a built-in name or `path://`. Default `"person"`. */
  icon?: string;
  /** How to print the counts. Default `"integer"`. */
  format?: unknown;
  /** The second band: reference groups counted with the same icon at the same size, in a muted colour (`unit-blocks`). */
  reference?: Region<CountPosterBlocks>;
  /** Bottom left: two to four values as squares sized by area with a ratio bracket (`proportional-area`). */
  area?: Region<{ name?: string; value?: string }>;
  /** Bottom middle: a short series as thick bars with the numbers inside (`block-bar`). */
  bars?: Region<{ name?: string; value?: string | string[] }>;
  /** Bottom right: shares of one whole. With `icon` it draws filled silhouettes (`shape-fill`), otherwise nested outlines (`nested-shares`). */
  shares?: Region<{ name?: string; value?: string; icon?: string }>;
}

const total = (rows: unknown, field: string | undefined) => (Array.isArray(rows) && field ? (rows as Row[]).reduce((s, r) => s + Math.max(0, toNumber(r[field]) || 0), 0) : 0);

/** A round unit (1, 2 or 5 times a power of ten) that brings `sum` to about 2,000 icons. */
function roundUnit(sum: number): number {
  const target = sum / 2000;
  if (!(target > 1)) return 1;
  const pow = 10 ** Math.floor(Math.log10(target));
  return [1, 2, 5, 10].map((m) => m * pow).find((u) => u >= target) ?? 10 * pow;
}

/**
 * Counting at scale. A block of thousands of unit icons fills most of the sheet, a second
 * band counts reference groups with the same icon at the same size in a muted colour, and
 * three small graphics close the poster.
 */
function CountPosterImpl({ hero, unit, unitLabel, icon = "person", format = "integer", reference, area, bars, shares, theme = "noir", mode = "light", download, maxWidth = 1100, linked, data, kicker, title, subtitle, sources, note, credit, level, className, style }: CountPosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(1100);
  const { bind, wrap } = useInfographicLink(linked, data);
  const tokens = posterTokens(theme, mode);

  // Both bands must draw the same icon at the same size, or their areas would not compare. The
  // primitive picks its own size per chart, so the size is set here from the sheet's width.
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const phone = sheet < 600;
  const inner = Math.max(240, sheet - 2 * (phone ? 20 : sheet < 900 ? 36 : 56));
  const heroConfig = hero && typeof hero === "object" && !isSpec(hero) && !("$$typeof" in hero) ? (hero as { data?: Row[]; value?: string }) : undefined;
  const heroSum = total(heroConfig?.data, heroConfig?.value);
  const per = unit ?? roundUnit(heroSum);
  const icons = Math.max(1, heroSum / per);
  const aspect = resolveIcon(icon, "person").aspect;
  // Area of one cell is h * (aspect + 0.2) wide by 1.24 h tall (the primitive's own pitch).
  const want = inner * (phone ? inner * 1.5 : Math.min(560, inner * 0.5)) * 0.86;
  const iconSize = Math.max(3, Math.min(aspect < 0.7 ? 20 : 14, Math.floor(Math.sqrt(want / (icons * (aspect + 0.2) * 1.24)) * 2) / 2));
  const blocks = { name: "name", value: "value", unit: per, unitLabel, icon, iconSize, format };
  // The reference band is painted in the context grey: it is there to be compared with, not read first.
  const muted = { categorical: Array.from({ length: 8 }, () => tokens.context), accent: tokens.context };

  // Three across on a wide sheet. On a narrower one the bars take a full row under the other
  // two, because six columns of bars need more than a third of 700px.
  const wide = sheet >= 1000;
  const areaPanel = regionPanel(area, "proportional-area", { name: "name", value: "value", ratio: "{ratio}x larger", format }, { id: "area", valign: "end" });
  const barsPanel = regionPanel(bars, "block-bar", { name: "name", value: "value", format: "compact", orientation: phone ? "auto" : "vertical" }, { id: "bars", valign: "end" });
  const sharesPanel = regionPanel(shares, shares && typeof shares === "object" && "icon" in shares ? "shape-fill" : "nested-shares", { name: "name", value: "value", format: "{value}%" }, { id: "shares", valign: "end" });
  const small = (wide ? [areaPanel, barsPanel, sharesPanel] : [areaPanel, sharesPanel, barsPanel]).filter((p) => p != null);
  const pair = [areaPanel, sharesPanel].filter((p) => p != null);
  if (wide || !barsPanel) small.forEach((p) => (p.span = 12 / small.length));
  else {
    pair.forEach((p) => (p.span = 12 / pair.length));
    barsPanel.span = 12;
  }
  const panels = linkPanels([regionPanel(hero, "unit-blocks", blocks, { id: "hero", span: 12 }), regionPanel(reference, "unit-blocks", blocks, { id: "reference", span: 12 }, { theme: muted }), ...small], bind);

  return (
    <div ref={ref} data-slot="ic-count-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. Norland, the Aldern Valley and the Orrin works are invented; every figure is illustrative.
const pupils = [
  { stage: "Primary", pupils: 820000 },
  { stage: "Lower secondary", pupils: 460000 },
  { stage: "Upper secondary", pupils: 390000 },
  { stage: "Vocational", pupils: 170000 },
];
const staff = [
  { group: "Teachers", people: 142000 },
  { group: "Support staff", people: 61000 },
  { group: "Pupils who left without a certificate", people: 38000 },
];
const schoolSizes = [
  { school: "Largest secondary school", pupils: 3640 },
  { school: "Median primary school", pupils: 280 },
];
const pupilsByYear = [
  { year: "2000", m: 1.42 },
  { year: "2005", m: 1.51 },
  { year: "2010", m: 1.6 },
  { year: "2015", m: 1.69 },
  { year: "2020", m: 1.77 },
  { year: "2025", m: 1.84 },
];
const laptops = [
  { year: "2013", share: 6 },
  { year: "2017", share: 19 },
  { year: "2021", share: 44 },
  { year: "2025", share: 68 },
];
export const CountPoster = withMeta(CountPosterImpl, {
  name: "count-poster",
  component: "CountPoster",
  title: "Count poster",
  level: "template",
  category: "infographic",
  description: "A poster that counts at scale. Blocks of thousands of unit icons fill most of the sheet, a second band counts reference groups with the same icon at the same size in a muted colour, and a bottom row holds three small graphics: squares sized by area with a ratio bracket, thick bars with the numbers inside, and shares as nested outlines or filled silhouettes.",
  whenToUse: "Use it when the subject is a large count of people or things in 2 to 6 groups and the reader should see the crowd: pupils by stage, trees planted by species, vehicles built by model. Give `hero` the groups and `reference` one to three quantities to compare them with. Both bands use the same `unit`, `icon` and icon size, so their areas compare. State the total in the title.",
  avoid: "Counts under a few hundred (use `pictogram-chart` in a `poster`). Shares of one whole as the main point (use `waffle-chart` or `treemap`). A ranking of many named things (use `ranking-poster`). A flow from sources to destinations (use `flow-poster`).",
  composes: ["poster", "unit-blocks", "proportional-area", "block-bar", "nested-shares", "shape-fill"],
  props: [
    { name: "hero", type: "{ data, name, value, title?, subtitle?, source?, ...unit-blocks props } | Slot", required: true, description: "The hero band: one block of unit icons per row, drawn by `unit-blocks`. A full spec or element replaces it." },
    { name: "unit", type: "number", description: "Units one icon stands for, in both bands. Default: a round number that gives the hero about 2,000 icons." },
    { name: "unitLabel", type: "string", description: 'What one icon stands for, e.g. "1,000 pupils". Printed as the key of both bands.' },
    { name: "icon", type: 'IconName | "path://..."', default: '"person"', description: "Icon of both bands." },
    { name: "format", type: "FormatSpec", default: '"integer"', description: "How to print the counts." },
    { name: "reference", type: "{ data, name, value, title?, ... } | Slot", description: "The second band: reference groups counted with the same icon at the same size, painted in the theme's context grey (`unit-blocks`)." },
    { name: "area", type: "{ data, name, value, ratio?, title?, ... } | Slot", description: 'Bottom left: two to four values as squares sized by area, with a bracket stating how many times the largest is the smallest (`proportional-area`). `ratio` defaults to `"{ratio}x larger"`.' },
    { name: "bars", type: "{ data, name, value, title?, ... } | Slot", description: "Bottom middle: 3 to 8 values as thick rounded bars with the numbers inside (`block-bar`)." },
    { name: "shares", type: "{ data, name, value, icon?, title?, ... } | Slot", description: "Bottom right: shares of one whole. With `icon` each share is a silhouette filled to its level (`shape-fill`); without, the shares are outlines nested in one square (`nested-shares`)." },
    ...frameDocs("noir", 1100),
  ],
  example: {
    type: "count-poster",
    theme: "noir",
    kicker: "Education",
    title: "Norland's schools taught 1.84 million pupils in 2025",
    subtitle: "Pupils enrolled in state schools by stage, autumn term 2025.",
    unit: 1000,
    unitLabel: "1,000 people",
    icon: "person",
    hero: { data: pupils, name: "stage", value: "pupils", title: "820,000 pupils were in primary school" },
    reference: { data: staff, name: "group", value: "people", title: "142,000 teachers taught them" },
    area: { data: schoolSizes, name: "school", value: "pupils", title: "The largest school had 3,640 pupils" },
    bars: { data: pupilsByYear, name: "year", value: "m", format: "{value}m", title: "Enrolment was 1.42 million in 2000" },
    shares: { data: laptops, name: "year", value: "share", highlight: "2025", wholeLabel: "All pupils", title: "68% of pupils had a school laptop in 2025" },
    sources: "Norland Ministry of Education, school census 2025",
    note: "Norland is an invented country. All figures are illustrative.",
    credit: "InsightCharts",
  },
});
