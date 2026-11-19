// Refresh static HTML from the same data used by the interactive views.
const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const root = resolve(__dirname, '..');

function render(html, portfolio) {
  const escape = portfolio.escapeHtml;
  return html.replace(/<!-- portfolio:([\w.]+) -->[\s\S]*?<!-- \/portfolio:\1 -->/g, (_, key) => {
    let content;
    if (key === 'documentTitle') {
      content = `<title>${escape(portfolio.title)}</title>`;
    } else if (key === 'projects') {
      const links = portfolio.selectedProjects.map(project => `<a href="profile/project.html?id=${encodeURIComponent(project.id)}">${escape(project.name)}</a>`).join(' · ');
      content = `\n  <div class="browse-fallback"><h2>Projects & experience</h2><p><a href="#projects" data-scene-link="web">Explore all projects</a> · ${links}</p><p><a href="profile/CV_Karan_Kapur.pdf">Read my CV</a> or <a href="${escape(portfolio.mailto)}">send me an email</a>.</p></div>\n  `;
    } else {
      const value = key.split('.').reduce((object, part) => object?.[part], portfolio);
      if (typeof value !== 'string') throw new Error(`Unknown portfolio field: ${key}`);
      content = escape(value);
    }
    return `<!-- portfolio:${key} -->${content}<!-- /portfolio:${key} -->`;
  }).replace(/data-portfolio-(href|content|src|alt)="([\w.]+)" \1="[^"]*"/g, (_, attribute, key) => {
    const value = key.split('.').reduce((object, part) => object?.[part], portfolio);
    if (typeof value !== 'string') throw new Error(`Unknown portfolio link: ${key}`);
    return `data-portfolio-${attribute}="${key}" ${attribute}="${escape(value)}"`;
  });
}

if (require.main === module) {
  const context = {}; context.window = context;
  vm.runInNewContext(readFileSync(resolve(root, 'profile/portfolio.js'), 'utf8'), context);
  for (const file of ['index.html', 'profile/project.html']) {
    const path = resolve(root, file), html = readFileSync(path, 'utf8');
    const updated = render(html, context.PORTFOLIO);
    if (updated === html) continue;
    if (process.argv.includes('--check')) {
      console.error(`${file} needs updating: run node scripts/sync-portfolio.cjs`);
      process.exitCode = 1;
    } else writeFileSync(path, updated);
  }
}
module.exports = { render };
