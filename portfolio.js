// Motion is optional and stops while the cover is out of view.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const cover = document.querySelector('.poster-hero');
const poster = document.querySelector('.poster-stage');
const motionButton = document.querySelector('.motion-toggle');
let motionPaused = motionPreference.matches;
function updateMotion() {
  document.body.classList.toggle('motion-paused', motionPaused);
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  motionButton.disabled = motionPreference.matches;
  motionButton.textContent = motionPreference.matches ? 'Reduced motion' : motionPaused ? 'Resume motion' : 'Pause motion';
}
updateMotion();
motionButton.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
motionPreference.addEventListener('change', () => { motionPaused = motionPreference.matches; updateMotion(); });
cover.addEventListener('pointermove', event => {
  if (motionPaused || motionPreference.matches || event.pointerType !== 'mouse') return;
  const box = cover.getBoundingClientRect();
  poster.style.setProperty('--tilt-x', `${((event.clientX - box.left) / box.width - .5) * 5}deg`);
  poster.style.setProperty('--tilt-y', `${((event.clientY - box.top) / box.height - .5) * -5}deg`);
});
cover.addEventListener('pointerleave', () => {
  poster.style.setProperty('--tilt-x', '0deg');
  poster.style.setProperty('--tilt-y', '0deg');
});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    cover.querySelector('.poster-float').style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
  }).observe(cover);
}
