import { PillRank } from "@/components/insightcharts/atoms/pill-rank";

const data = [
  { river: "Nile", km: 6650 },
  { river: "Amazon", km: 6400 },
  { river: "Yangtze", km: 6300 },
  { river: "Mississippi-Missouri", km: 6275 },
  { river: "Yenisei", km: 5539 },
  { river: "Yellow River", km: 5464 },
  { river: "Ob-Irtysh", km: 5410 },
  { river: "Congo", km: 4700 },
  { river: "Danube", km: 2850 },
  { river: "Rhine", km: 1230 },
];

export function PillRankDemo() {
  return (
    <PillRank
      theme="paper"
      data={data}
      name="river"
      value="km"
      format="{value} km"
      highlight="Congo"
      compare={["Danube", "Rhine"]}
      compareLabel="Europe, for comparison"
      title="The Congo is 4,700 km long"
      subtitle="Length of eight major river systems and two European rivers, kilometres"
      source="Encyclopaedia Britannica"
      note="Lengths of river systems are approximate and vary by source"
    />
  );
}
