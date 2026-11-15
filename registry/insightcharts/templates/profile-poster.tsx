"use client";

import { GlyphTable, type GlyphTableProps } from "@/components/insightcharts/atoms/glyph-table";
import { ScaleLadder, type ScaleLadderProps } from "@/components/insightcharts/atoms/scale-ladder";
import { ShapeFill, type ShapeFillProps } from "@/components/insightcharts/atoms/shape-fill";
import { withMeta, registerComponents, useContainerWidth } from "insightcharts/core";
import type { Row } from "insightcharts/data";
import { Poster } from "@/components/insightcharts/molecules/poster";
import { frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFrameProps, type Region } from "@/components/insightcharts/templates/_infographic-layout";
import { _figureColumns, _PosterFigures, figureDoc, type PosterFigure } from "@/components/insightcharts/templates/_poster-figures";

// Specs in the regions resolve without the host calling registerAll().
registerComponents({ ShapeFill, ScaleLadder, GlyphTable });

export interface ProfilePosterProps extends InfographicFrameProps {
  /** The portrait: the subject as one large silhouette filled to a share (`shape-fill`). Config `{ data, name, value, icon, max? }` with one row, or a full spec. */
  portrait: Region<Partial<ShapeFillProps>>;
  /** Two to four large figures about the subject. */
  figures?: PosterFigure[];
  /** Where the subject sits among 4 to 10 other things on one scale (`scale-ladder`). Config `{ data, name, value, highlight?, zones?, ... }`, or a full spec. */
  scale?: Region<Partial<ScaleLadderProps>>;
  /** The subject beside 2 to 6 others across 2 to 5 measures, each number drawn as a small form (`glyph-table`). Config `{ rows, name, columns, highlight? }`, or a full spec. */
  table?: Region<Partial<GlyphTableProps>>;
}

/**
 * One subject described from four sides: a large filled silhouette, a few figures in type,
 * its place on one scale, and a table that sets it beside its peers.
 */
function ProfilePosterImpl({ portrait, figures, scale, table, theme = "blueprint", mode = "light", download, maxWidth = 1100, linked, data, kicker, title, subtitle, sources, note, credit, level, className, style }: ProfilePosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(1100);
  const { bind, wrap } = useInfographicLink(linked, data);
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const phone = sheet < 600;
  const three = sheet >= 960;
  const inner = Math.max(240, sheet - 2 * (phone ? 20 : sheet < 900 ? 36 : 56));
  const figs = (figures ?? []).slice(0, 4);

  // The silhouette and the scale stand side by side, so they are given the same height.
  const scaleRows = scale && typeof scale === "object" && "data" in scale && Array.isArray(scale.data) ? (scale.data as Row[]).length : 0;
  const tall = Math.max(phone ? 480 : 520, scaleRows * 56 + 70);
  const portraitPanel = regionPanel(portrait, "shape-fill", { name: "name", value: "value", format: "{value}%", height: scale == null ? 420 : phone ? 300 : tall }, { id: "portrait", span: scale == null ? (three && figs.length ? 7 : 12) : three ? 4 : 6, valign: "center" });
  const scalePanel = regionPanel(scale, "scale-ladder", { name: "name", value: "value", height: tall }, { id: "scale", span: three ? 4 : 6 });
  // Three columns on a wide sheet with the figures in the middle; otherwise the figures run in a strip under the pair.
  const stacked = three && (scalePanel != null || figs.length > 0);
  const figuresPanel = figs.length ? { id: "figures", span: stacked ? (scalePanel ? 4 : 5) : 12, valign: "center" as const, content: <_PosterFigures figures={figs} columns={stacked ? 1 : _figureColumns(figs.length, inner)} max={stacked ? 76 : 84} slot="ic-profile-poster-figures" /> } : null;
  const tablePanel = regionPanel(table, "glyph-table", {}, { id: "table", span: 12 });

  const top = stacked ? [portraitPanel, figuresPanel, scalePanel] : [portraitPanel, scalePanel, figuresPanel];
  const panels = linkPanels([...top, tablePanel], (id, slot) => (id === "figures" ? slot : bind(id, slot)));
  return (
    <div ref={ref} data-slot="ic-profile-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} columns={12} gap={three ? 32 : undefined} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. The Line 9 bus, Carrow Reservoir and the Aldern turbine are invented; every figure is illustrative.
const ranges = [
  { vehicle: "Electric scooter", km: 35, icon: "bolt" },
  { vehicle: "Electric bike", km: 70, icon: "bike" },
  { vehicle: "Delivery van", km: 210, icon: "truck" },
  { vehicle: "Line 9 bus", km: 310, icon: "bus" },
  { vehicle: "Family car", km: 420, icon: "car" },
  { vehicle: "Long-haul truck", km: 520, icon: "truck" },
];
const busFleet = [
  { vehicle: "Line 9 bus", seats: 41, cost: 0.21, co2: 14, noise: 62 },
  { vehicle: "Diesel bus", seats: 43, cost: 0.58, co2: 71, noise: 78 },
  { vehicle: "Tram", seats: 64, cost: 0.17, co2: 9, noise: 70 },
];
export const ProfilePoster = withMeta(ProfilePosterImpl, {
  name: "profile-poster",
  component: "ProfilePoster",
  title: "Profile poster",
  level: "template",
  category: "infographic",
  description: "A poster that describes one subject from four sides: the subject as one large silhouette filled to a share (`shape-fill`), two to four large figures, its place among other things on one scale (`scale-ladder`), and a table that sets it beside its peers with every number drawn as a small form (`glyph-table`).",
  whenToUse: "Use it for a fact sheet about one named thing: a vehicle, a reservoir, a building, a machine, a species. Give `portrait` one row with the share that defines the subject and the `icon` that stands for it, `figures` the numbers a reader should take away, `scale` the subject among 4 to 10 reference points, and `table` the subject beside 2 to 6 peers. Highlight the subject in `scale` and `table`. On a sheet at least 960px wide the silhouette, the figures and the scale stand in three columns.",
  avoid: "Several subjects of equal weight (use `glyph-table` in a `poster`, or `ranking-poster`). A subject whose parts are the point (use `radial-poster`). A subject with no defining share: leave `portrait` to a full spec such as `stat-circles`, or use `scale-poster` when the scale is the whole subject. Change over time (use `timeline-poster`).",
  composes: ["poster", "shape-fill", "scale-ladder", "glyph-table"],
  props: [
    { name: "portrait", type: "{ data, name, value, icon, max?, format?, title?, ... } | Slot", required: true, description: 'The portrait: one silhouette filled from the bottom to the share in its row, with the number beside it, drawn by `shape-fill`. `format` defaults to `"{value}%"`. A full spec or element replaces it.' },
    { name: "figures", type: figureDoc, description: "Two to four large figures about the subject. In the three-column layout they stand between the silhouette and the scale; otherwise they run in a strip." },
    { name: "scale", type: "{ data, name, value, iconField?, direction?, scale?, min?, max?, zones?, scaleLabel?, highlight?, format?, title?, ... } | Slot", description: "The subject among 4 to 10 other things on one scale (`scale-ladder`). It is drawn as tall as the silhouette." },
    { name: "table", type: "{ rows, name, columns, nameLabel?, highlight?, order?, title?, ... } | Slot", description: "The subject beside its peers, one row each, with a glyph per measure (`glyph-table`). `columns` is `{ field, label?, glyph?, unit?, format?, max?, icon? }[]`." },
    ...frameDocs("blueprint", 1100),
  ],
  example: {
    type: "profile-poster",
    theme: "blueprint",
    kicker: "Public transport",
    title: "The Line 9 electric bus ended a working day with 34% of its charge",
    subtitle: "One 12-metre battery bus on Marlow's Line 9, average of 60 working days in 2025.",
    portrait: { data: [{ state: "Charge left at 23:00", charge: 34 }], name: "state", value: "charge", icon: "bus", title: "Charge left at the end of the day" },
    figures: [
      { value: "204 km", label: "driven on a working day" },
      { value: "310 km", label: "of range on a full charge" },
      { value: "4 h", label: "to recharge overnight at the depot" },
    ],
    scale: { data: ranges, name: "vehicle", value: "km", iconField: "icon", min: 0, max: 600, format: "{value} km", scaleLabel: "Range, km", highlight: "Line 9 bus", title: "Range of six electric vehicles" },
    table: {
      rows: busFleet,
      name: "vehicle",
      nameLabel: "Vehicle",
      highlight: "Line 9 bus",
      title: "The Line 9 bus emitted 14 g of CO2 per passenger-kilometre",
      columns: [
        { field: "seats", label: "Seats", glyph: "icons", icon: "person", unit: 5 },
        { field: "cost", label: "Energy cost per km", glyph: "bar", format: "€{value}", max: 0.6 },
        { field: "co2", label: "CO2 per passenger-km", glyph: "circle", format: "{value} g" },
        { field: "noise", label: "Noise at 10 m", glyph: "bar", format: "{value} dB", max: 80 },
      ],
    },
    sources: "Marlow Transit depot telemetry, 2025",
    note: "Marlow Transit and the Line 9 bus are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
});
