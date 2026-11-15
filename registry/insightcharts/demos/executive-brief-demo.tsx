import { ExecutiveBrief } from "@/components/insightcharts/templates/executive-brief";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";
import { DumbbellChart } from "@/components/insightcharts/atoms/dumbbell-chart";
import { SlopeChart } from "@/components/insightcharts/atoms/slope-chart";

export function ExecutiveBriefDemo() {
  return (
    <ExecutiveBrief
      theme="ledger"
      kicker="Retention review · Q4 2024"
      title="Monthly churn fell from 4.2% to 2.1% in 2024"
      deck="The new onboarding shipped in March. Accounts that joined before March still churn at 3.8% a month."
      byline="Growth analytics"
      date="2025-01-14"
      figures={{
        variant: "tiles",
        items: [
          {
            surface: "outline-accent",
            edge: "top",
            value: "2.1%",
            label: "Monthly churn, December",
            delta: "−2.1 pts",
            deltaLabel: "vs January",
            upIsGood: false,
          },
          {
            surface: "outline-accent",
            edge: "top",
            value: 0.61,
            format: "percent",
            label: "New accounts finishing setup in week one",
            delta: "+19 pts",
            deltaLabel: "vs January",
          },
          {
            surface: "outline-accent",
            edge: "top",
            value: 1.12,
            format: "percent",
            label: "Net revenue retention",
            context: "Top quartile for the sector is 110%",
          },
          {
            surface: "outline-accent",
            edge: "top",
            value: "$1.9m",
            label: "Annual revenue retained",
            context: "Compared with churn staying at the January rate of 4.2%",
          },
        ],
      }}
      hero={<LineChart
        data={[
          { month: "2024-01-01", churn: 4.2, prior: 4.4 },
          { month: "2024-02-01", churn: 4.3, prior: 4.3 },
          { month: "2024-03-01", churn: 4.1, prior: 4.4 },
          { month: "2024-04-01", churn: 3.6, prior: 4.2 },
          { month: "2024-05-01", churn: 3.1, prior: 4.3 },
          { month: "2024-06-01", churn: 2.9, prior: 4.1 },
          { month: "2024-07-01", churn: 2.6, prior: 4.2 },
          { month: "2024-08-01", churn: 2.4, prior: 4.3 },
          { month: "2024-09-01", churn: 2.3, prior: 4.1 },
          { month: "2024-10-01", churn: 2.2, prior: 4.2 },
          { month: "2024-11-01", churn: 2.1, prior: 4.3 },
          { month: "2024-12-01", churn: 2.1, prior: 4.2 },
        ]}
        x="month"
        y={["churn", "prior"]}
        names={{ churn: "2024", prior: "2023" }}
        highlight="churn"
        contextLabels
        format="{value}%"
        zero
        title="Monthly churn fell from 4.1% in March to 2.1% in December"
        subtitle="Share of paying accounts cancelling each month, 2024 and the same months of 2023"
        annotations={[
          { type: "line", axis: "x", value: "2024-03-01", label: "New onboarding ships" },
          { type: "band", axis: "y", from: 2, to: 2.5, label: "Target range" },
        ]}
        source="Billing system"
      />}
      takeaway={{
        lead: "Churn was between 2.1% and 2.4% from August to December",
        body: "The new onboarding shipped in March. Churn was between 4.1% and 4.4% in every month of 2023.",
      }}
      supporting={[
        <DumbbellChart
          data={[
            { plan: "Starter", jan: 6.1, dec: 2.9 },
            { plan: "Team", jan: 4, dec: 2 },
            { plan: "Business", jan: 2.4, dec: 1.6 },
            { plan: "Enterprise", jan: 0.9, dec: 0.8 },
          ]}
          category="plan"
          from="jan"
          to="dec"
          names={{ jan: "January", dec: "December" }}
          format="{value}%"
          sort="none"
          highlight="Starter"
          title="Starter plan churn fell from 6.1% to 2.9%"
          subtitle="Monthly churn by plan, January and December 2024"
        />,
        <SlopeChart
          data={[
            { reason: "Setup not finished", before: 38, after: 14 },
            { reason: "Too expensive", before: 22, after: 27 },
            { reason: "Missing a feature", before: 17, after: 24 },
            { reason: "Went to a rival", before: 13, after: 19 },
            { reason: "Company closed", before: 10, after: 16 },
          ]}
          series="reason"
          y={["before", "after"]}
          names={{ before: "Q1", after: "Q4" }}
          format="{value}%"
          highlight="Setup not finished"
          height={260}
          title="“Setup not finished” fell from 38% to 14% of cancellations"
          subtitle="Share of cancellations by stated reason, Q1 and Q4 2024"
        />,
      ]}
      actions={[
        {
          title: "Offer the guided setup to the 2,400 accounts that joined before March",
          text: "These accounts churn at 3.8% a month.",
          owner: "Lifecycle · by end of February",
        },
        {
          title: "Make the setup checklist the default on the Team plan",
          text: "The checklist is opt-in on Team today. Team churn was 2.0% in December.",
          owner: "Product · Q1",
        },
        {
          title: "Measure churn again in March 2025",
          text: "That will give 12 months of data since the new onboarding shipped.",
          owner: "Growth analytics",
        },
      ]}
      sources={["Billing system", "Product analytics warehouse"]}
      period="January to December 2024, monthly"
      method="Churn is the share of accounts paying at the start of a month that cancel during it. Downgrades are not counted."
      note="Illustrative data"
    />
  );
}
