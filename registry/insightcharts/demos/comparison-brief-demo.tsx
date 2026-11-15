import { ComparisonBrief } from "@/components/insightcharts/templates/comparison-brief";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";
import { SegmentedBar } from "@/components/insightcharts/atoms/segmented-bar";

export function ComparisonBriefDemo() {
  return (
    <ComparisonBrief
      theme="earth"
      kicker="Home heating"
      title="With the £7,500 grant, a heat pump repays its extra £500 cost in 4 years"
      deck="After the grant a heat pump costs £3,500 to buy and fit. A gas boiler costs £3,000. The heat pump costs £855 a year to run. The boiler costs £980."
      a={{ name: "Heat pump", detail: "Air source, 7 kW" }}
      b={{ name: "Gas boiler", detail: "Condensing combi, 30 kW" }}
      figures={[
        {
          label: "Cost to buy and fit, after grant",
          a: 3500,
          b: 3000,
          format: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
          better: "lower",
        },
        { label: "Running cost per year", a: 855, b: 980, format: "currency:GBP", better: "lower" },
        { label: "CO2 per year, tonnes", a: 0.6, b: 2.3, format: "decimal:1", better: "lower" },
        {
          label: "Heat out per unit of energy in",
          a: 3.2,
          b: 0.9,
          format: "decimal:1",
          better: "higher",
        },
        { label: "Expected life, years", a: 20, b: 15, better: "higher" },
      ]}
      hero={<LineChart
        data={[
          { year: "0", saving: -500 },
          { year: "1", saving: -375 },
          { year: "2", saving: -250 },
          { year: "3", saving: -125 },
          { year: "4", saving: 0 },
          { year: "5", saving: 125 },
          { year: "6", saving: 250 },
          { year: "7", saving: 375 },
          { year: "8", saving: 500 },
          { year: "9", saving: 625 },
          { year: "10", saving: 750 },
          { year: "11", saving: 875 },
          { year: "12", saving: 1000 },
          { year: "13", saving: 1125 },
          { year: "14", saving: 1250 },
          { year: "15", saving: 1375 },
        ]}
        x="year"
        y="saving"
        format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0, signDisplay: "exceptZero" }}
        area
        title="After 15 years the heat pump has cost £1,375 less than the boiler"
        subtitle="Cumulative saving of a heat pump over a gas boiler in pounds, by years since installation. Includes purchase after the £7,500 grant, energy and servicing"
        annotations={[
          {
            type: "line",
            axis: "y",
            value: 0,
            label: "Same cost as the boiler",
            dashed: false,
            emphasis: true,
          },
          { type: "point", x: "4", y: 0, label: "Break-even", position: "top" },
        ]}
      />}
      heroText="Without the grant the heat pump costs £11,000 to buy and fit. That is £8,000 more than the boiler. A saving of £125 a year would take 64 years to repay it."
      pairs={[
        {
          title: "The January energy bill is £120 for the heat pump and £139 for the boiler",
          text: "Estimated monthly energy cost for heating and hot water. Both charts use the same scale. The heat pump's bill is lower in all 12 months.",
          a: <BarChart
            data={[
              { month: "Jan", cost: 120 },
              { month: "Feb", cost: 108 },
              { month: "Mar", cost: 86 },
              { month: "Apr", cost: 57 },
              { month: "May", cost: 34 },
              { month: "Jun", cost: 24 },
              { month: "Jul", cost: 21 },
              { month: "Aug", cost: 22 },
              { month: "Sep", cost: 32 },
              { month: "Oct", cost: 56 },
              { month: "Nov", cost: 83 },
              { month: "Dec", cost: 112 },
            ]}
            x="month"
            y="cost"
            orientation="vertical"
            sort="none"
            labels={false}
            format="currency:GBP"
            height={200}
            option={{ yAxis: { max: 140 } }}
          />,
          b: <BarChart
            data={[
              { month: "Jan", cost: 139 },
              { month: "Feb", cost: 124 },
              { month: "Mar", cost: 101 },
              { month: "Apr", cost: 69 },
              { month: "May", cost: 43 },
              { month: "Jun", cost: 33 },
              { month: "Jul", cost: 30 },
              { month: "Aug", cost: 31 },
              { month: "Sep", cost: 41 },
              { month: "Oct", cost: 65 },
              { month: "Nov", cost: 94 },
              { month: "Dec", cost: 130 },
            ]}
            x="month"
            y="cost"
            orientation="vertical"
            sort="none"
            labels={false}
            format="currency:GBP"
            height={200}
            highlight="none"
            option={{ yAxis: { max: 140 } }}
          />,
        },
        {
          title: "Cost over 15 years by part",
          text: "Energy is £11,325 of the heat pump's £16,325. It is £13,500 of the boiler's £17,700.",
          a: <SegmentedBar
            data={[
              { part: "Purchase and fitting", gbp: 3500 },
              { part: "Energy", gbp: 11325 },
              { part: "Servicing", gbp: 1500 },
            ]}
            name="part"
            value="gbp"
            format="currency:GBP"
          />,
          b: <SegmentedBar
            data={[
              { part: "Purchase and fitting", gbp: 3000 },
              { part: "Energy", gbp: 13500 },
              { part: "Servicing", gbp: 1200 },
            ]}
            name="part"
            value="gbp"
            format="currency:GBP"
          />,
        },
      ]}
      verdict={{
        lead: "Choose the heat pump if you get the grant and will stay at least 5 years",
        body: "Without the grant the boiler is cheaper. The figures assume electricity and gas prices stay at their Q4 2024 levels.",
      }}
      sources={["Energy regulator price cap, Q4 2024", "Installer quotes collected by the author"]}
      method="A house using 11,500 kWh of heat a year. Heat pump seasonal efficiency is 3.2. Boiler efficiency is 90%. Prices held flat in real terms."
      note="Illustrative data"
    />
  );
}
