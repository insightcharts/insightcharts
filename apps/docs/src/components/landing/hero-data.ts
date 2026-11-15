// The dataset behind the landing page's hero: trips in an invented city, by district, year,
// mode and purpose. Generated from a fixed seed, so server and client draw the same numbers.
// Every figure is illustrative.

export const MODES = ["Metro", "Bus", "Bike", "Walk", "Car", "Ferry"] as const;
export const PURPOSES = ["Work", "School", "Shopping", "Leisure"] as const;
export const YEARS = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"] as const;

export type Mode = (typeof MODES)[number];

export interface District {
  name: string;
  /** Short code printed on the tile. */
  code: string;
  col: number;
  row: number;
  /** On the water: has a ferry pier. */
  coast?: boolean;
}

// A tile grid shaped like a city round a bay. The gaps on the bottom row are water.
export const DISTRICTS: District[] = [
  { name: "Northgate", code: "NG", col: 1, row: 0 },
  { name: "Elmfield", code: "EL", col: 2, row: 0 },
  { name: "Highmoor", code: "HM", col: 3, row: 0 },
  { name: "Ridgeway", code: "RW", col: 4, row: 0 },
  { name: "Westbrook", code: "WB", col: 0, row: 1 },
  { name: "Mill Lane", code: "ML", col: 1, row: 1 },
  { name: "Old Town", code: "OT", col: 2, row: 1 },
  { name: "Cathedral", code: "CA", col: 3, row: 1 },
  { name: "Eastside", code: "ES", col: 4, row: 1 },
  { name: "Fernhill", code: "FH", col: 5, row: 1 },
  { name: "Marsh End", code: "ME", col: 0, row: 2, coast: true },
  { name: "Canal", code: "CN", col: 1, row: 2 },
  { name: "Market", code: "MK", col: 2, row: 2 },
  { name: "Station", code: "ST", col: 3, row: 2 },
  { name: "Park", code: "PK", col: 4, row: 2 },
  { name: "Orchard", code: "OR", col: 5, row: 2 },
  { name: "Docks", code: "DK", col: 1, row: 3, coast: true },
  { name: "Harbour", code: "HB", col: 2, row: 3, coast: true },
  { name: "Riverside", code: "RS", col: 3, row: 3, coast: true },
  { name: "Southbank", code: "SB", col: 4, row: 3, coast: true },
  { name: "Meadow", code: "MD", col: 5, row: 3 },
  { name: "Pier", code: "PR", col: 2, row: 4, coast: true },
  { name: "Lighthouse", code: "LH", col: 4, row: 4, coast: true },
  { name: "Sands", code: "SA", col: 5, row: 4, coast: true },
];

export interface TripRow {
  district: string;
  year: string;
  mode: Mode;
  purpose: string;
  /** Million trips in the year. */
  trips: number;
  /** Residents of the district, thousands. */
  residents: number;
  /** The row's trips per resident per year, averaged over the eight years. Sums to the district's rate. */
  rate: number;
  [key: string]: unknown;
}

/** mulberry32: a small seeded generator, so the data never changes between renders. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// What each mode is used for: work, school, shopping, leisure.
const PURPOSE_MIX: Record<Mode, number[]> = {
  Metro: [0.55, 0.12, 0.13, 0.2],
  Bus: [0.34, 0.28, 0.2, 0.18],
  Bike: [0.4, 0.14, 0.14, 0.32],
  Walk: [0.16, 0.22, 0.3, 0.32],
  Car: [0.38, 0.08, 0.3, 0.24],
  Ferry: [0.3, 0.04, 0.1, 0.56],
};

// How each mode's use changed from the first year (t = 0) to the last (t = 1).
const TREND: Record<Mode, (t: number) => number> = {
  Metro: (t) => 1 + 0.22 * t,
  Bus: (t) => 1 - 0.1 * t,
  Bike: (t) => 1 + 1.2 * t * t + 0.5 * t,
  Walk: (t) => 1 + 0.18 * t,
  Car: (t) => 1 - 0.34 * t,
  Ferry: (t) => 1 + 0.6 * t,
};

// 2020 and 2021: fewer shared rides, more bikes and walks.
const SHOCK: Record<string, Partial<Record<Mode, number>>> = {
  "2020": { Metro: 0.58, Bus: 0.64, Ferry: 0.5, Car: 0.86, Bike: 1.18, Walk: 1.12 },
  "2021": { Metro: 0.8, Bus: 0.84, Ferry: 0.78, Car: 0.95, Bike: 1.1, Walk: 1.06 },
};

function build(): TripRow[] {
  const rand = seeded(20260214);
  const rows: TripRow[] = [];
  for (const d of DISTRICTS) {
    // 1 at the two central districts, falling towards the edge of the city.
    const central = Math.max(0, 1 - Math.hypot(d.col - 2.5, d.row - 2) / 3.2);
    const residents = Math.round(20 + rand() * 14 + central * 30);
    const base: Record<Mode, number> = {
      Metro: 0.1 + 0.2 * central,
      Bus: 0.17 + 0.03 * rand(),
      Bike: 0.05 + 0.07 * central + 0.03 * rand(),
      Walk: 0.07 + 0.15 * central,
      Car: 0.46 - 0.33 * central,
      Ferry: d.coast ? 0.05 + 0.06 * rand() : 0.004,
    };
    const lean = Object.fromEntries(MODES.map((m) => [m, 0.85 + rand() * 0.3])) as Record<Mode, number>;
    YEARS.forEach((year, yi) => {
      const t = yi / (YEARS.length - 1);
      for (const mode of MODES) {
        const level = residents * 0.92 * base[mode] * lean[mode] * TREND[mode](t) * (SHOCK[year]?.[mode] ?? 1) * (0.96 + rand() * 0.08);
        PURPOSES.forEach((purpose, pi) => {
          const value = Math.max(0.01, Math.round(level * PURPOSE_MIX[mode][pi] * (0.93 + rand() * 0.14) * 100) / 100);
          rows.push({ district: d.name, year, mode, purpose, residents, trips: value, rate: (value * 1000) / residents / YEARS.length });
        });
      }
    });
  }
  return rows;
}

/** One row per district, year, mode and purpose: 4,608 rows. */
export const trips: TripRow[] = build();

/** The districts as square tiles, in the GeoJSON form the choropleth map takes. */
export const districtTiles = {
  type: "FeatureCollection" as const,
  features: DISTRICTS.map((d) => {
    const x = d.col;
    const y = 4 - d.row;
    const g = 0.035;
    return {
      type: "Feature" as const,
      properties: { name: d.name, code: d.code },
      geometry: { type: "Polygon" as const, coordinates: [[[x + g, y + g], [x + 1 - g, y + g], [x + 1 - g, y + 1 - g], [x + g, y + 1 - g], [x + g, y + g]]] },
    };
  }),
};
