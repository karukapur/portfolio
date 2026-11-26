/* Run with Playwright installed externally: NODE_PATH=/path/to/node_modules node scripts/verify-responsive.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');
const base = process.env.PORTFOLIO_URL || 'http://localhost:4173';
const output = process.env.PORTFOLIO_QA_OUTPUT || path.join(os.tmpdir(), 'portfolio-responsive-qa');
const sizes = [[821,600],[821,720],[1024,701],[1101,761],[1024,600],[1280,720],[1366,768],[1440,900],[1490,712],[1709,982],[1920,920],[1920,1080],[2560,1440],[3440,1440],[3840,2160],[2560,720],[5120,1440],[1280,599],[320,667],[360,740],[390,844],[430,932],[768,1024],[820,1180],[932,430]];
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.PORTFOLIO_CHROMIUM ? { executablePath: process.env.PORTFOLIO_CHROMIUM } : {}) });
  const results = [];
  try {
    for (const [width, height] of sizes) {
      const touch = width <= 820 || height === 430;
      const context = await browser.newContext({ viewport: { width, height }, isMobile: touch, hasTouch: touch,
        deviceScaleFactor: width === 1709 ? 2 : 1 });
      const page = await context.newPage();
      const errors = []; const dependencies = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (/gsap|three@/.test(request.url())) dependencies.push(request.url()); });
      await page.goto(base, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const scene = await page.evaluate(() => !!window.Stage?.enabled);
      assert.equal(scene, !touch && height >= 600, `${width}x${height}: incorrect layout mode or missing animation dependencies`);
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
        const readingSize = await page.locator('.wi-panel').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        assert(readingSize >= 16 && readingSize <= 21, `${label}: Work copy outside its reading range`);
        const heading = await page.locator('.wi-mark').boundingBox();
        const copy = await page.locator('.wi-body').boundingBox();
        assert(heading && heading.x >= 0 && heading.x + heading.width + 8 <= copy.x &&
          heading.y >= 64 && heading.y + heading.height <= height - 86,
          `${label}: vertical Selected Work heading overlaps the layout`);
        const ids = await page.locator('.wi-dock [data-go]').evaluateAll(nodes => nodes.map(node => node.dataset.go));
        for (const id of ids) {
          await page.locator(`.wi-dock [data-go="${id}"]`).click();
          await page.waitForFunction(id => Stage.web.hash === id, id);
          const tabs = page.locator('.wi-tabs [role="tab"]');
          assert.equal(await tabs.count(), 5, `${label}/${id}: missing Work tab`);
          for (const tab of await tabs.all()) {
            await tab.click();
            const panel = page.locator('#' + await tab.getAttribute('aria-controls'));
            assert(await panel.isVisible(), `${label}/${id}: selected tab panel hidden`);
            const fits = await page.locator('.wi-body').evaluate(body => {
              const rect = body.getBoundingClientRect();
              const dock = document.querySelector('.wi-dock');
              const header = document.querySelector('.site-header').getBoundingClientRect();
              const preview = document.querySelector('.mb-screen').getBoundingClientRect();
              return rect.top >= header.bottom && rect.bottom + 4 <= dock.getBoundingClientRect().top &&
                rect.right <= preview.left && [body, ...body.querySelectorAll('*'), dock].every(el => {
                  if (!el.clientWidth) return true;
                  // An unclipped font can paint beyond its line box without needing a scroll area.
                  const style = getComputedStyle(el);
                  return (style.overflowY === 'visible' || el.scrollHeight <= el.clientHeight + 1) &&
                    el.scrollWidth <= el.clientWidth + 1;
                });
            });
            assert(fits, `${label}/${id}/${await tab.textContent()}: clipped content or overlap`);
          }
          assert(await page.locator('#wi-details .wi-go').isVisible(), `${label}/${id}: missing project link`);
          const caseLink = page.locator('.sus-case-study');
          assert.equal(await caseLink.getAttribute('href'), 'profile/project.html?id=' + id);
          assert(await caseLink.isVisible(), `${label}/${id}: missing case study`);
          await tabs.last().press('ArrowRight');
          assert.equal(await tabs.first().getAttribute('aria-selected'), 'true');
          await tabs.first().evaluate(el => el.blur());
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
