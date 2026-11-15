import { BigNumber, type BigNumberProps } from "../atoms/big-number";
import { Callout } from "../atoms/callout";
import { Headline } from "../atoms/headline";
import { Prose } from "../atoms/prose";
import { StepMarker } from "../atoms/step-marker";
import type { FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { isSpec, renderSlot, type Slot } from "../core/spec";
import { Provide } from "../molecules/_shared";
import { ProportionStatement } from "../molecules/proportion-statement";
import { below, button, frame, FRAME_DOCS, Heading, RULE, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type TemplateProps, type TemplateSourcing } from "./_shared";

export interface ExplainerHook {
  /** The number. With `text` it is the count in "19 in every 100"; without, it is shown as a big number. */
  value: number | string;
  /** Proportion form: the whole. Default 100. */
  total?: number;
  /** Proportion form: the rest of the sentence, read straight after the figure. */
  text?: string;
  /** Proportion form: the emphasised words, when "{value} in every {total}" is not right. */
  figure?: string;
  visual?: "waffle" | "icons";
  /** Proportion form: the glyph (`"circle"`, `"person"` or `"square"`). Big-number form: the icon for `variant: "with-icon"`. */
  icon?: BigNumberProps["icon"];
  /** A second sentence in smaller type. */
  detail?: string;
  /** Big-number form: what the number measures. */
  label?: string;
  /** Big-number form: what the number is compared with. */
  context?: string;
  format?: FormatSpec;
  /** Big-number form: the display of the number, any `big-number` variant (`"filled"`, `"tinted"`, `"with-icon"`, `"with-ring"`, `"with-trend"`). */
  variant?: BigNumberProps["variant"];
  /** Big-number form: colour of the ground or graphic. */
  tone?: BigNumberProps["tone"];
  /** Big-number form: past values ending with the current one, for `with-trend`. */
  series?: number[];
  /** Big-number form: the goal, for `with-ring`. */
  target?: number;
  /** Big-number form: end of the ring's scale. */
  max?: number;
}

export interface ExplainerSection {
  /** What the section shows: one plain sentence with the number in it, or a plain label. */
  title: string;
  /** Two or three short sentences. Each states one fact. */
  text?: string | string[];
  /** The section's one exhibit. */
  exhibit?: Slot;
  /** One sentence with the section's main number, set off under the exhibit. */
  takeaway?: string;
  id?: string;
}

export interface ExplainerConclusion {
  title: string;
  text?: string | string[];
  /** Short concrete points: what the reader can do, or what happens next. */
  points?: string[];
  /** A link to a page outside the piece. */
  action?: { label: string; href: string };
}

export interface ExplainerProps extends TemplateProps, TemplateSourcing {
  /** The main finding, as one plain sentence with the number and the period in it. */
  title: string;
  kicker?: string;
  deck?: string;
  byline?: string;
  date?: string;
  /** The opening number. A hook object, or any spec or element. */
  hook?: ExplainerHook | Slot;
  /** The main exhibit. Its `title` states one fact with its number. */
  hero?: Slot;
  /** One or two sentences under the hero. Each states one more fact. */
  heroText?: string;
  /** Numbered sections. Each has one heading and one exhibit. */
  sections?: ExplainerSection[];
  /** Give every section at least the height of the viewport, so each fills a screen. */
  screenful?: boolean;
  conclusion?: ExplainerConclusion;
}

const isHook = (value: unknown): value is ExplainerHook => typeof value === "object" && value !== null && !isSpec(value) && "value" in value && !("$$typeof" in value);

/**
 * A vertical infographic in one column: an opening number, the main exhibit, numbered
 * sections with one exhibit each, and a conclusion.
 */
function ExplainerImpl({ title, kicker, deck, byline, date, hook, hero, heroText, sections, screenful = false, conclusion, sources, period, method, note, credit, level = 1, maxWidth = 760, className, style, ...rest }: ExplainerProps) {
  const { ref, mode, root, phone, gap } = useTemplate(rest);
  const list = sections ?? [];
  const sub = below(level);
  const pad = phone ? 32 : 48;
  return (
    <article ref={ref} data-slot="ic-explainer" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, 0), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} level={level} />
        {hook != null ? (
          <section data-slot="ic-explainer-hook" aria-label="The number" style={{ minWidth: 0, marginTop: gap, borderTop: RULE, borderBottom: hero != null ? undefined : RULE, padding: `${pad}px 0` }}>
            {isHook(hook) ? (
              hook.text ? (
                <ProportionStatement value={Number(hook.value)} total={hook.total} figure={hook.figure} text={hook.text} visual={hook.visual} icon={hook.icon as "circle" | "person" | "square" | undefined} detail={hook.detail} />
              ) : (
                <BigNumber size="hero" value={hook.value} label={hook.label ?? ""} context={hook.context ?? hook.detail} format={hook.format} variant={hook.variant} tone={hook.tone} icon={hook.icon} series={hook.series} target={hook.target} max={hook.max} />
              )
            ) : (
              renderSlot(hook as Slot)
            )}
          </section>
        ) : null}
        {hero != null ? (
          <section data-slot="ic-explainer-hero" aria-label="The explanation" style={{ minWidth: 0, borderTop: RULE, paddingTop: pad, marginTop: hook != null ? 0 : gap }}>
            {renderSlot(withHeight(hero, phone ? 280 : 360))}
            {heroText ? <Prose text={heroText} size={phone ? "md" : "lg"} style={{ marginTop: 20 }} /> : null}
          </section>
        ) : null}
        {list.map((section, i) => (
          <section key={i} id={section.id} data-slot="ic-explainer-section" aria-label={section.title} style={{ minWidth: 0, marginTop: pad, borderTop: RULE, paddingTop: pad, display: "flex", flexDirection: "column", justifyContent: "center", gap: phone ? 20 : 24, ...(screenful ? { minHeight: "100svh", boxSizing: "border-box", paddingBottom: pad, marginTop: 0 } : null) }}>
            <div style={{ minWidth: 0, display: "grid", gap: 12 }}>
              <StepMarker step={i + 1} total={list.length} title={section.title} size="lg" level={sub} layout={phone ? "stacked" : "inline"} />
              {section.text ? <Prose text={section.text} size="md" /> : null}
            </div>
            {section.exhibit != null ? (
              <div data-slot="ic-explainer-exhibit" style={{ minWidth: 0 }}>
                {renderSlot(withHeight(section.exhibit, phone ? 240 : 280))}
              </div>
            ) : null}
            {section.takeaway ? <Callout variant="plain" tone="accent" lead={section.takeaway} /> : null}
          </section>
        ))}
        {conclusion ? (
          <section data-slot="ic-explainer-conclusion" aria-label={conclusion.title} style={{ minWidth: 0, marginTop: pad, borderTop: "2px solid var(--_ic-ink)", paddingTop: phone ? 24 : 32, display: "grid", gap: 16 }}>
            <Heading level={sub} size="lg" style={{ fontSize: phone ? "1.375rem" : "1.75rem", lineHeight: 1.18, letterSpacing: "-0.02em" }}>
              {conclusion.title}
            </Heading>
            {conclusion.text ? <Prose text={conclusion.text} size={phone ? "md" : "lg"} /> : null}
            {conclusion.points?.length ? (
              <ul data-slot="ic-explainer-points" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}>
                {conclusion.points.map((point, i) => (
                  <li key={i} style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: 12, alignItems: "baseline", padding: "12px 0", borderTop: RULE, fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--_ic-ink)" }}>
                    <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: "var(--_ic-accent)", transform: "translateY(-2px)" }} />
                    <Prose text={point} size="md" style={{ fontSize: "0.9375rem" }} />
                  </li>
                ))}
              </ul>
            ) : null}
            {conclusion.action && /^(https?:|\/|#|\.|mailto:)/i.test(conclusion.action.href) ? (
              <div>
                <a data-slot="ic-button" href={conclusion.action.href} style={{ ...button, minHeight: 36, padding: "0 14px", textDecoration: "none", background: "var(--_ic-ink)", color: "var(--_ic-surface)", borderColor: "var(--_ic-ink)" }}>
                  {conclusion.action.label}
                  <span aria-hidden>→</span>
                </a>
              </div>
            ) : null}
          </section>
        ) : null}
        <Sourcing sources={sources} period={period} method={method} note={note} credit={credit} style={{ marginTop: pad }} />
      </Provide>
    </article>
  );
}

const wasteBySector = [
  { sector: "Households", mt: 631 },
  { sector: "Food service", mt: 290 },
  { sector: "Retail", mt: 131 },
];
const wasteByIncome = [
  { group: "High income", kg: 81 },
  { group: "Upper-middle", kg: 88 },
  { group: "Lower-middle", kg: 86 },
];
const emitters = [
  { emitter: "China", gt: 13.0 },
  { emitter: "United States", gt: 6.0 },
  { emitter: "Wasted food", gt: 4.4 },
  { emitter: "India", gt: 3.9 },
  { emitter: "European Union", gt: 3.4 },
];

// Savings example: a fixed monthly deposit at a constant real return, compounded monthly.
const grow = (monthly: number, annual: number, years: number) => {
  const r = annual / 12;
  return Math.round((monthly * ((1 + r) ** (years * 12) - 1)) / r);
};
const savings = Array.from({ length: 9 }, (_, i) => 25 + i * 5).flatMap((age) => [
  { age: String(age), saver: "Starts at 25", balance: grow(300, 0.06, age - 25) },
  ...(age >= 35 ? [{ age: String(age), saver: "Starts at 35", balance: grow(300, 0.06, age - 35) }] : []),
]);
const early = grow(300, 0.06, 40);
const late = grow(300, 0.06, 30);
const fees = [
  { fund: "Index fund, 0.2% a year", balance: grow(300, 0.058, 40) },
  { fund: "Managed fund, 1.5% a year", balance: grow(300, 0.045, 40) },
];

// Home energy example: an average home's use by purpose, by building age and by month.
const homeUse = [
  { use: "Room heating", kwh: 8804 },
  { use: "Hot water", kwh: 2414 },
  { use: "Appliances", kwh: 1846 },
  { use: "Lighting", kwh: 710 },
  { use: "Cooking", kwh: 426 },
];
const homeAge = [
  { built: "Before 1945", kwh: 17900 },
  { built: "1945 to 1964", kwh: 15800 },
  { built: "1965 to 1990", kwh: 14100 },
  { built: "1991 to 2010", kwh: 11700 },
  { built: "After 2010", kwh: 9600 },
];
const homeMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => ({ month, Gas: [78, 70, 55, 36, 18, 10, 9, 9, 16, 34, 56, 74][i], Electricity: [10.5, 10.1, 9.6, 9.0, 8.6, 8.2, 8.1, 8.2, 8.7, 9.4, 10.0, 10.6][i] }));
const homeMeasures = [
  { measure: "Cavity wall insulation", kwh: 2100 },
  { measure: "Loft insulation", kwh: 1400 },
  { measure: "Thermostat 1°C lower", kwh: 1100 },
  { measure: "Draught-proofing", kwh: 500 },
];

export const Explainer = withMeta(ExplainerImpl, {
  name: "explainer",
  component: "Explainer",
  title: "Explainer",
  level: "template",
  category: "story",
  description: "A vertical infographic in one narrow column. It opens with a big number or a proportion statement (`hook`), then the hero exhibit, then numbered sections with one exhibit each, a conclusion with an optional link, and sources.",
  whenToUse: "Use it to explain one subject to a general audience in a single narrow column. The column also works as a tall image or on a phone screen. State the main finding with its number in the headline and repeat the main number in `hook`. Make the hero exhibit the largest thing on the page. Give each numbered section one heading, one exhibit and one sentence with its main number. Write each section so it can be read without the others. Keep one accent colour on the subject (`highlight`) throughout.",
  avoid: "Findings that need caveats and separate interpretation (use `report-page`). A chart that has to change step by step (use `visual-essay` with a scrolly block). More than five sections, because readers stop before the end.",
  composes: ["headline", "big-number", "proportion-statement", "step-marker", "prose", "callout", "source-note", "bar-chart", "donut-chart", "pictogram-chart", "icon-stat", "line-chart", "segmented-bar", "treemap", "lollipop-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "The main finding, as one plain sentence with the number and the period in it." },
    { name: "kicker", type: "string", description: "Small label above the title." },
    { name: "deck", type: "string", description: "One-sentence standfirst." },
    { name: "byline", type: "string", description: "Author line." },
    { name: "date", type: "string", description: "Publication date." },
    { name: "hook", type: "{ value, total?, text?, figure?, visual?, icon?, detail?, label?, context?, format?, variant?, tone?, series?, target?, max? } | Slot", description: "The opening number. With `text` it renders a `proportion-statement` (\"19 in every 100 ...\"); with `label` a hero `big-number`, which also takes that atom's `variant` (`filled`, `tinted`, `with-icon`, `with-ring`, `with-trend`), `tone`, `icon`, `series`, `target` and `max`. A spec or element is rendered as given." },
    { name: "hero", type: "Slot", description: "The main exhibit. Its `title` states one fact with its number. Default height 360px." },
    { name: "heroText", type: "string", description: "One or two sentences under the hero. Each states one more fact." },
    { name: "sections", type: "{ title, text?, exhibit?, takeaway?, id? }[]", description: "Numbered sections. Each has a heading, one exhibit and a `takeaway` sentence with its main number." },
    { name: "screenful", type: "boolean", default: "false", description: "Give every section at least the height of the viewport and centre its content, so each fills a screen." },
    { name: "conclusion", type: "{ title, text?, points?, action?: { label, href } }", description: "The closing block: a heading, text, a list of actions and an optional link." },
    ...SOURCING_DOCS,
    ...FRAME_DOCS,
  ],
  example: {
    type: "explainer",
    theme: "sunrise",
    kicker: "Food and climate",
    title: "Households threw away 631 million tonnes of food in 2022",
    deck: "That is 60% of the 1.05 billion tonnes of food wasted worldwide. Food service wasted 290 million tonnes and retail 131 million.",
    hook: {
      value: 19,
      total: 100,
      text: "tonnes of food that reach shops, restaurants and homes are thrown away.",
      detail: "That was 1.05 billion tonnes in 2022.",
    },
    hero: {
      type: "donut-chart",
      data: wasteBySector,
      name: "sector",
      value: "mt",
      format: "{value} Mt",
      centerLabel: "Million tonnes wasted",
      centerValue: "1,052",
      height: 340,
      title: "Households produced 60% of the world's food waste in 2022",
      subtitle: "Food waste by sector, million tonnes (Mt), 2022",
      source: "UNEP Food Waste Index Report 2024",
      note: "Figures are approximate, for illustration",
    },
    heroText: "Food service produced 290 million tonnes, or 28%. Retail produced 131 million tonnes, or 12%.",
    sections: [
      {
        title: "Household food waste by income group",
        text: "Households in high-income countries waste 81 kg of food per person a year. In upper-middle-income countries the figure is 88 kg. In lower-middle-income countries it is 86 kg.",
        exhibit: { type: "pictogram-chart", data: wasteByIncome, name: "group", value: "kg", unit: 10, unitLabel: "10 kg of food", icon: "apple", format: "{value} kg", subtitle: "Household food waste per person per year, by country income group" },
        takeaway: "The three income groups are within 7 kg per person of each other.",
      },
      {
        title: "Lost and wasted food causes 4.4 billion tonnes of emissions a year",
        text: "Growing, transporting and chilling food uses land, fertiliser and fuel. Food releases methane when it rots. Lost and wasted food causes 8 to 10% of global greenhouse gas emissions.",
        exhibit: { type: "bar-chart", data: emitters, x: "emitter", y: "gt", sort: "desc", orientation: "horizontal", highlight: "Wasted food", format: "{value} Gt", subtitle: "Annual greenhouse gas emissions, billion tonnes of CO2 equivalent. Wasted food includes losses before retail" },
        takeaway: "Only China and the United States emit more than lost and wasted food.",
      },
      {
        title: "733 million people faced hunger in 2023",
        exhibit: { type: "icon-stat", icon: "person", tone: "negative", count: 1, total: 11, columns: 11, text: "people in the world faced hunger in 2023." },
      },
    ],
    conclusion: {
      title: "The UN target is to halve food waste by 2030",
      text: "Britain and Japan publish household food waste figures. Britain has cut household waste by 18% and Japan by 31%.",
      points: ["Measure household food waste and publish the figure every year.", "State on packaging that “best before” refers to quality and “use by” refers to safety.", "Plan meals before shopping and freeze food that will not be eaten in time."],
      action: { label: "Read the UNEP report", href: "https://www.unep.org/resources/publication/food-waste-index-report-2024" },
    },
    sources: [{ name: "UNEP Food Waste Index Report 2024", url: "https://www.unep.org/resources/publication/food-waste-index-report-2024" }, "FAO, State of Food Security and Nutrition in the World 2024", "Emissions figures rounded from national inventories"],
    note: "Figures are approximate, for illustration",
    period: "2022 (waste), 2023 (hunger and emissions)",
    method: "Food waste is measured at retail, food service and household level and includes inedible parts. Losses on farms and in transport are counted separately.",
  },
});

export const examples = {
  "Personal finance, opening with a big number": {
    theme: "blueprint",
    kicker: "Money basics",
    title: "Starting to save at 35 instead of 25 leaves $296,000 less at 65",
    deck: "Both savers put in $300 a month at a 6% real return. The saver who starts at 25 has $597,000 at 65. The saver who starts at 35 has $301,000.",
    hook: { variant: "with-icon", icon: "coin", value: Math.round((early - late) / 1000) * 1000, format: { style: "currency", currency: "USD", maximumFractionDigits: 0 }, label: "Difference at 65 between starting at 25 and starting at 35", context: `Saving $300 a month until 65 at a 6% real return gives $${Math.round(early / 1000)}k from age 25 and $${Math.round(late / 1000)}k from age 35` },
    hero: {
      type: "line-chart",
      data: savings,
      x: "age",
      y: "balance",
      series: "saver",
      format: "compact",
      zero: true,
      height: 320,
      title: "At 50 the saver who started at 25 has $208,000 and the other has $87,000",
      subtitle: "Balance by age, $300 a month at a 6% real annual return",
      note: "Illustrative calculation",
    },
    heroText: "The saver who starts at 25 deposits $36,000 more. The other $260,000 of the difference is investment growth.",
    sections: [
      {
        title: "Deposits are $144,000 of the $597,000",
        text: "The saver who starts at 25 pays in $300 a month for 40 years. The other $453,000 is growth.",
        exhibit: {
          type: "segmented-bar",
          data: [
            { part: "Deposits", usd: 144000 },
            { part: "Growth", usd: early - 144000 },
          ],
          name: "part",
          value: "usd",
          format: "compact",
          highlight: "Growth",
        },
        takeaway: "Growth is 76% of the final balance.",
      },
      {
        title: "A 1.5% annual fee leaves $402,000 instead of $566,000",
        text: "The index fund charges 0.2% a year. The managed fund charges 1.5%. After 40 years the managed fund's balance is 29% lower.",
        exhibit: { type: "bar-chart", data: fees, x: "fund", y: "balance", sort: "none", orientation: "horizontal", format: "currency:USD", highlight: "Index fund, 0.2% a year" },
        takeaway: "The 1.3-point difference in fees costs $164,000 over 40 years.",
      },
    ],
    conclusion: { title: "What to do", points: ["Set up a monthly standing order this month.", "Choose a broad index fund with a fee of about 0.2% a year.", "Increase the monthly amount each time your pay rises."] },
    sources: "Author's calculation",
    method: "Monthly compounding at a constant real return of 6% a year. Fees are subtracted from the return. Real returns vary from year to year.",
    note: "Illustrative data. Not financial advice.",
  },
  "Home energy, default theme, five chart forms": {
    kicker: "Home energy",
    title: "Heating rooms used 62% of the energy in an average home in 2023",
    deck: "The average home used 14,200 kWh of gas and electricity. Room heating used 8,804 kWh of it.",
    hook: { value: 62, total: 100, figure: "62 in every 100", text: "units of energy used at home heat the rooms.", detail: "Hot water uses another 17." },
    hero: {
      type: "treemap",
      data: homeUse,
      name: "use",
      value: "kwh",
      format: "{value} kWh",
      highlight: "Room heating",
      height: 320,
      title: "Room heating used 8,804 of the 14,200 kWh",
      subtitle: "Energy used by an average home in 2023, by purpose, kWh",
      note: "Illustrative data",
    },
    heroText: "Hot water used 2,414 kWh. Appliances, lighting and cooking together used 2,982 kWh.",
    sections: [
      {
        title: "Homes built before 1945 used 17,900 kWh",
        text: "Homes built after 2010 used 9,600 kWh. Building rules have required wall and loft insulation since 1990.",
        exhibit: { type: "lollipop-chart", data: homeAge, x: "built", y: "kwh", sort: "none", format: "integer", highlight: "Before 1945", subtitle: "Energy used per home in 2023, by year built, kWh" },
        takeaway: "A home built before 1945 used 8,300 kWh more than one built after 2010.",
      },
      {
        title: "Daily gas use was 78 kWh in January and 9 kWh in July",
        text: "Gas heats the rooms and the water in most homes. Daily electricity use stayed between 8.1 and 10.6 kWh all year.",
        exhibit: { type: "line-chart", data: homeMonths, x: "month", y: ["Gas", "Electricity"], zero: true, format: "{value} kWh", subtitle: "Average daily energy use per home by month, 2023, kWh" },
        takeaway: "January gas use was 8.7 times July gas use.",
      },
      {
        title: "Cavity wall insulation saves 2,100 kWh a year",
        text: "Loft insulation saves 1,400 kWh. Turning the thermostat down by 1°C saves 1,100 kWh.",
        exhibit: { type: "bar-chart", data: homeMeasures, x: "measure", y: "kwh", sort: "none", orientation: "horizontal", format: "{value} kWh", highlight: "Cavity wall insulation", subtitle: "Energy saved per year by measure, average home, kWh" },
      },
    ],
    conclusion: {
      title: "The four measures together save 5,100 kWh a year",
      text: "That is 36% of the 14,200 kWh an average home used in 2023.",
      points: ["Check whether the walls and loft are insulated.", "Set the thermostat 1°C lower.", "Fit draught strips to doors and windows."],
    },
    sources: "National household energy survey",
    period: "2023",
    method: "Energy is delivered gas and electricity, in kWh. Savings are modelled for a three-bedroom semi-detached house and overlap when measures are combined.",
    note: "Illustrative data",
  },
};
