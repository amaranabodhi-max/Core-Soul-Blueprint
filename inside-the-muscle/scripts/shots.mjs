// Renders still frames at chosen moments: node scripts/shots.mjs <baseUrl> <outDir> "scene:t[:ui]" ...
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const [base, out, ...specs] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const exe = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1 });
const logs = [];
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && logs.push(`${m.type()}: ${m.text()}`));
page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));
for (const spec of specs) {
  const [scene, t, ui] = spec.split(':');
  const start = Math.max(0, Number(t) - 1.2);
  await page.goto(`${base}?capture&fps=30&scene=${scene}&t=${start}${ui ? '&ui' : ''}`);
  await page.waitForFunction(() => window.__ITM?.ready, null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  // run ~1.2 s of film so smoothing/fades settle
  for (let i = 0; i < 36; i++) await page.evaluate(() => window.__ITM.step());
  await page.locator('#frame').screenshot({ path: `${out}/s${scene}_t${t}${ui ? '_ui' : ''}.png` });
  console.log('shot', spec, await page.evaluate(() => JSON.stringify(window.__ITM.state())));
}
console.log(logs.slice(0, 20).join('\n') || 'no console errors');
await browser.close();
