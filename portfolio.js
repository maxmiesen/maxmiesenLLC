// Reflect the section currently in view without changing scroll or keyboard focus.
const sectionLinks = [...document.querySelectorAll('.page-links a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const active = entries.find(entry => entry.isIntersecting);
    if (!active) return;
    sectionLinks.forEach(link => {
      if (link.hash === `#${active.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  sectionLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  });
}
