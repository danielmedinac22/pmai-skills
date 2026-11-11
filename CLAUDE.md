# Working on pmai-skills

These are skills for product managers who ship AI agents. The reader is a PM: technical enough to run a script, but focused on users and the business. Every change should serve that reader.

## Rules for skills

- Write in English, in short sentences, without em dashes.
- Keep each `SKILL.md` under about 100 lines. Move material that only some branches need into a sibling file and link to it from the step that needs it.
- Write the description for the model: what the skill does, then "Use when..." with the phrases a PM actually says.
- End each step with a "Done when" criterion that can be checked.
- The PM owns decisions; the skill owns facts and mechanics. Never ask the PM for something you can read from the code, the conversations or the config.
- Report findings in this form: failure or job, share or runs, business metric, action.
- Teach only in learn mode, in one sentence, with the PM's own data. Do not write theory sections.
- Phrase instructions positively. Leave out instructions the model already follows by default.
- Name other skills by their skill name (`build-evals`). Do not link to files inside another skill's folder.
- Skills read state from the user's `evals/` folder and write state to it. `evals/CONFIG.md` is the contract between skills.

## Layout

- `skills/<name>/SKILL.md`, plus sibling reference files.
- `skills/<name>/agents/openai.yaml` for Codex.
- `examples/whatsapp-store/`: the demo dataset. It contains anonymized data only. Before committing changes to it, grep for phone numbers, emails, URLs and real names.
- `.claude-plugin/plugin.json` lists every published skill. When you add or remove a skill, update that file and the README table in the same change.
