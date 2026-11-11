# Writing and validating an LLM judge

## One judge, one failure

A judge answers a single question about a single failure mode: "Did the agent promise a delivery date the carrier does not offer?" It does not answer "Was this conversation good?". A broad question gives a broad verdict that nobody can act on.

## What the judge receives

Give the judge only the material its criterion grades:

- The conversation, or the specific part the criterion names (the final message, the order summary, the handoff note).
- The criterion, with its PASS if and FAIL if text.
- The reference facts it needs, such as the catalog price, the shipping days, or the expected answer for that case.

Leave out everything else:

- The simulated user's hidden rules, so it grades what happened and not what the agent "should have known".
- Anything the criterion does not name, so the judge does not find a pass somewhere else.

## Template

Save the following as `evals/checks/<id>.judge.md`:

```
You grade one criterion on one conversation from <agent>, which <job>.

Criterion <id>: <name>
PASS if: <observable condition>
FAIL if: <observable condition>
Reference facts: <only what this criterion needs>

Rules:
- The criterion is the only standard. Answer PASS or FAIL, nothing in between.
- If the criterion needs something that does not appear in the material, answer FAIL.
- Quote the exact message or field that decides the verdict.
- Grade the result, not the method. Length and style are not criteria.

Examples:
<2-4 labeled examples from the training split, at least one PASS and one FAIL, each with its reason>

Material:
<only what the criterion grades>

Answer as JSON: {"criterion": "<id>", "verdict": "PASS" | "FAIL", "evidence": "<quote>", "reason": "<one sentence>"}
```

Run the judge at temperature 0 when the model allows it. Run it in a session separate from the agent under test. It should be a different model from the one the agent uses whenever one is available.

## Validate against the PM

A judge is only as good as its agreement with the person who owns the bar.

1. **The PM labels conversations.** Aim for at least 40, with at least 15 failures. Use the failure review's sample first and add conversations the check flagged until both sides are covered. The PM labels them before seeing any judge output.
2. **Split the labels.** About 20% are training examples you may put in the prompt. The rest is the test set. Test conversations never go into the prompt.
3. **Run the judge on the test set and measure two numbers:**
   - **Catch rate** (true positive rate): of the conversations the PM marked FAIL, the share the judge also failed.
   - **Clean rate** (true negative rate): of the conversations the PM marked PASS, the share the judge also passed.
4. **Fix and rerun.** Read every disagreement. Either the criterion is ambiguous, so rewrite it, or the judge misses a pattern, so add a training example. Stop when both rates are at least 90%, or tell the PM which rate is short and what that means. For example, "it misses 1 in 5 real failures".
5. **Record the result** at the top of the judge file: date, number of labels, catch rate, clean rate, and the model.

Do not report plain accuracy. If 90% of conversations pass, a judge that always says PASS scores 90% while catching nothing.

## Optional second judge

For high-stakes checks, such as "Never" rules or the launch bar, run a second judge from another model provider. Report three things:

- whether both judges pass;
- the average of the two;
- each judge's rate.

The PM reviews the disagreements to find badly written criteria. The PM does not change scores by hand.

## Re-validate

Validate the judge again when the agent's model changes, when the criterion changes, or when a new failure review shows behavior the judge has not seen.
