const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const root = resolve(__dirname, '..');
const read = file => readFileSync(resolve(root, file), 'utf8');

// A small DOM fixture checks selection logic; layout and native keyboard behavior need a browser.
class Element {
  constructor(attrs = {}) {
    this.attrs = attrs; this.children = []; this.dataset = {}; this.events = {}; this.hidden = 'hidden' in attrs;
    this.id = attrs.id; this.textContent = ''; this.style = { setProperty() {} };
    const classes = new Set((attrs.class || '').split(' '));
    this.classList = { add: name => classes.add(name), contains: name => classes.has(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) };
    Object.entries(attrs).filter(([key]) => key.startsWith('data-')).forEach(([key, value]) => this.dataset[key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value);
  }
  set innerHTML(html) {
    this.markup = html;
    this.children = [...html.matchAll(/<[a-z][\w-]*\b([^>]*)>/gi)].map(([, attributes]) => {
      const attrs = Object.fromEntries([...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(([, key, value]) => [key, value ?? '']));
      return new Element(attrs);
    });
  }
  append(...children) { this.children.push(...children); }
  appendChild(child) { this.children.push(child); return child; }
  setAttribute(key, value) { this.attrs[key] = value; }
  getAttribute(key) { return this.attrs[key]; }
  addEventListener(name, listener) { this.events[name] = listener; }
  click() { this.events.click(); }
  play() { this.playCount = (this.playCount || 0) + 1; return Promise.resolve(); }
  pause() { this.pauseCount = (this.pauseCount || 0) + 1; }
  all() { return this.children.flatMap(child => [child, ...child.all()]); }
  querySelectorAll(selector) {
    return this.all().filter(node => selector.startsWith('.') ? node.classList.contains(selector.slice(1)) : selector.startsWith('[') ? selector.slice(1, -1) in node.attrs : selector === 'figcaption' && node === this.caption);
  }
  querySelector(selector) {
    if (selector === 'figcaption') return this.caption ||= new Element();
    return this.querySelectorAll(selector)[0] || null;
  }
}

function page(id = 'edge-ai') {
  const document = new Element();
  document.innerHTML = read('profile/project.html').split('<script')[0];
  document.documentElement = new Element();
  document.body = new Element();
  document.createElement = () => new Element();
  document.getElementById = id => document.all().find(node => node.id === id);
  document.currentScript = { src: 'http://localhost/profile/flipwords.js' };
  const context = { document, URL, URLSearchParams, ResizeObserver: class { observe() {} }, location: { search: `?id=${id}` } };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read('profile/portfolio.js'), context);
  vm.runInContext(read('profile/project-experiences.js'), context);
  vm.runInContext(read('profile/flipwords.js'), context);
  const inline = [...read('profile/project.html').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].at(-1)[1];
  vm.runInContext(inline, context);
  return { context, document, host: document.getElementById('experience') };
}

const optionCounts = { 'edge-ai': 3, embedded: 3, sustainability: 4, camh: 3, education: 3 };

function homeStage({ hash = '', width = 1440, reduce = false, cdn = true } = {}) {
  const classes = new Set(), events = {}, ticks = [], timers = new Map();
  const location = new URL(`https://example.test/portfolio/index.html?test=1${hash}`);
  let now = 0, timerId = 0;
  const root = { classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) } };
  const context = {
    document: { documentElement: root, querySelector: () => ({ style: {} }), querySelectorAll: () => [] },
    innerWidth: width, innerHeight: 900, location,
    history: { state: null, replaceState: (_, __, url) => { location.href = new URL(url, location).href; } },
    performance: { now: () => now },
    matchMedia: query => ({ matches: query.includes('reduced-motion') ? reduce : query.includes('max-width') ? width <= 820 : true, addEventListener() {} }),
    addEventListener: (name, fn) => { (events[name] ||= []).push(fn); },
    setTimeout: fn => { timers.set(++timerId, fn); return timerId; }, clearTimeout: id => timers.delete(id),
    gsap: cdn ? { registerPlugin() {}, ticker: { add: fn => ticks.push(fn), lagSmoothing() {} } } : undefined,
    Observer: cdn ? { create: () => ({ enable() {}, disable() {} }) } : undefined
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read('profile/portfolio.js'), context);
  const script = [...read('index.html').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].find(([, code]) => code.includes('const WORK_PROJECTS ='))[1];
  vm.runInContext(script, context);
  const advance = () => {
    for (let i = 0; i < 300; i++) { now += 1000 / 60; ticks.forEach(fn => fn(now / 1000, 1000 / 60)); }
  };
  const emit = (name, event = {}) => {
    let prevented = false;
    events[name].forEach(fn => fn({ preventDefault() { prevented = true; }, ...event }));
    return prevented;
  };
  return { Stage: context.Stage, classes, location, advance, emit,
    settle() { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); advance(); } };
}

test('scene keyboard navigation preserves stations, boundaries and input guards', () => {
  const { Stage, location, advance, emit } = homeStage();
  for (const [key, shiftKey, station, hash] of [
    ['ArrowDown', false, 'work', '#work'], ['PageDown', false, 'web', '#web'],
    [' ', false, 'end', '#contact'], ['ArrowDown', false, 'end', '#contact'],
    [' ', true, 'web', '#web'], ['PageUp', false, 'work', '#work'],
    ['ArrowUp', false, 'hero', ''], ['ArrowUp', false, 'hero', ''],
    ['End', false, 'end', '#contact'], ['Home', false, 'hero', '']
  ]) {
    assert.equal(emit('keydown', { key, shiftKey }), true);
    advance();
    assert.equal(Stage.state.station, station);
    assert.equal(location.hash, hash);
  }
  for (const guard of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }, { defaultPrevented: true }, { target: { tagName: 'INPUT' } }, { target: { isContentEditable: true } }]) {
    assert.equal(emit('keydown', { key: 'ArrowDown', ...guard }), false);
    advance(); assert.equal(Stage.state.p, 0);
  }
  const hold = Stage.hold('web');
  assert.equal(emit('keydown', { key: 'ArrowDown' }), false);
  Stage.release(hold);
  emit('keydown', { key: 'ArrowDown' }); advance();
  assert.equal(Stage.state.p, 1);
  assert.equal(location.pathname, '/portfolio/index.html');
  assert.equal(location.search, '?test=1');
});

test('scene hashes preserve all project aliases and the selected Work hash', () => {
  for (const id of ['flipwords', 'edgesentry', 'edge-ai', 'embedded', 'sustainability', 'sttc', 'camh', 'education', 'noshi-boshi']) {
    const { Stage, location, advance, emit } = homeStage({ hash: `#${id}` });
    assert.equal(Stage.config.startHash, id);
    Stage.web = { hash: id }; advance();
    assert.equal(Stage.state.station, 'web');
    assert.equal(location.hash, `#${id}`);
    location.hash = '#contact'; emit('hashchange'); advance();
    assert.equal(Stage.state.p, 3);
    location.hash = `#${id}`; emit('hashchange'); advance();
    assert.equal(Stage.state.p, 2);
    assert.equal(location.hash, `#${id}`);
    location.hash = '#unknown'; emit('hashchange'); advance();
    assert.equal(Stage.state.p, 2);
  }
});

test('scene wheel input respects split distances, station stops and browser gestures', () => {
  const { Stage, emit, advance, settle } = homeStage();
  Stage.config.split = [[0, .18, .15]];
  const wheel = deltaY => emit('wheel', { deltaY, deltaX: 0, deltaMode: 0 });
  wheel(90); advance();
  assert(Math.abs(Stage.state.p - .12) < 1e-6);
  wheel(3000); advance(); settle();
  assert.equal(Stage.state.p, 1);
  wheel(90); advance(); settle();
  assert(Stage.state.p > 1 && Stage.state.p < 2);
  const before = Stage.state.p;
  for (const gesture of [{ ctrlKey: true }, { metaKey: true }, { deltaX: 100 }]) {
    assert.equal(emit('wheel', { deltaY: 90, deltaX: 0, deltaMode: 0, ...gesture }), false);
  }
  advance(); assert.equal(Stage.state.p, before);
});

test('home retains reduced-motion and CDN fallbacks and gates narrow screens', () => {
  for (const options of [{ reduce: true }, { cdn: false }]) {
    const { Stage, classes } = homeStage(options);
    assert.equal(Stage.enabled, false);
    assert(classes.has('stage-off'));
    assert(!classes.has('stage-on'));
  }
  for (const width of [375, 819, 820, 821, 1280, 1440, 1920, 2560]) {
    const { Stage, classes, emit, advance } = homeStage({ width, hash: '#contact' });
    assert.equal(classes.has('gate'), width <= 820);
    advance(); assert.equal(Stage.state.p, width <= 820 ? 0 : 3);
    emit('keydown', { key: 'Home' }); advance();
    assert.equal(Stage.state.p, 0);
  }
});

for (const [id, count] of Object.entries(optionCounts)) {
  test(`${id}: route, content, selection and reset`, () => {
    const { context, document, host } = page(id);
    assert.equal(document.body.dataset.project, id);
    assert.equal(host.hidden, false);
    assert.equal(document.getElementById('project-nav').children.length, 9);
    assert.equal(document.getElementById('chapters').children.length, 3);
    assert.equal(document.getElementById('details').children.length, 3);
    const project = context.PORTFOLIO.projects.find(project => project.id === id);
    assert.equal(document.title, `${project.name} — Karan Kapur`);
    assert.equal(document.getElementById('summary').textContent, project.tabs[0]);
    assert.equal(document.getElementById('back').href, `../index.html#${id}`);
    const buttons = host.querySelector('.experience-buttons').children;
    assert.equal(buttons.length, count);
    const headings = new Set();
    buttons.forEach((button, i) => {
      assert.equal(button.type, 'button');
      assert.equal(button.getAttribute('aria-controls'), 'experience-detail');
      button.click();
      assert.equal(host.dataset.choice, String(i));
      assert.equal(button.getAttribute('aria-pressed'), 'true');
      assert.equal(buttons.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
      assert(host.querySelector('.experience-copy').textContent.length > 80);
      headings.add(host.querySelector('.experience-title').textContent);
      const highlights = host.querySelectorAll('[data-focus]');
      if (highlights.length) assert.equal(highlights.filter(node => node.classList.contains('is-active')).length, 1);
      if (id === 'edge-ai') assert.equal(host.querySelector('.core-model').textContent, button.textContent);
    });
    assert.equal(headings.size, count);
    assert.equal(host.querySelector('.experience-detail').getAttribute('aria-live'), 'polite');
    context.mountProjectExperience(host, project);
    assert.equal(host.dataset.choice, '0');
    assert.equal(host.querySelector('.experience-buttons').children.length, count);
  });
}

test('STTC embeds its website and retains the co-founder story', () => {
  const { document, host } = page('sttc');
  assert.equal(document.body.dataset.project, 'sttc');
  assert.equal(document.title, 'Building STTC — Karan Kapur');
  assert.equal(host.hidden, false);
  const frame = host.querySelector('.live-site-frame');
  assert.equal(frame.src, 'https://sttc.tw/');
  assert.match(frame.title, /Southern Taiwan Technology Council.*live website/);
  assert.match(frame.getAttribute('sandbox'), /allow-scripts/);
  assert(!frame.getAttribute('sandbox').includes('allow-top-navigation'));
  assert.equal(host.querySelector('.live-site-link').href, 'https://sttc.tw/');
  assert.equal(host.querySelector('.experience-buttons'), null);
  assert.match(document.getElementById('summary').textContent, /I co-founded/);
  assert.equal(document.getElementById('project-nav').children.length, 9);
  assert.equal(document.getElementById('chapters').children.length, 3);
  assert.equal(document.getElementById('details').children.length, 3);
});

test('lab loads STTC directly as an external website and keeps other project routes', () => {
  const { context } = page('sttc');
  const html = read('index.html');
  const services = vm.runInContext(html.match(/const WORK_PROJECTS = [^\n]+/)[0] + '\n' + html.match(/const services = WORK_PROJECTS\.map[^\n]+/)[0] + '\nservices;', context);
  const sttc = services.find(service => service.id === 'sttc');
  assert.equal(sttc.url, 'https://sttc.tw/');
  assert.equal(sttc.external, true);
  assert.equal(services.filter(service => service.external).length, 1);
  for (const id of ['edge-ai', 'education', 'camh', 'embedded']) {
    assert.equal(services.some(service => service.id === id), false);
    assert(context.PORTFOLIO.projects.some(project => project.id === id));
  }
  assert.deepEqual(Array.from(services, service => service.id), ['flipwords', 'edgesentry', 'sustainability', 'sttc', 'noshi-boshi']);
  const fallbackIds = [...html.match(/<section class="web-list"[\s\S]*?<\/section>/)[0].matchAll(/project.html\?id=([^"&]+)/g)].map(([, id]) => id);
  assert.deepEqual(fallbackIds, Array.from(services, service => service.id));
  const dock = vm.runInContext(html.match(/const DOCK = WORK_PROJECTS\.map[^\n]+/)[0] + '\nDOCK;', context);
  assert.deepEqual(Array.from(dock, entry => entry[0]), Array.from(services, service => service.id));
  services.filter(service => service.id !== 'sttc').forEach(service => {
    assert.equal(service.url, service.id === 'sustainability' ? 'profile/sustainability-work.html' : `profile/project.html?id=${service.id}`);
    assert.equal(service.external, false);
  });
});

test('Work shares the STTC MacBook with sustainability and resets it for other projects', () => {
  const mb = new Element();
  mb.innerHTML = '<p class="mb-chin"></p>';
  const context = vm.createContext({ mb, info: null });
  const setInfo = read('index.html').match(/function setInfo\(sv\)\{[\s\S]*?\n  \}/)[0];
  vm.runInContext(setInfo + '\nsetInfo({ id: "sttc" });', context);
  assert(mb.classList.contains('sttc-macbook'));
  assert.match(mb.getAttribute('aria-label'), /MacBook.*STTC/);
  assert.equal(mb.querySelector('.mb-chin').textContent, 'MacBook Pro');
  vm.runInContext('setInfo({ id: "sustainability" });', context);
  assert(mb.classList.contains('sttc-macbook'));
  assert.match(mb.getAttribute('aria-label'), /MacBook.*ESG/);
  assert.equal(mb.querySelector('.mb-chin').textContent, 'MacBook Pro');
  vm.runInContext('setInfo({ id: "flipwords" });', context);
  assert.equal(mb.classList.contains('sttc-macbook'), false);
  assert.equal(mb.getAttribute('aria-label'), 'Interactive project showcase');
  assert.equal(mb.querySelector('.mb-chin').textContent, '');
});

test('Contact frames the right-tilted ID card within the space above its links', () => {
  const html = read('index.html');
  const tilt = Number(html.match(/const END_TILT = Math.PI - ([\d.]+);/)[1]);
  const END_TILT = Math.PI - tilt;
  const targetCode = html.match(/const target = g => \{[\s\S]*?\n  \};/)[0];
  const pose = vm.runInNewContext(targetCode + '\ntarget({});', {
    END_TILT, desk: { moved: true, ek: 1, ck: 1, b: 0 }, ss: () => 1,
    sideCorner: () => ({ x: 0, z: 0 }), endSpot: () => ({ x: 100, z: 200 })
  });
  // The top of the face-up card must project to the right of its center.
  assert(Math.sin(pose.b) > 0);
  assert(Math.cos(pose.b) < 0);
  const boundsGetter = html.match(/get endBounds\(\)\{[\s\S]*?\n      \},/)[0];
  const bounds = vm.runInNewContext('({' + boundsGetter + '}).endBounds;', {
    END_TILT, geo: () => ({ hw: 150, hh: 215 }), endScale: () => 1.6
  });
  const cameraCode = html.match(/const cam = \{[\s\S]*?\n  \};/)[0];
  for (const [width, height, contactTop] of [[1440, 900, 620], [1728, 1117, 850], [1024, 700, 420], [375, 812, 420], [375, 667, 290], [844, 390, 180]]) {
    const focalLength = width <= 820 ? 820 : 1200;
    const cardCenter = { x: 2000, z: 1500 };
    const camera = vm.runInNewContext(cameraCode + '\ncam.end();', {
      W: { Wd: width, H: height, mobile: width <= 820 }, P: () => focalLength,
      window: { Hero: { desk: { endAt: cardCenter, endBounds: bounds } } },
      document: { querySelector: () => ({ offsetTop: contactTop }) }, safeTop: () => 0
    });
    assert.equal(camera.th, 90);
    assert.equal(camera.Tx, cardCenter.x);
    const scale = camera.d / focalLength;
    const centerY = height / 2 + (cardCenter.z - camera.Tz) / scale;
    assert(width / 2 - bounds.width / scale / 2 >= .15 * width - 1);
    assert(centerY - bounds.height / scale / 2 >= 63);
    assert(centerY + bounds.height / scale / 2 <= contactTop - 31);
  }
});

test('the avatar side stays fixed throughout Work to Contact and back', () => {
  const html = read('index.html');
  const start = html.indexOf('Stage.ticker.add(() => {', html.indexOf('// 해시로 바로 다른 정거장에 들어오면 progress'));
  const tickerCode = html.slice(start, html.indexOf('\n  });', start) + '\n  });'.length);
  let tick, face, visible;
  const Stage = {
    state: { p: 0 }, config: { stations: [{ name: 'hero' }, { name: 'work' }, { name: 'web' }, { name: 'end' }] },
    world: { ease: value => Math.max(0, Math.min(1, value)) }, ticker: { add: callback => { tick = callback; } }
  };
  const Hero = { t: 1, desk: { corner() {}, end() {}, face: value => { face = value; }, show: value => { visible = value; } } };
  vm.runInNewContext(tickerCode, { Stage, Hero, innerWidth: 1440 });
  for (const p of [1.79, 1.8, 2, 2.1, 2.5, 2.75, 2.9, 3, 2.75, 2.1, 2, 1.8, 1.79]) {
    Stage.state.p = p;
    tick();
    if (p >= 1.8) assert.equal(face, 1);
    else { assert.equal(face, 0); assert.equal(visible, 0); }
    if (p === 1.8) assert.equal(visible, 0);
  }
});

test('Contact hides the entire project display and restores it on returning to Work', () => {
  const html = read('index.html');
  const sceneCode = html.match(/Stage.add\('web', \{[\s\S]*?\n  \}\);/)[0];
  let hooks;
  const mb = new Element();
  const Stage = { config: { stations: [0, 1, 2, 3] }, add: (_, scene) => { hooks = scene; }, camera: { set() {} }, tone() {} };
  vm.runInNewContext(sceneCode, {
    Stage, mb, END: () => 3, path: () => ({}), W: { mobile: false },
    Wd: { toneOf: () => 1 }, pool: null, info: null
  });
  for (const [p, hidden] of [[2, false], [2.5, true], [3, true], [2, false]]) {
    hooks.progress(0, { p });
    assert.equal(mb.hidden, hidden);
  }
  assert.match(html, /html.stage-on \.mb\[hidden\]\{display:none\}/);
});

test('topic map uses synthetic coordinates, labels them, and links the selected method', () => {
  const { host } = page('camh');
  assert.match(host.querySelector('figcaption').textContent, /Illustrative.*no participant data.*not model output/);
  const points = host.querySelectorAll('[data-point]');
  assert.equal(points.length, 36);
  const positions = new Set();
  host.querySelector('.experience-buttons').children.forEach(button => {
    button.click();
    positions.add(points.map(point => `${point.getAttribute('cx')},${point.getAttribute('cy')}`).join(';'));
    assert(host.querySelector('.experience-source').href.startsWith('https://'));
    points.forEach(point => {
      assert(Number.isFinite(Number(point.getAttribute('cx'))));
      assert(Number.isFinite(Number(point.getAttribute('cy'))));
    });
  });
  assert.equal(positions.size, 3);
});

test('validation outcome is attributed to the real project', () => {
  const { host } = page('sustainability');
  host.querySelector('.experience-buttons').children[2].click();
  assert.match(host.querySelector('.experience-copy').textContent, /92%.*Corporate Knights/);
  assert.match(host.markup, /Corporate Knights · Project outcome/);
});

function sustainabilityWorkflow(reduce = false) {
  const document = new Element();
  document.innerHTML = read('profile/sustainability-work.html');
  document.getElementById = id => document.all().find(node => node.id === id);
  const checks = Array.from({ length: 3 }, () => {
    const item = new Element();
    item.appendChild(new Element({ class: 'sus-check' }));
    return item;
  });
  const queryAll = document.querySelectorAll.bind(document);
  document.querySelectorAll = selector => selector === '.sus-validation li' ? checks : queryAll(selector);
  const timers = new Map();
  const media = { matches: reduce, addEventListener(name, listener) { this.change = listener; } };
  let timerId = 0;
  vm.runInNewContext(read('profile/sustainability-work.js'), {
    document, matchMedia: () => media,
    setTimeout: callback => { timers.set(++timerId, callback); return timerId; },
    clearTimeout: id => timers.delete(id)
  });
  return {
    document, checks, timers, media, dashboard: document.querySelector('.sus-dashboard'),
    advance() {
      assert.equal(timers.size, 1, 'only one animation timer should run');
      const [id, callback] = timers.entries().next().value;
      timers.delete(id); callback();
    }
  };
}

test('ESG workflow advances, pauses, inspects sources, replays and suspends in hidden tabs', () => {
  const { document, dashboard, checks, timers, advance } = sustainabilityWorkflow();
  const pause = document.getElementById('sus-pause');
  assert.equal(dashboard.dataset.step, '0');
  advance();
  assert.equal(dashboard.dataset.step, '1');
  pause.click();
  assert.equal(dashboard.dataset.running, 'false');
  assert.equal(timers.size, 0);
  document.querySelectorAll('[data-step-control]').find(node => node.dataset.stepControl === '2').click();
  assert.equal(dashboard.dataset.step, '2');
  assert.equal(checks.filter(item => item.classList.contains('sus-checked')).length, 1);
  document.querySelectorAll('[data-metric]').find(node => node.dataset.metric === 'water').click();
  assert.match(document.getElementById('sus-source').textContent, /p\. 51.*m³/);
  document.querySelectorAll('[data-metric]').forEach(button => {
    assert.equal(button.getAttribute('aria-pressed'), String(button.dataset.metric === 'water'));
    assert.equal(button.getAttribute('aria-controls'), 'sus-source');
  });
  document.getElementById('sus-replay').click();
  assert.equal(dashboard.dataset.step, '0');
  document.hidden = true; document.events.visibilitychange();
  assert.equal(timers.size, 0);
  assert.equal(dashboard.dataset.running, 'false');
  document.hidden = false; document.events.visibilitychange();
  advance(); advance(); advance(); advance();
  assert.equal(dashboard.dataset.step, '3');
  assert.equal(dashboard.dataset.running, 'false');
  assert.equal(timers.size, 0);
  assert.equal(pause.disabled, true);
  assert.equal(checks.filter(item => item.classList.contains('sus-checked')).length, 3);
  assert.match(document.getElementById('sus-status').textContent, /human review/);
});

test('ESG reduced motion starts complete and allows manual exploration without autoplay', () => {
  const { document, dashboard, timers, media } = sustainabilityWorkflow(true);
  assert.equal(dashboard.dataset.step, '3');
  assert.equal(timers.size, 0);
  document.getElementById('sus-replay').click();
  assert.equal(dashboard.dataset.step, '0');
  assert.equal(dashboard.dataset.running, 'false');
  assert.equal(timers.size, 0);
  document.querySelectorAll('[data-step-control]').find(node => node.dataset.stepControl === '1').click();
  assert.match(document.getElementById('sus-status').textContent, /NLP pipeline/);
  media.change();
  assert.equal(dashboard.dataset.step, '3');
});

test('missing route retains the existing fallback', () => {
  const { document } = page('missing');
  assert.match(document.title, /Project not found/);
  assert.match(document.getElementById('content').markup, /Explore the portfolio/);
});

test('unknown experience leaves its host hidden', () => {
  const { context } = page();
  const host = new Element({ hidden: '' });
  context.mountProjectExperience(host, { id: 'unknown' });
  assert.equal(host.hidden, true);
  assert.equal(host.children.length, 0);
});

test('home actions navigate to Contact and Work, preserving fallback and modified clicks', () => {
  const html = read('index.html');
  const document = new Element();
  document.innerHTML = html.split('<script')[0];
  document.documentElement = new Element();
  document.getElementById = id => document.all().find(node => node.id === id);
  const links = document.querySelectorAll('[data-scene-link]');
  assert.equal(links.length, 2);
  links.forEach(link => { link.dataset.sceneLink = link.getAttribute('data-scene-link'); });
  const destinations = [];
  const Stage = { enabled: true, go: destination => destinations.push(destination) };
  let flipped = false, scrolled = false;
  document.getElementById('toBack').addEventListener('click', () => { flipped = true; });
  document.getElementById('hero').scrollIntoView = () => { scrolled = true; };
  const context = { document, Stage, window: { Stage } };
  const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].find(([, code]) => code.includes("document.querySelectorAll('[data-scene-link]')"))[1];
  vm.runInNewContext(script, context);
  const click = (link, modifiers = {}) => {
    let prevented = false;
    link.events.click({ preventDefault() { prevented = true; }, ...modifiers });
    return prevented;
  };
  links.forEach(link => assert.equal(click(link), true));
  assert.deepEqual(destinations, ['end', 'web']);
  assert.equal(click(links[0], { metaKey: true }), false);
  assert.equal(destinations.length, 2);
  Stage.enabled = false;
  assert.equal(click(links[0]), true);
  assert(flipped && scrolled);
  assert.equal(click(links[1]), false);
  assert.equal(links[1].getAttribute('href'), '#web');
  assert(document.getElementById('web'));
});


test('FlipWords uses the supplied mockup on its project route', () => {
  const { document, host, context } = page('flipwords');
  assert.equal(document.title, 'FlipWords — Karan Kapur');
  assert.equal(host.hidden, false);
  const mockup = host.querySelector('.fw-mockup');
  assert.equal(mockup.getAttribute('src'), 'http://localhost/profile/flipwords-mockup.png');
  assert.match(mockup.getAttribute('alt'), /folded cover screen/);
  assert(readFileSync(resolve(root, 'profile/flipwords-mockup.png')).length > 0);
  assert.equal(host.querySelectorAll('.fw-phone').length, 0);
  const project = context.PORTFOLIO.projects.find(p => p.id === 'flipwords');
  assert.equal(project.sourceUrl, 'https://github.com/karukapur/flipwords');
  assert.equal(project.notesUrl, project.sourceUrl + '/blob/main/docs/SCHEDULER.md');
  assert.equal(document.getElementById('project-nav').children.length, 9);
});


test('image and video previews ride the 3D scene and pause video when leaving Work', () => {
  const { context } = page();
  const document = new Element();
  document.documentElement = new Element();
  document.currentScript = { src: 'http://localhost/profile/flipwords.js' };
  document.createElement = () => new Element();
  const info = new Element({ class: 'web-info' });
  info.innerHTML = '<div class="wi-body"></div>';
  const tabCalls = [];
  info.wiTabs = (tabs, labels) => tabCalls.push({ tabs, labels });
  const face = new Element({ class: 'mb-face' });
  document.append(info, face);
  const callbacks = [], events = {};
  const Stage = { enabled: true, web: { hash: 'flipwords' }, state: { p: 2 }, config: { stations: [{ name: 'hero' }, { name: 'table' }, { name: 'web' }, { name: 'end' }] }, ticker: { add: callback => callbacks.push(callback) } };
  context.document = document;
  context.Stage = Stage;
  context.addEventListener = (name, callback) => { events[name] = callback; };
  vm.runInContext(read('profile/flipwords.js'), context);
  assert(document.documentElement.classList.contains('flipwords-work'));
  const stage = face.querySelector('.fw-stage');
  assert.equal(info.querySelector('.fw-stage'), null);
  assert.equal(stage.hidden, false);
  assert.deepEqual(Array.from(tabCalls.at(-1).labels), ['What', 'Why', 'The build', 'Source']);
  const body = info.querySelector('.wi-body');
  body.scrollHeight = 700; body.clientHeight = 500;
  let wheelStopped = false;
  body.events.wheel({ stopPropagation() { wheelStopped = true; } });
  assert.equal(wheelStopped, true);
  Stage.web.hash = 'edgesentry';
  events['web:select']();
  assert.equal(stage.hidden, false);
  assert(stage.classList.contains('es-stage'));
  assert.equal(stage.querySelector('.fw-mockup').getAttribute('src'), 'http://localhost/profile/edgesentry-mockup.png');
  assert.equal(body.children.find(node => node.className === 'fw-notes').href, 'https://github.com/karukapur/edgesentry');
  Stage.web.hash = 'flipwords';
  events['web:select']();
  assert.equal(stage.classList.contains('es-stage'), false);
  assert.match(stage.querySelector('.fw-mockup').getAttribute('src'), /flipwords-mockup/);
  Stage.web.hash = 'embedded';
  events['web:select']();
  assert.equal(document.documentElement.classList.contains('flipwords-work'), false);
  assert.equal(stage.hidden, true);
  assert.equal(info.querySelector('.wi-body').children.find(node => node.className === 'fw-notes').hidden, true);
  assert.equal(tabCalls.at(-1).labels, undefined);
  wheelStopped = false;
  body.events.wheel({ stopPropagation() { wheelStopped = true; } });
  assert.equal(wheelStopped, false);
  Stage.web.hash = 'flipwords';
  events['web:select']();
  Stage.state.p = 3;
  callbacks.forEach(callback => callback());
  assert.equal(document.documentElement.classList.contains('flipwords-work'), true);
  Stage.state.p = 1.3;
  callbacks.forEach(callback => callback());
  assert.equal(document.documentElement.classList.contains('flipwords-work'), true);
  Stage.state.p = 2;
  Stage.web.hash = 'noshi-boshi';
  events['web:select']();
  const video = stage.querySelector('.nb-video');
  assert(video);
  assert(stage.classList.contains('nb-stage'));
  assert.equal(stage.classList.contains('es-stage'), false);
  assert.equal(video.getAttribute('src'), 'http://localhost/profile/media/noshi-boshi-unboxing.mp4');
  assert.equal(video.playCount, 1);
  assert.equal(video.getAttribute('tabindex'), '-1');
  assert.equal(video.getAttribute('controls'), undefined);
  assert.equal(video.getAttribute('autoplay'), undefined);
  assert.equal(video.getAttribute('loop'), undefined);
  assert.equal(body.children.find(node => node.className === 'fw-notes').hidden, true);
  document.hidden = true;
  document.events.visibilitychange();
  assert.equal(video.pauseCount, 1);
  document.hidden = false;
  document.events.visibilitychange();
  assert.equal(video.playCount, 2);
  Stage.state.p = 3;
  callbacks.forEach(callback => callback());
  assert.equal(video.pauseCount, 2);
  Stage.state.p = 2;
  callbacks.forEach(callback => callback());
  assert.equal(video.playCount, 3);
  Stage.web.hash = 'sttc';
  events['web:select']();
  assert.equal(video.pauseCount, 3);
  assert.equal(stage.hidden, true);
  Stage.web.hash = 'noshi-boshi';
  events['web:select']();
  assert.equal(stage.querySelector('.nb-video').playCount, 1);
  const completedVideo = stage.querySelector('.nb-video');
  completedVideo.ended = true;
  document.hidden = true;
  document.events.visibilitychange();
  document.hidden = false;
  document.events.visibilitychange();
  Stage.state.p = 3;
  callbacks.forEach(callback => callback());
  Stage.state.p = 2;
  callbacks.forEach(callback => callback());
  assert.equal(stage.querySelector('.nb-video'), completedVideo);
  assert.equal(completedVideo.playCount, 1, 'completed playback must retain its last frame when returning to Work or the tab');
  Stage.web.hash = 'sustainability';
  events['web:select']();
  assert(document.documentElement.classList.contains('sustainability-work'));
  Stage.state.p = 3;
  callbacks.forEach(callback => callback());
  assert.equal(document.documentElement.classList.contains('sustainability-work'), false);
  Stage.state.p = 2;
  callbacks.forEach(callback => callback());
  assert(document.documentElement.classList.contains('sustainability-work'));
  Stage.web.hash = 'sttc';
  events['web:select']();
  assert.equal(document.documentElement.classList.contains('sustainability-work'), false);
});

test('Minecraft avatar runs, jumps, lands, waves and holds its final pose', () => {
  const context = vm.createContext({});
  vm.runInContext(read('profile/contact-avatar.js').replace(/^export /gm, ''), context);
  const pose = t => JSON.parse(JSON.stringify(vm.runInContext(`avatarPose(${t})`, context)));
  assert(pose(.7).x > pose(.2).x, 'the run must move toward the greeting');
  assert(pose(1.8).y > 12, 'the jump must visibly clear the ground');
  assert.equal(pose(2.4).y, 0);
  assert(pose(2.85).kneeR > 1, 'the landing must absorb the impact');
  assert.notEqual(pose(4.1).wave, pose(4.3).wave);
  assert(pose(6.4).wave < -2, 'the final pose must keep the hand raised');
  assert.deepEqual(pose(6.4), pose(60), 'the final pose must remain fixed');
  for (let t = 0; t <= 7; t += .025) assert(Object.values(pose(t)).every(Number.isFinite));
  const markup = read('index.html').match(/<canvas class="ei-avatar"[^>]*>/)[0];
  assert.match(markup, /width="896" height="640"/);
  assert.doesNotMatch(read('index.html'), /<video class="ei-avatar"/);
  assert(readFileSync(resolve(root, 'profile/media/karan-minecraft-avatar.png')).length > 0);
});

test('Minecraft animation pauses away, resumes, completes once and respects reduced motion', () => {
  function mount(reduced = false) {
    const frames = new Map(), events = {}, times = [];
    let frameId = 0, completed = 0;
    const document = { hidden: false, addEventListener: (name, fn) => events[name] = fn };
    const context = vm.createContext({
      DURATION: 6.4, document, canvas: { clientWidth: 224, clientHeight: 160 },
      renderer: { render() {}, setSize() {} }, scene: {}, camera: { updateProjectionMatrix() {} },
      matchMedia: () => ({ matches: reduced, addEventListener() {} }),
      ResizeObserver: class { observe() {} },
      requestAnimationFrame: fn => { frames.set(++frameId, fn); return frameId; },
      cancelAnimationFrame: id => frames.delete(id),
      applyPose: t => times.push(t), onComplete: () => completed++
    });
    const source = read('profile/contact-avatar.js');
    const lifecycle = source.slice(source.indexOf('  let elapsed ='), source.lastIndexOf('\n}'));
    const avatar = vm.runInContext(`(() => {${lifecycle}})()`, context);
    return { avatar, frames, events, times, document, completed: () => completed,
      tick(now) { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); } };
  }
  const a = mount();
  assert.equal(a.frames.size, 0);
  a.avatar.setVisible(true); a.tick(0); a.tick(50);
  assert(a.times.at(-1) > 0);
  a.avatar.setVisible(false);
  assert.equal(a.frames.size, 0);
  const paused = a.times.at(-1);
  a.avatar.setVisible(true); a.tick(5000);
  assert.equal(a.times.at(-1), paused, 'time away must not skip the animation');
  a.document.hidden = true; a.events.visibilitychange();
  assert.equal(a.frames.size, 0);
  a.document.hidden = false; a.events.visibilitychange();
  for (let now = 5050; now < 13000; now += 50) a.tick(now);
  assert.equal(a.completed(), 1); assert.equal(a.frames.size, 0);
  assert.equal(a.times.at(-1), 6.4);
  a.avatar.setVisible(false); a.avatar.setVisible(true);
  assert.equal(a.frames.size, 0); assert.equal(a.completed(), 1);
  const reduced = mount(true); reduced.avatar.setVisible(true);
  assert.equal(reduced.frames.size, 0); assert.equal(reduced.times.at(-1), 6.4);
  assert.equal(reduced.completed(), 1);
});

test('Noshi Boshi presents the supplied video and retains its founder story', () => {
  const { document, host } = page('noshi-boshi');
  assert.equal(document.title, 'Noshi Boshi — Karan Kapur');
  assert.equal(host.hidden, false);
  const video = host.querySelector('.nb-video');
  assert.equal(video.getAttribute('src'), 'http://localhost/profile/media/noshi-boshi-unboxing.mp4');
  assert.equal(video.getAttribute('poster'), 'http://localhost/profile/media/noshi-boshi-unboxing-poster.jpg');
  for (const attr of ['autoplay', 'muted', 'playsinline', 'disablepictureinpicture', 'disableremoteplayback']) assert.equal(video.getAttribute(attr), '');
  assert.equal(video.getAttribute('loop'), undefined);
  assert.equal(video.getAttribute('preload'), 'metadata');
  assert.match(video.getAttribute('aria-label'), /meal-kit product unboxing/);
  assert.equal(video.getAttribute('controls'), undefined);
  assert.equal(video.getAttribute('tabindex'), '-1');
  assert.match(document.getElementById('summary').textContent, /I co-founded Noshi Boshi/);
  assert.equal(document.getElementById('chapters').children.length, 3);
  assert.equal(document.getElementById('details').children.length, 3);
  assert(readFileSync(resolve(root, 'profile/media/noshi-boshi-unboxing.mp4')).length > 0);
  assert(readFileSync(resolve(root, 'profile/media/noshi-boshi-unboxing-poster.jpg')).length > 0);
});


test('EdgeSentry uses its hardware concept, source and shared Work presentation', () => {
  const { document, host, context } = page('edgesentry');
  assert.equal(document.title, 'EdgeSentry — Karan Kapur');
  assert.equal(host.hidden, false);
  assert(host.classList.contains('es-stage'));
  const bondLogo = host.querySelector('.es-bond-logo');
  assert.equal(bondLogo.getAttribute('src'), 'http://localhost/profile/logos/james-bond-007.svg');
  assert.equal(bondLogo.getAttribute('alt'), 'James Bond 007');
  assert.match(read('profile/logos/james-bond-007.svg'), /viewBox="0 0 476.22 149.39"/);
  assert.equal(host.querySelector('.es-caption'), null);
  assert.doesNotMatch(host.markup, /Exploded hardware concept|On-device vision/);
  const image = host.querySelector('.fw-mockup');
  assert.equal(image.getAttribute('src'), 'http://localhost/profile/edgesentry-mockup.png');
  assert.match(image.getAttribute('alt'), /hardware concept.*OV5647/);
  assert(readFileSync(resolve(root, 'profile/edgesentry-mockup.png')).length > 0);
  assert(readFileSync(resolve(root, 'profile/edgesentry.svg')).length > 0);
  const project = context.PORTFOLIO.projects.find(p => p.id === 'edgesentry');
  assert.equal(project.sourceUrl, 'https://github.com/karukapur/edgesentry');
  assert.match(project.tabs[3], /hardware concept/);
  assert.equal(document.querySelector('.project-heading').children.at(-1).href, project.sourceUrl);
  assert.match(read('index.html'), /project.html\?id=edgesentry/);
});
