(() => {
  const assetBase = document.currentScript.src;
  window.mountProjectVideo = (host, project, autoplay = true) => {
    host.classList.add('fw-stage');
    host.classList.add('nb-stage');
    host.classList.toggle('es-stage', false);
    const videoUrl = new URL(project.video.src, assetBase).href;
    const posterUrl = new URL(project.video.poster, assetBase).href;
    host.innerHTML = `<video class="nb-video" src="${videoUrl}" poster="${posterUrl}" width="1280" height="720" ${autoplay ? 'autoplay' : ''} muted loop playsinline disablepictureinpicture disableremoteplayback tabindex="-1" preload="metadata" aria-label="${project.video.label}">Your browser does not support this video. <a href="${videoUrl}">Download the unboxing video</a>.</video>`;
  };
  window.mountProjectMockup = (host, project) => {
    host.classList.add('fw-stage');
    host.classList.toggle('nb-stage', false);
    host.classList.toggle('es-stage', project.id === 'edgesentry');
    const bondLogoUrl = new URL('logos/james-bond-007.svg', assetBase).href;
    const mockupUrl = new URL(`${project.id}-mockup.png`, assetBase).href;
    host.innerHTML = `${project.id === 'edgesentry' ? `<div class="es-insignia"><span class="es-reticle" aria-hidden="true"></span><img class="es-bond-logo" src="${bondLogoUrl}" alt="James Bond 007" width="476" height="149"><span>Field tech / EdgeSentry</span></div>` : ''}<img class="fw-mockup" src="${mockupUrl}" width="1374" height="1145" alt="${project.mockup.alt}">`;
  };

  if (!window.Stage?.enabled) return;
  const info = document.querySelector('.web-info');
  const face = document.querySelector('.mb-face');
  if (!info || !face || !Stage.web) return;
  const stage = document.createElement('section');
  // Ride the existing camera path instead of floating above the 3D scene.
  face.appendChild(stage);
  const notes = document.createElement('a');
  notes.className = 'fw-notes';
  notes.target = '_blank'; notes.rel = 'noopener';
  info.querySelector('.wi-body').appendChild(notes);
  const body = info.querySelector('.wi-body');
  body.setAttribute('data-stage-ignore', '');
  body.addEventListener('wheel', event => {
    if (info.classList.contains('fw-selected') && body.scrollHeight > body.clientHeight && !event.ctrlKey && !event.metaKey) event.stopPropagation();
  }, { passive: true });
  let previousSelection, video, videoActive = false;
  const webStation = Stage.config.stations.findIndex(station => station.name === 'web');
  const update = () => {
    const project = PORTFOLIO.projects.find(p => p.id === Stage.web.hash);
    const selected = !!(project?.mockup || project?.video);
    if (Stage.web.hash !== previousSelection) {
      video?.pause();
      video = null; videoActive = false;
      previousSelection = Stage.web.hash;
      info.classList.toggle('fw-selected', selected);
      stage.hidden = !selected;
      notes.hidden = !project?.mockup;
      if (selected) {
        stage.setAttribute('aria-label', `${project.name} preview`);
        if (project.video) {
          mountProjectVideo(stage, project, false);
          video = stage.querySelector('.nb-video');
        } else {
          mountProjectMockup(stage, project);
          notes.textContent = project.notesUrl ? 'Read the engineering notes ↗' : 'Explore the build on GitHub ↗';
          notes.href = project.notesUrl || project.sourceUrl;
        }
      }
      // Refit the text after applying the project-specific type sizes.
      if (project && info.wiTabs) info.wiTabs(project.tabs, project.tabLabels);
    }
    document.documentElement.classList.toggle('flipwords-work', selected);
    if (video) {
      const active = Stage.state.p >= webStation - .4 && Stage.state.p <= webStation + .25 && !document.hidden;
      if (active !== videoActive) {
        videoActive = active;
        if (active) video.play().catch(() => {});
        else if (!active) video.pause();
      }
    }
  };
  addEventListener('web:select', update);
  document.addEventListener('visibilitychange', update);
  Stage.ticker.add(update);
  update();
})();
