---
name: animate-illustration
description: Turns a static explainer illustration (a diagram, a flow, a loop, a chart, a before-and-after) into a short looping video for LinkedIn, a deck or a README. Rebuilds the image as SVG and HTML, choreographs it so the motion shows the order and the cause the still image compresses, and renders an MP4, a GIF and a poster frame by code. Use when someone shares an image or an infographic and says "make this move", "animate this diagram", "animated version for LinkedIn", "turn this into a video", or wants a motion graphic of a concept.
---

# Animate an illustration

A still illustration makes the reader work out the order: what happens first, what causes what, what repeats. The animated version shows that order. Motion earns its place only when it does.

The user owns the idea and the final look. You own the rebuild, the timing and the render.

## 1. Read the illustration

Read the image or the description. Write `story.md` next to where the scene will live:

- The idea in one sentence.
- The beats in causal order, one idea per beat. For each beat: what appears or changes, and why it comes after the beat before it.
- What repeats. Loops, retries and "something changed, start again" are the most valuable things to animate. Show at least two passes so the viewer sees it is a loop.
- Two views of the same idea, such as a diagram and a chart. Write which beat in one causes which change in the other.

Done when every element in the image belongs to a beat, and the beats read as a story out loud.

## 2. Rebuild it as vectors

Copy `template.html` to `scene.html`. Rebuild the illustration in inline SVG and HTML at 1080x1350 (4:5, the tallest LinkedIn feed format) unless the user asks for another size. Match the layout, palette, type and stroke weights of the original. Sample colors from the image. Draw every line as a path so it can draw on. Never animate the raster.

Keep the user's wording. If the user only described the idea, propose the layout in `story.md` first.

Done when a screenshot of the final frame reads as the original illustration, rebuilt.

## 3. Choreograph

Give every moving element a start time with `--at` and a motion class from the template: `draw`, `pop`, `rise`, `fade`, `wipe`. Follow `motion.md` for timing, easing, loops and the patterns for dashed lines, travelling dots and synced charts.

Done when the title shows at frame 0, the total runs 8 to 15 seconds, and the final frame holds for at least 2.5 seconds.

## 4. Render

Once per machine (needs Node 18+ and ffmpeg):

```
cd <this skill>/scripts && npm install && npx playwright install chromium
```

Then:

```
node <this skill>/scripts/render.mjs scene.html out/scene.mp4 --gif --stills 1,4,7
```

It pauses every CSS animation and seeks it frame by frame, so the video is exact at any speed. It writes the MP4 (H.264, 30 fps), `scene-poster.png` (the final frame), the GIF with `--gif`, and one PNG per time in `--stills`.

Done when the command prints `Done` and the files exist.

## 5. Check and hand off

Pick stills at the middle of each beat and read them with the poster. Check:

- Nothing overlaps or clips at any still, including text the animation moves.
- Each beat starts after the one it depends on.
- The poster matches the original illustration.
- Each pass of a loop changes the second view, if there is one.

Fix and render again until all four hold. Then hand the user:

- The MP4, to upload as a native video. LinkedIn autoplays it muted and loops it.
- The poster, to upload as the video thumbnail.
- The GIF, for Slack, docs and READMEs.

See `examples/eval-loop/` for a finished scene and its story.
