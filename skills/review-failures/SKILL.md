---
name: review-failures
description: Read real conversations with the PM, turn their notes into named failure modes, and rank them by business impact. Use when the user wants to know what their agent gets wrong, asks for error analysis, a failure review, "look at the data", a weekly quality review, or before building evals.
---

Read `evals/CONFIG.md` and `evals/GOOD.md`. If the config is missing, run `ask-pmai`. If `GOOD.md` is missing, review against the PM's judgment and note that the bar is not written down yet.

The PM reads and writes notes. You sample, sort, count and connect each failure to the business. The output is `evals/failures/<date>.md`: a ranked list of what is going wrong, how often, and what it costs.

## 1. Sample

Pick 30 conversations from `evals/data/traces.jsonl`, at least 4 per job in `GOOD.md`: about half at random, the rest from where trouble hides, meaning human handoffs, negative outcomes (no order, refund, return, complaint), unusually long or repetitive conversations, and conversations where the customer wrote again after the last agent message. Make sure every job from `GOOD.md` appears.

Shuffle the sample so jobs are mixed. Done when the sample is written to `evals/failures/<date>-sample.txt` as a list of ids with the reason each was picked.

## 2. The PM reviews, first and alone

Show one conversation at a time, condensed: the customer's goal, the messages, the tool calls that matter, and the outcome. The PM answers two things:

- **Pass or fail** against the bar in `GOOD.md`.
- **A free note** on the first thing that went wrong, in their own words ("told her it ships tomorrow, the store only ships Mondays"). One note per conversation is enough.

Show none of your own opinions until the PM has answered, because their unprimed notes are the point. For more than 20 conversations, offer the offline route first: write `evals/failures/<date>-review.csv` (id, summary, pass_fail, note) and wait for it.

In learn mode, after the fifth conversation explain in one sentence why the PM writes the notes: the failure categories have to come from what actually happens, and the person who owns the bar is the only one who can spot a quietly wrong answer.

Done when every sampled conversation has a pass/fail and, if it failed, a note.

## 3. Name the failure modes

Group the notes into failure modes. Name each mode by what happened and where ("promises delivery dates the carrier does not offer"), never by a generic label like "hallucination" or "unhelpful". Count each mode. Show the grouping to the PM and ask where they disagree.

If the last 10 conversations produced a new mode seen at least twice, sample 15 more (or all that remain, if fewer) and repeat steps 2 and 3, at most twice. Record modes seen only once as "seen once" and stop.

Done when every failed conversation maps to one primary mode, with a secondary one noted when two failures stack (a wrong item that then gets no answer), and the PM accepts the names. Count secondary modes too: a failure that sits under several modes is often the biggest one.

## 4. Rank by business impact

For each mode, compute from the full trace file, not just the sample (write a small script if needed):

- **Frequency**: share of conversations showing it. Use a keyword or tool-call pattern to estimate it, and say the estimate is rough. If the trace file over-samples trouble (see the sampling rule in `evals/data/README.md`), the share in the file is not the real rate: reweight by stratum or run the same pattern on the full source, and report both.
- **Outcome gap**: the business signal in conversations with the mode compared with those without it, within the same job (for example, returns 67% vs 24% in confirmation chats). Show the count. Compare like with like: users who keep writing are more engaged than users who go silent, so compare within users who showed the same intent (for example, only buyers who said they still want the order). If the gap points the wrong way, suspect this before trusting it. If fewer than 5 conversations have the mode, or the cost lands outside the conversation (a made-up fact that closes the sale, a complaint after delivery), write "not measurable here" and name where the cost shows up instead.
- **Severity**: `never` (violates a Never rule), `lost` (user leaves or the sale is lost), `cost` (refund, return, human time), or `annoying` (works out in the end).
- **Money at stake per 1,000 conversations**: frequency × outcome gap × value of one outcome, only when all three are known. Otherwise leave it blank.

Propose a ranking from these columns and let the PM reorder it. Their reasons for reordering belong in the review.

Then name each mode's owner (the agent's prompt or tools, the human team or operations, or automated messages) and sort it into one bucket:

- **Fix now**: an obvious bug or a missing instruction. Write the fix suggestion; no eval is needed yet.
- **Needs an eval**: subtle, recurring, risky, or likely to come back after the next change.
- **Accept for now**: rare and cheap. Say why.

## 5. Write the review

```markdown
# Failure review - <date>
Reviewed: <n> conversations by <PM> · Pass rate: <x>% in the random half, <y>% in the trouble half

| Rank | Failure mode | % of conversations | Outcome gap (n) | Severity | Money at stake / 1k | Owner | Bucket |
|---|---|---|---|---|---|---|---|

## <Mode>
What happens: ... · Examples: <ids> · Business effect: ... · Suggested fix or eval: ...

## What is working
Jobs that passed consistently, with examples.
```

Lead the summary in chat with the top three lines in this form: *<failure> in <x>% of conversations, <metric> goes from <a> to <b> (n=<k>); fix now / needs an eval*.

If the data is the demo dataset, offer to compare the PM's modes with the answer key at `examples/whatsapp-store/.answer-key/failure-modes.md` in the pmai-skills repo (two folders up from this skill's directory, not the PM's workspace), and discuss what they caught and missed.

Next: fix the "fix now" items, then `build-evals` for the "needs an eval" items. Repeat this review after every major change, and at least monthly while the agent is live.
