(() => {
  'use strict';
  const root = document.documentElement;
  const core = window.ExperienceCore;
  const q = selector => document.querySelector(selector);
  const qa = selector => [...document.querySelectorAll(selector)];
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch (_) { /* Settings still work without storage. */ } };
  const read = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };

  const themeButtons = qa('[data-theme-choice]');
  function setTheme(value) {
    const theme = core.themeValue(value);
    root.dataset.theme = theme;
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
  }
  setTheme(read('mm-theme'));
  themeButtons.forEach(button => button.addEventListener('click', () => {
    setTheme(button.dataset.themeChoice);
    save('mm-theme', button.dataset.themeChoice);
  }));

  // Use a native CSS cursor: no lag, no hidden system cursor, no tracking loop.
  const cursorToggle = q('#cursorToggle');
  function setCursor(enabled) {
    root.dataset.cursor = enabled ? 'pixel' : 'system';
    cursorToggle.setAttribute('aria-pressed', String(enabled));
    cursorToggle.textContent = enabled ? 'Custom cursor: on' : 'Custom cursor: off';
  }
  setCursor(read('mm-cursor') !== 'system');
  cursorToggle.addEventListener('click', () => {
    setCursor(root.dataset.cursor !== 'pixel');
    save('mm-cursor', root.dataset.cursor);
  });

  // A single frame per pointer update. No continuous animation or touch tracking.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const glassPanels = qa('.hero-bottom, .card, .cta-panel');
  let frame = 0, pending;
  function clearLight() {
    cancelAnimationFrame(frame); frame = 0; pending = null;
    glassPanels.forEach(panel => panel.classList.remove('glass-lit'));
  }
  glassPanels.forEach(panel => {
    panel.classList.add('light-panel');
    panel.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches || event.pointerType !== 'mouse') return;
      pending = { panel, x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0; if (!pending) return;
        const { panel, x, y } = pending, rect = panel.getBoundingClientRect();
        panel.style.setProperty('--light-x', `${x - rect.left}px`);
        panel.style.setProperty('--light-y', `${y - rect.top}px`);
        panel.classList.add('glass-lit');
      });
    });
    panel.addEventListener('pointerleave', clearLight);
  });
  motion.addEventListener('change', clearLight);
  pointer.addEventListener('change', clearLight);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearLight(); });
})();
