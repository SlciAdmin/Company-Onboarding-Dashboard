// ============================================================
// UNIFIED 4 LABOUR CODES DASHBOARD — MAIN APP (FIXED)
// ============================================================

let currentCode = 'wages';
let currentData = null;
let currentCharts = [];
let rulesFiltData = [];
let sectionFiltData = [];
let formsFiltData = [];
const PER_PAGE = 25;

const CODE_DATA_MAP = {
  wages: typeof DATA_WAGES !== 'undefined' ? DATA_WAGES : null,
  osh: typeof DATA_OSH !== 'undefined' ? DATA_OSH : null,
  ir: typeof DATA_IR !== 'undefined' ? DATA_IR : null,
  ss: typeof DATA_SS !== 'undefined' ? DATA_SS : null
};

const CAT_PILL_MAP = {
  'Minimum Wages':'p-mw','Floor Wages':'p-fw','Payment':'p-py','Bonus':'p-bn',
  'Advisory':'p-ad','Claims':'p-cl','Records':'p-rc','Records & Returns':'p-rr','Offences':'p-of',
  'Health & Safety':'p-hs','Welfare':'p-wf','Working Hours':'p-wh','Mine Safety':'p-mn',
  'Mine Rescue':'p-mr','Mine Training':'p-mt','Preliminary':'p-pre','Registration':'p-reg',
  'Contract Labour':'p-cl','Inspection':'p-ins','Miscellaneous':'p-ot',
  'Trade Union':'p-tu','Standing Orders':'p-so','Works Committee':'p-wc','Grievance':'p-gr',
  'Conciliation':'p-con','Strikes':'p-str','Lay-off/Closure':'p-lay','Arbitration':'p-arb',
  'Compounding':'p-com','Notice of Change':'p-ot','Recovery':'p-lay','Misc':'p-ot',
  'EPF':'p-epf','ESI':'p-esi','Gratuity':'p-grt','Maternity':'p-mat',
  'BOCW':'p-bocw','Gig/Platform':'p-gig','Employment':'p-emp','Workers Compensation':'p-wc',
  'Compliance':'p-com','Settlement':'p-tu','Tribunal':'p-arb','Notice':'p-ot',
  'Strike/Lockout':'p-str','Retrenchment':'p-so','Complaint':'p-ot',
  'Wage Slip':'p-fw','Nomination':'p-bn','Attendance':'p-py','Appeal':'p-cl'
};

function getCatPill(c) { return CAT_PILL_MAP[c] || 'p-ot'; }

// ============================================================
// MODAL HELPERS — FIXED
// No more body freeze: use body.modal-open class for scroll lock
// Overlay click closes only when clicking the backdrop itself
// ============================================================
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.classList.add('modal-open');
  // Scroll overlay to top
  overlay.scrollTop = 0;
}

function closeDetailModal() {
  const overlay = document.getElementById('detailOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('modal-open');
  if (currentData) {
    document.documentElement.style.setProperty('--current-accent', currentData.meta.accent);
  }
}

function closeCal() {
  const overlay = document.getElementById('calOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('modal-open');
}

// Overlay backdrop click handler
function handleOverlayClick(e, overlayId) {
  // Only close if clicking the overlay itself (not any child)
  if (e.target.id === overlayId) {
    if (overlayId === 'detailOverlay') closeDetailModal();
    if (overlayId === 'calOverlay') closeCal();
  }
}

// ============================================================
// CODE SELECTION — non-blocking, uses requestAnimationFrame
// ============================================================
function selectCode(code, btn) {
  currentCode = code;
  currentData = CODE_DATA_MAP[code];
  if (!currentData) {
    console.error('Data not found for code:', code);
    return;
  }
  document.querySelectorAll('.code-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  destroyCharts();
  // Use requestAnimationFrame so button state updates visually before heavy render
  requestAnimationFrame(() => renderDashboard());
}

function destroyCharts() {
  currentCharts.forEach(c => { try { c.destroy(); } catch(e) {} });
  currentCharts = [];
}

function renderDashboard() {
  const d = currentData;
  if (!d) return;
  const acc = d.meta.accent;
  document.documentElement.style.setProperty('--current-accent', acc);
  document.documentElement.style.setProperty('--active-accent', acc);

  const content = document.getElementById('dashboard-content');
  content.innerHTML = buildShell(d);

  renderStats(d);

  // Use setTimeout 0 to let browser paint first, preventing UI freeze
  setTimeout(() => {
    renderCharts(d);
    initSectionsTable(d);
    initRulesTable(d);
    renderForms(d);
    renderEmployer(d);
    renderTimeline(d);
    animateCounters(d);
    initInnerTabClickHandlers();
  }, 0);
}

// ============================================================
// BUILD HTML SHELL
// ============================================================
function buildShell(d) {
  const acc = d.meta.accent;
  return `
  <div class="code-hdr">
    <div class="code-hdr-inner" style="background:rgba(0,0,0,0.22);border:1px solid ${acc}28;border-radius:12px;">
      <div class="code-hdr-title">
        <div class="code-hdr-icon" style="background:${acc}1A;">${d.meta.icon}</div>
        <div>
          <div class="code-hdr-h">${d.meta.name}</div>
          <div class="code-hdr-sub">${d.meta.act} · ${d.meta.gsr} · ${d.meta.enacted}</div>
        </div>
      </div>
      <div class="code-hdr-right">
        <button class="btn-cal" style="background:${acc};color:#000;" onclick="openCal()">📅 Calendar</button>
        <button class="export-btn-sm" onclick="exportAllCSV()">⬇ Export CSV</button>
      </div>
    </div>
  </div>

  <div class="stats-row" id="statsRow"></div>

  <div class="inner-tabs" id="innerTabBar" style="--current-accent:${acc}">
    <button class="inner-tab active" data-panel="overview">📊 Overview</button>
    <button class="inner-tab" data-panel="sections">📜 Code Sections</button>
    <button class="inner-tab" data-panel="employer">🏭 Employer Compliance</button>
    <button class="inner-tab" data-panel="rules">📋 Rules</button>
    <button class="inner-tab" data-panel="forms">📄 Forms</button>
    <button class="inner-tab" data-panel="timeline">⏱️ Timeline</button>
  </div>

  <div id="panel-overview" class="inner-panel active">
    <div class="chart-grid" id="chartGrid"></div>
  </div>

  <div id="panel-sections" class="inner-panel">
    <div class="table-section">
      <div class="table-card">
        <div class="table-head">
          <div class="table-title-row">
            <div class="table-title">All ${d.meta.sections} Sections — Complete Reference</div>
            <span class="table-count" id="secCount"></span>
          </div>
          <button class="export-btn-sm" onclick="exportSectionsCSV()">⬇ CSV</button>
        </div>
        <div class="toolbar" id="secFilterBar"></div>
        <div class="twrap">
          <table>
            <thead><tr>
              <th style="min-width:70px">Sec.</th>
              <th style="min-width:60px">Ch.</th>
              <th style="min-width:200px">Title</th>
              <th>Key Provision</th>
              <th style="min-width:110px">Applicability</th>
              <th style="min-width:130px">Linked Rules</th>
              <th style="min-width:130px">Linked Forms</th>
            </tr></thead>
            <tbody id="secTbody"></tbody>
          </table>
        </div>
        <div class="pager">
          <span id="secPageInfo"></span>
          <div class="pbtns" id="secPageBtns"></div>
        </div>
      </div>
    </div>
  </div>

  <div id="panel-employer" class="inner-panel">
    <div class="table-section">
      <div id="employerContent"></div>
    </div>
  </div>

  <div id="panel-rules" class="inner-panel">
    <div class="table-section">
      <div class="table-card">
        <div class="table-head">
          <div class="table-title-row">
            <div class="table-title">All ${d.meta.rules} Central Rules (${d.meta.gsr})</div>
            <span class="table-count" id="rulesCount"></span>
          </div>
          <button class="export-btn-sm" onclick="exportRulesCSV()">⬇ CSV</button>
        </div>
        <div class="toolbar" id="rulesToolbar"></div>
        <div class="twrap">
          <table>
            <thead><tr>
              <th style="min-width:80px">Rule No.</th>
              <th style="min-width:55px">Ch.</th>
              <th style="min-width:260px">Title</th>
              <th style="min-width:120px">Category</th>
              <th>Threshold</th>
              <th style="min-width:90px">Code Ref</th>
            </tr></thead>
            <tbody id="rulesTbody"></tbody>
          </table>
        </div>
        <div class="pager">
          <span id="rulesPageInfo"></span>
          <div class="pbtns" id="rulesPageBtns"></div>
        </div>
      </div>
    </div>
  </div>

  <div id="panel-forms" class="inner-panel">
    <div class="table-section">
      <div class="table-card" style="margin-bottom:14px;">
        <div class="table-head">
          <div class="table-title-row">
            <div class="table-title">All ${d.meta.forms} Prescribed Forms — ${d.meta.gsr}</div>
          </div>
        </div>
        <div class="toolbar" id="formsToolbar"></div>
      </div>
      <div class="forms-grid" id="formsGrid"></div>
    </div>
  </div>

  <div id="panel-timeline" class="inner-panel">
    <div class="table-section">
      <div class="table-card">
        <div class="table-head">
          <div class="table-title-row">
            <div class="table-title">Legislative &amp; Compliance Timeline</div>
          </div>
        </div>
        <div class="timeline" id="timelineContent"></div>
      </div>
    </div>
  </div>
  4
  `;
}

// ============================================================
// INNER TAB CLICK HANDLERS
// ============================================================
function initInnerTabClickHandlers() {
  const tabBar = document.getElementById('innerTabBar');
  if (!tabBar) return;
  tabBar.querySelectorAll('.inner-tab').forEach(btn => {
    btn.addEventListener('click', function() {
      tabBar.querySelectorAll('.inner-tab').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const panelId = 'panel-' + this.dataset.panel;
      document.querySelectorAll('.inner-panel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(panelId);
      if (target) target.classList.add('active');
    });
  });
}

// ============================================================
// STATS
// ============================================================
function renderStats(d) {
  const colors = ['#5A96F8','#E8A020','#1ECDE8','#2ECC9A','#F07070','#F07832'];
  const row = document.getElementById('statsRow');
  if (!row) return;
  row.innerHTML = d.stats.map((s, i) => `
    <div class="scard">
      <div style="background:linear-gradient(90deg,${colors[i]},${colors[(i+1)%colors.length]})"></div>
      <div class="snum" style="color:${colors[i]}" id="stat${i}">${typeof s.num === 'string' ? s.num : '0'}</div>
      <div class="slabel">${s.label}</div>
      <div class="ssub">${s.sub}</div>
    </div>
  `).join('');
}

function animateCounters(d) {
  d.stats.forEach((s, i) => {
    const el = document.getElementById('stat' + i);
    if (!el) return;
    if (typeof s.num === 'string') { el.textContent = s.num; return; }
    let cur = 0;
    const target = s.num;
    const step = Math.max(1, Math.ceil(target / 40));
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(t);
    }, 28);
  });
}

// ============================================================
// CHARTS
// ============================================================
const CHART_COLORS = [
  '#2E6FED','#F07070','#E8A020','#E858A8','#F07832',
  '#1ECDE8','#2ECC9A','#9B72E8','#60A5FA','#FBBF24',
  '#A78BFA','#34D399','#FB923C','#F472B6'
];

function renderCharts(d) {
  const grid = document.getElementById('chartGrid');
  if (!grid) return;
  const acc = d.meta.accent;

  grid.innerHTML = `
    <div class="chart-card">
      <div class="chart-head">
        <span class="chart-title"><span class="dot8" style="background:${acc}"></span>Sections by Chapter</span>
        <span class="chart-sub">${d.meta.sections} Sections</span>
      </div>
      <div class="chart-body">
        <canvas id="chChart"></canvas>
        <div class="legend" id="chLegend"></div>
      </div>
    </div>
    <div class="chart-card">
      <div class="chart-head">
        <span class="chart-title"><span class="dot8" style="background:#E8A020"></span>Rules by Category</span>
        <span class="chart-sub">${d.meta.rules} Rules</span>
      </div>
      <div class="chart-body"><canvas id="rulesCatChart"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-head">
        <span class="chart-title"><span class="dot8" style="background:#2ECC9A"></span>Employer Thresholds</span>
        <span class="chart-sub">Worker Count Requirements</span>
      </div>
      <div class="chart-body"><canvas id="threshChart"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-head">
        <span class="chart-title"><span class="dot8" style="background:#9B72E8"></span>Compliance Radar</span>
        <span class="chart-sub">By Functional Area</span>
      </div>
      <div class="chart-body"><canvas id="radarChart"></canvas></div>
    </div>
  `;

  Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
  Chart.defaults.color = '#7BA8CC';

  const chCount = {};
  d.sections.forEach(s => { chCount[s.ch] = (chCount[s.ch] || 0) + 1; });
  const chLabels = Object.keys(chCount).sort();
  const chData = chLabels.map(c => chCount[c]);

  const chBar = new Chart(document.getElementById('chChart'), {
    type: 'bar',
    data: {
      labels: chLabels.map(c => 'Ch.' + c),
      datasets: [{
        label: 'Sections',
        data: chData,
        backgroundColor: chLabels.map((_, i) => `hsl(${190 + i * 12}, 65%, ${52 + i}%)`),
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#7BA8CC', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#7BA8CC', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true }
      }
    }
  });
  currentCharts.push(chBar);

  const leg = document.getElementById('chLegend');
  if (leg) {
    leg.innerHTML = chLabels.map((c, i) => `
      <div class="leg-item">
        <div class="leg-dot" style="background:hsl(${190+i*12},65%,${52+i}%)"></div>
        <div class="leg-lbl">Ch.${c}</div>
        <div class="leg-n">${chData[i]}</div>
        <div class="leg-pct" style="color:${acc}">${((chData[i]/d.meta.sections)*100).toFixed(0)}%</div>
      </div>`).join('');
  }

  const rc = {};
  d.rules.forEach(r => { rc[r.c] = (rc[r.c] || 0) + 1; });
  const rkeys = Object.keys(rc).sort((a, b) => rc[b] - rc[a]);
  const rvals = rkeys.map(k => rc[k]);
  const rtot = rvals.reduce((a, b) => a + b, 0);

  const rulesDonut = new Chart(document.getElementById('rulesCatChart'), {
    type: 'doughnut',
    data: {
      labels: rkeys,
      datasets: [{
        data: rvals,
        backgroundColor: CHART_COLORS,
        borderWidth: 3,
        borderColor: 'var(--card)',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#7BA8CC', font: { size: 9 }, boxWidth: 9, padding: 6 } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} (${((ctx.parsed/rtot)*100).toFixed(1)}%)` } }
      }
    }
  });
  currentCharts.push(rulesDonut);

  const threshData = getThresholdData(d);
  const threshBar = new Chart(document.getElementById('threshChart'), {
    type: 'bar',
    data: {
      labels: threshData.map(x => x.l),
      datasets: [{
        label: 'Items',
        data: threshData.map(x => x.v),
        backgroundColor: threshData.map(x => x.c),
        borderRadius: 7,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#7BA8CC', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true },
        y: { ticks: { color: '#7BA8CC', font: { size: 9 } }, grid: { display: false } }
      }
    }
  });
  currentCharts.push(threshBar);

  const radarData = getRadarData(d);
  const radar = new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: radarData.labels,
      datasets: [
        {
          label: 'Sections',
          data: radarData.secData,
          fill: true,
          backgroundColor: acc + '28',
          borderColor: acc,
          pointBackgroundColor: acc,
          pointRadius: 4,
          borderWidth: 2
        },
        {
          label: 'Rules',
          data: radarData.ruleData,
          fill: true,
          backgroundColor: 'rgba(232,160,32,0.12)',
          borderColor: '#E8A020',
          pointBackgroundColor: '#E8A020',
          pointRadius: 4,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        r: {
          ticks: { color: '#7BA8CC', backdropColor: 'transparent', font: { size: 9 } },
          grid: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: { color: '#7BA8CC', font: { size: 10 } }
        }
      },
      plugins: { legend: { labels: { color: '#7BA8CC', font: { size: 10 }, boxWidth: 10 } } }
    }
  });
  currentCharts.push(radar);
}

function getThresholdData(d) {
  if (d.meta.code === 'wages') return [
    {l:'All Employees (Min Wages)',v:14,c:'#2E6FED'},
    {l:'Floor Wage (Central)',v:1,c:'#1ECDE8'},
    {l:'Payment of Wages',v:11,c:'#E8A020'},
    {l:'Bonus (30+ Days Worked)',v:16,c:'#E858A8'},
    {l:'Advisory Board',v:2,c:'#9B72E8'},
    {l:'Claims & Records',v:5,c:'#2ECC9A'}
  ];
  if (d.meta.code === 'osh') return [
    {l:'All Establishments (General)',v:30,c:'#1ECDE8'},
    {l:'20+ Workers (Basic Welfare)',v:5,c:'#2ECC9A'},
    {l:'50+ Workers (Rest Room/Crèche)',v:3,c:'#9B72E8'},
    {l:'100+ Workers (Canteen)',v:2,c:'#E8A020'},
    {l:'250+ Workers (Welfare Officer)',v:2,c:'#F07832'},
    {l:'500+ Workers (Ambulance Room)',v:2,c:'#F07070'},
    {l:'Mine/Construction',v:20,c:'#E858A8'}
  ];
  if (d.meta.code === 'ir') return [
    {l:'All Establishments (General)',v:28,c:'#9B72E8'},
    {l:'20+ Workers (GRC)',v:1,c:'#F07070'},
    {l:'50+ Workers (Lay-off Comp)',v:3,c:'#60A5FA'},
    {l:'100+ Workers (Works Committee)',v:1,c:'#2E6FED'},
    {l:'300+ Workers (Standing Orders)',v:12,c:'#E8A020'},
    {l:'300+ Workers (Ch X Permissions)',v:5,c:'#F07832'}
  ];
  return [
    {l:'All Establishments (General)',v:20,c:'#2ECC9A'},
    {l:'10+ Employees (ESI)',v:12,c:'#F07070'},
    {l:'20+ Employees (EPF)',v:8,c:'#2E6FED'},
    {l:'50+ Employees (Crèche/BOCW)',v:6,c:'#E858A8'},
    {l:'Construction Employers (BOCW)',v:8,c:'#F07832'},
    {l:'All Aggregators (Gig)',v:4,c:'#1ECDE8'}
  ];
}

function getRadarData(d) {
  if (d.meta.code === 'wages') return {
    labels: ['Min Wages','Floor Wage','Payment','Bonus','Advisory','Claims','Records','Offences'],
    secData: [11,1,11,16,2,7,1,5], ruleData: [8,1,10,8,14,3,3,2]
  };
  if (d.meta.code === 'osh') return {
    labels: ['Health & Safety','Welfare','Working Hours','Records','Accidents','Women','Contract','Mine'],
    secData: [12,8,8,3,3,2,13,10], ruleData: [22,20,6,5,2,2,8,84]
  };
  if (d.meta.code === 'ir') return {
    labels: ['Trade Unions','Standing Orders','Works Committee','Grievance','Strikes','Lay-off','Arbitration','Conciliation'],
    secData: [23,12,1,1,3,18,1,19], ruleData: [3,9,2,3,2,11,3,3]
  };
  return {
    labels: ['EPF/PF','ESI','Gratuity','Maternity','BOCW','Gig/Platform','Records','Compensation'],
    secData: [10,29,6,14,9,6,7,27], ruleData: [6,12,4,6,7,6,5,6]
  };
}

// ============================================================
// SECTIONS TABLE
// ============================================================
function buildSectionRelations(d) {
  const rel = {};
  d.sections.forEach(s => { rel[s.sec] = { rules: [], forms: [] }; });
  d.rules.forEach(r => {
    (r.codeRef || '').replace(/Sec\s+/gi, '').split(',').map(x => x.trim()).filter(Boolean).forEach(n => {
      if (rel[n] && !rel[n].rules.find(x => x.r === r.r)) rel[n].rules.push({r: r.r, t: r.t});
    });
  });
  d.forms.forEach(f => {
    (f.codeRef || '').replace(/Sec\s+/gi, '').split(',').map(x => x.trim()).filter(Boolean).forEach(n => {
      if (rel[n] && !rel[n].forms.find(x => x.n === f.n)) rel[n].forms.push({n: f.n, title: f.title});
    });
  });
  return rel;
}

function initSectionsTable(d) {
  const rel = buildSectionRelations(d);
  const chapters = [...new Set(d.sections.map(s => s.ch))].sort();
  const bar = document.getElementById('secFilterBar');
  if (!bar) return;

  let state = { filt: 'all', q: '', page: 1 };
  let filtData = [...d.sections];

  bar.innerHTML = `
    <div class="srch"><input type="text" id="secSearch" placeholder="Search sections..." oninput="secSearchFn(this.value)"></div>
    <button class="fbtn on" onclick="secFilt('all',this)">All</button>
    ${chapters.map(c => `<button class="fbtn" onclick="secFilt('${c}',this)">Ch.${c}</button>`).join('')}
  `;

  window.secSearchFn = function(q) {
    state.q = q.toLowerCase(); state.page = 1;
    filtData = d.sections
      .filter(s => state.filt === 'all' || s.ch === state.filt)
      .filter(s => !state.q || s.sec.includes(state.q) || s.title.toLowerCase().includes(state.q) || s.provision.toLowerCase().includes(state.q) || s.app.toLowerCase().includes(state.q));
    renderSecTable(filtData, rel, state);
  };

  window.secFilt = function(f, btn) {
    state.filt = f; state.page = 1;
    document.querySelectorAll('#secFilterBar .fbtn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    filtData = d.sections
      .filter(s => f === 'all' || s.ch === f)
      .filter(s => !state.q || s.sec.includes(state.q) || s.title.toLowerCase().includes(state.q) || s.provision.toLowerCase().includes(state.q));
    renderSecTable(filtData, rel, state);
  };

  window.secGoPage = function(n) { state.page = n; renderSecTable(filtData, rel, state); };
  sectionFiltData = filtData;
  renderSecTable(filtData, rel, state);
}

function renderSecTable(data, rel, state) {
  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  if (state.page > pages) state.page = pages;
  const start = (state.page - 1) * PER_PAGE;
  const slice = data.slice(start, start + PER_PAGE);
  const acc = currentData.meta.accent;

  const secCount = document.getElementById('secCount');
  if (secCount) secCount.textContent = `Showing ${start+1}–${Math.min(start+PER_PAGE,total)} of ${total}`;

  const tbody = document.getElementById('secTbody');
  if (!tbody) return;

  tbody.innerHTML = slice.map(s => {
    const r = rel[s.sec] || { rules: [], forms: [] };
    const rHtml = r.rules.length
      ? r.rules.map(x => `<span class="sec-pill rule-pill clickable" onclick="openDetailModal('rule','${x.r}')">R${x.r}</span>`).join('')
      : '<span class="empty-pill">—</span>';
    const fHtml = r.forms.length
      ? r.forms.map(x => `<span class="sec-pill form-pill clickable" onclick="openDetailModal('form','${x.n}')">F-${x.n}</span>`).join('')
      : '<span class="empty-pill">—</span>';
    return `<tr>
      <td class="tc-mono" style="color:${acc}">Sec ${s.sec}</td>
      <td class="tc-mono" style="color:#9B72E8">Ch.${s.ch}</td>
      <td style="font-size:11px;font-weight:700;max-width:200px;line-height:1.4">${s.title}</td>
      <td style="font-size:10px;color:var(--text3);max-width:280px;line-height:1.5">${s.provision.substring(0,200)}${s.provision.length>200?'…':''}</td>
      <td><span style="padding:2px 7px;border-radius:10px;font-size:9px;background:${acc}18;color:${acc};font-weight:700;white-space:nowrap">${s.app}</span></td>
      <td>${rHtml}</td>
      <td>${fHtml}</td>
    </tr>`;
  }).join('');

  const pageInfo = document.getElementById('secPageInfo');
  if (pageInfo) pageInfo.textContent = `Page ${state.page} of ${pages}`;

  let btns = '';
  if (state.page > 1) btns += `<button class="pb" onclick="secGoPage(${state.page-1})">← Prev</button>`;
  const sp = Math.max(1, state.page-2), ep = Math.min(pages, state.page+2);
  for (let i = sp; i <= ep; i++) btns += `<button class="pb ${i===state.page?'on':''}" onclick="secGoPage(${i})">${i}</button>`;
  if (state.page < pages) btns += `<button class="pb" onclick="secGoPage(${state.page+1})">Next →</button>`;
  const secPageBtns = document.getElementById('secPageBtns');
  if (secPageBtns) secPageBtns.innerHTML = btns;
  sectionFiltData = data;
}

// ============================================================
// RULES TABLE
// ============================================================
function initRulesTable(d) {
  const cats = [...new Set(d.rules.map(r => r.c))].sort();
  const bar = document.getElementById('rulesToolbar');
  if (!bar) return;

  let state = { filt: 'all', q: '', page: 1 };
  rulesFiltData = [...d.rules];

  bar.innerHTML = `
    <div class="srch"><input type="text" id="rulesSearch" placeholder="Search rules..." oninput="rulesSearchFn(this.value)"></div>
    <button class="fbtn on" onclick="rulesFilt('all',this)">All</button>
    ${cats.map(c => `<button class="fbtn" onclick="rulesFilt('${c}',this)">${c}</button>`).join('')}
  `;

  window.rulesSearchFn = function(q) {
    state.q = q.toLowerCase(); state.page = 1;
    rulesFiltData = d.rules
      .filter(r => state.filt === 'all' || r.c === state.filt)
      .filter(r => !state.q || r.r.toString().includes(state.q) || r.t.toLowerCase().includes(state.q) || r.c.toLowerCase().includes(state.q));
    renderRulesTable(rulesFiltData, state);
  };

  window.rulesFilt = function(f, btn) {
    state.filt = f; state.page = 1;
    document.querySelectorAll('#rulesToolbar .fbtn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    rulesFiltData = d.rules
      .filter(r => f === 'all' || r.c === f)
      .filter(r => !state.q || r.r.toString().includes(state.q) || r.t.toLowerCase().includes(state.q));
    renderRulesTable(rulesFiltData, state);
  };

  window.rulesGoPage = function(n) { state.page = n; renderRulesTable(rulesFiltData, state); };
  renderRulesTable(rulesFiltData, state);
}

function renderRulesTable(data, state) {
  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  if (state.page > pages) state.page = pages;
  const start = (state.page - 1) * PER_PAGE;
  const slice = data.slice(start, start + PER_PAGE);
  const acc = currentData.meta.accent;

  const rulesCount = document.getElementById('rulesCount');
  if (rulesCount) rulesCount.textContent = `Showing ${start+1}–${Math.min(start+PER_PAGE,total)} of ${total}`;

  const tbody = document.getElementById('rulesTbody');
  if (!tbody) return;

  tbody.innerHTML = slice.map(r => `
    <tr style="cursor:pointer" onclick="openDetailModal('rule','${r.r}')">
      <td class="tc-mono" style="color:${acc}">Rule ${r.r}</td>
      <td class="tc-mono" style="color:#9B72E8">Ch.${r.ch}</td>
      <td style="font-size:11px;max-width:260px;line-height:1.5">${r.t}</td>
      <td><span class="tpill ${getCatPill(r.c)}">${r.c}</span></td>
      <td style="font-size:10px;color:var(--text3)">${r.thresh}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:9px;color:${acc}">${r.codeRef || '—'}</td>
    </tr>`).join('');

  const pageInfo = document.getElementById('rulesPageInfo');
  if (pageInfo) pageInfo.textContent = `Page ${state.page} of ${pages}`;

  let btns = '';
  if (state.page > 1) btns += `<button class="pb" onclick="rulesGoPage(${state.page-1})">← Prev</button>`;
  const sp = Math.max(1, state.page-2), ep = Math.min(pages, state.page+2);
  for (let i = sp; i <= ep; i++) btns += `<button class="pb ${i===state.page?'on':''}" onclick="rulesGoPage(${i})">${i}</button>`;
  if (state.page < pages) btns += `<button class="pb" onclick="rulesGoPage(${state.page+1})">Next →</button>`;
  const pagesBtns = document.getElementById('rulesPageBtns');
  if (pagesBtns) pagesBtns.innerHTML = btns;
}

// ============================================================
// FORMS GRID
// ============================================================
function renderForms(d) {
  const cats = [...new Set(d.forms.map(f => f.cat))].sort();
  const bar = document.getElementById('formsToolbar');
  if (!bar) return;

  let state = { filt: 'all', q: '' };
  formsFiltData = [...d.forms];

  bar.innerHTML = `
    <div class="srch"><input type="text" id="formsSearch" placeholder="Search forms..." oninput="formsSearchFn(this.value)"></div>
    <button class="fbtn on" onclick="formsFilt('all',this)">All (${d.forms.length})</button>
    ${cats.map(c => `<button class="fbtn" onclick="formsFilt('${c}',this)">${c}</button>`).join('')}
  `;

  window.formsSearchFn = function(q) {
    state.q = q.toLowerCase();
    formsFiltData = d.forms
      .filter(f => state.filt === 'all' || f.cat === state.filt)
      .filter(f => !state.q || f.n.toLowerCase().includes(state.q) || f.title.toLowerCase().includes(state.q) || f.cat.toLowerCase().includes(state.q) || f.desc.toLowerCase().includes(state.q));
    renderFormsGrid(formsFiltData);
  };

  window.formsFilt = function(filt, btn) {
    state.filt = filt;
    document.querySelectorAll('#formsToolbar .fbtn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    formsFiltData = d.forms
      .filter(f => filt === 'all' || f.cat === filt)
      .filter(f => !state.q || f.n.toLowerCase().includes(state.q) || f.title.toLowerCase().includes(state.q) || f.cat.toLowerCase().includes(state.q));
    renderFormsGrid(formsFiltData);
  };

  renderFormsGrid(formsFiltData);
}

function renderFormsGrid(forms) {
  const grid = document.getElementById('formsGrid');
  if (!grid) return;
  if (!forms.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text3)">No forms match.</div>';
    return;
  }
  grid.innerHTML = forms.map(f => `
    <div class="fcard" onclick="openFormDetail('${f.n}')">
      <div class="fcard-top">
        <div class="fcard-badge" style="background:${f.bg};color:${f.cc};border:1.5px solid ${f.cc}44">
          <span class="fn-form">FORM</span>
          <span class="fn-num">${f.n}</span>
        </div>
        <div class="fcard-header">
          <div class="fcard-cat" style="background:${f.bg};color:${f.cc}">${f.cat}</div>
          <div class="fcard-title">${f.title}</div>
        </div>
      </div>
      <div class="fcard-body">
        <div class="fcard-ref">📌 <code>${f.ruleRef} · ${f.codeRef}</code></div>
        <div style="font-size:10px;color:var(--text3);line-height:1.5">${f.desc.substring(0,150)}...</div>
      </div>
      <div class="fcard-footer">
        <div class="fcard-who">👤 ${f.filedBy}</div>
        <div class="fcard-dl" style="color:${f.cc}">⏰ ${f.deadline}</div>
        ${f.driveLink ? `<a href="${f.driveLink}" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="font-size:9px;color:${f.cc};text-decoration:none;font-weight:700">↗ PDF</a>` : ''}
      </div>
    </div>`).join('');
}

function openFormDetail(formN) {
  const f = currentData.forms.find(x => x.n === formN);
  if (!f) return;
  document.documentElement.style.setProperty('--current-accent', f.cc || currentData.meta.accent);
  document.getElementById('detailContent').innerHTML = `
    <div class="detail-header">
      <h3>📄 FORM-${f.n} — ${f.title}</h3>
      <div class="detail-meta">
        <span class="tpill ${getCatPill(f.cat)}">${f.cat}</span>
        <span>📌 ${f.ruleRef} · ${f.codeRef}</span>
        <span>👤 ${f.who || f.filedBy}</span>
        <span>⏰ ${f.deadline}</span>
      </div>
    </div>
    <div class="detail-desc">${f.desc}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">📤 Filed By: ${f.filedBy}</div>
    ${f.driveLink ? `<a href="${f.driveLink}" target="_blank" rel="noopener" class="detail-drive-btn">↗ Open FORM-${f.n} on Google Drive</a>` : ''}
  `;
  openModal('detailOverlay');
}

// ============================================================
// EMPLOYER COMPLIANCE
// ============================================================
function renderEmployer(d) {
  const el = document.getElementById('employerContent');
  if (!el) return;
  el.innerHTML = d.employerSections.map(sec => `
    <div class="emp-sec-head">
      <div class="emp-sec-icon" style="background:${sec.color}">${sec.icon}</div>
      <div class="emp-sec-title">${sec.title}</div>
      <div class="emp-sec-cnt">${sec.items.length} Items</div>
    </div>
    <div class="employer-grid">
      ${sec.items.map(it => `
        <div class="ecard" style="border-left-color:${d.meta.accent}">
          <div class="ecard-rule">${it.rule} · ${it.codeRef}</div>
          <div class="ecard-title">${it.title}</div>
          <div class="ecard-desc">${it.desc}</div>
          <div class="ecard-thresh">👥 ${it.thresh}</div>
          ${it.forms && it.forms.length ? `<div class="ecard-forms">${it.forms.map(f => `<span class="fpill" onclick="openFormDetail('${f}')">FORM-${f}</span>`).join('')}</div>` : ''}
        </div>`).join('')}
    </div>`).join('');
}

// ============================================================
// TIMELINE
// ============================================================
function renderTimeline(d) {
  const el = document.getElementById('timelineContent');
  if (!el) return;
  el.innerHTML = d.timeline.map(e => `
    <div class="tl-row">
      <div class="tl-dot" style="background:${e.color};box-shadow:0 0 10px ${e.color}88;flex-shrink:0;margin-top:4px"></div>
      <div>
        <div class="tl-date" style="color:${e.color}">${e.date}</div>
        <div class="tl-title">${e.title}</div>
        <div class="tl-sub">${e.sub}</div>
      </div>
    </div>`).join('');
}

// ============================================================
// DETAIL MODAL
// ============================================================
function openDetailModal(type, id) {
  const d = currentData;
  let html = '';
  if (type === 'rule') {
    const r = d.rules.find(x => String(x.r) === String(id));
    if (!r) return;
    html = `
      <div class="detail-header">
        <h3>📋 Rule ${r.r} — ${r.t}</h3>
        <div class="detail-meta">
          <span>Chapter ${r.ch}</span>
          <span class="tpill ${getCatPill(r.c)}">${r.c}</span>
          <span>👥 ${r.thresh}</span>
          <span>📖 ${r.codeRef || '—'}</span>
        </div>
      </div>
      <div class="detail-desc">${r.t}</div>
      <div style="font-size:11px;color:var(--text3);margin-top:8px">📅 Notified: 8 May 2026 · ${d.meta.gsr}</div>
    `;
  } else if (type === 'form') {
    openFormDetail(id);
    return;
  }
  document.getElementById('detailContent').innerHTML = html;
  openModal('detailOverlay');
}

// ============================================================
// CALENDAR — FIXED
// Opens one URL directly then queues others with small delays
// Prevents browser popup blocking from freezing the page
// ============================================================
function openCal() {
  const d = currentData;
  if (!d || !d.calEvents) return;
  document.getElementById('calEvs').innerHTML = d.calEvents.map(e => `
    <div class="mev">
      <div style="flex:1;min-width:0">
        <div class="mev-t">${e.title}</div>
        <div class="mev-d">${e.date.replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2/$1')}</div>
      </div>
      <input type="checkbox" id="cal_${e.id}" checked>
    </div>`).join('');
  openModal('calOverlay');
}

function addCal() {
  const d = currentData;
  if (!d) return;

  // Close modal FIRST so UI doesn't freeze
  closeCal();

  const sel = d.calEvents.filter(e => {
    const el = document.getElementById('cal_' + e.id);
    return el && el.checked;
  });

  if (!sel.length) {
    alert('Please select at least one event.');
    return;
  }

  // Open first URL immediately
  const buildUrl = e =>
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(e.title)}` +
    `&dates=${e.date}/${e.date}` +
    `&details=${encodeURIComponent(e.desc)}`;

  // Open first one right away (user gesture context)
  window.open(buildUrl(sel[0]), '_blank', 'noopener');

  // Queue remaining with staggered delays to avoid popup blocking
  sel.slice(1).forEach((e, i) => {
    setTimeout(() => {
      window.open(buildUrl(e), '_blank', 'noopener');
    }, (i + 1) * 600);
  });
}

// ============================================================
// THEME TOGGLE
// ============================================================
function toggleTheme() {
  const h = document.documentElement;
  const isDark = h.getAttribute('data-theme') === 'dark';
  h.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '🌙 Dark' : '☀️ Light';
}

// ============================================================
// EXPORTS
// ============================================================
function exportAllCSV() {
  const d = currentData;
  const h = ['Section','Chapter','Title','Provision','Applicability'];
  const rows = d.sections.map(s => [
    'Sec ' + s.sec,
    'Ch.' + s.ch,
    '"' + s.title.replace(/"/g, '""') + '"',
    '"' + s.provision.substring(0,300).replace(/"/g, '""') + '"',
    s.app
  ]);
  downloadCSV([h, ...rows], `${d.meta.code}_sections.csv`);
}

function exportSectionsCSV() { exportAllCSV(); }

function exportRulesCSV() {
  const d = currentData;
  const h = ['Rule','Chapter','Title','Category','Threshold','Code Ref'];
  const rows = rulesFiltData.map(r => [
    'Rule ' + r.r,
    'Ch.' + r.ch,
    '"' + r.t.replace(/"/g, '""') + '"',
    r.c, r.thresh, r.codeRef || '—'
  ]);
  downloadCSV([h, ...rows], `${d.meta.code}_rules.csv`);
}

function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ============================================================
// KEYBOARD ACCESSIBILITY
// ============================================================
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeDetailModal();
    closeCal();
  }
});

// ============================================================
// INIT
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    CODE_DATA_MAP.wages = typeof DATA_WAGES !== 'undefined' ? DATA_WAGES : null;
    CODE_DATA_MAP.osh   = typeof DATA_OSH   !== 'undefined' ? DATA_OSH   : null;
    CODE_DATA_MAP.ir    = typeof DATA_IR    !== 'undefined' ? DATA_IR    : null;
    CODE_DATA_MAP.ss    = typeof DATA_SS    !== 'undefined' ? DATA_SS    : null;

    if (CODE_DATA_MAP.wages) {
      currentData = CODE_DATA_MAP.wages;
      renderDashboard();
    }
  }, 0);
});