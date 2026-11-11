---
name: run-evals
description: Run the eval suite - checks on logged conversations and cases against the live agent - and give the PM a one-page readout of what got better, what got worse, and what to do next. Use when the user wants to run evals, test a prompt or model change, compare two agent versions, or asks "did this change make the agent better".
---

Read `evals/CONFIG.md` and `evals/SUITE.md`. If there is no suite, run `build-evals` first.

The PM gets a readout in business terms. You run everything and keep a record that someone can audit later.

## 1. Decide what this run answers

Agree on one sentence: "Is version B better than A on <jobs>?", "Did the new model break anything?", or on a first run "Where does the agent stand today?" (one version, and the readout becomes the baseline for the next run). Name the versions being compared and keep everything else equal: same cases, same simulated user, same graders, same model unless the model is what is being compared. Write down any difference you cannot remove.

## 2. Run the checks on conversations

Refresh `evals/data/traces.jsonl` with the command in the config. Run every check on the conversations since the last run, and on the previous period for comparison. Split by agent version when the traces record it. If the two periods hold a different mix of jobs, compare within each job. On a first run, report each rate once and mark it "baseline". This needs no live agent and is the cheapest signal, so do it on every run.

## 3. Run the cases

Run the cases only through a channel to their real agent that is confirmed safe, as [CHANNEL.md](CHANNEL.md) describes. If the config says there is none, tell the PM the cases did not run, repeat the ask for engineering, and list it under "Not the agent's fault" in the readout. For each version:

- Give each run its own clean environment: no leftover memory, files or accounts from earlier runs.
- Play or dispatch the simulated user by the rules in the case's `simulated-user.md`.
- Record a `finished` status for each task. It is one of:
  - `delivered`: it said it was done;
  - `handed off`: it passed the conversation to a person and the product stops it from answering;
  - `waiting`: it stopped with no question and no result, after one "Go ahead.";
  - `error`;
  - `out of context`;
  - `timed out`.

**Pilot first.** The first run of a new or changed case is a pilot and does not count. After the pilot, sort every failure by cause:

| Cause | Meaning | Goes to |
|---|---|---|
| agent | the agent got it wrong | the readout, as a finding |
| platform | the product or infrastructure blocked it | the readout, flagged for engineering |
| case | the case was ambiguous, wrong, or missing an answer | fix the case and bump its version |
| harness | the runner, isolation or grader broke | fix it, then rerun |

When the case and the harness are clean, do the **counting runs**: 3 to 5 runs per version. A case's headline result is **passes every run**, because a customer meets the agent many times and one bad run is the one they remember. Show "passed at least once" next to it.

If a case fails in every version, suspect the case before the agent. If a counting run shows a case or harness cause (a planted problem never came up, a scripted answer was missing, a grader broke), those runs do not count: fix the case, bump its version, and pilot again. A case found wrong after grading goes into quarantine, as [GRADING.md](GRADING.md) describes.

## 4. Grade and record

Run the code graders, then the judges. Grade each task, take the all-pass, and compute per case how many runs passed out of k. Save each run in `evals/runs/<date>-<version>-k<n>/`:

- `run.json`: version, model, case versions, grader versions, finished status per task, verdict per criterion with evidence, cost, time;
- the transcripts, tool calls, final state and deliverables, so the run can be re-graded without running the agent again;
- `log.md`, with unscripted questions, failures with their cause and owner, judge disagreements, and what the version leaves behind that a team could keep using.

When the PM disagrees with a grade, their reading becomes a label next to the verdict, never a change to it. The readout shows the raw result and the result with labels side by side. [GRADING.md](GRADING.md) covers labels, re-grading, quarantine, and which graders may block a launch.

## 5. Write the readout

Write `evals/readouts/<date>.md` using [READOUT.md](READOUT.md). Put the decision first, then the evidence. Every finding gets a line in this format:

*<failure or job> - <rate before> -> <rate after> (<n> runs) - hits <metric> - <action>*

Mark the result as not comparable when a case version changed between the runs you compare.

In learn mode, explain in one sentence why "passes every run" is the headline, using the case that varied the most between runs.

Next: `ship-check` if a launch decision is pending, otherwise fix the top finding and run again.
