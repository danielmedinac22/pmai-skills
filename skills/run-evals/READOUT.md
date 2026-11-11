# Readout template

Keep it to one page. The PM should be able to forward it as-is.

```markdown
# Eval readout - <date>
Question: <the one sentence this run answers>
Versions: <A> vs <B> · Runs: k=<n> · Case versions: <ids@versions> · Comparable with last readout: yes | no (<why>)
Agent tested: real | STAND-IN (says nothing about the real agent) · First run: yes (baseline) | no

## Decision
<Ship B | Keep A | Fix X first | Not enough evidence: run Y>, because <one sentence>.

## What changed for users
| Job / failure | A | B | Runs | Metric it hits | Read |
|---|---|---|---|---|---|
| Confirms order before shipping (runs passed) | 2/5 | 4/5 | 5 | confirmation rate | better |
| Promises dates carrier can't meet (% convs) | 9% | 3% | 1,240 convs | returns | better |
| Hands off angry customers | 5/5 | 3/5 | 5 | escalation / churn | worse - blocks ship |

## Regressions (should be ~100%)
<any regression check or case under its bar, with an example id>

## Never rules
<violations, each with conversation id. Zero is the only passing number.>

## Cost and speed
Cost per resolved conversation: A $<x> · B $<y>. Median response time: A <s> · B <s>.

## Not the agent's fault
Failures caused by the case, the harness, or the platform, and who owns each.

## Next
1. <the single most valuable fix, with its expected effect>
2. ...
```

Rules:

- Show a rate together with its count: "3/5 runs" or "9% of 1,240 conversations". A percentage on its own hides how thin the evidence is. When the count is under about 100, add a rough range ("9%, likely 5-15%").
- When the PM labeled any verdict, show both numbers: "32/51 criteria (33/51 with PM labels)". Never show only the corrected one.
- Mark lines that rest on an unvalidated judge as "unvalidated".
- When the difference between versions is within one run out of five, call it a tie.
- Put the criteria-passed rate in an appendix, not in the table. It helps diagnose a failure, but it does not rank versions.
