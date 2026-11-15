import { GlyphTable } from "@/components/insightcharts/atoms/glyph-table";

export function GlyphTableDemo() {
  return (
    <GlyphTable
      theme="noir"
      caption="Filter coffee sold 310 cups a day at £2.40 a cup"
      subtitle="Six drinks at one café: price, cups sold per day, share ordered with oat milk, seconds to prepare and caffeine"
      note="Illustrative figures."
      name="drink"
      nameLabel="Drink"
      columns={[
        {
          field: "price",
          label: "Price per cup",
          glyph: "bar",
          format: { style: "currency", currency: "GBP" },
          max: 5,
        },
        { field: "cups", label: "Cups sold a day", glyph: "dots", unit: 10 },
        { field: "oat", label: "With oat milk", glyph: "ring", format: "{value}%" },
        { field: "seconds", label: "Seconds to prepare", glyph: "blocks", unit: 10 },
        { field: "caffeine", label: "Caffeine, mg", glyph: "circle" },
      ]}
      rows={[
        { drink: "Filter coffee", price: 2.4, cups: 310, oat: 8, seconds: 15, caffeine: 140 },
        { drink: "Espresso", price: 2.6, cups: 145, oat: null, seconds: 30, caffeine: 65 },
        { drink: "Flat white", price: 3.6, cups: 260, oat: 34, seconds: 95, caffeine: 130 },
        { drink: "Iced latte", price: 4.2, cups: 180, oat: 41, seconds: 70, caffeine: 130 },
        { drink: "Matcha latte", price: 4.8, cups: 75, oat: 57, seconds: 110, caffeine: 70 },
        { drink: "Hot chocolate", price: 3.9, cups: 40, oat: 22, seconds: 85, caffeine: 10 },
      ]}
    />
  );
}
