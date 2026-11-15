import type { FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { BigNumber } from "../atoms/big-number";
import { PullQuote } from "../atoms/pull-quote";
import { MoleculeFooter, Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface QuoteFigureStat {
  value: number | string;
  label: string;
  context?: string;
  delta?: number | string;
  deltaLabel?: string;
  upIsGood?: boolean;
  format?: FormatSpec;
}

export interface QuoteFigureProps extends MoleculeProps {
  /** The words quoted, without quotation marks. */
  quote: string;
  /** Who said it. */
  attribution?: string;
  /** Their role, or where it was said. */
  role?: string;
  /** Source URL, linked from the attribution. */
  cite?: string;
  /** The statistic that backs the quote up (the props of `big-number`). */
  stat?: QuoteFigureStat;
  /** A small chart or other figure instead of, or under, the statistic: a spec or a React element. */
  figure?: Slot;
  /** Which side the evidence sits on. Narrow containers put it underneath. */
  side?: "left" | "right";
  source?: string;
  note?: string;
}

/**
 * A quotation with the number or small chart it refers to beside it.
 */
function QuoteFigureImpl({ quote, attribution, role, cite, stat, figure, side = "right", source, note, className, style, ...rest }: QuoteFigureProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const stacked = width < 640;
  const left = side === "left" && !stacked;
  const rule = "1px solid var(--_ic-grid)";
  const hasEvidence = stat != null || figure != null;
  return (
    <div ref={ref} data-slot="ic-quote-figure" data-ic-mode={mode} data-layout={stacked ? "stacked" : "side"} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <div style={{ display: "grid", gridTemplateColumns: stacked || !hasEvidence ? "minmax(0, 1fr)" : left ? "minmax(0, 1fr) minmax(0, 1.7fr)" : "minmax(0, 1.7fr) minmax(0, 1fr)", gap: stacked ? 24 : 40, alignItems: "center" }}>
          <div data-slot="ic-quote-figure-quote" style={{ minWidth: 0, order: left ? 2 : 1 }}>
            <PullQuote quote={quote} attribution={attribution} role={role} cite={cite} size={width < 800 ? "md" : "lg"} />
          </div>
          {hasEvidence ? (
            <aside data-slot="ic-quote-figure-evidence" style={{ minWidth: 0, order: left ? 1 : 2, display: "grid", gap: 16, ...(stacked ? { borderTop: rule, paddingTop: 20 } : left ? { borderRight: rule, paddingRight: 40 } : { borderLeft: rule, paddingLeft: 40 }) }}>
              {stat ? <BigNumber {...stat} /> : null}
              {figure != null ? <div style={{ minWidth: 0 }}>{renderSlot(figure)}</div> : null}
            </aside>
          ) : null}
        </div>
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

export const QuoteFigure = withMeta(QuoteFigureImpl, {
  name: "quote-figure",
  component: "QuoteFigure",
  title: "Quote with figure",
  level: "molecule",
  category: "story",
  description: "A pull-quote paired with the statistic or small chart that backs it up, side by side and stacking in narrow containers.",
  whenToUse: "A quotation shown next to the number it refers to: an interview finding with its survey figure, an executive's statement with the metric. One per section.",
  avoid: "A quote with no evidence (use `pull-quote`); a figure that needs axes to read (use `chart-callout` and put the quote in prose); unattributed quotations.",
  composes: ["pull-quote", "big-number", "sparkline", "progress-meter"],
  props: [
    { name: "quote", type: "string", required: true, description: "The words quoted, without quotation marks." },
    { name: "attribution", type: "string", description: "Who said it." },
    { name: "role", type: "string", description: "Their role, or where it was said." },
    { name: "cite", type: "string", description: "Source URL, linked from the attribution." },
    { name: "stat", type: "{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }", description: "The statistic that backs the quote up; takes the props of `big-number`." },
    { name: "figure", type: "Slot", description: "A small chart or figure instead of, or under, the statistic: a spec or a React element." },
    { name: "side", type: '"left" | "right"', default: '"right"', description: "Side the evidence sits on; under 640px it goes underneath." },
    { name: "source", type: "string", description: 'Shown underneath as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the quote and the figure. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "quote-figure",
    theme: "magenta",
    quote: "Solar met more than half of demand on 41% of summer afternoons in 2024. We do not have enough storage for the midday surplus yet.",
    attribution: "Marta Keller",
    role: "Grid planner, quoted in the 2024 system adequacy review",
    stat: { value: 0.41, format: "percent", label: "Summer afternoons when solar met over half of demand", context: "It was 6% of afternoons in 2019" },
    figure: { type: "sparkline", data: [6, 9, 14, 22, 31, 41].map((share, i) => ({ year: String(2019 + i), share })), x: "year", y: "share", format: "{value}%", area: true },
    source: "National grid operator, hourly generation data",
    note: "Illustrative data",
  },
});

export const examples = {
  "Evidence on the left, statistic only": {
    side: "left",
    quote: "Most of the customers who left told us they stopped at the second screen of setup.",
    attribution: "Dana Whitfield",
    role: "Head of customer research",
    stat: { value: 0.58, format: "percent", label: "Churned accounts that never finished setup", delta: "−21 pts", deltaLabel: "after the redesign", upIsGood: false },
  },
  "A meter as the evidence, editorial theme": {
    theme: "editorial",
    quote: "Only 14 of our 92 bus routes have been redesigned since 2015. The other 78 follow maps drawn before the tram opened.",
    attribution: "Ines Carvalho",
    role: "Director of transport planning",
    figure: { type: "progress-meter", value: 14, max: 92, label: "Bus routes redesigned since 2015", format: "integer", context: "78 routes have not been redesigned" },
    source: "City transport authority, network review 2024",
    note: "Illustrative data",
  },
  "Evidence on the left with yearly bars, earth theme": {
    theme: "earth",
    side: "left",
    quote: "In the 2023 drought we harvested 2.1 tonnes of wheat per hectare. The five years before that averaged 3.4.",
    attribution: "Tomás Ferreira",
    role: "Wheat farmer, Alentejo",
    stat: { value: "2.1 t/ha", label: "Wheat yield, 2023", delta: "−38%", deltaLabel: "vs the 2018 to 2022 average" },
    figure: { type: "sparkline", data: [3.5, 3.3, 3.6, 3.2, 3.4, 2.1].map((tonnes, i) => ({ year: String(2018 + i), tonnes })), x: "year", y: "tonnes", mark: "bar", format: "{value} t/ha" },
    note: "Illustrative data",
  },
};
