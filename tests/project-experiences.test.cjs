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
    Object.entries(attrs).filter(([key]) => key.startsWith('data-')).forEach(([key, value]) => this.dataset[key.slice(5)] = value);
  }
  set innerHTML(html) {
    this.markup = html;
    this.children = [...html.matchAll(/<[a-z][\w-]*\b([^>]*)>/gi)].map(([, attributes]) => {
      const attrs = Object.fromEntries([...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(([, key, value]) => [key, value ?? '']));
      return new Element(attrs);
    });
  }
  append(...children) { this.children.push(...children); }
  setAttribute(key, value) { this.attrs[key] = value; }
  getAttribute(key) { return this.attrs[key]; }
  addEventListener(name, listener) { this.events[name] = listener; }
  click() { this.events.click(); }
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
  const context = { document, URLSearchParams, location: { search: `?id=${id}` } };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read('profile/portfolio.js'), context);
  vm.runInContext(read('profile/project-experiences.js'), context);
  const inline = [...read('profile/project.html').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].at(-1)[1];
  vm.runInContext(inline, context);
  return { context, document, host: document.getElementById('experience') };
}

const optionCounts = { 'edge-ai': 3, embedded: 3, sustainability: 4, camh: 3, education: 3, 'noshi-boshi': 3 };
for (const [id, count] of Object.entries(optionCounts)) {
  test(`${id}: route, content, selection and reset`, () => {
    const { context, document, host } = page(id);
    assert.equal(document.body.dataset.project, id);
    assert.equal(host.hidden, false);
    assert.equal(document.getElementById('project-nav').children.length, 7);
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
  assert.equal(document.getElementById('project-nav').children.length, 7);
  assert.equal(document.getElementById('chapters').children.length, 3);
  assert.equal(document.getElementById('details').children.length, 3);
});

test('lab loads STTC directly as an external website and keeps other project routes', () => {
  const { context } = page('sttc');
  const services = vm.runInContext(read('index.html').match(/const services = PORTFOLIO\.projects\.map[^\n]+/)[0] + '\nservices;', context);
  const sttc = services.find(service => service.id === 'sttc');
  assert.equal(sttc.url, 'https://sttc.tw/');
  assert.equal(sttc.external, true);
  assert.equal(services.filter(service => service.external).length, 1);
  services.filter(service => service.id !== 'sttc').forEach(service => {
    assert.equal(service.url, `profile/project.html?id=${service.id}`);
    assert.equal(service.external, false);
  });
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
