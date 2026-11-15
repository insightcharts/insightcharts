import { CurveRank } from "@/components/insightcharts/atoms/curve-rank";

const data = [
  { drink: "Filter coffee", price: 2.4, cups: 310 },
  { drink: "Espresso", price: 2.6, cups: 145 },
  { drink: "Flat white", price: 3.6, cups: 260 },
  { drink: "Iced latte", price: 4.2, cups: 180 },
  { drink: "Matcha latte", price: 4.8, cups: 75 },
  { drink: "Hot chocolate", price: 3.9, cups: 40 },
];

export function CurveRankDemo() {
  return (
    <CurveRank
      theme="blueprint"
      data={data}
      name="drink"
      left="price"
      right="cups"
      leftLabel="Price per cup"
      rightLabel="Cups sold a day"
      leftFormat={{ style: "currency", currency: "GBP" }}
      leftTop="low"
      title="Filter coffee sold 310 cups a day at £2.40 a cup"
      subtitle="Price per cup and cups sold per day for six drinks at one café, cheapest at the top"
      note="Illustrative figures."
    />
  );
}
