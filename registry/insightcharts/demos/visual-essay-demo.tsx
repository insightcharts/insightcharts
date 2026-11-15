import { VisualEssay } from "@/components/insightcharts/templates/visual-essay";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

export function VisualEssayDemo() {
  return (
    <VisualEssay
      theme="editorial"
      kicker="Energy transition"
      title="Solar supplied 11.1% of EU electricity in 2024, more than coal's 9.8%"
      deck="Solar's share was 2.9% in 2015. Coal's share was 24.6% in 2015."
      byline="By the data desk"
      date="2025-03-14"
      blocks={[
        {
          kind: "prose",
          lead: true,
          text: "Solar supplied **2.9% of the EU's electricity** in 2015. Hydro supplied 11.5%.\n\nIn 2024 solar supplied 11.1%. It was the first full year in which solar generated more electricity than coal.",
        },
        {
          kind: "figure",
          chart: <LineChart
            data={[
              { year: "2015", Solar: 2.9, Coal: 24.6 },
              { year: "2016", Solar: 3, Coal: 22 },
              { year: "2017", Solar: 3.4, Coal: 20.6 },
              { year: "2018", Solar: 3.7, Coal: 19.2 },
              { year: "2019", Solar: 4.2, Coal: 15 },
              { year: "2020", Solar: 5, Coal: 13 },
              { year: "2021", Solar: 5.4, Coal: 14.7 },
              { year: "2022", Solar: 7, Coal: 15.8 },
              { year: "2023", Solar: 9.1, Coal: 12.3 },
              { year: "2024", Solar: 11.1, Coal: 9.8 },
            ]}
            x="year"
            y={["Solar", "Coal"]}
            format="{value}%"
            zero
            title="Solar's share rose from 2.9% to 11.1% between 2015 and 2024"
            subtitle="Share of EU electricity generation, 2015 to 2024"
            annotations={[{ type: "band", axis: "x", from: "2021", to: "2022", label: "Gas price crisis" }]}
            source="Ember, European Electricity Review 2025"
          />,
        },
        {
          kind: "prose",
          text: "Coal's share was 15.8% in 2022. It fell to 12.3% in 2023 and 9.8% in 2024. Solar's share rose from 7.0% to 11.1% in the same two years.",
        },
        {
          kind: "break",
          step: 1,
          total: 3,
          title: "Solar module prices, 2010 to 2024",
          text: "A module cost $2.00 a watt in 2010. It cost $0.11 a watt in 2024.",
        },
        {
          kind: "callout",
          chart: <LineChart
            data={[
              { year: "2010", usd: 2 },
              { year: "2012", usd: 0.9 },
              { year: "2014", usd: 0.65 },
              { year: "2016", usd: 0.5 },
              { year: "2018", usd: 0.3 },
              { year: "2020", usd: 0.22 },
              { year: "2022", usd: 0.26 },
              { year: "2024", usd: 0.11 },
            ]}
            x="year"
            y="usd"
            format={{ style: "currency", currency: "USD" }}
            zero
            area
            title="Solar module prices fell from $2.00 to $0.11 a watt between 2010 and 2024"
            subtitle="Average price of crystalline silicon solar modules, US dollars per watt"
            source="IRENA and BloombergNEF (rounded)"
          />,
          label: "Rooftop system cost",
          lead: "Modules are now the smaller part of the cost of a rooftop system",
          body: "Mounting, wiring, labour and the grid connection make up most of the cost.",
        },
        {
          kind: "stats",
          variant: "tiles",
          subtitle: "Bars show 2020 to 2024",
          items: [
            {
              variant: "bars",
              series: [137, 165, 205, 272, 338],
              value: 338,
              format: "{value} GW",
              label: "Solar capacity installed in the EU, end of 2024",
              delta: "+66 GW",
              deltaLabel: "in 2024",
            },
            {
              variant: "bars",
              series: [145, 165, 210, 249, 304],
              value: 304,
              format: "{value} TWh",
              label: "Solar generation, 2024",
              delta: 0.22,
              deltaLabel: "vs 2023",
            },
            {
              variant: "bars",
              tone: 1,
              series: [350, 400, 430, 320, 269],
              value: 269,
              format: "{value} TWh",
              label: "Coal generation, 2024",
              delta: -0.16,
              deltaLabel: "vs 2023",
              upIsGood: false,
            },
          ],
        },
        {
          kind: "break",
          step: 2,
          total: 3,
          title: "EU electricity generation by source, 2015 and 2024",
          text: "Scroll to see the shares in 2015 and then in 2024.",
        },
        {
          kind: "scrolly",
          chart: <BarChart
            data={[
              { source: "Nuclear", y2015: 26.5, y2024: 23.7 },
              { source: "Coal", y2015: 24.6, y2024: 9.8 },
              { source: "Gas", y2015: 15.8, y2024: 15.7 },
              { source: "Hydro", y2015: 11.5, y2024: 12.5 },
              { source: "Wind", y2015: 9.3, y2024: 17.4 },
              { source: "Solar", y2015: 2.9, y2024: 11.1 },
            ]}
            x="source"
            y="y2015"
            sort="none"
            orientation="horizontal"
            format="{value}%"
            height={320}
            title="EU electricity generation by source, 2015"
            subtitle="Share of electricity generation"
            source="Ember, European Electricity Review 2025"
            option={{ xAxis: { max: 30 } }}
          />,
          stepHeight: "70vh",
          stickyTop: 16,
          steps: [
            {
              id: "baseline",
              label: "2015",
              content: "In 2015 **nuclear and coal** together supplied 51% of the EU's electricity.",
            },
            {
              id: "coal",
              content: "Coal supplied 24.6% in 2015. It was the second-largest source after nuclear.",
              highlight: "Coal",
            },
            {
              id: "coal-now",
              label: "2024",
              content: "Coal supplied 9.8% in 2024. Plants closed in Germany, Spain and Portugal.",
              highlight: "Coal",
              y: "y2024",
              title: "EU electricity generation by source, 2024",
            },
            {
              id: "solar",
              content: "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015. Wind supplied 17.4% in 2024 and gas 15.7%.",
              highlight: "Solar",
              y: "y2024",
              title: "Solar supplied 11.1% of EU electricity in 2024",
            },
          ],
        },
        {
          kind: "quote",
          quote: "Solar was 1% of Dutch generation in 2015. It was 18% in 2024. We have had to change how we run the grid at midday.",
          attribution: "Marit de Vries",
          role: "Head of system operations at a Dutch grid operator",
        },
        {
          kind: "break",
          step: 3,
          total: 3,
          title: "Solar share by country",
          text: "Greece had the highest share in 2024 at 22.1%. Spain had 21.0%. France had 4.6%.",
        },
        {
          kind: "multiples",
          data: [
            { country: "Greece", year: "2015", share: 7.8 },
            { country: "Greece", year: "2018", share: 8.1 },
            { country: "Greece", year: "2021", share: 10.9 },
            { country: "Greece", year: "2024", share: 22.1 },
            { country: "Spain", year: "2015", share: 4.9 },
            { country: "Spain", year: "2018", share: 4.7 },
            { country: "Spain", year: "2021", share: 9.6 },
            { country: "Spain", year: "2024", share: 21 },
            { country: "Netherlands", year: "2015", share: 1 },
            { country: "Netherlands", year: "2018", share: 3.2 },
            { country: "Netherlands", year: "2021", share: 9.3 },
            { country: "Netherlands", year: "2024", share: 17.9 },
            { country: "Germany", year: "2015", share: 6 },
            { country: "Germany", year: "2018", share: 7.1 },
            { country: "Germany", year: "2021", share: 8.4 },
            { country: "Germany", year: "2024", share: 14.7 },
            { country: "Poland", year: "2015", share: 0 },
            { country: "Poland", year: "2018", share: 0.2 },
            { country: "Poland", year: "2021", share: 2.2 },
            { country: "Poland", year: "2024", share: 10.8 },
            { country: "France", year: "2015", share: 1.3 },
            { country: "France", year: "2018", share: 1.9 },
            { country: "France", year: "2021", share: 2.8 },
            { country: "France", year: "2024", share: 4.6 },
          ],
          facet: "country",
          x: "year",
          y: "share",
          highlight: ["Netherlands", "Poland"],
          format: "{value}%",
          columns: 3,
          title: "Solar's share in the Netherlands rose from 1.0% to 17.9% between 2015 and 2024",
          subtitle: "Solar share of electricity generation, 2015 to 2024, same scale in every panel",
          source: "Ember (country series rounded, illustrative)",
          width: "wide",
        },
        {
          kind: "prose",
          text: "Poland's solar share rose from 0.0% in 2015 to 10.8% in 2024. Retail electricity prices in the Netherlands and Poland rose after 2022. At those prices a rooftop system paid for itself in under seven years without subsidy.\n\nFrance has cheap nuclear power and slow permitting. Its solar share was 4.6% in 2024. Germany's was 14.7%.",
        },
      ]}
      sources={[
        { name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" },
        "IRENA Renewable Power Generation Costs",
        "BloombergNEF",
      ]}
      period="2010 to 2024, annual"
      method="Generation shares are of total net generation in the EU-27. Module prices are annual averages in nominal dollars."
      note="EU totals are approximate, rounded for illustration. Country series and the quotation are illustrative."
      credit="Analysis and charts by the data desk"
    />
  );
}
