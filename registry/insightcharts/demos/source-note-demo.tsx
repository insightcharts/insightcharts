import { SourceNote } from "@/components/insightcharts/atoms/source-note";

export function SourceNoteDemo() {
  return (
    <SourceNote
      sources={[
        { name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" },
        { name: "ENTSO-E Transparency Platform", url: "https://transparency.entsoe.eu" },
      ]}
      note="Figures are approximate, for illustration"
      period="January 2015 to December 2024, monthly"
      method="Generation shares are net of pumped-storage consumption. Figures for 2024 are provisional and exclude Malta and Cyprus."
      credit="Analysis and charts by the data desk"
    />
  );
}
