import type { ReactNode } from "react";
import { withMeta } from "../core/meta";
import { isSpec, renderSlot, type InsightSpec, type Slot } from "../core/spec";
import { Scrolly, type StoryStep } from "../story/scrolly";
import { Prose } from "../atoms/prose";
import { MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface ScrollyChartStep {
  /** Stable id, also the anchor for deep links. */
  id?: string;
  /** The text for this step: one short paragraph that says plainly what the chart now shows. Supports `**bold**`, `*italic*` and links. A spec or element also works. */
  content: Slot;
  /** Optional short heading above the narration. */
  label?: string;
  /**
   * Every other key is a chart prop merged over the base `chart` for this step:
   * `highlight`, `transform`, `annotations`, `x`, `y`, `title`, `subtitle`… `null` removes a base prop.
   */
  [prop: string]: unknown;
}

export interface ScrollyChartProps extends MoleculeProps {
  /** The base chart spec. Each step patches it. */
  chart: InsightSpec;
  /** The steps, in order. Change ONE thing per step. */
  steps: ScrollyChartStep[];
  /** Each step's patch builds on the steps before it instead of on the base spec alone. */
  cumulative?: boolean;
  /**
   * `"scroll"` pins the chart while the steps scroll past, `"swipe"` turns steps into cards
   * under the chart, `"steps"` shows previous/next buttons, `"auto"` picks scroll or swipe.
   */
  scrollMode?: "auto" | "scroll" | "swipe" | "steps";
  /** Which side the text column sits on in scroll mode. */
  side?: "left" | "right";
  /** Distance from the top of the viewport at which the chart pins. */
  stickyTop?: number | string;
  /** Scroll distance per step, as a CSS length. */
  stepHeight?: string;
  /** Called when the active step changes. */
  onStepChange?: (index: number) => void;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

const RESERVED = new Set(["id", "content", "label"]);

function patchOf(step: ScrollyChartStep): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(step)) if (!RESERVED.has(k)) out[k] = v;
  return out;
}

function apply(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const next = { ...base };
  // null is the JSON way to say "this step does not have the base's highlight / annotations".
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) delete next[k];
    else next[k] = v;
  }
  return next;
}

/**
 * A scroll story from JSON alone: one chart, and a list of steps that each say something
 * and change one thing about it. The same chart instance receives each step's props, so
 * it morphs rather than redraws.
 */
function ScrollyChartImpl({ chart, steps, cumulative = false, scrollMode = "auto", side = "left", stickyTop = 0, stepHeight, onStepChange, title, subtitle, source, note, className, style, ...rest }: ScrollyChartProps) {
  const { ref, mode, root } = useMolecule(rest);
  const list = steps ?? [];
  const specs = list.map((_, i) => {
    let spec: Record<string, unknown> = chart ?? {};
    for (let j = cumulative ? 0 : i; j <= i; j++) spec = apply(spec, patchOf(list[j]));
    return spec as InsightSpec;
  });
  const story: (StoryStep & { at: number })[] = list.map((s, i) => {
    const body: ReactNode = typeof s.content === "string" ? <Prose text={s.content} size="md" /> : isSpec(s.content) ? renderSlot(s.content) : (s.content as ReactNode);
    return {
      id: s.id,
      at: i,
      content: s.label ? (
        <>
          <div data-slot="ic-scrolly-chart-label" style={{ fontSize: "0.8125rem", lineHeight: 1.4, fontWeight: 600, color: "var(--_ic-muted)", marginBottom: 4 }}>
            {s.label}
          </div>
          {body}
        </>
      ) : (
        body
      ),
    };
  });

  return (
    <div ref={ref} data-slot="ic-scrolly-chart" data-ic-mode={mode} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        <Scrolly steps={story} mode={scrollMode} side={side} stickyTop={stickyTop} stepHeight={stepHeight} onStepChange={onStepChange}>
          {/* Constant key: one chart instance for the whole story. */}
          {({ index }) => (specs[index] ? renderSlot(specs[index], "chart") : null)}
        </Scrolly>
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

const mix = [
  { source: "Coal", y2015: 24.6, y2024: 9.8 },
  { source: "Gas", y2015: 15.8, y2024: 15.7 },
  { source: "Nuclear", y2015: 27.1, y2024: 23.7 },
  { source: "Wind", y2015: 9.2, y2024: 17.4 },
  { source: "Hydro", y2015: 12.0, y2024: 13.2 },
  { source: "Solar", y2015: 2.9, y2024: 11.1 },
];

const story = {
  chart: { type: "bar-chart", data: mix, x: "source", y: "y2015", sort: "none", orientation: "horizontal", format: "{value}%", height: 300, title: "EU electricity generation by source, 2015", subtitle: "Share of EU electricity generation, %", source: "Ember, European Electricity Review 2025", note: "Rounded, approximate figures for illustration" },
  steps: [
    { id: "baseline", label: "2015", content: "In 2015 **nuclear and coal** together supplied 51.7% of the EU's electricity." },
    { id: "coal", content: "Coal supplied 24.6% in 2015. Only nuclear supplied more.", highlight: "Coal" },
    { id: "today", label: "2024", content: "In 2024 coal supplied 9.8%.", highlight: "Coal", y: "y2024", title: "EU electricity generation by source, 2024" },
    { id: "solar", content: "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015.", highlight: "Solar", y: "y2024", title: "Solar supplied 11.1% of EU electricity in 2024" },
  ],
};

const QUARTERS = [2022, 2023, 2024].flatMap((year) => [1, 2, 3, 4].map((q) => `Q${q} ${year}`));
const rates = QUARTERS.map((quarter, i) => ({
  quarter,
  "Bank rate": [0.5, 1.0, 1.75, 3.0, 4.0, 4.75, 5.25, 5.25, 5.25, 5.25, 5.0, 4.75][i],
  "Two-year fixed": [2.2, 3.0, 4.2, 6.0, 5.4, 5.8, 6.6, 6.0, 5.8, 5.9, 5.5, 5.4][i],
  "Five-year fixed": [2.4, 3.1, 4.1, 5.7, 5.0, 5.3, 6.1, 5.6, 5.3, 5.5, 5.2, 5.1][i],
}));

export const ScrollyChart = withMeta(ScrollyChartImpl, {
  name: "scrolly-chart",
  component: "ScrollyChart",
  title: "Scrolly chart",
  level: "molecule",
  category: "story",
  description: "A scroll-driven story from JSON: one base chart spec and a list of steps, each with narration and a patch of chart props applied while that step is active.",
  whenToUse: "Walking a reader through one chart in stages: show everything, highlight the subject, change the measure, add the annotation. Make ONE change per step (the highlight, the data or the encoding) so the reader can see what changed.",
  avoid: "Steps that change several things at once, or that swap to an unrelated chart (start a new `section` instead). More than about seven steps. A fact that one view can show (use `chart-callout`). In documents that will be printed or embedded in a short frame, set `scrollMode: \"steps\"`.",
  composes: ["prose", "bar-chart", "line-chart"],
  props: [
    { name: "chart", type: "InsightSpec", required: true, description: "The base chart spec: `{ type, data, x, y, ... }`. Give it a `title`; steps may replace it." },
    { name: "steps", type: "{ content, id?, label?, ...chart props }[]", required: true, description: "The steps in order. `content` is a short paragraph that says plainly what the chart now shows (`**bold**` works). Every other key is a chart prop merged over `chart` for that step: `highlight`, `transform`, `annotations`, `x`, `y`, `title`… Use `null` to remove a base prop. Change one thing per step." },
    { name: "cumulative", type: "boolean", default: "false", description: "Each step's patch builds on the previous steps instead of on the base spec alone." },
    { name: "scrollMode", type: '"auto" | "scroll" | "swipe" | "steps"', default: '"auto"', description: "`scroll` pins the chart while steps scroll past; `swipe` makes steps swipeable cards; `steps` shows previous/next buttons; `auto` uses scroll, or swipe on narrow touch screens. (Named `scrollMode` because `mode` is the colour mode.)" },
    { name: "side", type: '"left" | "right"', default: '"left"', description: "Side of the text column in scroll mode. Narrow containers overlay the text on the chart." },
    { name: "stickyTop", type: "number | string", default: "0", description: "Offset from the top of the viewport at which the chart pins; set it to the height of a fixed header." },
    { name: "stepHeight", type: "string", default: '"80vh"', description: "Scroll distance per step, as a CSS length." },
    { name: "onStepChange", type: "(index) => void", description: "Called when the active step changes." },
    { name: "title", type: "string", description: "Heading above the whole story." },
    { name: "subtitle", type: "string", description: "Line under the heading." },
    { name: "source", type: "string", description: 'Shown after the last step as "Source: ...". Prefer the chart\'s own `source`, which stays visible.' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the chart and the step cards. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: { type: "scrolly-chart", theme: "earth", ...story, stepHeight: "70vh", stickyTop: 16 },
});

export const examples = {
  "Steps mode (buttons), cumulative patches, noir theme": {
    theme: "noir",
    scrollMode: "steps",
    cumulative: true,
    chart: story.chart,
    steps: [
      { content: "The chart shows each source's share in 2015." },
      { content: "**Coal** is highlighted. It supplied 24.6% in 2015.", highlight: "Coal" },
      { content: "The chart now shows 2024. Coal is still highlighted because the patches accumulate.", y: "y2024", title: "EU electricity generation by source, 2024" },
      { content: "The highlight is removed. The sources are sorted by their 2024 share.", highlight: null, sort: "desc" },
    ],
  },
  "Swipe mode": { scrollMode: "swipe", ...story },
  "Three lines, one highlighted per step, ledger theme": {
    theme: "ledger",
    scrollMode: "steps",
    title: "The average two-year fixed mortgage rate was 5.4% in the last quarter of 2024",
    chart: { type: "line-chart", data: rates, x: "quarter", y: ["Bank rate", "Two-year fixed", "Five-year fixed"], format: "{value}%", zero: true, height: 300, subtitle: "Bank rate and average fixed mortgage rates, quarterly, 2022 to 2024", note: "Illustrative data" },
    steps: [
      { label: "All three rates", content: "The chart shows the central bank rate and the average rates of two-year and five-year fixed mortgages." },
      { label: "Bank rate", content: "The **bank rate** rose from 0.5% in the first quarter of 2022 to 5.25% in the third quarter of 2023.", highlight: "Bank rate", contextLabels: true },
      { label: "Two-year fixed", content: "The average **two-year fixed rate** was 6.6% in the third quarter of 2023. It was 5.4% in the last quarter of 2024.", highlight: "Two-year fixed", contextLabels: true },
      { label: "Five-year fixed", content: "The average **five-year fixed rate** was 5.1% in the last quarter of 2024. The two-year rate was 0.3 points higher.", highlight: "Five-year fixed", contextLabels: true },
    ],
  },
};
