import { ScalePoster } from "@/components/insightcharts/templates/scale-poster";

export function ScalePosterDemo() {
  return (
    <ScalePoster
      theme="ocean"
      kicker="Oceans"
      title="The Meridian Deep survey logged 12 sightings between 8 m and 3,750 m"
      subtitle="Depth of each sighting on one research dive, metres below the surface."
      scale={{
        data: [
          { sighting: "Survey ship hull", m: 8, icon: "ship" },
          { sighting: "Kelp canopy", m: 120, icon: "leaf" },
          { sighting: "Sardine shoal", m: 310, icon: "fish" },
          { sighting: "Lanternfish layer", m: 560, icon: "fish" },
          { sighting: "Swordfish", m: 820, icon: "fish" },
          { sighting: "Coral mound", m: 1150, icon: "tree" },
          { sighting: "Sperm whale", m: 1480, icon: "wave" },
          { sighting: "Anglerfish", m: 1900, icon: "fish" },
          { sighting: "Sensor array", m: 2300, icon: "satellite" },
          { sighting: "Dumbo octopus", m: 2750, icon: "star" },
          { sighting: "Sea cucumbers", m: 3200, icon: "circle" },
          { sighting: "Seabed lander", m: 3750, icon: "pin" },
        ],
        name: "sighting",
        value: "m",
        iconField: "icon",
        direction: "down",
        min: 0,
        max: 4000,
        format: "{value} m",
        scaleLabel: "Depth, metres",
        zones: [
          { from: 0, to: 200, label: "Sunlit" },
          { from: 200, to: 1000, label: "Twilight zone" },
          { from: 1000, to: 4000, label: "Dark zone" },
        ],
      }}
      figures={[
        { at: 200, value: "1%", label: "of surface light is left" },
        { at: 1000, value: "4°C", label: "water temperature" },
        { at: 3000, value: "376 atm", label: "pressure at the lander, 3,750 m down" },
      ]}
      side={{
        data: [
          { zone: "species in the sunlit zone", species: 148 },
          { zone: "species in the twilight zone", species: 61 },
          { zone: "species in the dark zone", species: 23 },
        ],
        name: "zone",
        value: "species",
        title: "Species logged",
        height: 250,
      }}
      sideAt={1900}
      sources="Meridian Deep survey log"
      note="The Meridian Deep survey is invented. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
