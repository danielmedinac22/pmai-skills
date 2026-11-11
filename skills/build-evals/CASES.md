# Building a case

A case tests one job end to end against the live agent. Write one case well before you write ten. The first case is where the template gets proven.

## Layout

```
evals/cases/<case-id>/
  case.md             what the case is, its version, what the agent must never see
  tasks/T1.md ...     what the user asks, in order
  simulated-user.md   hidden: who the user is and what they answer
  planted.md          hidden: problems planted in the scenario, each traced to a real failure
  expected/           hidden: the right result for each task
  rubric.md           hidden: atomic pass/fail criteria
  CHANGELOG.md        every change, and whether it breaks comparison
```

## case.md

```markdown
---
id: <case-id>
version: 0.1
status: draft | piloted | counting
job: <job from GOOD.md>
type: regression | capability
held_out: <variant id, or "none">
hidden: [simulated-user.md, planted.md, expected/, rubric.md]
---
# <Case title>
The situation in three sentences: who the user is, what they need, what makes it hard.
Real conversations it is based on: <ids>.
```

## tasks/T<n>.md

Most cases have a single task. Use a sequence of tasks only when the job really spans several sessions, such as "place the order" and then "change the address the next day". Each task starts a new session with the same context the real user would have.

```markdown
# T1 - <name>
Context given to the agent: <files, account state, earlier order>
Request (send exactly):
> <the user's first message, under 50 words, in their voice>
After the request: the simulated user answers per simulated-user.md.
Finished when: <the agent says it is done and every scripted move in simulated-user.md has been sent | 20 turns | 15 minutes>
If the agent says it is done before a scripted move, send the move next and keep going until the agent answers it.
Save: transcript, tool calls, final state (order, ticket, message drafts)
```

A request never names the mechanism. Write "I want two of the blue ones sent to my sister's place", not "create an order with a shipping-address override".

## simulated-user.md

```markdown
# Simulated user - <persona>
Who: <one paragraph, how they write, what they know and don't know>

## Answers (only when asked about that topic)
| # | If the agent asks about... | Answer exactly |
|---|---|---|
| R1 | ... | "..." |

## Scripted moves (sent whatever the agent says)
| # | Sent right after | Message exactly |
|---|---|---|
| M1 | the user gives <detail> | "..." |

Each planted problem the user causes (a correction, a change of mind) is a scripted move.

## Anything else
"I don't know, you decide and tell me what you assumed."
That phrase never counts as approval to act. Approvals come only from the table.

## Does not
- volunteer information, except the scripted moves above
- correct the agent unless asked
- repeat or rephrase the request
```

You can play the simulated user yourself, or give the file to a sub-agent. In either case, follow these rules:

- **Only one nudge.** If the agent stops without finishing, send "Go ahead." once per task, and nothing else.
- **No help.** Do not rephrase the request, do not hint, and do not retry so the agent passes. If it does not get there, that is the result.
- **Product buttons.** Accept the product's own gates as they are (approve plan, allow permission) and record them. They are not business decisions.
- **Unscripted questions.** Log every question the script does not cover. It is a gap in the case. Fix it in the next version, as an answer in the table or as an "I don't know" rule.

## planted.md

```markdown
| ID | Planted problem | From real failure | Where it appears | Correct handling |
|---|---|---|---|---|
| P1 | Customer corrects the address mid-conversation | trace t014 | T1, message 3 | Order ships to the corrected address and the agent confirms it back |
| P0 | Clean: nothing wrong | - | T2 | Agent completes the job with no false alarm |
```

Every planted problem comes from a failure mode in the failure review. A case with no clean variant cannot tell you whether the agent raises false alarms.

## expected/ and rubric.md

Write the expected result as data whenever you can (the order fields, the amount, the date), so a code check can compare it. Then write the rubric:

```markdown
Case passes only if every criterion passes. Also report criteria passed / total, as a diagnostic.
Precondition: <a deliverable exists>. If it does not, the case fails and is logged "did not deliver".

| ID | Planted | Layer | Grader | Graded on | PASS if | FAIL if |
|---|---|---|---|---|---|---|
| C1 | P1 | Result | code | final order | ship-to equals corrected address | any other address |
| C2 | P1 | Communication | judge | final message | confirms the corrected address back to the user | does not mention it |
| C3 | - | Process | judge | transcript | asks before charging anything extra | charges or promises without asking |
```

Use three layers: **Result** (the end state is right), **Process** (it asked or got approval where it had to), and **Communication** (the user understood what happened).

A criterion is in the rubric only if a demanding human reviewer of this job would check it. Give each planted problem one criterion per thing that reviewer checks: noticed it, got it right, told the user, took the right next step.

## Held-out variant

For each case, keep one variant aside: the same job, with different details and different planted values. Do not look at it while the team tunes the prompt. Run it only to confirm that an improvement is real, not memorized.

## CHANGELOG.md

```markdown
## 0.2 - <date>
- Changed: <what> · Surface: request | simulated user | planted | expected | rubric | judge
- Breaks comparison with earlier runs: yes | no
```

Change the expected result or the rubric only with a reason and a new version. Keep old runs; mark them with the version they ran on.
