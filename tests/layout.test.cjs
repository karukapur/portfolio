const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const code = readFileSync(require('node:path').join(__dirname, '../profile/layout.js'), 'utf8');
function layout({ width = 1440, height = 900, touch = false, reduce = false } = {}) {
  const compact = { matches: width <= 820 || height < 600 || touch, addEventListener(_, fn) { this.change = fn; } };
  const reduced = { matches: reduce, addEventListener(_, fn) { this.change = fn; } };
  const timers = new Map(); let id = 0, reloads = 0;
  const context = { matchMedia: q => q.includes('reduced-motion') ? reduced : compact,
    setTimeout: fn => { timers.set(++id, fn); return id; }, clearTimeout: n => timers.delete(n),
    requestAnimationFrame: fn => { timers.set(++id, fn); return id; }, cancelAnimationFrame: n => timers.delete(n),
    document: { documentElement: { classList: { remove() {}, add() {} } }, querySelectorAll: () => [{ id: 'projects', getBoundingClientRect: () => ({ top: 40 }) }] },
    innerHeight: height, history: { state: null, replaceState(_, __, hash) { context.hash = hash; } },
    location: { reload: () => reloads++ } };
  context.window = context;
  vm.runInNewContext(code, context);
  return { context, compact, flush: () => { const work = [...timers.values()]; timers.clear(); work.forEach(fn => fn()); }, reloads: () => reloads };
}
test('document mode covers narrow, shallow, landscape touch and reduced motion', () => {
  for (const options of [{ width: 820 }, { height: 599 }, { width: 932, touch: true }, { reduce: true }]) {
    assert.equal(layout(options).context.PortfolioLayout.documentMode, true);
  }
  for (const options of [{}, { width: 3440, height: 1440 }, { width: 1024, height: 600 }]) {
    assert.equal(layout(options).context.PortfolioLayout.documentMode, false);
  }
});
test('mode changes debounce and retain the current document section', () => {
  const l = layout({ width: 390 });
  l.compact.matches = false;
  l.compact.change(); l.compact.change(); l.flush();
  assert.equal(l.reloads(), 1);
  assert.equal(l.context.hash, '#projects');
});
test('temporary boundary crossing does not reload and resize callbacks coalesce', () => {
  const l = layout();
  l.compact.matches = true; l.compact.change();
  l.compact.matches = false; l.compact.change(); l.flush();
  assert.equal(l.reloads(), 0);
  let calls = 0; const resize = l.context.PortfolioLayout.schedule(() => calls++);
  resize(); resize(); resize(); l.flush(); assert.equal(calls, 1);
});

test('mobile and reduced motion skip desktop dependencies; desktop loads them in order', () => {
  const html = readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
  const loader = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .find(([, script]) => script.includes('document.write('))[1];
  for (const [documentMode, expected] of [[true, 0], [false, 2]]) {
    const writes = [];
    vm.runInNewContext(loader, { PortfolioLayout: { documentMode }, document: { write: markup => writes.push(markup) } });
    assert.equal(writes.length, expected);
    if (!documentMode) {
      assert.match(writes[0], /\/gsap\.min\.js"><\/script>$/);
      assert.match(writes[1], /\/Observer\.min\.js"><\/script>$/);
    }
  }
});

test('returning to desktop preserves a project deep link that is still visible', () => {
  const l = layout({ width: 390 });
  l.context.location.hash = '#flipwords';
  l.context.document.getElementById = id => id === 'flipwords' ? { getBoundingClientRect: () => ({ top: 88, bottom: 500 }) } : null;
  l.compact.matches = false;
  l.compact.change(); l.flush();
  assert.equal(l.context.hash, undefined);
  assert.equal(l.context.location.hash, '#flipwords');
  assert.equal(l.reloads(), 1);
});
