import { ProfilePoster } from "@/components/insightcharts/templates/profile-poster";

export function ProfilePosterDemo() {
  return (
    <ProfilePoster
      theme="blueprint"
      kicker="Public transport"
      title="The Line 9 electric bus ended a working day with 34% of its charge"
      subtitle="One 12-metre battery bus on Marlow's Line 9, average of 60 working days in 2025."
      portrait={{
        data: [{ state: "Charge left at 23:00", charge: 34 }],
        name: "state",
        value: "charge",
        icon: "bus",
        title: "Charge left at the end of the day",
      }}
      figures={[
        { value: "204 km", label: "driven on a working day" },
        { value: "310 km", label: "of range on a full charge" },
        { value: "4 h", label: "to recharge overnight at the depot" },
      ]}
      scale={{
        data: [
          { vehicle: "Electric scooter", km: 35, icon: "bolt" },
          { vehicle: "Electric bike", km: 70, icon: "bike" },
          { vehicle: "Delivery van", km: 210, icon: "truck" },
          { vehicle: "Line 9 bus", km: 310, icon: "bus" },
          { vehicle: "Family car", km: 420, icon: "car" },
          { vehicle: "Long-haul truck", km: 520, icon: "truck" },
        ],
        name: "vehicle",
        value: "km",
        iconField: "icon",
        min: 0,
        max: 600,
        format: "{value} km",
        scaleLabel: "Range, km",
        highlight: "Line 9 bus",
        title: "Range of six electric vehicles",
      }}
      table={{
        rows: [
          { vehicle: "Line 9 bus", seats: 41, cost: 0.21, co2: 14, noise: 62 },
          { vehicle: "Diesel bus", seats: 43, cost: 0.58, co2: 71, noise: 78 },
          { vehicle: "Tram", seats: 64, cost: 0.17, co2: 9, noise: 70 },
        ],
        name: "vehicle",
        nameLabel: "Vehicle",
        highlight: "Line 9 bus",
        title: "The Line 9 bus emitted 14 g of CO2 per passenger-kilometre",
        columns: [
          { field: "seats", label: "Seats", glyph: "icons", icon: "person", unit: 5 },
          { field: "cost", label: "Energy cost per km", glyph: "bar", format: "€{value}", max: 0.6 },
          { field: "co2", label: "CO2 per passenger-km", glyph: "circle", format: "{value} g" },
          { field: "noise", label: "Noise at 10 m", glyph: "bar", format: "{value} dB", max: 80 },
        ],
      }}
      sources="Marlow Transit depot telemetry, 2025"
      note="Marlow Transit and the Line 9 bus are invented. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
