/* Layout mode follows available space and primary input, including rotated phones. */
(() => {
  const compact = matchMedia('(max-width: 820px), (max-height: 599px), (hover: none) and (pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const documentMode = compact.matches || reduced.matches;
  const schedule = callback => {
    let frame = 0;
    return () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; callback(); });
    };
  };
  window.PortfolioLayout = { documentMode, schedule };
  if (!documentMode) {
    document.documentElement.classList.remove('stage-off');
    document.documentElement.classList.add('stage-preparing');
  }
  let timer;
  const change = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if ((compact.matches || reduced.matches) === documentMode) return;
      // Document scrolling does not update the hash; save the visible section first.
      if (!window.Stage?.enabled) {
        const sections = [...document.querySelectorAll('#hero, .browse-section')];
        const visible = sections.filter(el => el.getBoundingClientRect().top <= innerHeight / 2).at(-1);
        const destination = document.getElementById?.(location.hash?.slice(1));
        const bounds = destination?.getBoundingClientRect();
        const keepDestination = bounds && bounds.top < innerHeight / 2 && bounds.bottom > 88;
        if (visible && !keepDestination) history.replaceState(history.state, '', '#' + visible.id);
      }
      location.reload();
    }, 250);
  };
  compact.addEventListener('change', change);
  reduced.addEventListener('change', change);
})();
