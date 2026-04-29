(function (global) {
  'use strict';

  function formatGb(bytes) {
    return (bytes / (1024 ** 3)).toFixed(1) + ' GB';
  }

  function getCpuTotals(info) {
    return info.processors.reduce(function (acc, processor) {
      acc.idle += processor.usage.idle;
      acc.total += processor.usage.total;
      return acc;
    }, { idle: 0, total: 0 });
  }

  function calculateCpuUsage(previous, current) {
    if (!previous || !current) return null;

    const totalDelta = current.total - previous.total;
    const idleDelta = current.idle - previous.idle;
    if (totalDelta <= 0) return null;

    const usage = Math.round((1 - idleDelta / totalDelta) * 100);
    return Math.max(0, Math.min(100, usage));
  }

  function calculateMemoryUsage(info) {
    const used = info.capacity - info.availableCapacity;
    const pct = Math.round((used / info.capacity) * 100);
    return {
      usedPercentage: Math.max(0, Math.min(100, pct)),
      availableText: formatGb(info.availableCapacity),
    };
  }

  function deriveLabel(url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, '');
      return host.split('.')[0].toUpperCase();
    } catch (_error) {
      return 'LINK';
    }
  }

  function normalizeQuickLinks(links) {
    if (!Array.isArray(links)) return [];
    return links
      .filter(function (link) {
        return link && typeof link.url === 'string';
      })
      .map(function (link) {
        const label = typeof link.label === 'string' && link.label.trim()
          ? link.label.trim()
          : deriveLabel(link.url);
        return {
          label: label,
          url: link.url.trim(),
        };
      })
      .filter(function (link) {
        return link.label && link.url;
      });
  }

  const api = {
    calculateCpuUsage: calculateCpuUsage,
    calculateMemoryUsage: calculateMemoryUsage,
    deriveLabel: deriveLabel,
    formatGb: formatGb,
    getCpuTotals: getCpuTotals,
    normalizeQuickLinks: normalizeQuickLinks,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.ExtremeNewTabUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
