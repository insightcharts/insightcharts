import { IconArrayGrid } from "@/components/insightcharts/atoms/icon-array-grid";

const data = [
  { district: "Ashby", cars: 118 },
  { district: "Brook End", cars: 104 },
  { district: "Castle Hill", cars: 97 },
  { district: "Dockside", cars: 41 },
  { district: "Eastfield", cars: 88 },
  { district: "Fairmile", cars: 126 },
  { district: "Greenway", cars: 73 },
  { district: "Hollins", cars: 110 },
  { district: "Old Town", cars: 36 },
  { district: "Priory", cars: 92 },
  { district: "Riverside", cars: 58 },
  { district: "Station Quarter", cars: 29 },
];

export function IconArrayGridDemo() {
  return (
    <IconArrayGrid
      theme="sunrise"
      data={data}
      name="district"
      value="cars"
      icon="car"
      unitLabel="1 car per 100 households"
      columns={4}
      title="Fairmile had 126 cars per 100 households in 2025"
      subtitle="Cars per 100 households in 12 districts of Port Aldwin, 2025"
      source="Illustrative data"
      note="Invented figures for a fictional city"
    />
  );
}
