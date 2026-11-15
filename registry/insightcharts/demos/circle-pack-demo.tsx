import { CirclePack } from "@/components/insightcharts/atoms/circle-pack";

const data = [
  { crop: "Maize", group: "Cereals", mt: 1160 },
  { crop: "Wheat", group: "Cereals", mt: 780 },
  { crop: "Rice", group: "Cereals", mt: 790 },
  { crop: "Barley", group: "Cereals", mt: 150 },
  { crop: "Sorghum", group: "Cereals", mt: 60 },
  { crop: "Potatoes", group: "Roots", mt: 375 },
  { crop: "Cassava", group: "Roots", mt: 330 },
  { crop: "Sweet potatoes", group: "Roots", mt: 90 },
  { crop: "Yams", group: "Roots", mt: 85 },
  { crop: "Soybeans", group: "Oil crops", mt: 350 },
  { crop: "Oil palm fruit", group: "Oil crops", mt: 420 },
  { crop: "Rapeseed", group: "Oil crops", mt: 87 },
  { crop: "Sunflower seed", group: "Oil crops", mt: 54 },
];

export function CirclePackDemo() {
  return (
    <CirclePack
      data={data}
      name="crop"
      value="mt"
      group="group"
      format="{value} Mt"
      title="The world harvested 1,160 million tonnes of maize in 2022"
      subtitle="Harvest of 13 major crops by group, million tonnes, 2022"
      source="FAOSTAT"
      note="Rounded, approximate figures for illustration"
    />
  );
}
