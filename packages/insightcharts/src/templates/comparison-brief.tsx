import { Callout } from "../atoms/callout";
import { Headline } from "../atoms/headline";
import { Prose } from "../atoms/prose";
import { makeFormatter, type FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { Provide } from "../molecules/_shared";
import { below, frame, FRAME_DOCS, Heading, Label, RULE, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type TemplateProps, type TemplateSourcing } from "./_shared";

export interface ComparisonSide {
  /** What this side is called: a country, a product, a period. */
  name: string;
  /** A short qualifier under the name. */
  detail?: string;
}

export interface ComparisonFigure {
  /** What is measured, with its unit. */
  label: string;
  /** Side A's value. Numbers are formatted and drawn as mirrored bars; strings are shown as written. */
  a: number | string;
  /** Side B's value. */
  b: number | string;
  format?: FormatSpec;
  /** Which direction is better. The better value is set bolder. */
  better?: "higher" | "lower";
}

export interface ComparisonPair {
  /** What the pair shows: one plain sentence with the numbers, or a label. */
  title: string;
  text?: string;
  /** Side A's exhibit. Use the same chart form and scale on both sides. */
  a: Slot;
  /** Side B's exhibit. */
  b: Slot;
}

export interface ComparisonBriefProps extends TemplateProps, TemplateSourcing {
  /** The result of the comparison, as one plain sentence with the number in it. */
  title: string;
  kicker?: string;
  deck?: string;
  byline?: string;
  date?: string;
  /** Side A, shown on the left. */
  a: string | ComparisonSide;
  /** Side B, shown on the right. */
  b: string | ComparisonSide;
  /** Which side the piece is about. It takes the accent colour; the other side stays grey. Default `"a"`. */
  subject?: "a" | "b" | "none";
  /** The headline measures, mirrored either side of their labels. */
  figures?: ComparisonFigure[];
  /** The hero exhibit that shows both sides at once: a `before-after`, dumbbell, slope or two-series line. */
  hero?: Slot;
  /** One or two sentences under the hero. */
  heroText?: string;
  /** Paired exhibits under one heading. A is on the left and B on the right. */
  pairs?: ComparisonPair[];
  /** The closing recommendation. */
  verdict?: { lead?: string; body?: string; label?: string; tone?: "neutral" | "positive" | "negative" | "accent" };
}

const side = (value: string | ComparisonSide): ComparisonSide => (typeof value === "string" ? { name: value } : value);

/**
 * A compared with B. The headline figures sit either side of their labels. One exhibit
 * shows both sides at once. Paired exhibits repeat the same view for each side. A verdict
 * callout comes last.
 */
function ComparisonBriefImpl({ title, kicker, deck, byline, date, a, b, subject = "a", figures, hero, heroText, pairs, verdict, sources, period, method, note, credit, level = 1, maxWidth = 960, className, style, ...rest }: ComparisonBriefProps) {
  const { ref, width, mode, root, phone, gap, locale } = useTemplate(rest);
  const A = side(a);
  const B = side(b);
  const rows = figures ?? [];
  const bars = width >= 520;
  const two = width >= 600;
  const sub = below(level);
  const colour = (which: "a" | "b") => (subject === which ? "var(--_ic-accent)" : "var(--_ic-context)");
  const columns = bars ? "minmax(0, 1fr) minmax(120px, 0.7fr) minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr)";
  const nameStyle = { fontFamily: "var(--_ic-font-display)", fontSize: phone ? "1.125rem" : "1.5rem", lineHeight: 1.2, fontWeight: 650, letterSpacing: "-0.015em", color: "var(--_ic-ink)", overflowWrap: "break-word" } as const;
  const swatch = (which: "a" | "b") => <span aria-hidden style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: colour(which), margin: which === "a" ? "0 0 0 8px" : "0 8px 0 0", verticalAlign: "baseline" }} />;

  return (
    <article ref={ref} data-slot="ic-comparison-brief" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, gap), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} level={level} />
        <section data-slot="ic-comparison-brief-figures" aria-label={`${A.name} compared with ${B.name}`} style={{ minWidth: 0, marginTop: -gap / 4 }}>
          <div role="table" aria-label={`${A.name} and ${B.name}`} style={{ display: "grid", gap: 0 }}>
            <div role="row" style={{ display: "grid", gridTemplateColumns: columns, alignItems: "end", columnGap: phone ? 12 : 20, borderBottom: "2px solid var(--_ic-ink)", paddingBottom: 12 }}>
              <div role="columnheader" data-slot="ic-comparison-brief-side" data-side="a" style={{ minWidth: 0, textAlign: "right" }}>
                <div style={nameStyle}>
                  {A.name}
                  {subject !== "none" ? swatch("a") : null}
                </div>
                {A.detail ? <Label style={{ fontWeight: 400, marginTop: 2 }}>{A.detail}</Label> : null}
              </div>
              <div role="columnheader" style={{ textAlign: "center", fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--_ic-muted)", paddingBottom: A.detail || B.detail ? 0 : 4 }}>
                <span aria-hidden>vs</span>
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Measure</span>
              </div>
              <div role="columnheader" data-slot="ic-comparison-brief-side" data-side="b" style={{ minWidth: 0, textAlign: "left" }}>
                <div style={nameStyle}>
                  {subject !== "none" ? swatch("b") : null}
                  {B.name}
                </div>
                {B.detail ? <Label style={{ fontWeight: 400, marginTop: 2 }}>{B.detail}</Label> : null}
              </div>
            </div>
            {rows.map((row, i) => {
              const fmt = makeFormatter(row.format, locale);
              const na = typeof row.a === "number" ? row.a : NaN;
              const nb = typeof row.b === "number" ? row.b : NaN;
              const max = Math.max(Math.abs(na), Math.abs(nb));
              const numeric = Number.isFinite(max) && max > 0;
              const winner = !row.better || !numeric || na === nb ? null : (row.better === "higher") === na > nb ? "a" : "b";
              const cell = (which: "a" | "b") => {
                const raw = which === "a" ? row.a : row.b;
                const n = which === "a" ? na : nb;
                const strong = winner === null || winner === which;
                const value = (
                  <span data-slot="ic-comparison-brief-value" data-better={winner === which || undefined} style={{ flex: "none", fontFamily: "var(--_ic-font-display)", fontSize: phone ? "1.125rem" : "1.375rem", lineHeight: 1.2, fontWeight: strong ? 650 : 450, letterSpacing: "-0.015em", fontVariantNumeric: "tabular-nums", color: strong ? "var(--_ic-ink)" : "var(--_ic-ink-2)" }}>
                    {typeof raw === "number" ? fmt(raw) : raw}
                  </span>
                );
                const bar =
                  bars && numeric ? (
                    <span aria-hidden data-slot="ic-comparison-brief-bar" style={{ flex: "1 1 0", minWidth: 0, display: "flex", justifyContent: which === "a" ? "flex-end" : "flex-start" }}>
                      <span style={{ display: "block", height: 8, width: `${(Math.abs(n) / max) * 100}%`, background: colour(which), borderRadius: which === "a" ? "3px 0 0 3px" : "0 3px 3px 0" }} />
                    </span>
                  ) : null;
                return (
                  <div role="cell" style={{ minWidth: 0, display: "flex", alignItems: "center", justifyContent: which === "a" ? "flex-end" : "flex-start", gap: 12 }}>
                    {which === "a" ? (
                      <>
                        {value}
                        {bar}
                      </>
                    ) : (
                      <>
                        {bar}
                        {value}
                      </>
                    )}
                  </div>
                );
              };
              return (
                <div key={i} role="row" data-slot="ic-comparison-brief-row" style={{ display: "grid", gridTemplateColumns: columns, alignItems: "center", columnGap: phone ? 12 : 20, padding: phone ? "12px 0" : "14px 0", borderBottom: RULE }}>
                  {cell("a")}
                  <div role="rowheader" style={{ minWidth: 0, textAlign: "center", fontSize: "0.8125rem", lineHeight: 1.35, color: "var(--_ic-ink-2)", textWrap: "balance" }}>
                    {row.label}
                  </div>
                  {cell("b")}
                </div>
              );
            })}
          </div>
        </section>
        {hero != null ? (
          <section data-slot="ic-comparison-brief-hero" aria-label="Main comparison" style={{ minWidth: 0 }}>
            {renderSlot(withHeight(hero, phone ? 280 : 360))}
            {heroText ? <Prose text={heroText} size="md" style={{ marginTop: 16 }} /> : null}
          </section>
        ) : null}
        {(pairs ?? []).map((pair, i) => (
          <section key={i} data-slot="ic-comparison-brief-pair" aria-label={pair.title} style={{ minWidth: 0, borderTop: RULE, paddingTop: phone ? 24 : 32 }}>
            <Heading level={sub}>{pair.title}</Heading>
            {pair.text ? <Prose text={pair.text} size="sm" tone="muted" style={{ marginTop: 6 }} /> : null}
            <div style={{ display: "grid", gridTemplateColumns: two ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)", gap: two ? 40 : 24, marginTop: 20, alignItems: "start" }}>
              {(["a", "b"] as const).map((which) => (
                <div key={which} data-slot="ic-template-block" data-side={which} style={{ minWidth: 0 }}>
                  <Label style={{ color: "var(--_ic-ink)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    {subject !== "none" ? <span aria-hidden style={{ width: 10, height: 10, borderRadius: 2, background: colour(which) }} /> : null}
                    {(which === "a" ? A : B).name}
                  </Label>
                  {renderSlot(withHeight(which === "a" ? pair.a : pair.b, 220))}
                </div>
              ))}
            </div>
          </section>
        ))}
        {verdict?.lead || verdict?.body ? (
          <section data-slot="ic-comparison-brief-verdict" aria-label="Verdict" style={{ minWidth: 0 }}>
            <Callout variant="soft" tone={verdict.tone ?? "accent"} label={verdict.label ?? "Verdict"} lead={verdict.lead} text={verdict.body} />
          </section>
        ) : null}
        <Sourcing sources={sources} period={period} method={method} note={note} credit={credit} />
      </Provide>
    </article>
  );
}

// Cumulative cost of ownership: purchase (after grant) plus running costs, per year.
const ownership = Array.from({ length: 16 }, (_, year) => ({ year: String(year), saving: 3000 + 980 * year - (3500 + 855 * year) }));
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pumpBill = [120, 108, 86, 57, 34, 24, 21, 22, 32, 56, 83, 112].map((cost, i) => ({ month: MONTH[i], cost }));
const boilerBill = [139, 124, 101, 69, 43, 33, 30, 31, 41, 65, 94, 130].map((cost, i) => ({ month: MONTH[i], cost }));
const lifetime = (purchase: number, energy: number, service: number) => [
  { part: "Purchase and fitting", gbp: purchase },
  { part: "Energy", gbp: energy },
  { part: "Servicing", gbp: service },
];

const journey = [
  { mode: "Train", "Getting there": 25, "Waiting and boarding": 15, "In transit": 260, Onward: 10 },
  { mode: "Plane", "Getting there": 55, "Waiting and boarding": 95, "In transit": 80, Onward: 45 },
];

// Buying against renting the same flat: cumulative net cost (payments minus wealth gained) by year.
const tenure = Array.from({ length: 11 }, (_, year) => ({ year: String(year), Buying: (year ? 11000 : 0) + 9970 * year, Renting: 16680 * year }));
const outgoings = (parts: [string, number][]) => parts.map(([part, gbp]) => ({ part, gbp }));

export const ComparisonBrief = withMeta(ComparisonBriefImpl, {
  name: "comparison-brief",
  component: "ComparisonBrief",
  title: "Comparison brief",
  level: "template",
  category: "layout",
  description: "A compared with B on one page. It has a headline that states the result, the headline figures mirrored either side of their labels, one hero exhibit that shows both sides, paired exhibits on a shared scale, a verdict callout and a source note.",
  whenToUse: "Use it for two things a reader has to choose between or compare, such as two countries, two products or a before and an after. Write the result with its number in the headline. Put the four or five most important measures in `figures`. Use a two-series line, dumbbell, slope or `before-after` as the hero. In each pair, use the same chart form and the same scale for both sides. The `subject` side takes the accent colour everywhere and the other side stays grey.",
  avoid: "Three or more things (use a `comparison-table` or `small-multiple-grid` inside a `report-page`). One thing over time with nothing to compare it with (use `timeline-story`). Paired charts on different scales, because readers compare bar lengths across the pair.",
  composes: ["headline", "prose", "callout", "source-note", "line-chart", "bar-chart", "segmented-bar", "waffle-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "The result of the comparison, as one plain sentence with the number in it." },
    { name: "kicker", type: "string", description: "Small label above the title." },
    { name: "deck", type: "string", description: "One-sentence standfirst." },
    { name: "byline", type: "string", description: "Author line." },
    { name: "date", type: "string", description: "Publication date." },
    { name: "a", type: "string | { name, detail? }", required: true, description: "Side A, shown on the left." },
    { name: "b", type: "string | { name, detail? }", required: true, description: "Side B, shown on the right." },
    { name: "subject", type: '"a" | "b" | "none"', default: '"a"', description: "The side the piece is about. It takes the accent colour; the other stays grey. Match it with `highlight` in the charts." },
    { name: "figures", type: "{ label, a, b, format?, better?: \"higher\" | \"lower\" }[]", description: "Headline measures. Numeric values get mirrored bars scaled within each row; `better` sets the stronger value bolder." },
    { name: "hero", type: "Slot", description: "The exhibit that shows both sides at once. Default height 360px." },
    { name: "heroText", type: "string", description: "One or two sentences under the hero." },
    { name: "pairs", type: "{ title, text?, a: Slot, b: Slot }[]", description: "Paired exhibits under one heading. A is on the left and B on the right; they stack in narrow containers. Use the same form and scale for both." },
    { name: "verdict", type: "{ lead?, body?, label?, tone? }", description: "The closing recommendation, shown as a callout." },
    ...SOURCING_DOCS,
    ...FRAME_DOCS,
  ],
  example: {
    type: "comparison-brief",
    theme: "earth",
    kicker: "Home heating",
    title: "With the £7,500 grant, a heat pump repays its extra £500 cost in 4 years",
    deck: "After the grant a heat pump costs £3,500 to buy and fit. A gas boiler costs £3,000. The heat pump costs £855 a year to run. The boiler costs £980.",
    a: { name: "Heat pump", detail: "Air source, 7 kW" },
    b: { name: "Gas boiler", detail: "Condensing combi, 30 kW" },
    figures: [
      { label: "Cost to buy and fit, after grant", a: 3500, b: 3000, format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 }, better: "lower" },
      { label: "Running cost per year", a: 855, b: 980, format: "currency:GBP", better: "lower" },
      { label: "CO2 per year, tonnes", a: 0.6, b: 2.3, format: "decimal:1", better: "lower" },
      { label: "Heat out per unit of energy in", a: 3.2, b: 0.9, format: "decimal:1", better: "higher" },
      { label: "Expected life, years", a: 20, b: 15, better: "higher" },
    ],
    hero: {
      type: "line-chart",
      data: ownership,
      x: "year",
      y: "saving",
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0, signDisplay: "exceptZero" },
      area: true,
      title: "After 15 years the heat pump has cost £1,375 less than the boiler",
      subtitle: "Cumulative saving of a heat pump over a gas boiler in pounds, by years since installation. Includes purchase after the £7,500 grant, energy and servicing",
      annotations: [
        { type: "line", axis: "y", value: 0, label: "Same cost as the boiler", dashed: false, emphasis: true },
        { type: "point", x: "4", y: 0, label: "Break-even", position: "top" },
      ],
    },
    heroText: "Without the grant the heat pump costs £11,000 to buy and fit. That is £8,000 more than the boiler. A saving of £125 a year would take 64 years to repay it.",
    pairs: [
      {
        title: "The January energy bill is £120 for the heat pump and £139 for the boiler",
        text: "Estimated monthly energy cost for heating and hot water. Both charts use the same scale. The heat pump's bill is lower in all 12 months.",
        a: { type: "bar-chart", data: pumpBill, x: "month", y: "cost", orientation: "vertical", sort: "none", labels: false, format: "currency:GBP", height: 200, option: { yAxis: { max: 140 } } },
        b: { type: "bar-chart", data: boilerBill, x: "month", y: "cost", orientation: "vertical", sort: "none", labels: false, format: "currency:GBP", height: 200, highlight: "none", option: { yAxis: { max: 140 } } },
      },
      {
        title: "Cost over 15 years by part",
        text: "Energy is £11,325 of the heat pump's £16,325. It is £13,500 of the boiler's £17,700.",
        a: { type: "segmented-bar", data: lifetime(3500, 11325, 1500), name: "part", value: "gbp", format: "currency:GBP" },
        b: { type: "segmented-bar", data: lifetime(3000, 13500, 1200), name: "part", value: "gbp", format: "currency:GBP" },
      },
    ],
    verdict: { lead: "Choose the heat pump if you get the grant and will stay at least 5 years", body: "Without the grant the boiler is cheaper. The figures assume electricity and gas prices stay at their Q4 2024 levels." },
    sources: ["Energy regulator price cap, Q4 2024", "Installer quotes collected by the author"],
    method: "A house using 11,500 kWh of heat a year. Heat pump seasonal efficiency is 3.2. Boiler efficiency is 90%. Prices held flat in real terms.",
    note: "Illustrative data",
  },
});

export const examples = {
  "Transport: a stacked hero and a pair of waffles": {
    theme: "poster",
    kicker: "London to Edinburgh",
    title: "Flying from London to Edinburgh is 35 minutes faster than the train, door to door",
    deck: "The plane takes 275 minutes and the train 310. The flight itself lasts 80 minutes. The plane emits 140 kg of CO2 per passenger. The train emits 13 kg.",
    a: "Train",
    b: "Plane",
    figures: [
      { label: "Door to door, minutes", a: 310, b: 275, better: "lower" },
      { label: "CO2 per passenger, kg", a: 13, b: 140, better: "lower" },
      { label: "Typical fare booked two weeks ahead", a: 78, b: 92, format: "currency:GBP", better: "lower" },
      { label: "Minutes you can spend working", a: 240, b: 50, better: "higher" },
    ],
    hero: {
      type: "bar-chart",
      data: journey,
      x: "mode",
      y: ["Getting there", "Waiting and boarding", "In transit", "Onward"],
      stack: true,
      orientation: "horizontal",
      sort: "none",
      format: "{value} min",
      title: "80 of the plane's 275 minutes are spent in the air",
      subtitle: "Minutes per stage, city centre to city centre",
      source: "Timetables and airport guidance, weekday morning departures",
    },
    pairs: [
      {
        title: "240 of the train's 310 minutes can be spent working",
        text: "On the plane it is 50 of 275 minutes. Each square is 1% of the journey.",
        a: { type: "waffle-chart", data: [{ part: "Working time", minutes: 240 }], name: "part", value: "minutes", total: 310, restLabel: "Other time", format: "{value} min", aspect: 1.6 },
        b: { type: "waffle-chart", data: [{ part: "Working time", minutes: 50 }], name: "part", value: "minutes", total: 275, restLabel: "Other time", format: "{value} min", aspect: 1.6, highlight: "none" },
      },
    ],
    verdict: { lead: "Take the train unless you need the 35 minutes", body: "The train fare is £78 and the plane fare is £92. The train gives 240 minutes of working time. The plane gives 50.", tone: "positive" },
    sources: ["Operator timetables", "Government greenhouse gas conversion factors"],
    note: "Illustrative fares and times",
  },
  "Housing: buying against renting, two pairs": {
    theme: "ledger",
    kicker: "Housing costs",
    title: "Buying a £300,000 flat costs £56,100 less than renting it over 10 years",
    deck: "The buyer pays out £218,000 and gains £107,300 in wealth. The renter pays out £185,700 and gains £18,900.",
    a: { name: "Buying", detail: "£30,000 deposit, 4% mortgage" },
    b: { name: "Renting", detail: "£1,350 a month, rising 2.5% a year" },
    figures: [
      { label: "Net cost over 10 years", a: 110700, b: 166800, format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 }, better: "lower" },
      { label: "Paid out over 10 years", a: 218000, b: 185700, format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 }, better: "lower" },
      { label: "Wealth gained over 10 years", a: 107300, b: 18900, format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 }, better: "higher" },
      { label: "Monthly outgoing in year 1", a: 1725, b: 1385, format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 }, better: "lower" },
      { label: "Cash needed at the start", a: 41000, b: 1950, format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 }, better: "lower" },
    ],
    hero: {
      type: "line-chart",
      data: tenure,
      x: "year",
      y: ["Buying", "Renting"],
      highlight: "Buying",
      contextLabels: true,
      zero: true,
      format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
      title: "Buying has a lower net cost than renting from year 2",
      subtitle: "Cumulative net cost in pounds by years since moving in. Net cost is payments minus wealth gained",
    },
    heroText: "The buyer pays £11,000 in tax and fees in year 1. After 2 years buying has a net cost of £30,940 and renting £33,360.",
    pairs: [
      {
        title: "Mortgage interest is £93,700 of the buyer's £218,000",
        text: "Payments over 10 years by part. Rent is £181,500 of the renter's £185,700.",
        a: { type: "segmented-bar", data: outgoings([["Mortgage interest", 93700], ["Capital repaid", 77300], ["Upkeep and insurance", 36000], ["Tax and fees", 11000]]), name: "part", value: "gbp", format: "currency:GBP" },
        b: { type: "segmented-bar", data: outgoings([["Rent", 181500], ["Fees and insurance", 4200]]), name: "part", value: "gbp", format: "currency:GBP" },
      },
      {
        title: "The buyer gains £107,300 in wealth and the renter £18,900",
        text: "Wealth gained over 10 years by source. Both charts use the same scale.",
        a: { type: "bar-chart", data: outgoings([["Capital repaid", 77300], ["Rise in the flat's price", 30000]]), x: "part", y: "gbp", sort: "none", orientation: "horizontal", format: "currency:GBP", option: { xAxis: { max: 90000 } } },
        b: { type: "bar-chart", data: outgoings([["Growth on the invested deposit", 18900]]), x: "part", y: "gbp", sort: "none", orientation: "horizontal", format: "currency:GBP", highlight: "none", option: { xAxis: { max: 90000 } } },
      },
    ],
    verdict: { lead: "Buy if you will stay 2 years or more", body: "The figures assume a 4% mortgage rate, a flat price that rises 1% a year and a 5% annual return on the renter's invested deposit.", tone: "positive" },
    sources: ["Lender mortgage calculator", "Letting agent listings collected by the author"],
    method: "A £270,000 repayment mortgage over 25 years at 4%. The renter invests the £30,000 deposit. Net cost is payments minus capital repaid and growth.",
    note: "Illustrative data",
  },
};
