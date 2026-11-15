"use client";

import { withMeta } from "insightcharts/core";
import { IconStat } from "@/components/insightcharts/atoms/icon-stat";
import { WaffleChart } from "@/components/insightcharts/atoms/waffle-chart";
import { MoleculeFooter, Provide, useMolecule, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

export interface ProportionStatementProps extends MoleculeProps {
  /** How many of the whole: the 37 in "37 in every 100". */
  value: number;
  /** The whole. Default 100. */
  total?: number;
  /** The emphasised figure, as words. Default: "{value} in every {total}" (or "{value} in {total}" for totals up to 20). */
  figure?: string;
  /** The rest of the sentence, read straight after the figure. */
  text: string;
  /** `"waffle"` draws a grid of cells, `"icons"` a row of glyphs. Default: icons up to a total of 20, waffle above. */
  visual?: "waffle" | "icons";
  /** Glyph for the `icons` visual. */
  icon?: "circle" | "person" | "square";
  /** Cell shape for the `waffle` visual. */
  shape?: "square" | "circle";
  /** Which side the visual sits on. Narrow containers put it on top. */
  side?: "left" | "right";
  /** A second, quieter sentence under the statement. */
  detail?: string;
  source?: string;
  note?: string;
}

/**
 * A proportion written as a count ("37 in every 100"): a grid or a row of units with some filled,
 * beside the statement in large type with the number emphasised.
 */
function ProportionStatementImpl({ value, total = 100, figure, text, visual, icon = "person", shape = "square", side = "left", detail, source, note, className, style, ...rest }: ProportionStatementProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const kind = visual ?? (total <= 20 ? "icons" : "waffle");
  const stacked = width < 520;
  const words = figure ?? (total <= 20 ? `${value} in ${total}` : `${value} in every ${total}`);
  const cols = Math.ceil(Math.sqrt(total));
  const waffleSize = stacked ? Math.min(220, width) : width < 720 ? 180 : 220;
  const type = width < 520 ? 24 : width < 720 ? 28 : 34;
  const right = side === "right" && !stacked;

  const picture =
    kind === "waffle" ? (
      // Under 480px the waffle drops its own direct labels and draws only the grid, which is what is wanted beside the sentence.
      <div data-slot="ic-proportion-statement-visual" style={{ width: waffleSize, maxWidth: "100%", minWidth: 0, flex: "none" }}>
        <WaffleChart data={[{ part: words, n: value }]} name="part" value="n" total={total} rows={Math.ceil(total / cols)} columns={cols} shape={shape} height={waffleSize} legend={false} lazy={false} alt={`${value} of ${total} cells filled.`} />
      </div>
    ) : (
      <div data-slot="ic-proportion-statement-visual" style={{ minWidth: 0, flex: "none", maxWidth: stacked ? "100%" : "45%" }}>
        <IconStat count={value} total={total} icon={icon} value={false} columns={total <= 10 ? total : Math.min(10, cols * 2)} size={total <= 5 ? 56 : total <= 10 ? 40 : undefined} />
      </div>
    );

  return (
    <div ref={ref} data-slot="ic-proportion-statement" data-ic-mode={mode} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <div style={{ display: "flex", flexDirection: stacked ? "column" : right ? "row-reverse" : "row", alignItems: stacked ? "flex-start" : "center", gap: stacked ? 20 : width < 720 ? 32 : 48 }}>
          {picture}
          <div data-slot="ic-proportion-statement-text" style={{ minWidth: 0, flex: "1 1 0" }}>
            <p data-slot="ic-proportion-statement-sentence" style={{ margin: 0, fontFamily: "var(--_ic-font-display)", fontSize: type, lineHeight: 1.22, letterSpacing: "-0.02em", fontWeight: 450, color: "var(--_ic-ink-2)", textWrap: "balance", maxWidth: "18em" }}>
              <strong data-slot="ic-proportion-statement-figure" style={{ fontWeight: 700, color: "var(--_ic-ink)", boxShadow: "inset 0 -0.14em 0 color-mix(in srgb, var(--_ic-accent) 55%, transparent)" }}>
                {words}
              </strong>{" "}
              {text}
            </p>
            {detail ? (
              <p data-slot="ic-proportion-statement-detail" style={{ margin: "12px 0 0", fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--_ic-ink-2)", maxWidth: "52ch", textWrap: "pretty" }}>
                {detail}
              </p>
            ) : null}
            <MoleculeFooter source={source} note={note} />
          </div>
        </div>
      </Provide>
    </div>
  );
}

export const ProportionStatement = withMeta(ProportionStatementImpl, {
  name: "proportion-statement",
  component: "ProportionStatement",
  title: "Proportion statement",
  level: "molecule",
  category: "story",
  description: "A share stated as a countable sentence (\"37 in every 100…\"): a waffle grid or a row of icons beside the statement in large type, with the number emphasised.",
  whenToUse: "One proportion that is easier to read as a count of people or units than as a percentage. Round to a small whole first: 1 in 4 with icons, 37 in every 100 with a waffle.",
  avoid: "Several shares side by side (use `bar-chart`, or `waffle-chart` with categories); a precise percentage where the decimals matter (use `big-number`); totals above 100.",
  composes: ["waffle-chart", "icon-stat"],
  props: [
    { name: "value", type: "number", required: true, description: "How many of the whole are counted." },
    { name: "total", type: "number", default: "100", description: "The whole." },
    { name: "figure", type: "string", description: 'The emphasised words. Default: "{value} in every {total}", or "{value} in {total}" up to 20.' },
    { name: "text", type: "string", required: true, description: "The rest of the sentence, read straight after the figure." },
    { name: "visual", type: '"waffle" | "icons"', description: "Grid of cells or row of glyphs. Default: icons up to a total of 20, waffle above." },
    { name: "icon", type: '"circle" | "person" | "square"', default: '"person"', description: "Glyph for the `icons` visual." },
    { name: "shape", type: '"square" | "circle"', default: '"square"', description: "Cell shape for the `waffle` visual." },
    { name: "side", type: '"left" | "right"', default: '"left"', description: "Side the visual sits on; under 520px it goes on top." },
    { name: "detail", type: "string", description: "A second, quieter sentence under the statement." },
    { name: "source", type: "string", description: 'Shown under the statement as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the visual. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "proportion-statement",
    theme: "sunrise",
    value: 33,
    total: 100,
    text: "people in the world have never used the internet.",
    detail: "That was about 2.6 billion people in 2023.",
    source: "ITU Facts and Figures 2023",
    note: "Figures are approximate, for illustration",
  },
});
