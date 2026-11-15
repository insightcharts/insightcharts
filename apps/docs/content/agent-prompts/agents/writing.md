---
title: Writing rules for agents
description: The rules for every title, subtitle, callout, annotation label and story step an agent writes, with examples and a self-check list.
order: 5
---

These rules apply to every piece of text you write for a figure: `title`, `subtitle`, `deck`, `source`, `note`, callouts, annotation labels and story steps. They are hard requirements.

## The rules

{{WRITING_RULES}}

## Take every number from the data

1. Compute each number in the text from the rows before you write it.
2. Do not round a number in a way that changes its meaning. Write "31.7%", or "32%" when the data has no decimals.
3. Do not state a cause or an event that the data does not show. "Churn fell from 4.2% to 2.1% in 2024" is a fact from the rows. "after the onboarding revamp" is not, unless the user gave you that event.
4. If the user asks for a title the data does not support, tell the user and propose the fact the data does support.

## Apply the rules to each prop

| Prop | Write | Example |
|---|---|---|
| `title` | One plain fact with its number and period, in one clause. Or a plain label. | Monthly churn fell from 4.2% to 2.1% in 2024 |
| `subtitle` | The measure, the unit, the population and the period. | Monthly customer churn, % of paying accounts, 2024 |
| `source` | The name of the source. The chart prints "Source:" before it. | Billing database export, January 2025 |
| `note` | A caveat or a method note. | Illustrative data |
| `kicker` | A short topic label. | Support review, Q3 |
| `deck` | One to three short sentences. Each states one more fact. | The weekend median was 6.2 hours in September. |
| Callout `lead` | One short sentence with the main fact. | Churn was 2.1% in November |
| Callout `body` | One or two sentences with the supporting numbers. Do not repeat the chart title. | The largest fall between two readings was from 4.1% in March to 3.1% in May. |
| Annotation `label` | The name of the event, or the value. | New pricing page |
| Story step `content` | One or two plain sentences that state what the chart shows at that step, with the number. | Solar generated 3,870 TWh, 18% of the total. |
| `alt` | The chart type and measures, then the main pattern and the notable values. | Bar chart of signups by channel. Search leads with 420, followed by referral with 310. |

A plain label is always acceptable for a title when there is no single fact to state: "Monthly churn, 2024".

## Rewrite a title that breaks a rule

| Problem | Before | After |
|---|---|---|
| Two clauses | Churn halved, and the gain has held for six months | Monthly churn fell from 4.2% to 2.1% in 2024 |
| No number | Norway runs almost entirely on renewable electricity | Renewables supplied 98% of Norway's electricity in 2023 |
| Metaphor | Solar is closing the gap with wind | Solar's share rose from 2.7% to 5.5% between 2019 and 2023 |
| Dramatic verb | Signups soared in September | Monthly signups rose from 285 in May to 512 in September 2024 |
| Teasing | One channel explains most of it | Search brought in 420 of 1,005 signups last month |
| Question | Where did the tickets go? | Chat was 48% of tickets in September |

When a title has two facts, keep the main one in `title` and move the second to `subtitle`, `deck` or a callout.

## Check the text before you finish

Run this list on every string you wrote.

1. The title is one clause. It has no comma, "and", "but", "while", "yet", semicolon, colon or dash that adds a second half.
2. The title has its number and its period, or it is a plain label.
3. Every number can be found in the data or computed from it.
4. No sentence states a cause the data does not show.
5. There is no metaphor, idiom or figure of speech.
6. There is no dramatic verb: soared, plunged, surged, skyrocketed, slashed.
7. There is no staged contrast such as "not X, but Y".
8. There is no rhetorical question, no group of three for rhythm and no sign-off line.
9. Nothing hints at a point the reader has to work out.
10. The subtitle names the measure, the unit, the population and the period.
11. `source` is set and names the source.
12. `note` says so when the data is illustrative.

## Tell the model the fact

When you prompt another model for a chart or a spec:

- Give it the data and say which fact the chart should show. A model that knows the fact picks a better form and highlight.
- Tell it to write each title as one plain statement with the number and the period from the data.
- For a poster, name the infographic template and the poster theme. Icon props take only the names on the [icons](/docs/icons) page or a `path://` string.
