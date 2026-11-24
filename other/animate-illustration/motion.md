# Motion rules

## Timing

- One beat at a time. The eye follows one moving thing. Overlap beats by at most 0.15 s, so the next starts as the last one settles.
- Entrances: 0.35 to 0.6 s. Lines: 0.3 s for short arrows, up to 1 s for long paths. Stagger siblings by 0.1 to 0.25 s.
- A label appears 0.2 to 0.3 s after the thing it names.
- Total 8 to 15 s. Hold the complete final frame for at least 2.5 s so a reader can take it in before the loop restarts.

## Easing

- Entrances use `--ease-out`: fast start, soft landing.
- Lines and travel use `--ease-in-out`.
- No bounce, no overshoot, no spin. The illustration explains; it does not perform.

## What moves

- Lines draw in the direction of the flow they represent.
- Nodes and icons `pop`. Text blocks `rise`. Secondary marks `fade`.
- The accent color marks what the story is about. Keep it for that, and use the same accent for the moving parts of the loop.
- Nothing moves after the final frame is complete, except an ambient loop the story needs.

## Patterns

**Dashed lines.** `stroke-dasharray` is taken by the dashes, so `.draw` can't draw them. Put a solid copy of the path inside a `<mask>` with `class="draw"` and a white stroke wider than the line, and apply the mask to the dashed path. For straight dashed lines, `.wipe` on the path works too.

**A travelling dot.** Use an HTML element with `offset-path: path("...")` in stage pixels and animate `offset-distance` from 0% to 100%. Fade it in at the start and out at the end of each pass.

**A loop with passes.** Define `--loop` (first pass) and `--period` (one pass) on `:root`. Give loop animations `animation-iteration-count` equal to the number of passes and `--at: calc(var(--loop) + <offset>)`. Put the visible work of each pass inside the keyframes and keep the rest of the period at rest.

**Two synced views.** Each pass of the diagram ends by changing the chart: draw the next segment at `calc(var(--loop) + n * var(--period) + <offset>)`. The viewer sees the cause, then the effect.

**Counters.** Numbers that count up are driven by JavaScript. Define `window.seek = (t) => { ... }` and set the text from `t`. The renderer calls it on every frame.

## Things that break the render

- Animations that start on hover, scroll or a timer. Everything must be a CSS animation, a Web Animation, or a function of `t` in `window.seek`.
- `Math.random()` or `Date.now()` in the scene. Each frame must be the same on every render.
- Web fonts that never load. The renderer waits for `document.fonts.ready`; if the font is missing, the fallback renders instead.
