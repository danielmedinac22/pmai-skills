#!/usr/bin/env node
// Renders an animated HTML scene to MP4 (and optionally GIF and stills), frame by frame.
//
// Usage:
//   node render.mjs <scene.html> <out.mp4> [--fps 30] [--gif] [--stills 1,3.5,6]
//
// Contract with the scene:
//   window.STAGE = { width, height, duration }   // pixels and seconds
//   Motion is CSS animations (or Web Animations). The renderer pauses all of them
//   and seeks each one to the frame time, so every frame is exact.
//   Optional: window.seek(seconds) for anything driven by JavaScript.
//
// Always writes <out>-poster.png with the final frame.
// Set CHROME_PATH to use a Chromium you already have.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const [scene, out] = args.filter((a, i) => !a.startsWith('--') && !['--fps', '--stills'].includes(args[i - 1]));
if (!scene || !out) {
  console.error('Usage: node render.mjs <scene.html> <out.mp4> [--fps 30] [--gif] [--stills 1,3.5,6]');
  process.exit(1);
}
const fps = Number(opt('--fps', 30));
const stills = opt('--stills', '').split(',').filter(Boolean).map(Number);
const base = out.replace(/\.mp4$/i, '');

const run = (cmd, cmdArgs, input) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: [input ? 'pipe' : 'ignore', 'ignore', 'inherit'] });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`))));
    if (input) input(p.stdin);
  });

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage();
await page.goto(pathToFileURL(path.resolve(scene)).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const stage = await page.evaluate(() => window.STAGE);
if (!stage?.width || !stage?.height || !stage?.duration) {
  throw new Error('The scene must set window.STAGE = { width, height, duration }');
}
await page.setViewportSize({ width: stage.width, height: stage.height });

// Pause every animation now, then drive time ourselves.
await page.evaluate(() => {
  window.__anims = document.getAnimations();
  window.__anims.forEach((a) => a.pause());
});
const seek = (t) =>
  page.evaluate((t) => {
    const all = new Set([...window.__anims, ...document.getAnimations()]);
    all.forEach((a) => {
      a.pause();
      a.currentTime = t * 1000;
    });
    if (typeof window.seek === 'function') window.seek(t);
  }, t);
const shot = (file) => page.screenshot({ path: file, clip: { x: 0, y: 0, width: stage.width, height: stage.height } });

const frames = Math.round(stage.duration * fps);
console.log(`Rendering ${frames} frames at ${stage.width}x${stage.height}, ${fps} fps`);

await run(
  'ffmpeg',
  ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
   '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
  async (stdin) => {
    for (let i = 0; i < frames; i++) {
      await seek(i / fps);
      const buf = await page.screenshot({ clip: { x: 0, y: 0, width: stage.width, height: stage.height } });
      if (!stdin.write(buf)) await new Promise((r) => stdin.once('drain', r));
      if (i % fps === 0) process.stdout.write(`\r${Math.round((i / frames) * 100)}%`);
    }
    stdin.end();
  },
);
process.stdout.write('\r100%\n');

await seek(stage.duration);
await shot(`${base}-poster.png`);
for (const t of stills) {
  await seek(t);
  await shot(`${base}-t${t}.png`);
}
await browser.close();

if (flag('--gif')) {
  const w = Math.round(stage.width / 2);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', out, '-vf',
    `fps=15,scale=${w}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle`,
    `${base}.gif`]);
}

console.log(`Done: ${out}, ${base}-poster.png${flag('--gif') ? `, ${base}.gif` : ''}${stills.length ? `, ${stills.length} stills` : ''}`);
