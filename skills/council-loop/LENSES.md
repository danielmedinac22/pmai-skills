# Lenses by type of work

The three lenses stay the same: craft, fidelity, standard. What each one checks depends on the work. Start from the row that fits, then rewrite the parameters with the user's intent and references. If the work fits no row, keep the three lenses and write the parameters from what the best human doing this work would check.

| Work | Craft | Fidelity | Standard |
|---|---|---|---|
| Prototype, screen or site | Spacing rhythm, type scale, alignment and geometry, states (pressed, focus, disabled), fine detail | Design tokens, components keep their character, identical copy, same flows and destinations, no regressions | Reading of the key number or action, accessibility (read from the measured checks), platform conventions, density, perceived quality next to references |
| Document or spec | Structure, one idea per section, length, plain language | Facts, numbers and decisions match the sources, nothing invented, scope unchanged | What the reader needs to decide, compared with the best documents of its kind |
| Agent prompt | Clear instructions, no contradictions, examples that teach | The spec and its Never list, tools and handoff rules unchanged | Hard cases solved on a fixed input set, tone next to references |
| Deck or sales piece | Visual hierarchy, rhythm, one message per slide | Brand, approved claims and numbers | What an outsider understands in one pass |

## Good parameters

- Four to six per lens. More than six and judges start scoring them as one.
- Each one names what to look at and what good is: "amounts align right and to each other", not "the numbers look good".
- Put anything a script can measure in the measured checks. A parameter can still grade what the numbers mean together, as accessibility does.
- Fidelity always ends with "No regressions". It is the lens that keeps craft fixes from breaking what the user asked to keep.

## Measured checks by type

- Screens: text contrast (WCAG AA: 4.5:1, or 3:1 for large text), control and field border contrast (3:1), tap target size, input font size (16 px or more, so iOS does not zoom), text content identical to the original, every link and button keeps its destination, nothing clipped or overflowing.
- Tap targets: WCAG 2.2 sets 24 by 24 px as the minimum. Apple asks for 44 pt and Material for 48 dp. A common split is 24 px as a gate and 44 px as info, unless the user wants the platform size as the gate.
- Documents: every number traced to a source, reading length, headings present.
- Prompts: pass rate on the fixed input set, Never items detected by code where possible.
- Decks: slide count, words per slide, approved claims present verbatim.
