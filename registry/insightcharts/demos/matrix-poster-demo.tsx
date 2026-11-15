import { MatrixPoster } from "@/components/insightcharts/templates/matrix-poster";

export function MatrixPosterDemo() {
  return (
    <MatrixPoster
      theme="paper"
      kicker="Cities"
      title="A one-bedroom flat in Avenmouth rented for €1,640 a month in 2025"
      subtitle="Eight cities of Norland compared on rent, pay and five measures of daily life, 2025."
      rows={[
        {
          city: "Avenmouth",
          rent: 1640,
          pay: 3900,
          transit: 38,
          parks: 14,
          lanes: 212,
          cafes: 23,
          sun: 148,
        },
        {
          city: "Brackley Bay",
          rent: 1480,
          pay: 3300,
          transit: 22,
          parks: 9,
          lanes: 96,
          cafes: 17,
          sun: 201,
        },
        {
          city: "Castren",
          rent: 1310,
          pay: 3600,
          transit: 41,
          parks: 17,
          lanes: 184,
          cafes: 19,
          sun: 132,
        },
        {
          city: "Dunmore",
          rent: 1150,
          pay: 2900,
          transit: 27,
          parks: 11,
          lanes: 120,
          cafes: 12,
          sun: 165,
        },
        {
          city: "Eastwick",
          rent: 980,
          pay: 3100,
          transit: 33,
          parks: 21,
          lanes: 240,
          cafes: 15,
          sun: 121,
        },
        {
          city: "Fenhallow",
          rent: 860,
          pay: 2500,
          transit: 18,
          parks: 8,
          lanes: 54,
          cafes: 9,
          sun: 176,
        },
        {
          city: "Greyport",
          rent: 740,
          pay: 2700,
          transit: 24,
          parks: 12,
          lanes: 88,
          cafes: 11,
          sun: 190,
        },
        {
          city: "Hallin",
          rent: 610,
          pay: 2200,
          transit: 12,
          parks: 6,
          lanes: 31,
          cafes: 7,
          sun: 210,
        },
      ]}
      name="city"
      nameLabel="City"
      curve={{
        left: "rent",
        right: "pay",
        leftLabel: "Rent, € a month",
        rightLabel: "Median pay, € a month",
        format: "integer",
        title: "Median pay in Avenmouth was €3,900 a month",
      }}
      columns={[
        { field: "transit", label: "Trips by public transport", glyph: "ring", format: "{value}%" },
        { field: "parks", label: "Parks per 100,000 people", glyph: "dots" },
        { field: "lanes", label: "Cycle lanes, km", glyph: "bar" },
        { field: "cafes", label: "Cafés per 10,000 people", glyph: "blocks" },
        { field: "sun", label: "Sunny days a year", glyph: "circle" },
      ]}
      table={{ title: "Eastwick had 240 km of cycle lanes" }}
      sources="Norland Statistics Office, city indicators 2025"
      note="Norland and its cities are invented. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
