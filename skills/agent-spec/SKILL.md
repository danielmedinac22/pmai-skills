---
name: agent-spec
description: Write or review the spec for an AI agent from the PM side - the job, how much autonomy it gets, when it hands off, what it must never do, what it may cost, and how we will know it works. Use when the user is building a new agent, changing what an agent does, writing an agent PRD, or asks to critique an agent spec.
---

Read `evals/CONFIG.md` and `evals/GOOD.md` if they exist. A spec without a definition of good ends in "it feels better"; if `GOOD.md` is missing, say so and offer `define-good` first.

Two modes. **Write**: the PM describes the agent and you produce the spec. **Review**: the PM hands you a spec and you return the gaps, worst first.

## Write

### 1. Gather and grill

Read whatever exists: the PRD, the prompt, the tools, the code, the conversations. Then ask in rounds: every question you can ask now, numbered, each with your recommended answer so "yes" accepts it. Look facts up yourself; put decisions to the PM.

The decisions that agent specs usually skip, and that you make sure get decided:

1. **Agent or workflow?** If the steps are always the same, a workflow is cheaper and more reliable. An agent earns its place when the path depends on the conversation.
2. **Autonomy level** per action: *suggest* (a human executes), *act with approval*, or *act alone*. Start one level lower than the team wants, and write the eval result that unlocks the next level.
3. **Handoff**: when a human takes over, how fast, and what context travels with it.
4. **Never list**: actions that must not happen even once. Each one becomes a check in `build-evals`.
5. **Budget**: cost per resolved conversation and response time the business can afford.
6. **Launch bar**: which jobs must pass, at what rate, before real users see it.

Done when all six are decided or explicitly parked with an owner.

### 2. Write the spec

Write `evals/agent-spec.md`, or wherever the PM keeps specs:

```markdown
# <Agent> - spec
Owner: <name> · Status: draft | approved · Updated: <date>

## The job
Who, what they come to get done, what happens today without the agent.

## Why an agent
What varies per conversation that a workflow cannot handle.

## What it can do
| Action | Tool / data | Autonomy (suggest / approve / alone) | Unlocks next level when |

## Hand off
Triggers, target response time, context passed.

## Never
- ...

## Budget
Cost per resolved conversation: ... · Response time: ...

## How we know it works
Jobs and bars: see evals/GOOD.md. Launch bar: <job> passes <rate> over <k> runs; no "Never" violation.
Business metric to move: <metric>, from <today> to <target>, read <when>.

## Open questions
```

## Review

Read the spec against the six decisions above and against `GOOD.md`. Return a short list, worst first. Each item says what is missing, what will go wrong in production because of it, and the question that settles it. Typical findings: no handoff rule, autonomy above what anything has proven, a "Never" list without checks, a launch bar that says "high accuracy", and a business metric with no baseline.

Next: `review-failures` if the agent already talks to users, `build-evals` if it does not yet.
