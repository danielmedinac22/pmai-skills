<img src="assets/icon.svg" width="64" height="64" alt="">

# pmai-skills

Skills for product managers who ship AI agents.

You already have an agent. You don't know how often it fails, which failures cost you users, or whether the change you shipped last week made it better. These skills take you from there to an eval system you trust and a launch call you can defend. The skills handle the mechanics (judges, rubrics, repeated runs). You make the product calls.

## What you get

| Skill | You decide | It hands you |
|---|---|---|
| `ask-pmai` | Which agent, where its conversations are, what metric it should move | `evals/CONFIG.md` and your conversations in one format |
| `define-good` | What a good conversation is, job by job | `evals/GOOD.md` |
| `agent-spec` | Autonomy, handoff, what it must never do, budget | `evals/agent-spec.md`, or a critique of yours |
| `review-failures` | Pass or fail on about 30 real conversations, with a note on each | Failures ranked by what they cost the business |
| `build-evals` | What to test; labels on ~40 conversations | Checks, a validated judge, and scripted cases |
| `run-evals` | Which versions to compare | A one-page readout: better, worse, what to do next |
| `ship-check` | Ship, ship limited, or hold | Evidence, a rollout plan with holdout, and rollback triggers. After launch: did it move the metric? |
| `audit-evals` | Nothing | A verdict on your existing evals and the five fixes that matter |

Every finding reaches you in the same form:

> **Promises delivery dates the carrier can't meet** - 9% of conversations - confirmed orders drop from 78% to 41% - needs an eval.

## The loop

```
ask-pmai -> define-good -> review-failures -> build-evals -> run-evals -> ship-check
                 ^               |                                           |
             agent-spec     fix the obvious                   bad conversations feed back
```

On a first session, run `ask-pmai`, `define-good` and `review-failures`. That takes two to three hours, and the review usually pays for itself before any eval exists.

## Try it without your own agent

`examples/whatsapp-store/` holds 66 anonymized conversations from a real WhatsApp sales and support agent for a cash-on-delivery store. Run `ask-pmai` and choose the demo. When you finish `review-failures`, compare your failure list with the answer key.

## Learn mode

`ask-pmai` asks whether you want learn mode. With it on, each concept gets one plain sentence the first time it shows up, explained with your own data. You will not get lectures.

## Install

Pick one route. Installing both gives you every skill twice.

**Claude Code (plugin):**

```
/plugin marketplace add danielmedinac22/pmai-skills
/plugin install pmai-skills@pmai
```

**Any agent that reads skills** (Claude Code, Codex, Cursor, and others):

```
npx skills@latest add danielmedinac22/pmai-skills
```

The `npx` route copies only the skills. To use the demo, clone the repo and point `ask-pmai` at `examples/whatsapp-store/`.

## Where it comes from

The method was built while evaluating a production reconciliation agent against Claude Code and Codex on the same jobs, and refined on a WhatsApp commerce agent. It borrows from:

- Harvey's LAB benchmark: atomic pass/fail criteria, all-pass grading, and two independent judges.
- tau-bench: simulated users with hidden rules, and pass^k.
- Hamel Husain and Shreya Shankar's error-analysis practice: read the data first, binary judges, and judges validated against a human.

What this repo adds is the PM side: tying each failure to the business metric it moves, launch gates with a holdout, and checking that eval scores actually predict outcomes.

If you want deeper engineering tooling for judges and annotation, [ai-evals-course/evals-skills](https://github.com/ai-evals-course/evals-skills) complements these skills well.

## License

MIT
