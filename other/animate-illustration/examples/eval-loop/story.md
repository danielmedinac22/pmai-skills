# Story: the eval loop

**Idea:** reviewing real failures before building evals is a loop, and each pass lowers the failure rate.

## Beats

1. **0.0 s. Title.** Visible at frame 0 so the feed never shows an empty canvas.
2. **0.3 to 2.5 s. The four steps, left to right.** Conversations, Review, Evals, Ship. Each node pops, then its arrow draws to the next one. Order matters: you can't build an eval before you review.
3. **2.8 to 3.9 s. The feedback path.** Dashed, in the accent color, from Ship back to Conversations. It draws after Ship exists because bad conversations only appear after you ship.
4. **3.9 to 4.9 s. The chart.** Axes draw, release labels fade in, the v1 point pops. One point only: nothing has looped yet.
5. **5.2 to 10.0 s. Three passes of the loop.** In each pass the steps light up in order, a dot travels the feedback path, and the chart draws the next release, lower than the last.
6. **10.3 s. The takeaway.** "fewer failures every loop".
7. **10.3 to 13.0 s. Hold.**

## Two views

The diagram is the cause and the chart is the effect. Each pass ends with the dot arriving back at Conversations, and only then does the next chart segment draw.
