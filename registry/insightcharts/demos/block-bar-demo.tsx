import { BlockBar } from "@/components/insightcharts/atoms/block-bar";

const data = [
  { year: "2020", tickets: 18400, seats: "41% of seats" },
  { year: "2021", tickets: 22900, seats: "49% of seats" },
  { year: "2022", tickets: 31200, seats: "58% of seats" },
  { year: "2023", tickets: 36800, seats: "64% of seats" },
  { year: "2024", tickets: 41500, seats: "69% of seats" },
  { year: "2025", tickets: 48200, seats: "74% of seats" },
];

export function BlockBarDemo() {
  return (
    <BlockBar
      data={data}
      name="year"
      value="tickets"
      detail="seats"
      format="integer"
      marker={{ after: "2021", label: "Second screen opened" }}
      title="The Portholm Film Festival sold 48,200 tickets in 2025"
      subtitle="Tickets sold per year and share of available seats filled, 2020 to 2025"
      source="Illustrative data"
      note="Invented figures for a fictional festival"
    />
  );
}
