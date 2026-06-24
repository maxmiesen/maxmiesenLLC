// Shared site behaviors: mobile nav, scroll progress, gentle scroll reveals,
// number count-up + chart draw (used by inner pages), nav scroll state.

document.documentElement.classList.add('js');

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- mobile nav ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const tabs = document.querySelector('.nav-tabs');
  if (toggle && tabs) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      tabs.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !tabs.contains(e.target)) {
        tabs.classList.remove('active');
      }
    });
  }

  /* ---------- progress bar + nav scroll state ---------- */
  const progress = document.getElementById('progress');
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    const h = document.documentElement;
    if (progress) {
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
      progress.style.width = pct + '%';
    }
    if (navbar) navbar.classList.toggle('scrolled', h.scrollTop > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- gentle scroll reveal + stagger ---------- */
  const revealSelectors = [
    '.eyebrow', '.product-role', '.product-logo',
    '.page-title', '.page-lede', '.header-meta',
    '.section-eyebrow', '.section-title',
    '.card', '.metric', '.about-block', '.cta-panel',
    '.product-art', '.portrait', '.reel-embed', '.video-frame',
    '.toc', '.viewer-wrap', '.dots', '.hello-line',
    '.rate-card', '.tfe-wordmark', '.now-list',
  ];
  const revealEls = new Set();
  revealSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => revealEls.add(el));
  });

  // stagger items inside grids
  const stagger = (selector, step = 70) => {
    document.querySelectorAll(selector).forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        if (revealEls.has(child)) {
          child.style.setProperty('--reveal-delay', (i * step) + 'ms');
        }
      });
    });
  };
  stagger('.card-grid', 70);
  stagger('.metrics', 80);
  stagger('.video-grid', 80);
  stagger('.about-grid', 80);
  stagger('.rate-grid', 80);

  ['.product-art', '.portrait', '.reel-embed'].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => el.classList.add('reveal-scale'));
  });

  if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('reveal', 'in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---------- number count-up (inner pages) ---------- */
  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\D*)(\d[\d,]*\.?\d*)(.*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ''));
    if (!isFinite(target)) return;
    const hasComma = numStr.includes(',');
    const decimals = (numStr.split('.')[1] || '').length;
    const dur = 1400;
    const start = performance.now();
    const fmt = (v) => {
      let s = decimals ? v.toFixed(decimals) : String(Math.round(v));
      if (hasComma) s = Number(s).toLocaleString('en-US');
      return prefix + s + suffix;
    };
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  };

  const metricVals = document.querySelectorAll('.metric-val');
  if (metricVals.length && !(REDUCED_MOTION || !('IntersectionObserver' in window))) {
    const mio = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    metricVals.forEach((el) => mio.observe(el));
  }

  /* ---------- chart line draw (inner pages) ---------- */
  const charts = document.querySelectorAll('.chart-bg');
  charts.forEach((chart) => {
    const line = chart.querySelector('path[stroke]');
    if (line && line.getTotalLength) {
      chart.style.setProperty('--len', line.getTotalLength());
    }
  });
  if (charts.length) {
    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      charts.forEach((c) => c.classList.add('drawn'));
    } else {
      const cio = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('drawn');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      charts.forEach((c) => cio.observe(c));
    }
  }
});
