// Records the whole film frame-by-frame (deterministic, no dropped frames) to a vertical MP4.
//   npm run dev            (in another terminal)
//   node scripts/capture.mjs [url] [out.mp4] [height] [scene]
// Defaults: http://localhost:5173/  inside-the-muscle.mp4  1280 (→ 720×1280). Use 1920 for 1080×1920.
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';

const url = process.argv[2] || 'http://localhost:5173/';
const out = process.argv[3] || 'inside-the-muscle.mp4';
const height = Number(process.argv[4] || 1280);
const only = Number(process.argv[5] || 0); // optional: record just scene N (1-5), for parallel renders
const FPS = 30;
const scale = height / 960;
const exe = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: scale });
page.on('pageerror', (e) => console.error('pageerror', e.message));
await page.goto(`${url}?capture&film&fps=${FPS}${only ? `&scene=${only}` : ''}`);
await page.waitForFunction(() => window.__ITM?.ready, null, { timeout: 60000 });
await page.evaluate(() => document.fonts.ready);

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });

const frame = page.locator('#frame');
let n = 0;
const t0 = Date.now();
while (!(await page.evaluate(() => window.__ITM.done())) && n < FPS * 300) {
  if (only && (await page.evaluate(() => window.__ITM.state().scene)) !== only - 1) break;
  await page.evaluate(() => window.__ITM.step());
  const png = await frame.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
  n++;
  if (n % 150 === 0) {
    const st = await page.evaluate(() => window.__ITM.state());
    console.log(`frame ${n} (${(n / FPS).toFixed(1)} s film) scene ${st.scene + 1} · ${((Date.now() - t0) / 1000).toFixed(0)} s elapsed`);
  }
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log(`done: ${n} frames → ${out}`);
