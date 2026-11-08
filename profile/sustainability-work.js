(() => {
  const dashboard = document.querySelector('.sus-dashboard');
  if (!dashboard) return;
  const stages = [
    'Read source reports and keep the context behind each figure.',
    'Retrieve relevant passages; extract metrics with an NLP pipeline.',
    'Map disclosures to a shared taxonomy and normalize values and units.',
    'Compare sources and flag results for human review before publishing.'
  ];
  const sources = {
    ghg: 'Source: Sustainability Report, p. 42 · Scope 1 + 2 · unit: tCO₂e',
    intensity: 'Source: Annual Report, p. 58 · Emissions per US$M revenue · unit: tCO₂e/US$M',
    energy: 'Source: Sustainability Report, p. 46 · Renewable share of energy use · unit: %',
    water: 'Source: Sustainability Report, p. 51 · Total water withdrawal · unit: m³'
  };
  const stepButtons = [...document.querySelectorAll('[data-step-control]')];
  const metricButtons = [...document.querySelectorAll('[data-metric]')];
  const pause = document.getElementById('sus-pause');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let step = 0, running = false, timer = 0;

  function paint() {
    dashboard.dataset.step = String(step);
    dashboard.dataset.running = String(running && !document.hidden);
    document.getElementById('sus-status').textContent = stages[step];
    stepButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.stepControl) === step)));
    document.querySelectorAll('.sus-validation li').forEach((item, i) => {
      const checked = step >= 2 && (i === 0 || step === 3);
      item.classList.toggle('sus-checked', checked);
      item.querySelector('.sus-check').textContent = checked ? '✓' : '·';
    });
    pause.textContent = running ? 'Pause Ⅱ' : step === 3 ? 'Complete ✓' : 'Play ▷';
    pause.setAttribute('aria-label', running ? 'Pause workflow animation' : step === 3 ? 'Workflow animation complete' : 'Play workflow animation');
    pause.disabled = !running && step === 3;
  }

  function schedule() {
    clearTimeout(timer);
    if (!running || document.hidden) return;
    timer = setTimeout(() => {
      if (step < 3) step++;
      else running = false;
      paint();
      schedule();
    }, 2600);
  }

  function selectStep(next, play = false) {
    step = next;
    running = play;
    paint();
    schedule();
  }

  stepButtons.forEach(button => button.addEventListener('click', () => selectStep(Number(button.dataset.stepControl))));
  metricButtons.forEach(button => {
    button.setAttribute('aria-controls', 'sus-source');
    button.addEventListener('click', () => {
      const metric = button.dataset.metric;
      metricButtons.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.metric === metric)));
      document.getElementById('sus-source').textContent = sources[metric];
    });
  });
  pause.addEventListener('click', () => { running = !running; paint(); schedule(); });
  document.getElementById('sus-replay').addEventListener('click', () => selectStep(0, !reducedMotion.matches));
  document.addEventListener('visibilitychange', () => { paint(); schedule(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) selectStep(3); });
  selectStep(reducedMotion.matches ? 3 : 0, !reducedMotion.matches);
})();
