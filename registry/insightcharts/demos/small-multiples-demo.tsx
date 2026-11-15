import { SmallMultiples } from "@/components/insightcharts/atoms/small-multiples";

const data = [
  { country: "Germany", year: "2010", rate: 6.8 },
  { country: "Germany", year: "2013", rate: 5 },
  { country: "Germany", year: "2015", rate: 4.6 },
  { country: "Germany", year: "2017", rate: 3.8 },
  { country: "Germany", year: "2019", rate: 3.1 },
  { country: "Germany", year: "2021", rate: 3.6 },
  { country: "Germany", year: "2023", rate: 3 },
  { country: "Germany", year: "2024", rate: 3.4 },
  { country: "Spain", year: "2010", rate: 19.9 },
  { country: "Spain", year: "2013", rate: 26.1 },
  { country: "Spain", year: "2015", rate: 22.1 },
  { country: "Spain", year: "2017", rate: 17.2 },
  { country: "Spain", year: "2019", rate: 14.1 },
  { country: "Spain", year: "2021", rate: 14.8 },
  { country: "Spain", year: "2023", rate: 12.2 },
  { country: "Spain", year: "2024", rate: 11.4 },
  { country: "Italy", year: "2010", rate: 8.4 },
  { country: "Italy", year: "2013", rate: 12.1 },
  { country: "Italy", year: "2015", rate: 11.9 },
  { country: "Italy", year: "2017", rate: 11.2 },
  { country: "Italy", year: "2019", rate: 9.9 },
  { country: "Italy", year: "2021", rate: 9.5 },
  { country: "Italy", year: "2023", rate: 7.7 },
  { country: "Italy", year: "2024", rate: 6.5 },
  { country: "France", year: "2010", rate: 9.3 },
  { country: "France", year: "2013", rate: 10.3 },
  { country: "France", year: "2015", rate: 10.4 },
  { country: "France", year: "2017", rate: 9.4 },
  { country: "France", year: "2019", rate: 8.4 },
  { country: "France", year: "2021", rate: 7.9 },
  { country: "France", year: "2023", rate: 7.3 },
  { country: "France", year: "2024", rate: 7.4 },
  { country: "Greece", year: "2010", rate: 12.7 },
  { country: "Greece", year: "2013", rate: 27.5 },
  { country: "Greece", year: "2015", rate: 24.9 },
  { country: "Greece", year: "2017", rate: 21.5 },
  { country: "Greece", year: "2019", rate: 17.3 },
  { country: "Greece", year: "2021", rate: 14.7 },
  { country: "Greece", year: "2023", rate: 11.1 },
  { country: "Greece", year: "2024", rate: 10.1 },
  { country: "Poland", year: "2010", rate: 9.7 },
  { country: "Poland", year: "2013", rate: 10.3 },
  { country: "Poland", year: "2015", rate: 7.5 },
  { country: "Poland", year: "2017", rate: 4.9 },
  { country: "Poland", year: "2019", rate: 3.3 },
  { country: "Poland", year: "2021", rate: 3.4 },
  { country: "Poland", year: "2023", rate: 2.8 },
  { country: "Poland", year: "2024", rate: 2.9 },
];

export function SmallMultiplesDemo() {
  return (
    <SmallMultiples
      data={data}
      facet="country"
      x="year"
      y="rate"
      highlight="Greece"
      format="{value}%"
      title="Greek unemployment fell from 27.5% in 2013 to 10.1% in 2024"
      subtitle="Unemployment rate, 2010 to 2024, same scale in every panel"
      source="Eurostat (rounded)"
      note="Figures are approximate, for illustration"
    />
  );
}
