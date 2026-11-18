# Evidence

Judges grade what they can see, so the evidence decides what gets graded. Write one capture script in `capture/` in step 3, and run the same script every round. Save its output in `rounds/r<n>/evidence/` and the measured checks in `rounds/r<n>/checks.json`.

## Screens, prototypes and sites

- Render with a headless browser at the real target size (390 px wide for a phone, 1440 px for desktop). Capture every screen in the groups at full length. Add a crop of the first screen when what shows before scrolling matters.
- From round 1, make pairs: the original and the current version, same screen, same crop, side by side in one image. The fidelity judge reads these first. In round 0 capture the original alone.
- Capture states a static screenshot misses: pressed, focused, disabled, an open sheet or dialog, a toast, an empty or error state.
- Measure with code and save the numbers as JSON: contrast of text and control borders, tap target sizes, input font size, the full text content of every screen (diffed against the original), and every link and button with its destination.
- For motion, record the timing and easing values from the CSS, plus whether reduced motion is respected.

## Documents and specs

- Render to pages as the reader will see them (PDF or HTML), and save page images.
- Save the sources next to them, so the fidelity judge can trace every number and decision.

## Agent prompts

- Fix a set of 10 to 20 inputs before round 0, including the hard cases and anything on the Never list.
- Run the original and the current prompt on the same inputs with the same model. Save every output.
- If the agent runs in production, use `build-evals` and `run-evals` instead. This loop is for a draft.

## Decks

- Export every slide as an image, in the original and the current version, paired.

## References

- Save what the standard judge compares against in `references/`: screenshots of the reference products, or excerpts of reference documents. If you cannot get them, say so in `BAR.md`, and the judge marks that parameter as graded from memory.

## Every type

- Save the hash of the version each round graded.
- Keep the evidence after the run, so a new version of the bar can re-grade it without rebuilding anything.
