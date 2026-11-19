/* Run with Playwright installed externally: NODE_PATH=/path/to/node_modules node scripts/verify-responsive.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');
const base = process.env.PORTFOLIO_URL || 'http://localhost:4173';
const output = process.env.PORTFOLIO_QA_OUTPUT || path.join(os.tmpdir(), 'portfolio-responsive-qa');
const sizes = [[1024,600],[1280,720],[1366,768],[1440,900],[1920,1080],[2560,1440],[3440,1440],[3840,2160],[2560,720],[320,667],[360,740],[390,844],[430,932],[768,1024],[820,1180],[932,430]];
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.PORTFOLIO_CHROMIUM ? { executablePath: process.env.PORTFOLIO_CHROMIUM } : {}) });
  const results = [];
  try {
    for (const [width, height] of sizes) {
      const touch = width <= 820 || height === 430;
      const context = await browser.newContext({ viewport: { width, height }, isMobile: touch, hasTouch: touch });
      const page = await context.newPage();
      const errors = []; const dependencies = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (/gsap|three@/.test(request.url())) dependencies.push(request.url()); });
      await page.goto(base, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const scene = await page.evaluate(() => !!window.Stage?.enabled);
      assert.equal(scene, !touch, `${width}x${height}: incorrect layout mode or missing animation dependencies`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}x${height}: horizontal overflow`);
      const label = `${width}x${height}`;
      await page.screenshot({ path: path.join(output, `${label}-hero.png`) });
      if (scene) {
        for (const station of ['work', 'web', 'end']) {
          await page.evaluate(name => Stage.go(name, { instant: true }), station);
          await page.waitForFunction(name => Stage.state.station === name, station);
          await page.waitForTimeout(700); // Allow the card deal and scene-specific transitions to settle.
          await page.screenshot({ path: path.join(output, `${label}-${station}.png`) });
        }
        await page.evaluate(() => Stage.go('web', { instant: true }));
        await page.waitForFunction(() => Stage.state.station === 'web');
        const ids = await page.locator('.wi-dock [data-go]').evaluateAll(nodes => nodes.map(node => node.dataset.go));
        for (const id of ids) {
          await page.locator(`.wi-dock [data-go="${id}"]`).click();
          await page.waitForFunction(id => Stage.web.hash === id, id);
          const bounds = await page.locator('.wi-body').boundingBox();
          assert(bounds.y >= 64 && bounds.y + bounds.height <= height - 80, `${label}/${id}: description crosses fixed controls`);
          assert(await page.locator('.wi-body a[href*="project.html"]').count() > 0, `${label}/${id}: missing case study`);
          await page.screenshot({ path: path.join(output, `${label}-${id}.png`) });
        }
      } else {
        assert.deepEqual(dependencies, [], `${label}: mobile fetched desktop animation dependencies`);
        for (const id of ['projects', 'experience', 'contact']) {
          await page.locator(`.site-header a[href="#${id}"]`).click();
          const top = await page.locator(`#${id}`).evaluate(el => el.getBoundingClientRect().top);
          assert(top >= 60 && top < height - 44, `${label}: ${id} obscured by header`);
        }
        await page.screenshot({ path: path.join(output, `${label}-contact.png`) });
      }
      assert.deepEqual(errors, [], `${label}: JavaScript errors`);
      results.push({ viewport: label, layout: scene ? 'scene' : 'document', errors });
      console.log(`PASS ${label}`);
      await context.close();
    }
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(`Screenshots and results: ${output}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
