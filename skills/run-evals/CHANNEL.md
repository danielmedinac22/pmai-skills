# A safe test channel to the agent

Cases run against the PM's real agent: the same prompt, settings, model and reply parsing that users get. A production agent can send messages, write to databases and spend money, so confirm the channel is safe before the first run.

## What counts as their agent

Any of these:

- A staging or test environment that runs the production code.
- A test account or test number that does not reach real customers.
- A wrapper that calls the same production functions (build the prompt, call the model, parse the reply) with every side effect replaced by a line in a local log.

Record what the channel skips, such as queues, webhooks, timing, the human team or later automated messages. Results only speak for what the channel contains.

A **stand-in** (another model role-playing the agent from its description) tests the case, never their agent. Label every stand-in run `STAND-IN` in `run.json` and in the readout.

## Four conditions, confirmed from the code before anything runs

Write `evals/CHANNEL.md` in the PM's workspace. Cite the file and line for each condition:

1. **Sends nothing to real users.** No messaging provider, email or notification is reachable. For a wrapper, block every network host except the model provider.
2. **Writes nothing to production.** Database reads, if any, go through a read-only connection. Every tool with side effects is stubbed and logged instead.
3. **Pays with a test key under a spend cap.** Set a cap per conversation and a cap per run.
4. **Leaks no secrets.** Load keys by name only. Never print or copy their values.

If you cannot confirm conditions 1 and 2, do not run. Write the ask for engineering instead:

> "A way to send the agent a test message and read back its reply and tool calls, without touching real customers or production data."

## Cost

The agent's own cost is usually tiny. The expensive part tends to be the simulated user. If the pilot shows the agent asks nothing outside the simulated user's answer table, replay the scripted moves with a script for the counting runs. It is just as faithful and costs nothing.
