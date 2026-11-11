---
name: define-good
description: Write down what a good conversation with the agent looks like, job by job, in user and business terms, before any eval exists. Use when the user asks what "good" means for their agent, wants success criteria or acceptance criteria for an agent, or starts evals with no shared definition of quality.
---

Read `evals/CONFIG.md` first. If it is missing, run the `ask-pmai` skill.

The output is `evals/GOOD.md`: the yardstick every later skill grades against. The PM decides it. You draft it from evidence so they mostly accept or correct.

## 1. Gather evidence

Before asking anything, read what exists of: the agent's prompt and tools, product docs or the README, 20 conversations from `evals/data/traces.jsonl` (a spread across jobs and outcomes), and any support tickets, reviews or complaints you can reach. Look for what users actually came to do and what made them leave, repeat themselves, or ask for a human.

Done when you can list the jobs users bring to the agent, with a real conversation id for each.

## 2. Jobs, not features

A **job** is a complete outcome for the user, whether they started the chat or the business did ("get my package despite a delivery problem"), never a step of the tool ("call the shipping API"). If the data already labels jobs, map each of yours to those labels. Draft 3 to 8 jobs. For each one, draft:

- **Good looks like**: the end state for the user, in one or two sentences.
- **The reviewer's bar**: what a demanding expert on this job (the best human doing it today) would check before accepting the agent's work. If that expert would not check it, it is not a criterion.
- **Never**: the few things that are unacceptable even once (invents a price, acts without approval, leaks data). Keep this list short. If most failures land here, it stops helping anyone rank them.
- **Hand off when**: the cases where a human should take over, and what a good handoff includes.
- **Business signal**: which metric from the config this job moves, and the observable signal in a conversation (order confirmed, no human needed, customer did not repeat the question, came back within 30 days).
- **Examples**: three conversation ids. One clean day (nothing went wrong), one good save (something went wrong and the agent handled it), and one failure.

## 3. Grill the PM

Ask in rounds. Each round lists every question you can ask now, numbered, each with your recommended answer so "yes" accepts it. Look up facts in the conversations or code yourself; put only decisions to the PM.

Push on three things:

- **Is an agent the right tool for each job?** If a fixed workflow, a form or a button would do it, say so and mark the job "not an agent job".
- **Which jobs matter most?** Rank them by volume times business value. The top two get evals first.
- **Who owns the bar?** One person with domain judgment decides what good means (the config's owner). A committee produces vague criteria.

Done when every job has every field filled or explicitly marked unknown, and the PM has confirmed the ranking.

## 4. Write GOOD.md

```markdown
# What good looks like - <agent>
Owner: <name> · Updated: <date>

## Jobs, ranked
| # | Job | Volume | Business metric | Agent job? |

## <Job 1>
- Good looks like: ...
- Reviewer's bar: ...
- Never: ...
- Hand off when: ...
- Business signal: ...
- Examples: clean day <id>, good save <id>, failure <id>
```

Keep it to one screen per job. This file changes when the product changes; say so at the top.

In learn mode, close by explaining in two sentences why this comes first: graders and judges only check what someone decided, and most eval programs fail because nobody decided.

Next: `review-failures`.
