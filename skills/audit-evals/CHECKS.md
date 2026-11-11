# Audit checks

Each check states what a passing setup looks like, why it matters, and how to spot a fail.

## A. Grounded in real failures

1. **Someone read real conversations before writing graders.** A failure list exists, built from conversations someone actually reviewed. *Fail if* graders exist but nobody can point to the conversations that motivated them. Graders written that way test imagined problems.
2. **Failure modes are specific.** They have names like "quotes shipping for regions we don't serve", not "hallucination", "helpfulness" or "toxicity". *Fail if* the categories could apply to any chatbot.
3. **The review is recent.** Conversations were reread after the last major change of model, prompt or tools, or within the last month for a live agent. *Fail if* the error analysis predates the current version.
4. **The person who owns "good" labels.** A domain expert or the PM sets the bar and labels the examples. *Fail if* labels come only from contractors or engineers without domain judgment, or from an LLM.
5. **Reviewers see whole conversations.** Reviewers see the full conversation and tool calls in a readable view. *Fail if* they grade raw JSON, single spreadsheet cells, or only the final answer.

## B. Graders you can trust

6. **Verdicts are binary.** Each criterion is PASS or FAIL with a written reason. *Fail if* it uses 1-5 or 1-10 scales, or scores without a threshold that maps to a decision.
7. **One failure per judge.** Each judge checks one failure mode. *Fail if* a single judge rates "overall quality" or several things at once.
8. **Code where code works.** Format, presence, amounts, dates, tool calls and timing are checked by code. *Fail if* an LLM judge checks something a few lines of code could.
9. **Judges are validated against a human.** Each judge's catch rate (failures it catches) and clean rate (good conversations it passes) were measured against the bar owner's labels on a held-out set. *Fail if* there is no validation, if only plain accuracy or percent agreement is reported, or if the only check is agreement between two judges.
10. **No leakage.** The examples in a judge prompt are not part of the set used to measure it.
11. **Grade the outcome, not the path.** Criteria check the end state and what the user understood. *Fail if* criteria require an exact tool sequence or exact wording.

## C. Cases that test the job

12. **Cases are complete user jobs.** Each case is something a user came to get done, in their own voice. *Fail if* cases are single-turn trivia, or the request tells the agent how to do it.
13. **Cases are unambiguous.** Two experts would reach the same verdict, the expected result passes, and an empty answer fails. *Fail if* nobody has checked.
14. **The set is balanced.** It includes cases where the agent should act and cases where it should not, plus clean cases that catch false alarms. *Fail if* every case contains a problem to find.
15. **The simulated user is disciplined.** If cases use a simulated user, it has fixed answers, does not volunteer information, and its "you decide" never counts as approval. *Fail if* the simulated user improvises freely or helps the agent.

## D. Runs you can compare

16. **Pilots are separate.** The first run of a new or changed case is treated as a pilot and excluded from scores. *Fail if* results from runs that exposed broken cases are in the headline.
17. **There are repeated runs.** Customer-facing jobs are run at least 3 times and reported as "passes every run". *Fail if* conclusions rest on a single run per case.
18. **Regression and capability are separate.** Regression sits near 100%. Capability starts low and is expected to climb. *Fail if* they are mixed, or if a capability suite shows about 100%, which means it is saturated and no longer measures progress.
19. **Runs are isolated.** Each run starts clean, without memory, files or access left over from earlier runs. *Fail if* the agent can see answers, earlier runs, or tools outside the test.
20. **Cases are versioned.** Every change to a case, rubric or judge is logged with whether it breaks comparison. *Fail if* scores from different case versions are plotted on one line.
21. **There is a held-out set.** Some cases are kept out of prompt tuning and used only to confirm gains. *Fail if* every case has been used to tune the prompt.

## E. Tied to the business

22. **Each failure has a metric.** Each tracked failure mode is linked to the business metric it hurts, with an estimate of how much. *Fail if* scores cannot be translated into "this costs us X".
23. **The launch bar was written first.** The pass rates required to ship were set before results were known. *Fail if* the bar moved after the numbers came in, or reads "high accuracy".
24. **Production is watched.** Live conversations are sampled and graded, there are signals and rollback triggers, and a holdout exists for launches. *Fail if* evals are offline only.
25. **Evals predict outcomes.** Someone has checked that conversations that pass the evals lead to better business outcomes than those that fail. *Fail if* this was never checked. The evals may be optimizing something users do not care about.
26. **Someone reads transcripts on a schedule.** A named person reads conversations at least monthly. *Fail if* the team only looks at dashboards.
