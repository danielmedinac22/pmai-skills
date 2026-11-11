---
name: ship-check
description: Make the launch call for an agent or an agent change - ship, ship limited, or hold - with a rollout plan, what to watch in production, and when to roll back; after launch, check whether it actually moved the business metric. Use when the user asks whether to launch, ship, roll out or expand an agent, or whether a launched change worked.
---

Read `evals/CONFIG.md`, `evals/GOOD.md`, `evals/agent-spec.md` if it exists, `evals/SUITE.md`, and the latest readout in `evals/readouts/`.

There are two modes. Before launch, you make the **gate** call. After launch, you check whether it **landed**.

## Gate

### 1. Check the evidence

Go through each line below. Mark each one met, not met, or unknown, and cite the file behind it:

1. A launch bar was written before the results were known (the spec, or the Launch bar in `evals/SUITE.md`). A bar written after seeing the numbers does not count.
2. The top jobs meet the bar in counting runs, not pilots, passing every run, with at least 3 runs.
3. No Never rule was violated in any run or in recent conversations.
4. Regression checks and cases sit near 100%.
5. Every judge behind a launch criterion was validated against the PM, and the judge file records it.
6. The held-out variant was run and matches the tuned cases.
7. Cost per resolved conversation and response time are within budget.
8. Nothing on the readout's "not the agent's fault" list hides a platform failure that users will hit.

### 2. Make the call

Choose one:

- **Ship.** Everything is met.
- **Ship limited.** The core jobs pass but something is short. Narrow the launch so the gap cannot hurt: a lower autonomy level (the agent suggests, a human executes), a smaller share of traffic, fewer jobs, or one segment.
- **Hold.** A Never violation, a failed top job, or unvalidated judges behind the launch bar. Name the one thing that unblocks it.

### 3. Plan the rollout

- **Holdout.** Keep a share of users on the current experience (5 to 20%) so the business metric has something to compare against. Without a holdout, nobody can tell later whether the agent moved retention or whether the season did.
- **Watch in production.** For each top failure mode, name its signal in live data: the customer repeats or rephrases, asks for a human, abandons mid-conversation, writes again after the agent's last message, or an outcome turns bad (return, refund, cancelled order). Pick a daily or weekly sample of conversations to read.
- **Rollback.** For each signal, give the number that triggers a rollback and who decides.

Write `evals/ship/<date>-<change>.md` with the evidence table, the call, and the rollout plan. Lead in chat with the call and the one-sentence reason.

## Landed

Run this 2 to 6 weeks after launch, once enough users have gone through it.

1. **Compare exposed users with the holdout** on the business metric from the config: retention, conversion, resolution without a human, returns. Report the difference with its size and sample. Do not compare users who chose the agent with users who did not, because the ones who opt in were already more engaged.
2. **Check that eval quality predicts the metric.** Grade a sample of live conversations with the suite's checks. Then compare the metric for users whose conversations passed against those whose conversations failed. If passing conversations do not lead to better outcomes, the evals measure the wrong thing, and `GOOD.md` needs another pass.
3. **Feed back.** Send conversations with bad outcomes to the next `review-failures`. Turn every production incident into a regression case.

Append the result to the same ship file, then lead in chat with one line in this form: *<metric>: holdout <a>, exposed <b> (<n> users) - <kept | rolled back | expanding>*.

In learn mode, close by explaining in one sentence why the holdout matters, using their numbers.
