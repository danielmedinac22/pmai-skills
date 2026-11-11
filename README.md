<img src="assets/icon.svg" width="64" height="64" alt="">

# pmai-skills

Skills for product managers who ship AI agents.

You already have an agent, but you don't know how often it fails, which failures cost you users, or whether last week's change made it better. These skills take you from there to evals you can trust and a launch call you can defend. They handle the mechanics: judges, rubrics, repeated runs. You make the product calls.

## What you get

| Skill | You decide | It hands you |
|---|---|---|
| `ask-pmai` | Which agent, where its conversations are, what metric it should move | `evals/CONFIG.md`, plus your conversations in one format |
| `define-good` | What a good conversation is, job by job | `evals/GOOD.md` |
| `agent-spec` | Autonomy, handoff, what it must never do, budget | `evals/agent-spec.md`, or a critique of your spec |
| `review-failures` | Pass or fail on about 30 real conversations, with a note on each | Failures ranked by what they cost the business |
| `build-evals` | What to test, plus labels on about 40 conversations | Code checks, a judge validated against you, and scripted cases |
| `run-evals` | Which versions to compare | A one-page readout: what got better, what got worse, what to do next |
| `ship-check` | Ship, ship limited, or hold | Evidence, a rollout plan with a holdout, and rollback triggers. After launch, whether it moved the metric |
| `audit-evals` | Nothing | A verdict on your existing evals and the five fixes that matter |

Every finding reaches you in the same form:

> **Says "done" without doing it** - 10 of 66 conversations - orders ship wrong and come back - needs an eval.

## Why not just ask Claude?

You can, and it will find most of the failures. In our side-by-side tests, Claude with and without these skills found the same 9.5 of 10 planted failures. The difference shows up after that.

Without the skills, the model sets the bar itself. It labels the conversations, calibrates its judge against its own labels, and picks launch thresholds after it has seen the results. With the skills, you set the bar:

- You review conversations before you see the model's opinion.
- You decide what "good" means.
- Your labels validate the judge.
- The launch bar is written before any numbers come in.

What you get back is a decision, not a list: the share of conversations each failure affects, the money at stake, who owns the fix, and whether it ships.

## The loop

```
ask-pmai -> define-good -> review-failures -> build-evals -> run-evals -> ship-check
                 ^               |                                           |
             agent-spec     fix the obvious                   bad conversations feed back
```

For a first session, run `ask-pmai`, `define-good` and `review-failures`. It takes two to three hours, and the review usually pays for itself before any eval exists.

## Try it without your own agent

`examples/whatsapp-store/` holds 66 anonymized conversations from a real WhatsApp sales and support agent for a cash-on-delivery store. Run `ask-pmai` and choose the demo. When you finish `review-failures`, compare your failure list with the answer key.

## Learn mode

`ask-pmai` asks whether you want learn mode. When it is on, each concept gets one plain sentence the first time it comes up, explained with your own data. There are no lectures.

## Install

Pick one route. Installing both gives you every skill twice.

**Claude Code plugin:**

```
/plugin marketplace add danielmedinac22/pmai-skills
/plugin install pmai-skills@pmai
```

**Any agent that reads skills** (Claude Code, Codex, Cursor, and others):

```
npx skills@latest add danielmedinac22/pmai-skills
```

The `npx` route copies only the skills. To use the demo, clone the repo and point `ask-pmai` at `examples/whatsapp-store/`.

Then say "I want to set up evals for my agent", or run `/pmai-skills:ask-pmai`. The checks the skills write are small Python scripts, so you need Python 3.

## Where it comes from

We built the method while evaluating a production reconciliation agent against Claude Code and Codex on the same jobs. We then tested it on a production WhatsApp commerce agent, and every round of testing changed the skills. It borrows from three places:

- **Harvey's LAB benchmark:** atomic pass/fail criteria, all-pass grading, and two independent judges.
- **tau-bench:** simulated users with hidden rules, and judging an agent by whether it passes every run.
- **Hamel Husain and Shreya Shankar's error analysis:** read the data first, use binary judges, and validate each judge against a human.

What this repo adds is the PM side:

- each failure tied to the business metric it moves;
- launch gates with a holdout;
- human review that labels results instead of overwriting scores;
- a check that eval scores actually predict outcomes.

For deeper engineering tooling for judges and annotation, [ai-evals-course/evals-skills](https://github.com/ai-evals-course/evals-skills) pairs well with these skills.

## License

MIT
