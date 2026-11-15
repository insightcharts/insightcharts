import { ChoroplethMap } from "@/components/insightcharts/atoms/choropleth-map";

const data = [
  { state: "Queensland", share: 45 },
  { state: "South Australia", share: 47 },
  { state: "Western Australia", share: 39 },
  { state: "New South Wales", share: 31 },
  { state: "Australian Capital Territory", share: 29 },
  { state: "Victoria", share: 26 },
  { state: "Northern Territory", share: 22 },
  { state: "Tasmania", share: 19 },
];

export function ChoroplethMapDemo() {
  return (
    <ChoroplethMap
      theme="earth"
      geo={{
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Western Australia", code: "WA" },
            geometry: { type: "Polygon", coordinates: [[[0, 1], [4, 1], [4, 6], [0, 6], [0, 1]]] },
          },
          {
            type: "Feature",
            properties: { name: "Northern Territory", code: "NT" },
            geometry: {
              type: "Polygon",
              coordinates: [[[4, 3.5], [6.5, 3.5], [6.5, 6.5], [4, 6.5], [4, 3.5]]],
            },
          },
          {
            type: "Feature",
            properties: { name: "South Australia", code: "SA" },
            geometry: { type: "Polygon", coordinates: [[[4, 1], [6.5, 1], [6.5, 3.5], [4, 3.5], [4, 1]]] },
          },
          {
            type: "Feature",
            properties: { name: "Queensland", code: "Qld" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [6.5, 3],
                  [10, 3],
                  [10, 5.2],
                  [8.6, 5.2],
                  [8.6, 7.2],
                  [7.6, 7.2],
                  [7.6, 6.2],
                  [6.5, 6.2],
                  [6.5, 3],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { name: "New South Wales", code: "NSW" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [[6.5, 1.4], [10, 1.4], [10, 3], [6.5, 3], [6.5, 1.4]],
                [[8.7, 1.8], [8.7, 2.4], [9.4, 2.4], [9.4, 1.8], [8.7, 1.8]],
              ],
            },
          },
          {
            type: "Feature",
            properties: { name: "Australian Capital Territory", code: "ACT" },
            geometry: {
              type: "Polygon",
              coordinates: [[[8.7, 1.8], [9.4, 1.8], [9.4, 2.4], [8.7, 2.4], [8.7, 1.8]]],
            },
          },
          {
            type: "Feature",
            properties: { name: "Victoria", code: "Vic" },
            geometry: {
              type: "Polygon",
              coordinates: [[[6.5, 0.3], [9.2, 0.3], [9.2, 1.4], [6.5, 1.4], [6.5, 0.3]]],
            },
          },
          {
            type: "Feature",
            properties: { name: "Tasmania", code: "Tas" },
            geometry: {
              type: "Polygon",
              coordinates: [[[7.6, -1.1], [8.7, -1.1], [8.7, -0.3], [7.6, -0.3], [7.6, -1.1]]],
            },
          },
        ],
      }}
      data={data}
      region="state"
      value="share"
      format="{value}%"
      aspectScale={1}
      labels
      labelProperty="code"
      height={380}
      title="47% of homes in South Australia had rooftop solar in 2023"
      subtitle="Share of dwellings with a solar installation, by state and territory, 2023"
      source="Australian PV Institute"
      note="Approximate figures on a simplified block map"
    />
  );
}
