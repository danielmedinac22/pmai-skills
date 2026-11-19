---
name: council-loop
description: Raise any piece of work to a bar the user sets. Turns an intent or an existing deliverable (a prototype, a screen, a spec, an agent prompt, a deck) into a written bar with three judging lenses, has a council of independent judges grade it, and iterates until every score clears the bar. Use when the user says "make this pixel perfect", "polish this until it's excellent", "have judges review it", "iterate until it passes", "raise the quality without changing X", or "get this to a 9".
---

The user sets the bar and gives the final verdict. You do everything in between: draft the bar, capture evidence, run the council, fix, and report. The agent that fixes never grades its own work.

The owner is the one named in `evals/CONFIG.md` if it exists, otherwise the user. State lives in `evals/council/<topic>/`, where `<topic>` is a short kebab-case name:

```
INTAKE.md        what it is, what must not change, how judges see it
BAR.md           the frozen bar
original/        never edited
work/            the copy you fix
references/      what the standard judge compares against
capture/         the capture and check scripts
rounds/r<n>/     evidence/, checks.json, judge-1.json, judge-2.json, judge-3.json
SCORECARD.md     one row per round
REPORT.html      before and after
labels.jsonl     the user's disagreements with a verdict
```

## 1. Read the work and the intent

The input is an intent ("make onboarding feel like Revolut"), a deliverable (a URL, a file, a folder), or both. Read the deliverable before asking anything. Copy it to `original/` and to `work/`. If there is only an intent, build a first version and treat it as the original.

Write `INTAKE.md` with three sentences: what the deliverable is, what must not change (design system, copy, flows, data, scope), and how the judges will see it ([EVIDENCE.md](EVIDENCE.md) lists the evidence for each type of work).

Done when `INTAKE.md` is written.

## 2. Draft the bar

Draft `BAR.md` from the [BAR.md](BAR.md) template, in the user's language. Start from the lenses in [LENSES.md](LENSES.md) for this type of work, then adjust them to the intent. The bar holds:

- **Three lenses**, one per judge: craft (is it well made), fidelity (did it keep what must not change, with no regressions), and standard (does it match the best in its field). Each lens has four to six parameters, phrased as what a demanding expert would check.
- **An anchored scale** where each score describes what is visible, and a **threshold**. The default is every score at 9.1 or more.
- **Never**: pass or fail items. One failure blocks the round, whatever the scores say.
- **Measured checks**: anything that is a fact (contrast, tap size, identical copy) is measured by a script. Each check is a gate or info only. When a check measures a Never item, the check decides it.
- **Out of scope**: what never costs points.
- **References**: the ones the user names. If they name none, propose the two or three best in the field. Save screenshots or excerpts of them in `references/` so judges compare against something real.
- **Groups**: split large work into groups (screens, sections) so each one gets a score.
- **Stop rules**: a round cap (default 4), and a plateau rule (two rounds without the lowest score rising).

Put it to the user in one round of numbered questions, each with your recommended answer so "yes" accepts it. Ask only for decisions: what must not change and how much room there is inside it, references, out of scope, thresholds for measured checks, the score threshold and the cap. Read everything else yourself.

Done when the user has approved the bar and it is saved as `BAR.md` v1. From here it is frozen. Any change is a new version, and every saved round is re-graded with it.

## 3. Grade the original (round 0)

Write the capture script in `capture/`, as [EVIDENCE.md](EVIDENCE.md) describes. It covers every group and every measured check. Run it on `original/`. In round 0 there are no pairs: the evidence is the original alone.

Run the council as [COUNCIL.md](COUNCIL.md) describes: three fresh judges in parallel, one per lens, on the strongest model available. In round 0 the fidelity judge does not score. It writes an inventory of what must not change (tokens, components, copy, flows, destinations) that later rounds are checked against.

Start `SCORECARD.md` with one row per round: round, version hash, the lowest and highest score per judge, Never results, failing gate checks, and open findings by severity.

Done when the verdicts and the inventory are saved in `rounds/r0/` and `SCORECARD.md` shows round 0.

## 4. Iterate

Each round:

1. Merge the findings of the three judges. Drop duplicates. Order them by severity, then by the points they recover.
2. Fix `work/`, high severity first, inside the bar's constraints. When two judges ask for opposite things, the bar decides. If it does not, ask the user.
3. Save the version hash. Run the same capture script on `work/`, now with pairs against the original.
4. Run the council again with fresh judges. They get the bar, the original, the references, the inventory and the new evidence. They do not get your reasoning, your fix list or earlier scores.
5. Add the round to `SCORECARD.md`.

The round passes when every score clears the threshold, every Never passes and every gate check passes. Stop early when the plateau rule or the round cap fires, or when the next fix would break a constraint. Then show the user the scorecard, the open findings and the decision you need.

Done when a round passed, or a stop rule fired and the user has the decision.

## 5. Deliver

Deliver exactly the version the council passed. Compare its hash before you publish or hand it over.

Write `REPORT.html` with the before and after side by side, one change at a time. For each change, say what it fixed and how it was measured. Add the scorecard by round, what did not change, and the findings left open, each in this form:

*<finding> - <judge, where> - <points it costs> - <fix>*

Ask the user for the final verdict. If they disagree with a score, record it in `labels.jsonl` next to the verdict and leave the verdict unchanged. If the disagreement came from a loose criterion, rewrite the criterion for the next run.

Done when the user has the report and the delivered version matches the hash that passed.

If learn mode is on in `evals/CONFIG.md`, explain in one sentence why the bar is frozen before round 0, using a score that moved in this run.
