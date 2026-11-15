import type { ReactNode } from "react";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { Callout, type CalloutTone } from "../atoms/callout";
import { Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface ChartCalloutProps extends MoleculeProps {
  /** The chart: a spec (`{ type: "line-chart", ... }`) or a React element. */
  chart: Slot;
  /** The main fact in a few words, with its number. Shown in bold. */
  lead?: string;
  /** One or two plain sentences that say what the fact means. */
  body?: string;
  /** What kind of statement it is; sets the icon and tint together. */
  tone?: CalloutTone;
  /** Small label above the lead, e.g. "Takeaway". */
  label?: string;
  /** Which side of the chart the callout sits on. Narrow containers always put it underneath. */
  side?: "left" | "right";
  /** `"plain"` separates the callout with a hairline; `"soft"` and `"outline"` box it. */
  variant?: "plain" | "soft" | "outline";
  /** Vertical position of the callout beside the chart. */
  align?: "start" | "center" | "end";
  /** JSX alternative to `chart`. */
  children?: ReactNode;
}

/**
 * A chart and the sentence that says what it means, as one unit. The callout sits beside
 * the chart in wide containers and underneath it in narrow ones.
 */
function ChartCalloutImpl({ chart, lead, body, tone = "accent", label, side = "right", variant = "plain", align = "center", children, className, style, ...rest }: ChartCalloutProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const stacked = width < 640;
  const plain = variant === "plain";
  const left = side === "left" && !stacked;
  const rule = "1px solid var(--_ic-grid)";
  return (
    <div
      ref={ref}
      data-slot="ic-chart-callout"
      data-ic-mode={mode}
      data-layout={stacked ? "stacked" : "side"}
      className={className}
      style={{ ...root, display: "grid", gridTemplateColumns: stacked ? "minmax(0, 1fr)" : left ? "minmax(0, 1fr) minmax(0, 2.2fr)" : "minmax(0, 2.2fr) minmax(0, 1fr)", gap: stacked ? 16 : 24, alignItems: "stretch", ...style }}
    >
      <Provide theme={rest.theme} mode={rest.mode}>
        <div data-slot="ic-chart-callout-chart" style={{ minWidth: 0, order: left ? 2 : 1 }}>
          {children ?? renderSlot(chart)}
        </div>
        <aside
          data-slot="ic-chart-callout-aside"
          style={{
            minWidth: 0,
            order: left ? 1 : 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center",
            ...(plain ? (stacked ? { borderTop: rule, paddingTop: 16 } : left ? { borderRight: rule, paddingRight: 24 } : { borderLeft: rule, paddingLeft: 24 }) : null),
          }}
        >
          <Callout lead={lead} text={body} tone={tone} label={label} variant={variant} />
        </aside>
      </Provide>
    </div>
  );
}

const churn = [4.2, 4.3, 4.1, 3.6, 3.1, 2.9, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1].map((rate, i) => ({ month: new Date(Date.UTC(2024, i, 1)).toISOString().slice(0, 10), rate }));
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const churn2023 = [4.4, 4.3, 4.4, 4.2, 4.3, 4.1, 4.2, 4.3, 4.1, 4.2, 4.3, 4.2];
const churnByYear = churn.map((r, i) => ({ month: MONTHS[i], "2024": r.rate, "2023": churn2023[i] }));
const pm25 = [
  { city: "Kraków", y2015: 31, y2023: 19 },
  { city: "Milan", y2015: 29, y2023: 21 },
  { city: "Sofia", y2015: 26, y2023: 17 },
  { city: "Prague", y2015: 19, y2023: 13 },
  { city: "Vienna", y2015: 16, y2023: 11 },
];
const formats = [
  { format: "Vinyl", y2014: 0.3, y2024: 1.4 },
  { format: "CD", y2014: 1.9, y2024: 0.5 },
  { format: "Downloads", y2014: 2.6, y2024: 0.3 },
];

export const ChartCallout = withMeta(ChartCalloutImpl, {
  name: "chart-callout",
  component: "ChartCallout",
  title: "Chart with callout",
  level: "molecule",
  category: "layout",
  description: "A chart with a callout beside it that states the main fact. In narrow containers the callout goes underneath.",
  whenToUse: "Whenever a chart needs its meaning stated in words next to it: the standard chart-plus-interpretation unit of a report. The chart's title states the main fact with its number. The callout adds a second fact, a cause or a caveat in plain words.",
  avoid: "Repeating the chart title in the callout; long narration (put `prose` before the chart instead); a chart that is already a small tile (the callout would outweigh it).",
  composes: ["callout", "line-chart", "bar-chart", "dumbbell-chart", "slope-chart"],
  props: [
    { name: "chart", type: "Slot", required: true, description: "The chart: a spec or a React element." },
    { name: "lead", type: "string", description: "The main fact in a few words, with its number. Shown in bold." },
    { name: "body", type: "string", description: "One or two plain sentences that say what the fact means." },
    { name: "tone", type: '"neutral" | "positive" | "negative" | "accent"', default: '"accent"', description: "Sets the callout's icon and tint together." },
    { name: "label", type: "string", description: 'Small label above the lead, e.g. "Takeaway" or "Caveat".' },
    { name: "side", type: '"left" | "right"', default: '"right"', description: "Side of the chart the callout sits on. Under 640px it always goes underneath." },
    { name: "variant", type: '"plain" | "soft" | "outline"', default: '"plain"', description: "`plain` separates the callout with a hairline; the others box it." },
    { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Vertical position of the callout beside the chart." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `chart`." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the chart and callout. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "chart-callout",
    theme: "ledger",
    chart: {
      type: "line-chart",
      data: churnByYear,
      x: "month",
      y: ["2024", "2023"],
      highlight: "2024",
      contextLabels: true,
      format: "{value}%",
      zero: true,
      height: 280,
      title: "Monthly churn fell from 4.2% to 2.1% in 2024",
      subtitle: "Monthly customer churn, 2024 and 2023",
      source: "Internal analytics",
      note: "Illustrative data",
      annotations: [{ type: "line", axis: "x", value: "Mar", label: "New onboarding" }],
    },
    label: "Takeaway",
    lead: "Churn fell 2 points after March",
    body: "Churn was 4.1% in March 2024, when the new onboarding launched. It was 2.1% in December 2024. It was 4.2% in December 2023.",
  },
});

export const examples = {
  "Caveat on the left, boxed": {
    side: "left",
    variant: "soft",
    tone: "negative",
    label: "Caveat",
    lead: "The new onboarding launched on 11 March",
    body: "The March figure includes customers who joined before the launch. April is the first full month on the new onboarding.",
    chart: { type: "bar-chart", data: churn.slice(0, 6).map((r, i) => ({ ...r, month: MONTHS[i] })), x: "month", sort: "none", y: "rate", format: "{value}%", orientation: "vertical", highlight: "Mar", height: 260, title: "Monthly churn fell from 4.1% in March to 2.9% in June 2024", subtitle: "Monthly customer churn, January to June 2024" },
  },
  "Positive, aligned to the top, science theme": {
    theme: "science",
    tone: "positive",
    align: "start",
    label: "Result",
    lead: "Kraków's annual PM2.5 fell from 31 to 19 µg/m³",
    body: "All five cities recorded a lower annual mean in 2023 than in 2015. All five were above the WHO guideline of 5 µg/m³ in 2023.",
    chart: {
      type: "dumbbell-chart",
      data: pm25,
      category: "city",
      from: "y2015",
      to: "y2023",
      names: { y2015: "2015", y2023: "2023" },
      format: "{value}",
      sort: "gap",
      highlight: "Kraków",
      title: "Annual PM2.5 fell in all five cities between 2015 and 2023",
      subtitle: "Annual mean PM2.5 concentration, µg/m³, 2015 and 2023",
      source: "European Environment Agency",
      note: "Illustrative data",
    },
  },
  "Outlined context note, noir theme": {
    theme: "noir",
    variant: "outline",
    tone: "neutral",
    label: "Not shown",
    lead: "Streaming revenue was $14.9bn in 2024",
    body: "Streaming is left off the chart. It was 84% of recorded music revenue in 2024.",
    chart: {
      type: "slope-chart",
      data: formats,
      series: "format",
      y: ["y2014", "y2024"],
      names: { y2014: "2014", y2024: "2024" },
      highlight: "Vinyl",
      format: "${value}bn",
      height: 300,
      title: "Vinyl revenue rose from $0.3bn to $1.4bn between 2014 and 2024",
      subtitle: "Recorded music revenue by physical and download format, US, 2014 and 2024",
      note: "Illustrative data",
    },
  },
};
