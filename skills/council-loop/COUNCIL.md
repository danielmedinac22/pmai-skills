# Running the council

## Independence

- Three judges, one per lens, each a fresh subagent every round. In Claude Code use the Agent tool. In Codex use `spawn_agent`. Run them in parallel.
- Each judge gets: `BAR.md`, and the paths to `original/`, `references/`, the round's `evidence/` and `checks.json`, and from round 1 the fidelity inventory from `rounds/r0/`.
- Each judge never gets: your reasoning, the fix list, earlier rounds' scores or findings, or another judge's verdict. A judge who sees the last score anchors on it.
- Judges only read. They return their verdict as text, and you save it as `rounds/r<n>/judge-<n>.json`.
- Keep the brief identical across rounds. Only the paths change. A change to the brief is a change to the bar.

## Judge brief

Fill in the angle brackets and send everything inside the block, including the verdict shape.

```
You are judge <n> of 3 on a council. Your lens: <lens name>. Your parameters are in the "Judge <n>" section of BAR.md: <path>.

Read BAR.md in full. Then open the evidence yourself: <evidence path>. Compare with the original in <original path> wherever your lens needs it, and with the references in <references path>. The measured checks are in <checks path>; treat those numbers as facts.

You only read. Do not create, edit or delete any file.

Grade only against BAR.md. Your own taste does not count, and anything under "Out of scope" never costs points; list it separately. A group's score is your overall score for that group under your lens.

Be demanding and honest. If you give 9.5 or more, say why it is not 10. Every point below the threshold needs at least one finding with a concrete fix that respects "Must not change".

End your answer with one json block in exactly this shape:
{
  "judge": "<n>",
  "lens": "<lens name>",
  "parameters": {"P1": 0.0},
  "groups": {"G1": 0.0},
  "never": [{"id": "N1", "pass": true, "evidence": "..."}],
  "findings": [
    {"severity": "high|medium|low", "where": ["G2", "screen or section id"], "problem": "what is wrong, concretely", "fix": "the exact change", "points": "which score rises if fixed"}
  ],
  "out_of_scope": ["..."],
  "why_not_10": "..."
}
```

## Round 0 for the fidelity judge

In round 0 the original is compared with itself, so the fidelity judge does not score. Replace the last two paragraphs of its brief with:

```
This is round 0. Do not score. Write an inventory of everything BAR.md says must not change, as found in the original: tokens with their values, components, the full copy or its count per group, flows, and every action with its destination. End with one json block: {"judge": "2", "round": 0, "inventory": {...}}.
```

The gate in round 0 uses the craft and standard judges only.

## Merging

- A verdict that is not valid JSON, or that leaves a parameter or group unscored, is rerun with a fresh judge.
- The round's score for each judge is its lowest score across parameters and groups. The gate uses the lowest of the three.
- A Never fails if a gate check measures it and fails, or if any judge marks it failed with evidence. Check that evidence yourself before you accept it.
- Findings from different judges that name the same problem merge into one, keeping the highest severity.
