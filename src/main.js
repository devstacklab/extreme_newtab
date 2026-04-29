const QS = [
  { t: "The secret of getting ahead is <span class='hi'>getting started</span>.", a: "MARK TWAIN" },
  { t: "Hard work beats talent when talent doesn't <span class='hi'>work hard</span>.", a: "TIM NOTKE" },
  { t: "Push yourself — <span class='hi'>no one else</span> is going to do it for you.", a: "UNKNOWN" },
  { t: "Success is not final. Failure is not fatal. Only <span class='hi'>courage to continue</span> counts.", a: "WINSTON CHURCHILL" },
  { t: "Wake up with <span class='hi'>determination</span>. Go to bed with <span class='hi'>satisfaction</span>.", a: "UNKNOWN" },
  { t: "Don't stop when you're tired. Stop when you're <span class='hi'>done</span>.", a: "UNKNOWN" },
  { t: "Everything you've ever wanted is on the other side of <span class='hi'>fear</span>.", a: "GEORGE ADDAIR" },
  { t: "The future belongs to those who believe in the <span class='hi'>beauty of their dreams</span>.", a: "ELEANOR ROOSEVELT" },
  { t: "Believe you can and you're <span class='hi'>halfway there</span>.", a: "THEODORE ROOSEVELT" },
  { t: "The only way to do great work is to <span class='hi'>love what you do</span>.", a: "STEVE JOBS" },
  { t: "You didn't come this far to only come <span class='hi'>this far</span>.", a: "UNKNOWN" },
  { t: "The harder the battle, the <span class='hi'>sweeter the victory</span>.", a: "LES BROWN" },
  { t: "Great things never come from <span class='hi'>comfort zones</span>.", a: "UNKNOWN" },
  { t: "Dream it. Wish it. <span class='hi'>Do it.</span>", a: "UNKNOWN" },
  { t: "Your only limit is your <span class='hi'>mind</span>.", a: "UNKNOWN" },
];

const QUICK_LINKS = [
  { label: 'GMAIL', url: 'https://mail.google.com/' },
  { label: 'YOUTUBE', url: 'https://www.youtube.com/' },
  { label: 'GITHUB', url: 'https://github.com/' },
  { label: 'CHATGPT', url: 'https://chatgpt.com/' },
  { label: 'CALENDAR', url: 'https://calendar.google.com/' },
  { label: 'DRIVE', url: 'https://drive.google.com/' },
  { label: 'MAPS', url: 'https://maps.google.com/' },
];

let qi = 0;
let lastCpuSample = null;

function dayQi() {
  const n = new Date();
  return Math.floor((n - new Date(n.getFullYear(), 0, 0)) / 864e5) % QS.length;
}

function showQ(i) {
  const q = QS[i];
  const et = document.getElementById('qt');
  const ea = document.getElementById('qa');
  et.style.opacity = 0;
  ea.style.opacity = 0;
  setTimeout(function () {
    et.innerHTML = q.t;
    ea.textContent = '— ' + q.a;
    et.style.transition = 'opacity .4s';
    ea.style.transition = 'opacity .4s .1s';
    et.style.opacity = 1;
    ea.style.opacity = 1;
  }, 300);
}

function tick() {
  const n = new Date();
  let h = n.getHours();
  const m = n.getMinutes();
  const s = n.getSeconds();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  document.getElementById('ch').textContent = String(h).padStart(2, '0');
  document.getElementById('cm').textContent = String(m).padStart(2, '0');
  document.getElementById('campm').textContent = ap;
  document.getElementById('cs').textContent = String(s).padStart(2, '0');
  document.getElementById('sbf').style.width = (s / 59 * 100) + '%';
}

function updateInfo() {
  const n = new Date();
  const DAY = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const MON = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const ds = DAY[n.getDay()] + ' — ' + n.getDate() + ' ' + MON[n.getMonth()] + ' ' + n.getFullYear();
  document.getElementById('dlabel').textContent = '◈ ' + ds + ' ◈';
  document.getElementById('tbDate').textContent = ds;
  const doy = Math.floor((n - new Date(n.getFullYear(), 0, 0)) / 864e5);
  const wk = Math.ceil(doy / 7);
  document.getElementById('tbDay').textContent = 'DAY ' + doy;
  document.getElementById('tbWeek').textContent = 'WEEK ' + wk;
  const sp = n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
  const pct = Math.floor(sp / 864);
  document.getElementById('bpct').textContent = 'DAY ' + pct + '% DONE';
  document.getElementById('dpf').style.width = pct + '%';
}

function doSearch() {
  const q = document.getElementById('si').value.trim();
  if (q) location.href = 'https://www.google.com/search?q=' + encodeURIComponent(q);
}

function setStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHudLevel(sideClass, value) {
  const panel = document.querySelector('.' + sideClass);
  if (panel) {
    panel.style.setProperty('--hud-level', String(value));
  }
}

function setMeter(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.style.width = String(value) + '%';
  }
}

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

function updateCpuUsage() {
  if (!chrome.system || !chrome.system.cpu || !chrome.system.cpu.getInfo) {
    setStat('cpuUsage', 'N/A');
    setHudLevel('sidehud-left', 0);
    setMeter('cpuMeter', 0);
    return;
  }

  chrome.system.cpu.getInfo(function (info) {
    const current = getCpuTotals(info);
    if (!lastCpuSample) {
      lastCpuSample = current;
      setStat('cpuUsage', '--%');
      setHudLevel('sidehud-left', 0);
      setMeter('cpuMeter', 0);
      return;
    }

    const totalDelta = current.total - lastCpuSample.total;
    const idleDelta = current.idle - lastCpuSample.idle;
    lastCpuSample = current;

    if (totalDelta <= 0) {
      setStat('cpuUsage', '--%');
      setHudLevel('sidehud-left', 0);
      setMeter('cpuMeter', 0);
      return;
    }

    const usage = Math.round((1 - idleDelta / totalDelta) * 100);
    const clamped = Math.max(0, Math.min(100, usage));
    setStat('cpuUsage', String(clamped) + '%');
    setHudLevel('sidehud-left', clamped);
    setMeter('cpuMeter', clamped);
  });
}

function updateMemoryUsage() {
  if (!chrome.system || !chrome.system.memory || !chrome.system.memory.getInfo) {
    setStat('memoryUsage', 'N/A');
    setStat('memoryFree', 'N/A');
    setHudLevel('sidehud-right', 0);
    setMeter('memoryMeter', 0);
    return;
  }

  chrome.system.memory.getInfo(function (info) {
    const used = info.capacity - info.availableCapacity;
    const pct = Math.round((used / info.capacity) * 100);
    const clamped = Math.max(0, Math.min(100, pct));
    setStat('memoryUsage', String(clamped) + '%');
    setStat('memoryFree', formatGb(info.availableCapacity));
    setHudLevel('sidehud-right', clamped);
    setMeter('memoryMeter', clamped);
  });
}

function startSystemStats() {
  updateCpuUsage();
  updateMemoryUsage();
  setInterval(updateCpuUsage, 2000);
  setInterval(updateMemoryUsage, 5000);
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

function deriveLabel(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host.split('.')[0].toUpperCase();
  } catch (_error) {
    return 'LINK';
  }
}

function getTopSites() {
  return new Promise(function (resolve) {
    if (!chrome.topSites || !chrome.topSites.get) {
      resolve(QUICK_LINKS);
      return;
    }

    chrome.topSites.get(function (sites) {
      const topSites = normalizeQuickLinks(sites).slice(0, 14);
      resolve(topSites.length > 0 ? topSites : QUICK_LINKS);
    });
  });
}

function renderQuickLinks(links) {
  const grid = document.getElementById('linksgrid');
  grid.textContent = '';
  links.forEach(function (link) {
    const a = document.createElement('a');
    a.className = 'qlink';
    a.href = link.url;
    a.textContent = link.label;
    a.setAttribute('aria-label', link.label);
    grid.appendChild(a);
  });
}

function spawnPts() {
  const c = document.getElementById('pts');
  const cols = ['rgba(0,255,231,', 'rgba(255,0,60,', 'rgba(255,230,0,'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'p';
    const cl = cols[i % 3];
    const sz = Math.random() * 2.5 + 1;
    const dur = (9 + Math.random() * 12).toFixed(1);
    const del = -(Math.random() * 18).toFixed(1);
    const op = (0.25 + Math.random() * 0.5).toFixed(2);
    p.style.left = (Math.random() * 100).toFixed(1) + '%';
    p.style.width = sz.toFixed(1) + 'px';
    p.style.height = sz.toFixed(1) + 'px';
    p.style.background = cl + op + ')';
    p.style.boxShadow = '0 0 ' + (sz * 3).toFixed(0) + 'px ' + cl + '0.8)';
    p.style.animationDuration = dur + 's';
    p.style.animationDelay = del + 's';
    c.appendChild(p);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  qi = dayQi();
  showQ(qi);
  tick();
  updateInfo();
  spawnPts();
  startSystemStats();
  getTopSites().then(renderQuickLinks);

  setInterval(tick, 1000);
  setInterval(updateInfo, 30000);

  document.getElementById('rbtn').addEventListener('click', function () {
    qi = (qi + 1) % QS.length;
    showQ(qi);
  });

  document.getElementById('sibtn').addEventListener('click', doSearch);

  document.getElementById('si').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') doSearch();
  });
});
