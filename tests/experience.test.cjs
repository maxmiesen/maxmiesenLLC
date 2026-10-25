const { test } = require('node:test');
const assert = require('node:assert/strict');
const { filterProjects, themeValue } = require('../experience-core.js');
const projects = [{ category: 'Film' }, { category: 'Design' }, { category: 'Engineering' }];
test('gallery separates disciplines and combines both creative practices', () => {
  assert.equal(filterProjects(projects, 'all').length, 3);
  assert.equal(filterProjects(projects, 'Art').length, 2);
  for (const category of ['Film', 'Design', 'Engineering']) assert.deepEqual(filterProjects(projects, category), [{ category }]);
  assert.deepEqual(filterProjects(projects, 'missing'), []);
});
test('theme preferences accept only supported values', () => {
  assert.equal(themeValue('night'), 'night');
  for (const value of [null, undefined, 'dawn', 'invalid']) assert.equal(themeValue(value), 'dawn');
});
