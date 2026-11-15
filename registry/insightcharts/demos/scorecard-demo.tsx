import { Scorecard } from "@/components/insightcharts/templates/scorecard";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

export function ScorecardDemo() {
  return (
    <Scorecard
      theme="noir"
      kicker="Online store scorecard"
      reportPeriod="October 2024"
      title="Orders rose 12% in October to 24,900"
      deck="The return rate was 11.4%. It was 8.4% in July, the month before free returns launched. Outerwear had the highest return rate at 19.2%."
      kpis={{
        data: [
          {
            month: "2023-11-01",
            orders: 18200,
            conversion: 2.61,
            aov: 64.1,
            returns: 8.1,
            outerwear: 13,
          },
          {
            month: "2023-12-01",
            orders: 26900,
            conversion: 3.02,
            aov: 66.8,
            returns: 8.4,
            outerwear: 13.2,
          },
          {
            month: "2024-01-01",
            orders: 17100,
            conversion: 2.55,
            aov: 63,
            returns: 9,
            outerwear: 13.6,
          },
          {
            month: "2024-02-01",
            orders: 16400,
            conversion: 2.58,
            aov: 62.4,
            returns: 8.2,
            outerwear: 13.1,
          },
          {
            month: "2024-03-01",
            orders: 17900,
            conversion: 2.66,
            aov: 62.9,
            returns: 8,
            outerwear: 12.9,
          },
          {
            month: "2024-04-01",
            orders: 18800,
            conversion: 2.71,
            aov: 62.2,
            returns: 7.9,
            outerwear: 13.3,
          },
          {
            month: "2024-05-01",
            orders: 19600,
            conversion: 2.74,
            aov: 61.8,
            returns: 8.3,
            outerwear: 13,
          },
          {
            month: "2024-06-01",
            orders: 19900,
            conversion: 2.78,
            aov: 61.5,
            returns: 8.1,
            outerwear: 13.4,
          },
          {
            month: "2024-07-01",
            orders: 20400,
            conversion: 2.83,
            aov: 61.9,
            returns: 8.4,
            outerwear: 13.2,
          },
          {
            month: "2024-08-01",
            orders: 21300,
            conversion: 2.9,
            aov: 61.2,
            returns: 9.6,
            outerwear: 13.5,
          },
          {
            month: "2024-09-01",
            orders: 22200,
            conversion: 2.97,
            aov: 60.8,
            returns: 10.5,
            outerwear: 16.1,
          },
          {
            month: "2024-10-01",
            orders: 24900,
            conversion: 3.1,
            aov: 61,
            returns: 11.4,
            outerwear: 17.8,
          },
        ],
        x: "month",
        compare: "previous",
        metrics: [
          {
            variant: "area",
            y: "orders",
            label: "Orders",
            format: "compact",
            deltaLabel: "vs September",
          },
          {
            variant: "area",
            y: "conversion",
            label: "Conversion rate",
            format: "{value}%",
            delta: "+0.13 pts",
            deltaLabel: "vs September",
          },
          {
            variant: "area",
            y: "aov",
            label: "Average order value",
            format: "currency:EUR",
            deltaLabel: "vs September",
          },
          {
            variant: "area",
            y: "returns",
            label: "Return rate",
            format: "{value}%",
            delta: "+0.9 pts",
            upIsGood: false,
            deltaLabel: "vs September",
          },
        ],
      }}
      ranking={{
        data: [
          { category: "Outerwear", revenue: 412, change: 0.31, returns: 19.2 },
          { category: "Footwear", revenue: 371, change: 0.08, returns: 14.1 },
          { category: "Knitwear", revenue: 298, change: 0.22, returns: 9.8 },
          { category: "Accessories", revenue: 164, change: -0.04, returns: 4.2 },
          { category: "Denim", revenue: 152, change: -0.11, returns: 12.6 },
          { category: "Home", revenue: 88, change: 0.02, returns: 3.1 },
        ],
        name: "category",
        value: "revenue",
        change: "change",
        format: "€{value}k",
        highlight: "Outerwear",
        title: "Outerwear revenue rose 31% to €412k in October",
        subtitle: "Revenue by category, October, with change on September",
      }}
      trends={[
        <LineChart
          data={[
            {
              month: "2023-11-01",
              orders: 18200,
              conversion: 2.61,
              aov: 64.1,
              returns: 8.1,
              outerwear: 13,
            },
            {
              month: "2023-12-01",
              orders: 26900,
              conversion: 3.02,
              aov: 66.8,
              returns: 8.4,
              outerwear: 13.2,
            },
            {
              month: "2024-01-01",
              orders: 17100,
              conversion: 2.55,
              aov: 63,
              returns: 9,
              outerwear: 13.6,
            },
            {
              month: "2024-02-01",
              orders: 16400,
              conversion: 2.58,
              aov: 62.4,
              returns: 8.2,
              outerwear: 13.1,
            },
            {
              month: "2024-03-01",
              orders: 17900,
              conversion: 2.66,
              aov: 62.9,
              returns: 8,
              outerwear: 12.9,
            },
            {
              month: "2024-04-01",
              orders: 18800,
              conversion: 2.71,
              aov: 62.2,
              returns: 7.9,
              outerwear: 13.3,
            },
            {
              month: "2024-05-01",
              orders: 19600,
              conversion: 2.74,
              aov: 61.8,
              returns: 8.3,
              outerwear: 13,
            },
            {
              month: "2024-06-01",
              orders: 19900,
              conversion: 2.78,
              aov: 61.5,
              returns: 8.1,
              outerwear: 13.4,
            },
            {
              month: "2024-07-01",
              orders: 20400,
              conversion: 2.83,
              aov: 61.9,
              returns: 8.4,
              outerwear: 13.2,
            },
            {
              month: "2024-08-01",
              orders: 21300,
              conversion: 2.9,
              aov: 61.2,
              returns: 9.6,
              outerwear: 13.5,
            },
            {
              month: "2024-09-01",
              orders: 22200,
              conversion: 2.97,
              aov: 60.8,
              returns: 10.5,
              outerwear: 16.1,
            },
            {
              month: "2024-10-01",
              orders: 24900,
              conversion: 3.1,
              aov: 61,
              returns: 11.4,
              outerwear: 17.8,
            },
          ]}
          x="month"
          y={["outerwear", "returns"]}
          names={{ outerwear: "Outerwear", returns: "All orders" }}
          format="{value}%"
          zero
          title="The return rate rose from 8.4% in July to 11.4% in October"
          subtitle="Share of orders returned by month of order, all orders and outerwear"
          annotations={[{ type: "line", axis: "x", value: "2024-08-01", label: "Free returns" }]}
        />,
        <BarChart
          data={[
            { category: "Outerwear", revenue: 412, change: 0.31, returns: 19.2 },
            { category: "Footwear", revenue: 371, change: 0.08, returns: 14.1 },
            { category: "Knitwear", revenue: 298, change: 0.22, returns: 9.8 },
            { category: "Accessories", revenue: 164, change: -0.04, returns: 4.2 },
            { category: "Denim", revenue: 152, change: -0.11, returns: 12.6 },
            { category: "Home", revenue: 88, change: 0.02, returns: 3.1 },
          ]}
          x="category"
          y="returns"
          sort="desc"
          orientation="horizontal"
          format="{value}%"
          highlight="Outerwear"
          title="19.2% of outerwear orders were returned in October"
          subtitle="Return rate by category, October"
        />,
      ]}
      notes={[
        {
          title: "Returns cost about €62k in October",
          text: "About 2,840 parcels came back. Carriage and handling cost €22 a parcel. At September's return rate of 10.5% the cost would have been about €58k.",
        },
        {
          title: "62% of outerwear returns give “too small” as the reason",
          text: "A size guide goes into test on 4 November.",
        },
        {
          title: "Orders were highest in December 2023 at 26,900",
          text: "October 2024 was the second-highest month of the 12.",
        },
      ]}
      sources={["Store order database", "Returns portal"]}
      period="November 2023 to October 2024"
      method="Return rate is by month of order and is revised for 30 days as parcels arrive."
      note="Illustrative data"
    />
  );
}
