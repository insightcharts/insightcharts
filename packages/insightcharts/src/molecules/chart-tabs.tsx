import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { withMeta } from "../core/meta";
import { isSpec, renderSlot, type InsightSpec, type Slot } from "../core/spec";
import { MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface ChartTabsView {
  /** The tab's text: short, e.g. "Total", "Per capita". */
  label: string;
  /** Stable id, for `defaultView` and `onViewChange`. Defaults to the label. */
  id?: string;
  /** Props merged over the base `chart` spec for this view. */
  props?: Record<string, unknown>;
  /** A complete chart for this view instead: a spec or a React element. */
  chart?: Slot;
}

export interface ChartTabsProps extends MoleculeProps {
  /** The base chart spec every view starts from. */
  chart?: InsightSpec;
  /** Two to five views of the same data. */
  views: ChartTabsView[];
  /** The view shown first: an id, a label or an index. */
  defaultView?: string | number;
  /** Controlled active view (id, label or index). */
  view?: string | number;
  onViewChange?: (id: string, index: number) => void;
  /** Accessible name of the tab list. */
  tabsLabel?: string;
  /** Where the tabs sit relative to the title. Narrow containers always put them underneath. */
  tabsPosition?: "right" | "below";
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
  /** Extra content under the chart. */
  children?: ReactNode;
}

const find = (views: ChartTabsView[], key: string | number | undefined) => {
  if (key == null) return -1;
  if (typeof key === "number") return key >= 0 && key < views.length ? key : -1;
  return views.findIndex((v) => (v.id ?? v.label) === key || v.label === key);
};

/**
 * One frame, several views of the same data. Views that share a chart type keep the same
 * chart instance and only change its props, so ECharts morphs between them instead of redrawing.
 */
function ChartTabsImpl({ chart, views, defaultView, view, onViewChange, tabsLabel = "Chart view", tabsPosition = "right", title, subtitle, source, note, children, className, style, ...rest }: ChartTabsProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const list = views ?? [];
  const uid = useId();
  const [own, setOwn] = useState(() => Math.max(0, find(list, defaultView)));
  const controlled = find(list, view);
  const active = Math.min(Math.max(0, list.length - 1), controlled >= 0 ? controlled : own);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number, focus = false) => {
    const next = (i + list.length) % list.length;
    setOwn(next);
    onViewChange?.(list[next].id ?? list[next].label, next);
    if (focus) tabs.current[next]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? active + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? active - 1 : e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : null;
    if (to == null) return;
    e.preventDefault();
    go(to, true);
  };

  const current = list[active];
  const slot: Slot = current?.chart ?? (chart ? { ...chart, ...current?.props } : null);
  const below = tabsPosition === "below" || width < 560;
  const tabId = (i: number) => `${uid}tab${i}`;

  const tablist = (
    <div role="tablist" aria-label={tabsLabel} data-slot="ic-tabs-list" onKeyDown={onKey} style={{ display: "inline-flex", flex: "none", maxWidth: "100%", overflowX: "auto", gap: 2, padding: 2, borderRadius: 9, border: "1px solid var(--_ic-grid)", boxSizing: "border-box" }}>
      {list.map((v, i) => {
        const on = i === active;
        return (
          <button
            key={v.id ?? v.label}
            ref={(el) => void (tabs.current[i] = el)}
            type="button"
            role="tab"
            id={tabId(i)}
            aria-selected={on}
            aria-controls={`${uid}panel`}
            tabIndex={on ? 0 : -1}
            data-slot="ic-tab"
            data-active={on || undefined}
            onClick={() => go(i)}
            style={{ appearance: "none", font: "inherit", cursor: "pointer", margin: 0, border: 0, flex: "none", height: 28, padding: "0 12px", borderRadius: 6, fontSize: "0.8125rem", lineHeight: 1, fontWeight: on ? 600 : 500, whiteSpace: "nowrap", color: on ? "var(--_ic-ink)" : "var(--_ic-ink-2)", backgroundColor: on ? "color-mix(in srgb, var(--_ic-ink) 9%, transparent)" : "transparent" }}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={ref} data-slot="ic-chart-tabs" data-ic-mode={mode} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle}>
          {below ? null : tablist}
        </MoleculeHeader>
        {below ? <div style={{ marginBottom: 16, display: "flex", minWidth: 0 }}>{tablist}</div> : null}
        <div role="tabpanel" id={`${uid}panel`} aria-labelledby={tabId(active)} data-slot="ic-tabs-panel" style={{ minWidth: 0 }}>
          {/* A constant key: same-type specs update one mounted chart; a different type remounts by itself. */}
          {isSpec(slot) ? renderSlot(slot, "view") : slot}
        </div>
        {children}
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

const emitters = [
  { country: "China", total: 11.9, perCapita: 8.4, change: 0.38 },
  { country: "United States", total: 4.9, perCapita: 14.3, change: -0.13 },
  { country: "India", total: 3.1, perCapita: 2.1, change: 0.74 },
  { country: "Russia", total: 1.8, perCapita: 12.5, change: 0.1 },
  { country: "Japan", total: 1.0, perCapita: 8.0, change: -0.19 },
  { country: "Germany", total: 0.6, perCapita: 7.1, change: -0.28 },
];

const rentYears = ["2019", "2020", "2021", "2022", "2023", "2024"];
const rentTrend = rentYears.map((year, i) => ({ year, Lisbon: [11.2, 11.6, 11.4, 12.9, 14.8, 16.2][i], Porto: [8.1, 8.5, 8.4, 9.6, 11.0, 12.1][i], Braga: [5.0, 5.3, 5.5, 6.2, 7.1, 7.8][i] }));
const rentCities = [
  { city: "Lisbon", y2019: 11.2, y2024: 16.2, burden: 46 },
  { city: "Porto", y2019: 8.1, y2024: 12.1, burden: 39 },
  { city: "Braga", y2019: 5.0, y2024: 7.8, burden: 31 },
];
const genres = [
  { genre: "Drama", hours: 412, titles: 1840, perTitle: 224 },
  { genre: "Comedy", hours: 268, titles: 1310, perTitle: 205 },
  { genre: "Reality", hours: 231, titles: 620, perTitle: 373 },
  { genre: "Animation", hours: 198, titles: 540, perTitle: 367 },
  { genre: "Crime", hours: 176, titles: 465, perTitle: 378 },
  { genre: "Documentary", hours: 142, titles: 1105, perTitle: 129 },
];

export const ChartTabs = withMeta(ChartTabsImpl, {
  name: "chart-tabs",
  component: "ChartTabs",
  title: "Chart tabs",
  level: "molecule",
  category: "layout",
  description: "One chart frame with a segmented control that switches between several views of the same data, morphing between views that share a chart type.",
  whenToUse: "The same entities under two to five measures or scalings where each view changes the reading: total / per capita / change, absolute / share, linear / log. Give the frame a plain label as its title. Each view's `subtitle` names its measure.",
  avoid: "Hiding the most important view behind a tab (show it first, or show both with `small-multiple-grid`); unrelated charts (give each its own figure); more than five views.",
  composes: ["bar-chart", "line-chart"],
  props: [
    { name: "chart", type: "InsightSpec", description: "The base chart spec every view starts from: `{ type, data, ... }`." },
    { name: "views", type: "{ label, id?, props?, chart? }[]", required: true, description: "Two to five views. `props` are merged over `chart`; or give a view its own complete `chart` slot." },
    { name: "defaultView", type: "string | number", description: "The view shown first: an id, a label or an index." },
    { name: "view", type: "string | number", description: "Controlled active view." },
    { name: "onViewChange", type: "(id, index) => void", description: "Called when the reader switches view." },
    { name: "tabsLabel", type: "string", default: '"Chart view"', description: "Accessible name of the tab list." },
    { name: "tabsPosition", type: '"right" | "below"', default: '"right"', description: "Tabs beside the title or under it. Under 560px they always go underneath." },
    { name: "title", type: "string", description: "A plain label or fact that is true of every view." },
    { name: "subtitle", type: "string", description: "What the views share; each view's own `subtitle` names its measure." },
    { name: "source", type: "string", description: 'Shown under the chart as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "children", type: "ReactNode", description: "Extra content under the chart." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the chart. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "chart-tabs",
    theme: "mono",
    title: "CO2 emissions of six large emitters, 2023",
    tabsPosition: "below",
    chart: { type: "bar-chart", data: emitters, x: "country", y: "total", sort: "desc", orientation: "horizontal", height: 280, highlight: "China", format: "{value} Gt", subtitle: "CO2 emissions from fossil fuels, billion tonnes, 2023" },
    views: [
      { label: "Total", id: "total" },
      { label: "Per capita", id: "per-capita", props: { y: "perCapita", highlight: "United States", format: "{value} t", subtitle: "CO2 emissions per person, tonnes, 2023" } },
      { label: "Change since 2010", id: "change", props: { y: "change", highlight: "India", format: "percent", subtitle: "Change in CO2 emissions, 2010 to 2023" } },
    ],
    source: "Global Carbon Budget 2024",
    note: "Rounded, approximate figures for illustration",
  },
});

export const examples = {
  "Tabs beside the title, a different chart per view": {
    title: "Solar supplied 11.1% of EU electricity in 2024",
    defaultView: "Trend",
    views: [
      { label: "Trend", chart: { type: "line-chart", data: [2019, 2020, 2021, 2022, 2023, 2024].map((year, i) => ({ year: String(year), Solar: [4.2, 5.0, 5.4, 7.0, 9.1, 11.1][i], Coal: [15.0, 13.0, 14.7, 15.8, 12.3, 9.8][i] })), x: "year", y: ["Solar", "Coal"], format: "{value}%", height: 260, subtitle: "Solar and coal share of EU electricity generation, 2019 to 2024" } },
      { label: "2024", chart: { type: "bar-chart", data: [{ source: "Solar", share: 11.1 }, { source: "Coal", share: 9.8 }], x: "source", y: "share", format: "{value}%", height: 260, highlight: "Solar", subtitle: "Share of EU electricity generation, 2024. Coal supplied 9.8%." } },
    ],
    source: "Ember",
    note: "Figures are approximate, for illustration",
  },
  "Three chart forms, editorial theme": {
    theme: "editorial",
    title: "Median rent in Lisbon was €16.20 per square metre in 2024",
    views: [
      { label: "Trend", chart: { type: "line-chart", data: rentTrend, x: "year", y: ["Lisbon", "Porto", "Braga"], highlight: "Lisbon", contextLabels: true, format: "€{value}", zero: true, height: 280, subtitle: "Median monthly rent of new leases, € per square metre, 2019 to 2024" } },
      { label: "2019 and 2024", chart: { type: "dumbbell-chart", data: rentCities, category: "city", from: "y2019", to: "y2024", names: { y2019: "2019", y2024: "2024" }, format: "€{value}", sort: "to", highlight: "Lisbon", subtitle: "Median monthly rent of new leases, € per square metre, 2019 and 2024" } },
      { label: "Share of income", chart: { type: "bar-chart", data: rentCities, x: "city", y: "burden", sort: "desc", orientation: "horizontal", format: "{value}%", highlight: "Lisbon", subtitle: "Median rent for 70 square metres as a share of median household income, 2024" } },
    ],
    source: "National statistics office",
    note: "Illustrative data",
  },
  "One chart, three measures, dusk theme": {
    theme: "dusk",
    title: "Viewing by genre on one streaming service, 2024",
    tabsPosition: "below",
    chart: { type: "bar-chart", data: genres, x: "genre", y: "hours", sort: "desc", orientation: "horizontal", height: 280, highlight: "Drama", format: "{value}m", subtitle: "Hours viewed, millions, 2024. Drama had 412 million." },
    views: [
      { label: "Hours", id: "hours" },
      { label: "Titles", id: "titles", props: { y: "titles", highlight: "Drama", format: "integer", subtitle: "Titles available, 2024. Drama had 1,840." } },
      { label: "Hours per title", id: "per-title", props: { y: "perTitle", highlight: "Crime", format: "{value}k", subtitle: "Hours viewed per title, thousands, 2024. Crime had 378,000." } },
    ],
    note: "Illustrative data",
  },
};
