---
name: audit-evals
description: Grade an existing eval setup for an AI agent and return the gaps that matter, worst first, each with its business consequence and the fix. Use when the user asks to review, audit, grade or sanity-check their evals, judges, test sets or eval dashboard, or asks "are our evals any good".
---

The team already has evals, in any shape: a spreadsheet, a promptfoo or Braintrust or LangSmith setup, pytest files, a judge prompt, a dashboard. Your job is to tell the PM whether the setup can be trusted to make product decisions, and what to fix first.

## 1. Find what exists

Look through the repo, including other branches, gitignored run outputs and one-off scripts, and anything the PM points to. If the product has several user-facing agents, audit each one and say which you graded. Collect:

- **Test data:** cases, golden sets, synthetic data.
- **Graders:** code assertions, judge prompts, human labels.
- **Results:** runs, scores, dashboards.
- **How "good" is defined:** specs, rubrics, a `GOOD.md`.
- **Error analysis:** notes, failure lists, labeled traces.
- **Production signals:** logs, feedback, metrics.

Ask the PM only what you cannot find, such as who labels, how often anyone reads conversations, or what launch decisions the scores have driven.

Done when you can describe the setup in five lines: what is tested, how it is graded, how often it runs, who looks at it, and what decisions it has driven.

## 2. Run the checks

Go through every check in [CHECKS.md](CHECKS.md). Mark each one **pass**, **fail**, **partial** or **can't tell**. For each mark, cite the evidence: the file, the line, the number. When a check cannot be read from the material, mark it "can't tell", not "fail".

## 3. Write the audit

Write `evals/audit-<date>.md`, or answer in chat if the PM wants no files:

```markdown
# Eval audit - <date>
Setup in five lines: ...

## Verdict
<Trustworthy for launch calls | Useful for spotting regressions only | Not yet decision-grade>, because <one sentence>.

## Fix first
1. <Gap> - what goes wrong because of it: <business consequence> - fix: <action> (<skill that does it>)
2. ...

## Scorecard
| Area | Pass | Partial | Fail | Can't tell |
|---|---|---|---|---|
| Grounded in real failures | | | | |
| Graders you can trust | | | | |
| Cases that test the job | | | | |
| Runs you can compare | | | | |
| Tied to the business | | | | |

## All checks
| # | Check | Result | Evidence |
|---|---|---|---|
```

Rank the "fix first" list by how much each gap could mislead a launch decision, not by how easy it is to fix. Keep it to five items or fewer. Point each fix to the skill in this repo that handles it:

- `define-good`: no shared definition of good.
- `review-failures`: no recent reading of conversations, or generic failure names.
- `build-evals`: graders that are not validated, missing cases, path-based criteria.
- `run-evals`: no pilot, k=1, no comparability between runs.
- `ship-check`: no launch bar, no holdout, no link to the business metric.

Lead in chat with the verdict and the top three fixes.
