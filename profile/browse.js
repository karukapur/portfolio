(() => {
  const escape = value => String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  document.querySelectorAll('[data-portfolio-overview]').forEach(host => {
    const base = host.dataset.base || '';
    const selected = PORTFOLIO.selectedIds.map(id => PORTFOLIO.projects.find(project => project.id === id));
    const experience = PORTFOLIO.projects.filter(project => !project.mockup && !project.workOnly);
    const page = project => `${base}profile/project.html?id=${project.id}`;
    host.innerHTML = `
      <section class="browse-section" id="projects" data-station="web" aria-labelledby="projects-title">
        <div class="browse-section-heading"><div><p class="browse-kicker">Selected work</p><h2 id="projects-title">From a problem to something useful.</h2></div><p>Engineering, research and community projects. Each story covers my contribution, the decisions behind it, and what the result does and does not show.</p></div>
        <div class="browse-projects">${selected.map(project => `
          <article class="browse-project" id="${project.id}" aria-labelledby="title-${project.id}">
            <div class="browse-project-top"><img src="${base}${escape(project.logos[0].src)}" width="48" height="48" alt="" loading="lazy"><span>${escape(project.caseStudy.status)}</span></div>
            <h3 id="title-${project.id}"><a href="${page(project)}">${escape(project.name)}</a></h3>
            <p class="browse-project-promise">${escape(project.big)}</p>
            <p class="browse-role">${escape(project.role)}${project.timeline ? ` · ${escape(project.timeline)}` : ''}</p>
            <p>${escape(project.caseStudy.result)}</p>
            <div class="browse-links"><a href="${page(project)}">Read case study <span aria-hidden="true">↗</span></a>${project.sourceUrl ? `<a href="${escape(project.sourceUrl)}" target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a>` : project.liveUrl ? `<a href="${escape(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Live website ↗</a>` : ''}</div>
          </article>`).join('')}</div>
      </section>
      <section class="browse-section browse-about" id="about" aria-labelledby="about-title">
        <p class="browse-kicker">About</p><h2 id="about-title">Physical systems, data and software.</h2>
        <p>I’m Karan Kapur, an Edge AI engineer based in Hyderabad, India. I work as a Lead Software Engineer at NXP Semiconductors and co-founded the Southern Taiwan Technology Council.</p>
        <p>My path runs from chemical engineering to analytics and machine learning, embedded systems, and on-device AI. I’m interested in making advanced technology useful within real hardware and human constraints.</p>
        <a href="${base}profile/CV_Karan_Kapur.pdf">Read my CV <span aria-hidden="true">↗</span></a>
      </section>
      <section class="browse-section" id="experience" data-station="work" aria-labelledby="experience-title">
        <div class="browse-section-heading"><div><p class="browse-kicker">Experience & education</p><h2 id="experience-title">The work behind the projects.</h2></div><a href="${base}profile/CV_Karan_Kapur.pdf" download>Download CV ↓</a></div>
        <div class="browse-experience">${experience.map(project => `
          <article id="${PORTFOLIO.selectedIds.includes(project.id) ? `experience-${project.id}` : project.id}" aria-labelledby="experience-title-${project.id}">
            <p class="browse-role">${escape(project.timeline)}</p><h3 id="experience-title-${project.id}">${escape(project.organization)}</h3><p class="browse-position">${escape(project.role)}</p>
            <p>${escape(project.caseStudy.result)}</p><a href="${page(project)}">${project.id === 'education' ? 'Education & activities' : 'Read the story'} ↗</a>
          </article>`).join('')}</div>
      </section>
      <section class="browse-section browse-contact" id="contact" data-station="end" aria-labelledby="contact-title">
        <p class="browse-kicker">Contact</p><h2 id="contact-title">Let’s talk about useful technology.</h2>
        <p>For a conversation about on-device AI, document workflows or technology communities, send me a note with the problem you’re exploring and the context behind it.</p>
        <a class="browse-email" href="mailto:${escape(PORTFOLIO.email)}">${escape(PORTFOLIO.email)} <span aria-hidden="true">↗</span></a>
        <div class="browse-links"><a href="${escape(PORTFOLIO.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${escape(PORTFOLIO.github)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${base}profile/CV_Karan_Kapur.pdf" download>Download CV ↓</a></div>
      </section>`;
  });
  if (window.Stage?.enabled) return;
  const scrollToHash = () => {
    const hash = location.hash.slice(1);
    const id = ({ web: 'projects', work: 'experience', hero: 'hero' })[hash] || hash;
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' });
  };
  scrollToHash();
  addEventListener('hashchange', scrollToHash);
})();
