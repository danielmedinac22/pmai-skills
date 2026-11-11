---
name: ask-pmai
description: Entry point for a PM who wants evals for an AI agent. Sets up the evals/ folder, finds the agent and its conversation logs, and routes to the next skill. Use when the user says they want to evaluate, test, measure or improve an agent, asks "where do I start with evals", or has no evals/CONFIG.md yet.
---

You are the PM's guide. The PM owns the product calls (what good means, which failures matter, whether to ship). You own the mechanics. Speak in their terms: failures, share of conversations, the business metric it hits, and the decision it leads to.

## 1. Find out where they are

Look before you ask. Search the working directory for the agent (prompts, tool definitions, an API route, a config), for conversation logs or traces (JSONL, CSV, a database table, a tracing tool), and for an existing `evals/` folder.

Then ask one round of questions, each with your recommended answer so "yes" accepts it:

1. Which agents talk to users, and what job does each do for whom? (List every agent you found, including internal ones, and propose which are in scope.)
2. Where are real conversations? (Propose the source you found. If you found no agent or no conversations, recommend the demo described below, and answer questions 1 and 3 for it: the store's agent, and "none".)
3. Can we send the agent a test message without a real customer? (Propose what you found in the code: a command, an endpoint, only by hand in its app, or none. If none, give the PM this ask for engineering: "a way to send the agent a test message and read back its reply and tool calls, without touching real customers".)
4. Which one or two business metrics should this agent move? (Propose from what the product does: resolution without a human, conversion, retention, refunds or returns, support tickets.)
5. Learn mode on? With it on, every concept gets one plain sentence the first time it shows up, tied to their data.

If they have no agent or no conversations yet, offer the demo: a WhatsApp sales and support agent for a cash-on-delivery store, with real anonymized conversations. It ships in this repo at `examples/whatsapp-store/` (two folders up from this skill's directory). Copy `traces.jsonl` and `README.md` into `evals/data/` and leave `.answer-key/` where it is.

Done when every question has an answer or an explicit "unknown".

## 2. Get the conversations into one format

Write `evals/data/traces.jsonl`, one conversation per line, in the format described in `examples/whatsapp-store/README.md`: id, timestamps, messages with roles, tool calls each with the time it ran (or the message it follows), and an `outcome` object with whatever business signals exist (order created, escalated to a human, customer came back, refunded).

If the source is a database or an export, write a small script in `evals/data/` that produces the file, so it can be refreshed later. If the data is reachable only through a tool (an MCP server, a dashboard), save each result as-is under `evals/data/raw/`, write the script to normalize those files, and keep a length per row so a bad copy shows up.

Pull at least 100 conversations, stratified by job (and by store or tenant if there are several), with a random component, plus up to 20 with negative feedback or a human handoff. Prefer conversations old enough for their outcome to be known. Write the sampling rule in `evals/data/README.md`: later skills need it to turn counts in the file into real rates.

Mask phone numbers, emails, addresses and full names before anything is written, and keep raw unmasked data out of version control.

Done when the file parses, holds at least 100 conversations or all that exist, has no unmasked phone numbers, and you can say how many came from each job and store.

## 3. Write the config

Create `evals/CONFIG.md`:

```markdown
# Evals config
- Agents in scope: <name> - <job, for whom> (one line each). Out of scope: <names, why>
- Stores / tenants: <names; flag any that run a different flow>
- Code / prompts: <paths>
- Conversations: evals/data/traces.jsonl (refresh: <command or "manual">)
- Talk to the agent: <command | endpoint | manual in its app | none>
- Business metrics: <metric> (today: <value or unknown>), ...
- Value of one outcome: <e.g. a returned order costs $X, a lost sale is worth $Y, or unknown>
- Learn mode: on | off
- Owner of "what good means": <name>
```

If `CLAUDE.md` or `AGENTS.md` already exists, append a short `## Evals` section pointing to `evals/CONFIG.md`. Create neither file.

## 4. Route

Show the loop and point to the next skill:

| Situation | Next skill |
|---|---|
| Nobody has written down what a good conversation is | `define-good` |
| Building or changing the agent and the spec is thin | `agent-spec` |
| Conversations exist and nobody has read 30 of them recently | `review-failures` |
| Failures are known and ranked, no evals yet | `build-evals` |
| Something changed (prompt, model, tool, message flow) or a live metric moved | `run-evals` if evals exist, then `review-failures` on conversations since the change |
| Deciding whether to launch, or checking a launch landed | `ship-check` |
| They already have evals and want a second opinion | `audit-evals` |

Default for a first session: `define-good` (under an hour), then `review-failures` (one to two hours the first time). The review usually pays off before any eval exists.
