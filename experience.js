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

  const filmIds = ['tTdOMxfrU7s', 'YUmv99p-3O8', 'Yf-1s-MbgWU', 'UaEqSVQbv9M', 'oTlm4zahPZg', 'G2_V5_4qfik'];
  const projects = [
    ...filmIds.map((id, i) => ({ id: `film-${i}`, category: 'Film', title: `Selected film ${String(i + 1).padStart(2, '0')}`, story: 'A film from the portfolio’s collection of films and client work. Open the original video to watch the finished piece.', roleLabel: 'Practice', role: 'Film & creative production', outcome: 'Finished film / YouTube', href: `https://www.youtube.com/watch?v=${id}`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, glyph: '↗' })),
    ...REPORTS.map(report => ({ id: `report-${report.num}`, category: 'Engineering', title: report.title, story: report.desc, roleLabel: 'Collection', role: `${report.code} / ${report.semester}`, outcome: report.tags.join(' · '), href: report.file, glyph: report.code, report }))
  ];
  const grid = q('#projectGrid');
  const filters = qa('[data-project-filter]');
  const dialog = q('#projectDialog');
  let lastProjectTrigger;
  let restoreProjectFocus = true;
  const make = (tag, className, text) => { const element = document.createElement(tag); if (className) element.className = className; if (text) element.textContent = text; return element; };
  function projectArt(project) {
    const art = make('div', `project-art art-${project.category.toLowerCase()}`);
    art.append(make('span', 'project-glyph', project.glyph));
    if (project.thumbnail) {
      const image = new Image();
      image.alt = ''; image.loading = 'lazy'; image.src = project.thumbnail;
      image.addEventListener('load', () => art.querySelector('.project-glyph')?.remove());
      image.addEventListener('error', () => image.remove());
      art.append(image);
    }
    return art;
  }
  function openProject(project, trigger) {
    lastProjectTrigger = trigger;
    restoreProjectFocus = true;
    q('#projectDialogCategory').textContent = project.category;
    q('#projectDialogTitle').textContent = project.title;
    q('#projectDialogStory').textContent = project.story;
    q('#projectDialogArt').replaceChildren(projectArt(project));
    const details = q('#projectDialogDetails');
    details.replaceChildren();
    for (const [title, value] of [[project.roleLabel, project.role], ['Work', project.outcome]]) {
      const row = make('div'); row.append(make('dt', '', title), make('dd', '', value)); details.append(row);
    }
    const link = q('#projectDialogLink');
    link.href = project.href;
    link.textContent = project.category === 'Film' ? 'Watch film on YouTube ↗' : 'Read the report ↗';
    if (project.href.startsWith('#')) { link.removeAttribute('target'); link.removeAttribute('rel'); }
    else { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    dialog.showModal();
    document.body.classList.add('dialog-open');
    q('#closeProject').focus();
  }
  q('#closeProject').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); if (restoreProjectFocus) lastProjectTrigger?.focus(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  q('#projectDialogLink').addEventListener('click', event => {
    if (event.currentTarget.getAttribute('href').startsWith('#')) {
      restoreProjectFocus = false;
      dialog.close();
      const target = q(event.currentTarget.getAttribute('href'));
      target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
    }
  });
  function renderProjects(category) {
    const visible = core.filterProjects(projects, category);
    grid.replaceChildren();
    visible.forEach(project => {
      const button = make('button', 'project-card'); button.type = 'button';
      button.setAttribute('aria-haspopup', 'dialog');
      const art = projectArt(project); art.setAttribute('aria-hidden', 'true');
      button.append(art);
      if (project.category === 'Film') {
        button.classList.add('film-thumbnail');
        button.setAttribute('aria-label', `Explore ${project.title.toLowerCase()}`);
      } else {
        const copy = make('span', 'project-copy');
        copy.append(make('span', 'project-category', project.category), make('span', 'project-title', project.title), make('span', 'project-open', 'Explore ↗'));
        button.append(copy);
      }
      button.addEventListener('click', () => openProject(project, button)); grid.append(button);
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.projectFilter === category)));
    q('#projectCount').textContent = `${visible.length} ${visible.length === 1 ? 'project' : 'projects'} · ${category === 'all' ? 'All practices' : category}`;
  }
  filters.forEach(button => button.addEventListener('click', () => renderProjects(button.dataset.projectFilter)));
  renderProjects('all');

  // A single frame per pointer update. No continuous animation or touch tracking.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const glassPanels = qa('.hero-bottom, .card, .cta-panel, .pitch-line');
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
