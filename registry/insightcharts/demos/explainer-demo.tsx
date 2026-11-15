import { Explainer } from "@/components/insightcharts/templates/explainer";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";
import { IconStat } from "@/components/insightcharts/atoms/icon-stat";

export function ExplainerDemo() {
  return (
    <Explainer
      kicker="Food and climate"
      title="Households threw away 631 million tonnes of food in 2022"
      deck="That is 60% of the 1.05 billion tonnes of food wasted worldwide. Food service wasted 290 million tonnes and retail 131 million."
      hook={{
        value: 19,
        total: 100,
        text: "tonnes of food that reach shops, restaurants and homes are thrown away.",
        detail: "That was 1.05 billion tonnes in 2022.",
      }}
      hero={<BarChart
        data={[
          { sector: "Households", mt: 631 },
          { sector: "Food service", mt: 290 },
          { sector: "Retail", mt: 131 },
        ]}
        x="sector"
        y="mt"
        sort="none"
        orientation="horizontal"
        highlight="Households"
        format="{value} Mt"
        title="Households produced 60% of the world's food waste in 2022"
        subtitle="Food waste by sector, million tonnes (Mt), 2022"
        source="UNEP Food Waste Index Report 2024"
        note="Figures are approximate, for illustration"
      />}
      heroText="Food service produced 290 million tonnes, or 28%. Retail produced 131 million tonnes, or 12%."
      sections={[
        {
          title: "Household food waste by income group",
          text: "Households in high-income countries waste 81 kg of food per person a year. In upper-middle-income countries the figure is 88 kg. In lower-middle-income countries it is 86 kg.",
          exhibit: <BarChart
            data={[
              { group: "High income", kg: 81 },
              { group: "Upper-middle", kg: 88 },
              { group: "Lower-middle", kg: 86 },
            ]}
            x="group"
            y="kg"
            sort="none"
            orientation="horizontal"
            format="{value} kg"
            subtitle="Household food waste per person per year, by country income group"
          />,
          takeaway: "The three income groups are within 7 kg per person of each other.",
        },
        {
          title: "Lost and wasted food causes 4.4 billion tonnes of emissions a year",
          text: "Growing, transporting and chilling food uses land, fertiliser and fuel. Food releases methane when it rots. Lost and wasted food causes 8 to 10% of global greenhouse gas emissions.",
          exhibit: <BarChart
            data={[
              { emitter: "China", gt: 13 },
              { emitter: "United States", gt: 6 },
              { emitter: "Wasted food", gt: 4.4 },
              { emitter: "India", gt: 3.9 },
              { emitter: "European Union", gt: 3.4 },
            ]}
            x="emitter"
            y="gt"
            sort="desc"
            orientation="horizontal"
            highlight="Wasted food"
            format="{value} Gt"
            subtitle="Annual greenhouse gas emissions, billion tonnes of CO2 equivalent. Wasted food includes losses before retail"
          />,
          takeaway: "Only China and the United States emit more than lost and wasted food.",
        },
        {
          title: "733 million people faced hunger in 2023",
          exhibit: <IconStat
            icon="person"
            count={1}
            total={11}
            columns={11}
            text="people in the world faced hunger in 2023."
          />,
        },
      ]}
      conclusion={{
        title: "The UN target is to halve food waste by 2030",
        text: "Britain and Japan publish household food waste figures. Britain has cut household waste by 18% and Japan by 31%.",
        points: [
          "Measure household food waste and publish the figure every year.",
          "State on packaging that “best before” refers to quality and “use by” refers to safety.",
          "Plan meals before shopping and freeze food that will not be eaten in time.",
        ],
        action: {
          label: "Read the UNEP report",
          href: "https://www.unep.org/resources/publication/food-waste-index-report-2024",
        },
      }}
      sources={[
        {
          name: "UNEP Food Waste Index Report 2024",
          url: "https://www.unep.org/resources/publication/food-waste-index-report-2024",
        },
        "FAO, State of Food Security and Nutrition in the World 2024",
        "Emissions figures rounded from national inventories",
      ]}
      note="Figures are approximate, for illustration"
      period="2022 (waste), 2023 (hunger and emissions)"
      method="Food waste is measured at retail, food service and household level and includes inedible parts. Losses on farms and in transport are counted separately."
    />
  );
}
