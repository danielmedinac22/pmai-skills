# BAR.md template

Copy this to `evals/council/<topic>/BAR.md` and fill it in. Keep the scale anchors concrete: each one describes what a reader would see, never an adjective. Write the whole bar in the user's language, including the anchors and the fixed lines.

```markdown
# Bar - <topic>
Owner: <name> · Version: 1 · Approved: <date>
Frozen. A change is a new version, and saved rounds are re-graded with it.

## The job
<One paragraph: what the deliverable is, who it is for, and the intent in the user's words.>

## Must not change
- <design tokens, copy, flows, data, scope...>

## Out of scope (never costs points)
- <decisions already made by the team, scaffolding, known limits>

## References
- <the 2 or 3 products or works the result is compared with>, saved in `references/`

## Groups
- G1 <name>: <screens or sections>
- G2 ...

## Scale (same for every judge, one decimal)
- 10: indistinguishable from the references. Under a magnifier there is no defect.
- 9.5: ready to ship; one or two details only an expert sees.
- 9.0: ready to ship, with several minor details visible on a careful look.
- 8.0: good, with defects an attentive user notices (something clipped, misaligned, inconsistent).
- 7 or less: problems visible at a glance.
Threshold: every score at <9.1> or more. A 9.0 does not pass.
A score of 9.5 or more must say why it is not 10.
Every point below the threshold needs a finding with a concrete fix.

## Never (pass or fail)
- N1 <e.g. a text, a number or a button destination changed>
- N2 ...

## Measured checks (a script measures them, judges get the numbers)
Each check is a gate (it blocks the round) or info (judges read it, it blocks nothing).
When a check measures a Never item, the check decides it.
- M1 gate: <e.g. text contrast 4.5:1 or more> - how it is measured
- M2 info: <e.g. controls under 44 px> - how it is measured

## Judge 1 - Craft
- P1 <parameter>: <what a demanding expert checks>
- P2 ...

## Judge 2 - Fidelity
Always compares the original with the current version, side by side.
- P1 ...
- P5 No regressions: no part is worse than the original in any respect.

## Judge 3 - Standard
- P1 ...

## Stop rules
Round cap: <4>. Plateau: two rounds without the lowest score rising.
```
