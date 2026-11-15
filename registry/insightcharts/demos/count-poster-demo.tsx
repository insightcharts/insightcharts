import { CountPoster } from "@/components/insightcharts/templates/count-poster";

export function CountPosterDemo() {
  return (
    <CountPoster
      theme="noir"
      kicker="Education"
      title="Norland's schools taught 1.84 million pupils in 2025"
      subtitle="Pupils enrolled in state schools by stage, autumn term 2025."
      unit={1000}
      unitLabel="1,000 people"
      icon="person"
      hero={{
        data: [
          { stage: "Primary", pupils: 820000 },
          { stage: "Lower secondary", pupils: 460000 },
          { stage: "Upper secondary", pupils: 390000 },
          { stage: "Vocational", pupils: 170000 },
        ],
        name: "stage",
        value: "pupils",
        title: "820,000 pupils were in primary school",
      }}
      reference={{
        data: [
          { group: "Teachers", people: 142000 },
          { group: "Support staff", people: 61000 },
          { group: "Pupils who left without a certificate", people: 38000 },
        ],
        name: "group",
        value: "people",
        title: "142,000 teachers taught them",
      }}
      area={{
        data: [
          { school: "Largest secondary school", pupils: 3640 },
          { school: "Median primary school", pupils: 280 },
        ],
        name: "school",
        value: "pupils",
        title: "The largest school had 3,640 pupils",
      }}
      bars={{
        data: [
          { year: "2000", m: 1.42 },
          { year: "2005", m: 1.51 },
          { year: "2010", m: 1.6 },
          { year: "2015", m: 1.69 },
          { year: "2020", m: 1.77 },
          { year: "2025", m: 1.84 },
        ],
        name: "year",
        value: "m",
        format: "{value}m",
        title: "Enrolment was 1.42 million in 2000",
      }}
      shares={{
        data: [
          { year: "2013", share: 6 },
          { year: "2017", share: 19 },
          { year: "2021", share: 44 },
          { year: "2025", share: 68 },
        ],
        name: "year",
        value: "share",
        highlight: "2025",
        wholeLabel: "All pupils",
        title: "68% of pupils had a school laptop in 2025",
      }}
      sources="Norland Ministry of Education, school census 2025"
      note="Norland is an invented country. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
