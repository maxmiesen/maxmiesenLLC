/* Pure helpers shared by the page and dependency-free regression tests. */
(function (root) {
  function filterProjects(projects, category) {
    return category === 'all' ? projects : projects.filter(project => category === 'Art' ? ['Film', 'Design'].includes(project.category) : project.category === category);
  }
  function themeValue(value) { return value === 'night' ? 'night' : 'dawn'; }
  const api = { filterProjects, themeValue };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ExperienceCore = api;
})(globalThis);
