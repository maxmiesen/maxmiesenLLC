(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-shutter-link]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
      event.preventDefault();
      if (document.body.classList.contains('shutter-exit')) return;
      document.body.classList.add('shutter-exit');
      setTimeout(() => location.assign(link.href), 240);
    });
  });
  addEventListener('pageshow', () => document.body.classList.remove('shutter-exit'));
})();
