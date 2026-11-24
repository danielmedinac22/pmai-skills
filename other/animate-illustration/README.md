# animate-illustration

Give Claude a static explainer illustration and it gives you back a looping video of it: same layout, same palette, with the order and the cause shown in motion.

![The eval loop, animated](examples/eval-loop/preview.gif)

A still diagram makes the reader work out what happens first, what causes what, and what repeats. The animated version shows it. In the example above, every pass of the loop draws the next point on the chart.

## How it works

1. Claude reads your image and writes the story: the beats in causal order, what repeats, and which change in one view causes which change in the other.
2. It rebuilds the illustration as SVG and HTML at 1080x1350. No animating the raster: lines are paths, so they draw.
3. It choreographs each element with one start time and one motion (draw, pop, rise, fade, wipe).
4. A script pauses every animation in a headless browser and renders it frame by frame to MP4, GIF and a poster PNG.
5. It checks stills at each beat for overlaps and order, then hands you the files.

## Install

Needs Node 18+ and ffmpeg.

```
npx degit danielmedinac22/pmai-skills/other/animate-illustration ~/.claude/skills/animate-illustration
cd ~/.claude/skills/animate-illustration/scripts && npm install && npx playwright install chromium
```

## Use

In Claude Code, attach your image and say "animate this for LinkedIn". Upload the MP4 as a native video and the poster as its thumbnail.

To render a scene yourself:

```
node ~/.claude/skills/animate-illustration/scripts/render.mjs scene.html out/scene.mp4 --gif
```
