const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateCpuUsage,
  calculateMemoryUsage,
  deriveLabel,
  formatGb,
  getCpuTotals,
  normalizeQuickLinks,
} = require('../src/utils.js');

test('formatGb formats bytes to one decimal GB', function () {
  assert.equal(formatGb(1073741824), '1.0 GB');
  assert.equal(formatGb(1610612736), '1.5 GB');
});

test('getCpuTotals sums processor idle and total times', function () {
  const totals = getCpuTotals({
    processors: [
      { usage: { idle: 10, total: 100 } },
      { usage: { idle: 20, total: 200 } },
    ],
  });

  assert.deepEqual(totals, { idle: 30, total: 300 });
});

test('calculateCpuUsage returns clamped percentage from two samples', function () {
  assert.equal(
    calculateCpuUsage({ idle: 100, total: 200 }, { idle: 120, total: 260 }),
    67
  );
  assert.equal(
    calculateCpuUsage({ idle: 50, total: 50 }, { idle: 50, total: 50 }),
    null
  );
});

test('calculateMemoryUsage returns percentage and formatted free text', function () {
  const result = calculateMemoryUsage({
    capacity: 8 * 1024 ** 3,
    availableCapacity: 3 * 1024 ** 3,
  });

  assert.deepEqual(result, {
    usedPercentage: 63,
    availableText: '3.0 GB',
  });
});

test('deriveLabel creates uppercase label from hostname', function () {
  assert.equal(deriveLabel('https://www.youtube.com/watch?v=123'), 'YOUTUBE');
  assert.equal(deriveLabel('not-a-url'), 'LINK');
});

test('normalizeQuickLinks trims labels and derives missing labels', function () {
  const links = normalizeQuickLinks([
    { label: ' GitHub ', url: ' https://github.com ' },
    { url: 'https://calendar.google.com' },
    null,
    { label: '', url: 'https://chatgpt.com' },
    { label: 'Bad' },
  ]);

  assert.deepEqual(links, [
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'CALENDAR', url: 'https://calendar.google.com' },
    { label: 'CHATGPT', url: 'https://chatgpt.com' },
  ]);
});
