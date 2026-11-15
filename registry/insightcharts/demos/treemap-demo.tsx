import { Treemap } from "@/components/insightcharts/atoms/treemap";

const data = [
  { sector: "Energy", source: "Electricity and heat", gt: 15.8 },
  { sector: "Energy", source: "Transport", gt: 8.4 },
  { sector: "Energy", source: "Manufacturing and construction", gt: 6.3 },
  { sector: "Energy", source: "Buildings", gt: 3 },
  { sector: "Energy", source: "Fugitive emissions", gt: 3.3 },
  { sector: "Agriculture", source: "Livestock and manure", gt: 3.5 },
  { sector: "Agriculture", source: "Soils and rice", gt: 2.4 },
  { sector: "Industry", source: "Cement", gt: 1.6 },
  { sector: "Industry", source: "Chemicals and other", gt: 1.6 },
  { sector: "Waste", source: "Landfill and wastewater", gt: 1.7 },
  { sector: "Land use", source: "Deforestation and land-use change", gt: 1.4 },
];

export function TreemapDemo() {
  return (
    <Treemap
      theme="paper"
      data={data}
      group="sector"
      name="source"
      value="gt"
      format="{value} Gt"
      title="Energy produced 75% of global greenhouse gas emissions in 2021"
      subtitle="Global emissions by sector and source, billion tonnes of CO2 equivalent, 2021"
      source="Climate Watch, World Resources Institute"
      note="Rounded, approximate figures for illustration"
    />
  );
}
