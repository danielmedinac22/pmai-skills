# Grading, human review, and re-grading

A grade is evidence you can re-grade later. A human's judgment is a label that measures the grader. It never replaces a grade.

## Keep the evidence

Save everything a grader looked at with each run: transcripts, tool calls, final state, and deliverables. When a criterion or a judge changes, you re-grade the saved evidence. You do not run the agent again.

## When the PM disagrees with a grade

The PM reviews the criteria where graders disagree, or any verdict that looks wrong. Their reading goes to `evals/runs/<run>/labels.jsonl`, one line per reading, with these fields: criterion, conversation or task, label (PASS or FAIL), who, date, and evidence. Leave the stored verdicts unchanged.

Then:

1. **Report two numbers.** Show the raw result and, next to it, the result with the PM's labels applied. Show both every time, and never let one replace the other.
2. **Move data decisions to code.** If the PM settled a disagreement by checking data (an amount, a date, a field), turn that criterion into a code check.
3. **Rewrite unclear criteria.** If the disagreement came from loose wording, rewrite the criterion. The new text is a new version.
4. **Feed the labels to the judge's test set.** They count toward its validation (the judge validation in `build-evals`) only if the PM labeled them blind, before seeing the judge's verdict. Mark which ones were blind.

## Disagreements are a biased sample

When two judges disagree, it is tempting to count which one the PM sided with. Do not rank judges that way. The conversations where the judges agree have no label, and both could be wrong there. To compare judges, label a blind random sample for each criterion, including conversations where the judges agree.

## Re-grading

A change to a criterion, a judge prompt, or the expected result is a new grader version. Re-grade the saved runs with it and keep both verdicts. Comparisons across grader versions say "re-graded" in the readout.

## Quarantine

If the expected result, the verifier, or the simulated user's script turns out to be wrong after runs were graded, the case goes into quarantine. Its runs leave the headline until the case is fixed, versioned, and re-graded. If the agent's behavior would differ under the fixed case, run the case again.

## What can block a launch

The Launch bar may rest only on code checks, and on judges validated against the PM for that criterion, as `build-evals` describes. An unvalidated judge still informs the readout. Mark its lines "unvalidated" so nobody takes them for a launch gate.

## For engineering

Wrap the run in a script that exits with a non-zero code when the Launch bar fails, so the suite can run in CI on every change to the prompt, the model, or the tools.
