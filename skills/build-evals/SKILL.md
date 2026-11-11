---
name: build-evals
description: Turn ranked failures and the definition of good into a working eval suite - checks that grade any conversation for one failure, and scripted cases that test a job end to end with a simulated user. Use when the user wants to build, write or set up evals, graders, an LLM judge, a test set or a golden dataset for their agent.
---

Read `evals/CONFIG.md`, `evals/GOOD.md`, the latest `evals/failures/*.md`, and the latest `evals/audit-*.md` if one exists. If the team already has eval code, build on it: write new checks in its language, next to it, and keep the graders the audit rated sound. If there is no failure review, say evals built without one test imagined problems, and offer `review-failures` first. The PM can still go ahead.

The PM decides **what** to test and labels examples. You build everything else. Show the PM decisions and results, not prompts and scripts, unless they ask.

There are two kinds of eval, and a suite needs both:

- A **check** grades one failure mode on any conversation, logged or new. It answers "how often does X happen?".
- A **case** is a scripted scenario for one job, run against the live agent with a simulated user. It answers "can the agent do this job, every time?".

## 1. Pick what to cover

Propose and confirm with the PM:

- One check for each failure mode in the "needs an eval" bucket, merging modes the review says share a root. Then map each "Never" rule in `GOOD.md` to a check, and add a check only for Never rules nothing covers.
- One case for each of the top two jobs in `GOOD.md`. Add more only after these two have been run once.

Done when the PM approves the list.

## 2. Build the checks

For each check, use the cheapest grader that works:

1. **Code** when the failure is visible in the data: the order total differs from the agreed price, a field is empty, a customer message got no reply, a reply came too late. Write `evals/checks/<id>.py`, which reads `traces.jsonl` and prints pass, fail, not applicable or unknown per conversation, with a reason. Report failures over applicable conversations.
2. **LLM judge** only when it takes judgment. Write `evals/checks/<id>.judge.md` following [JUDGE.md](JUDGE.md): one failure, a binary verdict, a written reason, and evidence quoted from the conversation.

Validate every judge, and every code check that relies on a text pattern, against the PM before trusting it. Start with the failure review's labels: a keyword list that misses half the PM's failures measures the keywords, not the failure. For judges, follow [JUDGE.md](JUDGE.md): the PM labels at least 40 conversations, you measure how many real failures the judge catches and how many good conversations it wrongly flags, and you fix the judge until both are at least 90%. A judge that only agrees with another judge has not been validated. Then run each code check on conversations that were not used to write it. A keyword list tuned on the same conversations always looks perfect.

Done when each check has run on the full trace file and reports a failure rate, and each judge's agreement with the PM is recorded in its file.

## 3. Build the cases

If the config says there is no way to talk to the agent, tell the PM before building: the case can be written now, but it runs only once engineering provides a way to send the agent a test message and read back its reply and tool calls, without touching real customers. A stand-in agent tests the case, never their agent. Their agent means their prompt, settings, model and reply parsing. A wrapper that calls those production functions with every side effect stubbed counts. `run-evals` checks that the channel is safe.

Build each case as a folder under `evals/cases/<case-id>/`, using the layout and templates in [CASES.md](CASES.md). In short:

- A **request** in the customer's voice that never names how the agent should do it.
- A **simulated user** with fixed answers that it gives only when asked, plus "I don't know, you decide and tell me what you assumed" for anything else. The agent never sees this file.
- **Planted problems** taken from real failure modes (an address correction, an out-of-stock item, an ambiguous date), and one **clean** variant where nothing is wrong, to catch false alarms.
- The **expected result**, and a **rubric** of atomic pass/fail criteria. Each planted problem gets one criterion for each thing a demanding reviewer would check: noticed it, got it right, told the user, did the right next thing. The case passes only if every criterion passes.
- A **CHANGELOG** that records each change and whether it breaks comparison with earlier runs.

Grade the outcome, not the path. A criterion that demands a specific tool call or wording breaks the first time the agent finds a better way.

Before the first run, check that the case itself is sound:

- The expected result passes the rubric.
- An empty reply fails it.
- The PM and the judge grade the pilot independently, and every criterion they disagree on is rewritten before the counting runs.
- Every promise or claim the agent made in the pilot is graded by some criterion. Agreement between the PM and the judge only checks the criteria you already have.

Done when every case passes those three tests.

## 4. Label the suite

Tag each check and case as one of:

- **Regression**: it already works and must keep working. The target is about 100%.
- **Capability**: it does not work yet. A low pass rate is expected.

A capability case that passes in every run for two cycles becomes a regression case.

Write `evals/SUITE.md`, with one line per check or case: id, what it protects in business terms, type, grader (code or judge), validation result (or "unvalidated"), and owner. End it with a **Launch bar** agreed with the PM before any run: which cases must pass every run, which check rates must stay under what, and zero Never violations. Copy the spec's draft bar if one exists. The Launch bar may rest only on code checks and validated judges. `ship-check` grades against it.

In learn mode, end by explaining the two kinds of eval in two sentences, using one of their own checks and one of their own cases as examples.

Next: `run-evals`.
