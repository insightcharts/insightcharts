import { ReportPage } from "@/components/insightcharts/templates/report-page";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";
import { ProgressMeter } from "@/components/insightcharts/atoms/progress-meter";

export function ReportPageDemo() {
  return (
    <ReportPage
      kicker="Small-group tutoring programme · Year 1 evaluation"
      title="Tutored pupils gained 2.9 more scaled-score points in maths than matched pupils"
      deck="The difference in reading was 0.5 points. 31% of tutored pupils were eligible for free school meals against a funding target of 50%."
      byline="Evaluation team"
      date="2025-02-20"
      summary="Pupils offered tutoring gained **2.9 more scaled-score points in maths** over the year than matched pupils who were not. That is about three months of additional learning. The difference in reading was 0.5 points and could be chance. Pupils who attended fewer than 12 sessions gained less than 1 point over their matches. 58% of pupils attended 12 or more. We recommend continuing the maths strand. Attendance should be the main delivery target. The way pupils are selected should change."
      findings={[
        {
          title: "Tutored pupils gained 8.1 points in maths against 5.2 for comparison pupils",
          exhibit: <BarChart
            data={[
              { subject: "Maths", Tutored: 8.1, Comparison: 5.2 },
              { subject: "Reading", Tutored: 5.9, Comparison: 5.4 },
            ]}
            x="subject"
            y={["Tutored", "Comparison"]}
            orientation="horizontal"
            sort="none"
            highlight="Tutored"
            format="decimal:1"
            subtitle="Mean gain in scaled score, autumn 2023 to summer 2024"
            source="Standardised assessments, 42 schools"
          />,
          observation: "The difference in maths was 2.9 points (95% interval 1.6 to 4.2). In reading tutored pupils gained 5.9 points and comparison pupils 5.4. That difference was 0.5 points (−0.7 to 1.7).",
          interpretation: "The maths difference is unlikely to be chance. Trials of similar programmes found effects of about the same size. We do not conclude that reading tutoring failed, because half the reading tutors were recruited after January.",
          confidence: "medium",
          caveat: "Pupils were matched on prior attainment and background. They were not randomised. Unmeasured differences, such as parental engagement, could account for part of the difference.",
        },
        {
          title: "Pupils who attended 18 or more sessions gained 4.4 points over their matches",
          exhibit: <BarChart
            data={[
              { sessions: "Under 6", effect: 0.2 },
              { sessions: "6–11", effect: 0.9 },
              { sessions: "12–17", effect: 3.1 },
              { sessions: "18+", effect: 4.4 },
            ]}
            x="sessions"
            y="effect"
            orientation="vertical"
            sort="none"
            format={{ signDisplay: "exceptZero", maximumFractionDigits: 1 }}
            height={260}
            subtitle="Maths gain over comparison pupils, scaled-score points, by sessions attended (of 20 offered)"
          />,
          observation: "Pupils who attended fewer than 6 sessions gained 0.2 points more than their matches. Those who attended 6 to 11 gained 0.9 points more. 42% of tutored pupils attended fewer than 12 sessions.",
          interpretation: "A gain that rises with attendance is consistent with a real effect. Pupils who attend more may also differ in ways that raise attainment. The effect of extra sessions is therefore probably smaller than the bars show.",
          confidence: "low",
        },
        {
          title: "31% of tutored pupils were eligible for free school meals against a target of 50%",
          exhibit: <ProgressMeter
            label="Tutored pupils eligible for free school meals"
            value={0.31}
            max={1}
            showMax={false}
            target={0.5}
            targetLabel="Funding target"
            format="percent"
            context="984 of 3,180 pupils. In the same schools, 38% of all pupils are eligible."
          />,
          observation: "984 of the 3,180 tutored pupils were eligible for free school meals. The funding agreement specifies 50%. 38% of all pupils in the participating schools are eligible.",
          interpretation: "Schools selected pupils by teacher nomination. Nomination appears to favour pupils just below the expected standard over the most disadvantaged. The schools have enough eligible pupils to meet the target, so we think the selection rules cause the shortfall.",
          confidence: "high",
        },
      ]}
      method="We compared 3,180 tutored pupils in 42 schools with 3,180 pupils in the same schools and year groups, matched one to one on prior attainment, free-school-meal eligibility, special educational needs and attendance in the previous year. Outcomes are scaled scores on the standardised assessments schools already use. Intervals are 95% and account for clustering by school."
      limitations={[
        "Matching cannot rule out differences we did not measure. A randomised design is planned for year two.",
        "Attendance was recorded by tutors and may be overstated.",
        "One year of outcomes does not show whether the gain lasts.",
      ]}
      sources={["School assessment returns", "Tutor session logs", "National pupil database extract"]}
      period="September 2023 to July 2024"
      note="Illustrative data"
    />
  );
}
