'use strict';
/* =========================================================
   NVSU Clinic: Medicine Request App
   Front end only. No database and no login.
   Everything lives in the arrays below and resets on refresh.
   The same screens are drawn for phone and PC; styles.css
   decides how they look (bottom menu vs side menu, cards vs table).
   ========================================================= */

// ---------- helpers ----------
const $  = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const now = () => new Date().toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

// ---------- icons ----------
const PATHS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/>',
  pill: '<path d="M10.5 20.5a5 5 0 0 1-7-7l9-9a5 5 0 0 1 7 7z"/><path d="M8.5 8.5l7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 12v6M9 15h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  building: '<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/><path d="M12 8v3M10.5 9.5h3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 8H4c0-1 2-2 2-8"/><path d="M10 21h4"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
  inbox: '<path d="M4 13l2-8h12l2 8"/><path d="M4 13v6h16v-6h-5a3 3 0 0 1-6 0z"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  download: '<path d="M12 4v11m-5-4 5 5 5-5M5 20h14"/>',
  printer: '<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'
};
const ic = (n, s = 20, sw = 1.8) =>
  `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[n]}</svg>`;

// ---------- data (in memory only) ----------
const CATS = ['Pain & Fever', 'Allergy', 'Stomach', 'First Aid'];
const CAT_EMOJI = { 'Pain & Fever': '🌡️', 'Allergy': '🤧', 'Stomach': '🍵', 'First Aid': '🩹' };
const PALETTE = ['#ff8fb4', '#ffb199', '#c9a7ff', '#8fd3c0', '#ffc46b', '#9ec5ff', '#ff9fc2', '#f59abf'];

const inventory = [
  { id: 'para', name: 'Paracetamol', cat: 'Pain & Fever', stock: 40, min: 10, color: '#ff8fb4', kind: 'bottle',
    desc: 'A gentle pain reliever that also brings down fever. Take it after eating, with a glass of water.',
    uses: ['Headache and body pain', 'Fever', 'Toothache'] },
  { id: 'ibu', name: 'Ibuprofen', cat: 'Pain & Fever', stock: 25, min: 10, color: '#ffb199', kind: 'bottle',
    desc: 'Eases pain and swelling. It is best taken with food so it does not upset the stomach.',
    uses: ['Toothache and muscle pain', 'Swelling and inflammation', 'Fever'] },
  { id: 'mef', name: 'Mefenamic Acid', cat: 'Pain & Fever', stock: 18, min: 8, color: '#c9a7ff', kind: 'bottle',
    desc: 'Used for pain that comes and goes, such as menstrual cramps. Take it with food.',
    uses: ['Menstrual cramps', 'Headache', 'Joint and muscle pain'] },
  { id: 'cet', name: 'Cetirizine', cat: 'Allergy', stock: 6, min: 8, color: '#8fd3c0', kind: 'bottle',
    desc: 'Relieves allergy symptoms. It can make you sleepy, so be careful before riding or using machines.',
    uses: ['Sneezing and runny nose', 'Itchy skin and rashes', 'Watery eyes'] },
  { id: 'ant', name: 'Antacid', cat: 'Stomach', stock: 30, min: 10, color: '#ffc46b', kind: 'bottle',
    desc: 'Calms heartburn and a sour stomach. Chew the tablet well and wait a few minutes.',
    uses: ['Heartburn', 'Sour stomach', 'Mild stomach pain'] },
  { id: 'lop', name: 'Loperamide', cat: 'Stomach', stock: 0, min: 5, color: '#9ec5ff', kind: 'bottle',
    desc: 'Slows down loose bowel movement. Drink plenty of water and see the nurse if it lasts more than a day.',
    uses: ['Loose bowel movement', 'Stomach upset'] },
  { id: 'ors', name: 'Oral Rehydration Salts', cat: 'Stomach', stock: 12, min: 5, color: '#ff9fc2', kind: 'sachet',
    desc: 'Replaces the water and salts you lose with diarrhea or heat. Mix one sachet in a glass of clean water.',
    uses: ['Dehydration', 'Weakness from diarrhea', 'Heat exhaustion'] },
  { id: 'band', name: 'Band-aid / Plaster', cat: 'First Aid', stock: 60, min: 15, color: '#f59abf', kind: 'box',
    desc: 'Covers small cuts and scrapes. Clean the wound with water first, then cover it.',
    uses: ['Small cuts', 'Scrapes', 'Blisters'] }
];

const requests = [];
const activity = [];
let nextId = 1;

function addRequest(d) {
  const r = { id: nextId++, status: 'Pending', time: now(), reason: '', allergy: '', ...d };
  requests.push(r);
  return r;
}
function log(text) { activity.unshift({ time: now(), text }); }

addRequest({ name: 'Maria Santos',   sid: '2023-0101', section: 'BSIT 3A', medicine: 'Paracetamol', qty: 2, symptoms: 'Headache since morning', urgency: 'Normal' });
addRequest({ name: 'Juan Dela Cruz', sid: '2023-0214', section: 'BSIT 2B', medicine: 'Cetirizine',  qty: 1, symptoms: 'Itchy skin and sneezing', urgency: 'Normal', status: 'Approved' });
addRequest({ name: 'Ana Reyes',      sid: '2023-0307', section: 'BSED 1A', medicine: 'Antacid',     qty: 1, symptoms: 'Stomach pain after lunch', urgency: 'Urgent' });
addRequest({ name: 'Paolo Garcia',   sid: '2023-0422', section: 'BSIT 4A', medicine: 'Ibuprofen',   qty: 1, symptoms: 'Toothache', urgency: 'Normal', status: 'Dispensed' });
log('Clinic app started with sample data');

const byMed  = id => inventory.find(m => m.id === id);
const byName = n => inventory.find(m => m.name === n);
const stockState = m => (m.stock <= 0 ? 'Out' : m.stock <= m.min ? 'Low' : 'OK');
const stockLine = m => (m.stock <= 0 ? 'Out of stock' : m.stock <= m.min ? `Only ${m.stock} left` : `${m.stock} in stock`);

// ---------- medicine drawings ----------
function labelLines(name) {
  const w = name.replace(/\s*\/.*$/, '').split(' ');
  return w.length > 1 ? [w[0], w.slice(1).join(' ')] : [w[0]];
}
function art(m, w = 100) {
  const c = m.color, h = Math.round(w * 1.3);
  const F = 'font-family="Poppins,sans-serif"';
  let body;
  if (m.kind === 'sachet') {
    body = `<rect x="20" y="12" width="60" height="108" rx="7" fill="${c}"/><rect x="20" y="12" width="60" height="108" rx="7" fill="url(#shine)"/>
      <path d="M20 23h60M20 109h60" stroke="#fff" stroke-width="2" stroke-dasharray="3 3" opacity=".85"/>
      <circle cx="50" cy="55" r="16" fill="#fff"/><path d="M50 46v18M41 55h18" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <text x="50" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" ${F}>ORS</text>`;
  } else if (m.kind === 'box') {
    body = `<rect x="10" y="44" width="80" height="64" rx="10" fill="${c}"/><rect x="10" y="44" width="80" height="64" rx="10" fill="url(#shine)"/>
      <rect x="20" y="56" width="60" height="26" rx="7" fill="#fff"/>
      <rect x="30" y="63" width="40" height="12" rx="6" fill="#ffd6b8"/><rect x="45" y="63" width="10" height="12" fill="#fff3e8"/>
      <text x="50" y="98" text-anchor="middle" font-size="7.5" font-weight="700" fill="#fff" ${F}>PLASTER</text>`;
  } else {
    const L = labelLines(m.name);
    const fs = Math.max(...L.map(x => x.length)) > 9 ? 6.8 : 8.2;
    const ys = L.length === 2 ? [80, 91] : [85];
    body = `<rect x="30" y="4" width="40" height="18" rx="5" fill="#3a1c2b"/>
      <rect x="25" y="20" width="50" height="8" rx="3" fill="#fff" opacity=".92"/>
      <rect x="16" y="26" width="68" height="98" rx="18" fill="${c}"/><rect x="16" y="26" width="68" height="98" rx="18" fill="url(#shine)"/>
      <rect x="22" y="50" width="56" height="54" rx="8" fill="#fff"/>
      <path d="M50 56v9M45.5 60.5h9" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>
      ${L.map((t, i) => `<text x="50" y="${ys[i]}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#3a1c2b" ${F}>${esc(t)}</text>`).join('')}`;
  }
  return `<svg class="art" width="${w}" height="${h}" viewBox="0 0 100 130" aria-hidden="true">${body}</svg>`;
}

// ---------- app state ----------
const state = {
  mode: 'student', screen: 'home', params: {}, stack: [],
  draft: null, dqty: 1,
  me: { name: '', sid: '', section: '' },
  form: { name: '', sid: '', section: '', symptoms: '', allergy: '', urgency: 'Normal' },
  cat: 'All', search: '', fav: new Set(),
  qFilter: 'All', qSearch: '', lookup: ''
};

const firstName = () => (state.mode === 'nurse' ? 'Nurse' : state.me.name ? state.me.name.split(' ')[0] : 'Student');
const initial = () => (state.mode === 'nurse' ? '🩺' : (firstName()[0] || 'S').toUpperCase());
const pendingCount = () => requests.filter(r => r.status === 'Pending').length;
const statusText = {
  Pending: 'Waiting for the nurse', Approved: 'Approved: claim it at the clinic',
  Dispensed: 'Medicine given', Declined: 'Declined', Cancelled: 'Cancelled'
};

// ---------- toast + sheet ----------
function toast(msg, type = '') {
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => t.remove(), 3200);
}
function openSheet(html) { $('#sheet-body').innerHTML = html; $('#sheet').hidden = false; }
function closeSheet() { $('#sheet').hidden = true; $('#sheet-body').innerHTML = ''; }
$('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') closeSheet(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

// ---------- navigation ----------
function go(screen, params = {}, push = false) {
  if (push) state.stack.push({ screen: state.screen, params: state.params });
  else state.stack = [];
  state.screen = screen; state.params = params;
  render(true);
}
function back() {
  const p = state.stack.pop();
  if (p) { state.screen = p.screen; state.params = p.params; render(true); }
  else go(state.mode === 'nurse' ? 'queue' : 'home');
}

const rootOf = s => (s === 'detail' ? 'meds' : s);
function navItems() {
  return state.mode === 'student'
    ? [{ k: 'home', l: 'Home', i: 'home' }, { k: 'meds', l: 'Medicines', i: 'pill' },
       { k: 'request', l: 'Request', i: 'file', b: state.draft ? 1 : 0 },
       { k: 'history', l: 'History', i: 'clock' }, { k: 'clinic', l: 'Clinic', i: 'building' }]
    : [{ k: 'queue', l: 'Queue', i: 'inbox', b: pendingCount() }, { k: 'stock', l: 'Stock', i: 'box' },
       { k: 'activity', l: 'Activity', i: 'activity' }, { k: 'clinic', l: 'Clinic', i: 'building' }];
}

function renderNav() {
  const cur = rootOf(state.screen);
  const items = navItems();
  $('#nav').innerHTML = items.map(n => `
    <button class="nav-btn ${cur === n.k ? 'on' : ''}" data-a="go" data-v="${n.k}">
      ${ic(n.i, 22)}<span>${n.l}</span>${n.b ? `<i class="nav-badge">${n.b}</i>` : ''}
    </button>`).join('');

  $('#sidebar').innerHTML = `
    <div class="side-logo">
      <svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#ff6f9f" stroke-width="5"/>
        <path d="M32 18v28M18 32h28" stroke="#3a1c2b" stroke-width="9" stroke-linecap="round"/>
        <path d="M32 24v16M24 32h16" stroke="#ff6f9f" stroke-width="4.5" stroke-linecap="round"/>
      </svg><span>NVSU Clinic</span>
    </div>
    <div class="side-label">${state.mode === 'student' ? 'STUDENT MENU' : 'NURSE MENU'}</div>
    <nav class="side-nav">${items.map(n => `
      <button class="side-btn ${cur === n.k ? 'on' : ''}" data-a="go" data-v="${n.k}">
        ${ic(n.i, 20)}<span>${n.l === 'Request' ? 'Request Medicine' : n.l === 'History' ? 'My Requests' : n.l}</span>${n.b ? `<i class="nav-badge">${n.b}</i>` : ''}
      </button>`).join('')}</nav>
    <div class="side-foot">
      <div class="seg" role="group" aria-label="Switch view">
        <button class="${state.mode === 'student' ? 'on' : ''}" data-a="mode" data-v="student">🎓 Student</button>
        <button class="${state.mode === 'nurse' ? 'on' : ''}" data-a="mode" data-v="nurse">🩺 Nurse</button>
      </div>
    </div>`;
}

function deskTitle() {
  const s = state.screen;
  if (s === 'home') return [`Hello, ${esc(firstName())} 👋`, 'What do you need from the clinic today?'];
  if (s === 'meds') return ['Medicines', 'Browse what the clinic has in stock'];
  if (s === 'detail') { const m = byMed(state.params.id); return [esc(m ? m.name : 'Medicine'), esc(m ? m.cat : '')]; }
  if (s === 'request') return ['Request Medicine', 'Fill in the details and send it to the nurse'];
  if (s === 'history') return ['My Requests', 'Follow the status of your requests'];
  if (s === 'clinic') return ['Clinic Info', 'Hours, rules and what is on the shelf'];
  if (s === 'queue') return ['Nurse Dashboard', `${pendingCount()} request${pendingCount() === 1 ? '' : 's'} waiting for review`];
  if (s === 'stock') return ['Medicine Stock', 'Keep the shelves filled'];
  return ['Activity Log', 'Everything that happened'];
}
function renderDeskbar() {
  const [t, sub] = deskTitle();
  $('#deskbar').innerHTML = `
    <div><h1>${t}</h1><p>${sub}</p></div>
    <div class="deskbar-r">
      <button class="round" data-a="bell" aria-label="Notifications">${ic('bell', 18)}${notifications().length ? '<i class="dot"></i>' : ''}</button>
      <div class="who"><div class="avatar">${esc(initial())}</div>${esc(firstName())}</div>
    </div>`;
}

// ---------- shared pieces ----------
const topbar = (title, withBack) =>
  `<div class="topbar${withBack ? '' : ' noback'}">${withBack
    ? `<button class="back" data-a="back" aria-label="Back">${ic('back')}</button>` : '<span class="ph"></span>'}
    <h3>${esc(title)}</h3><span class="ph"></span></div>`;

function heroTop(modeLabel, modeTarget) {
  return `<div class="hero-top">
    <div class="avatar">${esc(initial())}</div>
    <div class="hello"><small>Hello,</small><b>${esc(firstName())}</b></div>
    <button class="mode-btn" data-a="mode" data-v="${modeTarget}">${ic('swap', 14)} ${modeLabel}</button>
    <button class="round" data-a="bell" aria-label="Notifications">${ic('bell', 18)}${notifications().length ? '<i class="dot"></i>' : ''}</button>
  </div>`;
}

function pcard(m) {
  const s = stockState(m);
  return `<div class="pcard" data-a="med" data-v="${m.id}" tabindex="0" role="button" aria-label="${esc(m.name)}">
    ${s === 'Low' ? '<span class="badge">Low stock</span>' : s === 'Out' ? '<span class="badge out">Out of stock</span>' : ''}
    <button class="heart ${state.fav.has(m.id) ? 'on' : ''}" data-a="fav" data-v="${m.id}" aria-label="Favourite">${ic('heart', 16)}</button>
    <div class="pimg">${art(m, 84)}</div>
    <h4>${esc(m.name)}</h4>
    <div class="pfoot">
      <span class="price ${s === 'Low' ? 'low' : s === 'Out' ? 'out' : ''}">${s === 'Out' ? 'Unavailable' : m.stock + ' left'}</span>
      <button class="plus" data-a="add" data-v="${m.id}" ${s === 'Out' ? 'disabled' : ''} aria-label="Add to request">${ic('plus', 16, 2.2)}</button>
    </div>
  </div>`;
}

function gridHtml() {
  const term = state.search.trim().toLowerCase();
  const list = inventory.filter(m => (state.cat === 'All' || m.cat === state.cat) && (!term || (m.name + ' ' + m.cat).toLowerCase().includes(term)));
  return list.length ? list.map(pcard).join('') : '<div class="empty"><span class="big">🔍</span>No medicine found.<br>Try another word.</div>';
}

// ---------- STUDENT screens ----------
function homeScreen() {
  const popular = inventory.filter(m => stockState(m) !== 'Out').slice(0, 6);
  return `<div class="page">
    <div class="hero">
      ${heroTop('Nurse view', 'nurse')}
      <div class="hero-body">
        <h2>Feeling unwell? Request your medicine in a few taps</h2>
        <p class="sub">The school nurse reviews every request.</p>
        <div class="hero-btns">
          <button class="btn dark" data-a="go" data-v="meds">Browse medicines</button>
          <button class="btn white" data-a="go" data-v="request">Start a request</button>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">${art(inventory[0], 120)}${art(inventory[3], 150)}${art(inventory[2], 120)}</div>
    </div>
    <div class="home-grid">
      <div>
        <div class="sec-head"><h3>Category</h3><button class="link" data-a="cat" data-v="All">View all</button></div>
        <div class="cat-grid">${CATS.map(c => `
          <button class="cat" data-a="cat" data-v="${esc(c)}">
            <span class="cat-ic">${CAT_EMOJI[c]}</span>
            <span><b>${esc(c)}</b><small>${inventory.filter(m => m.cat === c).length === 1 ? '1 medicine' : inventory.filter(m => m.cat === c).length + ' medicines'}</small></span>
          </button>`).join('')}</div>
        <div class="sec-head"><h3>Popular medicines</h3><button class="link" data-a="cat" data-v="All">See more</button></div>
        <div class="hscroll">${popular.map(pcard).join('')}</div>
      </div>
      <aside>
        <div class="sec-head"><h3>How it works</h3></div>
        <div class="card"><ol class="steps">
          <li><b>Pick</b> a medicine and send your request.</li>
          <li><b>The nurse reviews</b> it and approves or declines.</li>
          <li><b>Claim it</b> at the clinic when it says Approved.</li>
        </ol></div>
        <div class="card"><h4>Clinic hours</h4>
          <div class="minirow"><span>Mon to Fri</span><b>7:30 AM to 4:30 PM</b></div>
          <div class="minirow"><span>Lunch break</span><b>12:00 to 1:00 PM</b></div>
        </div>
        <div class="notice" style="margin:0 18px">Feeling very sick? Do not wait. Go to the clinic or tell a teacher right away.</div>
      </aside>
    </div>
  </div>`;
}

function medsScreen() {
  return `<div class="page">${topbar('Medicines', state.stack.length > 0)}
    <div class="search">${ic('search', 18)}<input id="s-search" type="search" placeholder="Search medicines" value="${esc(state.search)}" autocomplete="off"></div>
    <div class="chips">${['All', ...CATS].map(c => `<button class="chip ${state.cat === c ? 'on' : ''}" data-a="chip" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    <div class="pgrid" id="pgrid">${gridHtml()}</div>
  </div>`;
}

function detailScreen() {
  const m = byMed(state.params.id);
  if (!m) return homeScreen();
  const s = stockState(m);
  return `<div class="page"><div class="detail-wrap">
    <div class="dhero">
      <button class="back" data-a="back" aria-label="Back">${ic('back')}</button>
      <button class="heart ${state.fav.has(m.id) ? 'on' : ''}" data-a="fav" data-v="${m.id}" aria-label="Favourite">${ic('heart', 20)}</button>
      ${art(m, 170)}
    </div>
    <div class="dinfo">
      <div class="dtitle"><span class="tag Normal">${esc(m.cat)}</span><h2>${esc(m.name)}</h2></div>
      <div class="drow">
        <span class="tagline ${s === 'Low' ? 'low' : s === 'Out' ? 'out' : ''}">${stockLine(m)}</span>
        <div class="stepper">
          <button data-a="dq" data-v="-1" aria-label="Less">${ic('minus', 14, 2.4)}</button>
          <b id="dq">${state.dqty}</b>
          <button class="plusb" data-a="dq" data-v="1" aria-label="More">${ic('plus', 14, 2.4)}</button>
        </div>
      </div>
      <div class="dsec"><h4>Description</h4><p>${esc(m.desc)}</p>
        <ul class="uses">${m.uses.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div>
      <div class="notice">Take medicine only as the nurse says. Tell the nurse about any allergies.</div>
      <div class="dbar"><span class="tagline">Max 5 per request</span>
        <button class="btn pink" data-a="reqnow" data-v="${m.id}" ${s === 'Out' ? 'disabled' : ''}>${s === 'Out' ? 'Out of stock' : 'Request this'}</button></div>
    </div>
  </div></div>`;
}

function requestScreen() {
  const d = state.draft, m = d && byMed(d.id), f = state.form;
  if (!m) return `<div class="page">${topbar('Request Medicine', false)}
    <div class="empty"><span class="big">💊</span>No medicine picked yet.<br>Choose one to start your request.<br>
    <button class="btn pink" data-a="go" data-v="meds">Choose medicine</button></div></div>`;
  return `<div class="page">${topbar('Request Medicine', false)}
    <div class="req-wrap">
      <div class="req-main">
        <div class="block-title">Selected medicine <button class="link" data-a="go" data-v="meds">Change</button></div>
        <div class="pad"><div class="item">
          <div class="thumb">${art(m, 40)}</div>
          <div><b>${esc(m.name)}</b><small>${stockLine(m)}</small></div>
          <div class="stepper">
            <button data-a="rq" data-v="-1" aria-label="Less">${ic('minus', 14, 2.4)}</button>
            <b id="rq-n">${d.qty}</b>
            <button class="plusb" data-a="rq" data-v="1" aria-label="More">${ic('plus', 14, 2.4)}</button>
          </div></div></div>
        <div class="block-title">Your details</div>
        <div class="form">
          <div class="row2">
            <div class="field"><label for="f-name">Full name</label><input id="f-name" value="${esc(f.name)}" placeholder="Maria Santos" autocomplete="off"><span class="error" data-for="f-name"></span></div>
            <div class="field"><label for="f-sid">Student ID</label><input id="f-sid" value="${esc(f.sid)}" placeholder="2023-0101" autocomplete="off"><span class="error" data-for="f-sid"></span></div>
          </div>
          <div class="field"><label for="f-section">Section / Year</label><input id="f-section" value="${esc(f.section)}" placeholder="BSIT 3A" autocomplete="off"><span class="error" data-for="f-section"></span></div>
          <div class="field"><label for="f-symptoms">Symptoms</label><textarea id="f-symptoms" maxlength="200" placeholder="Tell the nurse how you feel">${esc(f.symptoms)}</textarea><span class="error" data-for="f-symptoms"></span></div>
          <div class="field"><label for="f-allergy">Allergies (optional)</label><input id="f-allergy" value="${esc(f.allergy)}" placeholder="e.g. Penicillin" autocomplete="off"></div>
          <div class="field"><label>Urgency</label><div class="pills">
            <button class="pill ${f.urgency === 'Normal' ? 'on' : ''}" data-a="urg" data-v="Normal">🌸 Normal</button>
            <button class="pill urgent ${f.urgency === 'Urgent' ? 'on' : ''}" data-a="urg" data-v="Urgent">🚨 Urgent</button></div></div>
        </div>
      </div>
      <div class="req-side">
        <div class="total">
          <div><span>Medicine</span><b>${esc(m.name)}</b></div>
          <div><span>Quantity</span><b id="rq-sum">${d.qty}</b></div>
          <div><span>Priority</span><b id="rq-urg">${f.urgency}</b></div>
        </div>
        <div class="cta"><button class="btn pink block" data-a="submit">Send Request</button></div>
        <div class="notice">You can cancel a pending request any time from My Requests.</div>
      </div>
    </div></div>`;
}

function myRequests() {
  const id = (state.lookup || state.me.sid).trim().toLowerCase();
  return id ? requests.filter(r => r.sid.toLowerCase() === id).sort((a, b) => b.id - a.id) : [];
}

function historyScreen() {
  const list = myRequests();
  const idVal = state.lookup || state.me.sid;
  let body;
  if (!idVal) body = `<div class="empty"><span class="big">🧾</span>Enter your Student ID to see your requests.<br>
    <button class="btn soft sm" data-a="sample">Try sample ID 2023-0101</button></div>`;
  else if (!list.length) body = `<div class="empty"><span class="big">📭</span>No requests found for <b>${esc(idVal)}</b>.<br>
    <button class="btn pink" data-a="go" data-v="meds">Make a request</button></div>`;
  else body = '<div class="ogrid">' + list.map(r => {
    const m = byName(r.medicine);
    return `<div class="ocard">
      <div class="orow"><div class="thumb">${m ? art(m, 40) : ''}</div>
        <div><b>${esc(r.medicine)} <span class="tag ${r.urgency}">${r.urgency}</span></b>
          <small>#${r.id} · x${r.qty} · ${esc(r.section)}</small><small>“${esc(r.symptoms)}”</small></div></div>
      ${r.status === 'Declined' && r.reason ? `<div class="note-red"><b>Nurse note:</b> ${esc(r.reason)}</div>` : ''}
      <div class="ofoot ${r.status}"><span>${statusText[r.status]}</span><time>${esc(r.time)}</time></div>
      ${r.status === 'Pending' || r.status === 'Approved' ? `<div class="oactions">
        ${r.status === 'Approved' ? `<button class="btn soft sm" data-a="slip" data-v="${r.id}">${ic('printer', 14)} Print slip</button>` : ''}
        ${r.status === 'Pending' ? `<button class="btn soft sm" data-a="cancel" data-v="${r.id}">Cancel request</button>` : ''}</div>` : ''}
    </div>`;
  }).join('') + '</div>';
  return `<div class="page">${topbar('My Requests', false)}
    <div class="find"><input id="h-id" placeholder="Your Student ID" value="${esc(idVal)}" autocomplete="off"><button class="btn pink" data-a="lookup">Search</button></div>
    ${body}</div>`;
}

function clinicScreen() {
  return `<div class="page">${topbar('Clinic Info', false)}
    <div class="two" style="padding-top:16px">
      <div class="card"><h4>Clinic hours and rules</h4><ul class="rules">
        <li>🕗 Monday to Friday, 7:30 AM to 4:30 PM</li>
        <li>🍽️ Closed 12:00 to 1:00 PM for lunch</li>
        <li>💊 Maximum of 5 pieces per request</li>
        <li>🪪 Bring your school ID when claiming</li>
        <li>⚠️ Tell the nurse about any allergies</li>
        <li>🏥 Serious cases are sent to the nearest hospital</li></ul></div>
      <div class="card"><h4>On the shelf today</h4>
        ${inventory.map(m => { const s = stockState(m); return `<div class="minirow"><span>${esc(m.name)}</span>
          <span class="status ${s === 'OK' ? 'Approved' : s === 'Low' ? 'Pending' : 'Declined'}">${s === 'OK' ? 'Available' : s === 'Low' ? 'Running low' : 'Out of stock'}</span></div>`; }).join('')}
      </div>
    </div></div>`;
}

// ---------- NURSE screens ----------
function queueRows() {
  const term = state.qSearch.trim().toLowerCase();
  return requests
    .filter(r => state.qFilter === 'All' || r.status === state.qFilter)
    .filter(r => !term || [r.name, r.sid, r.medicine, r.section].some(v => v.toLowerCase().includes(term)))
    .sort((a, b) => (b.urgency === 'Urgent') - (a.urgency === 'Urgent') || b.id - a.id);
}

function rowActions(r, small = true) {
  const c = small ? 'btn sm ' : 'btn ';
  return (r.status === 'Pending'
      ? `<button class="${c}pink" data-a="approve" data-v="${r.id}">Approve</button><button class="${c}danger" data-a="decline" data-v="${r.id}">Decline</button>` : '')
    + (r.status === 'Approved' ? `<button class="${c}dark" data-a="dispense" data-v="${r.id}">Dispense</button>` : '');
}

function queueList() {
  const rows = queueRows();
  if (!rows.length) return '<div class="empty"><span class="big">🎉</span>Nothing here. No requests match.</div>';
  const cards = rows.map(r => {
    const m = byName(r.medicine);
    return `<div class="qcard" data-a="view" data-v="${r.id}">
      <div class="head"><div class="initial">${esc(r.name[0])}</div><div><b>${esc(r.name)}</b><small>${esc(r.sid)} · ${esc(r.section)}</small></div>
        <span class="tag ${r.urgency}">${r.urgency}</span></div>
      <div class="body"><div class="thumb" style="width:46px;height:46px">${m ? art(m, 34) : ''}</div>
        <div><b>${esc(r.medicine)} x${r.qty}</b><small>“${esc(r.symptoms)}”</small></div></div>
      <div class="ofoot ${r.status}"><span>${r.status}</span><time>${esc(r.time)}</time></div>
      ${r.status === 'Pending' || r.status === 'Approved' ? `<div class="oactions">${rowActions(r)}</div>` : ''}
    </div>`;
  }).join('');
  const table = `<table class="tbl"><thead><tr><th>#</th><th>Student</th><th>Medicine</th><th>Qty</th><th>Priority</th><th>Status</th><th>Sent</th><th></th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${r.id}</td>
      <td><b>${esc(r.name)}</b><span class="sub">${esc(r.sid)} · ${esc(r.section)}</span></td>
      <td>${esc(r.medicine)}</td><td>${r.qty}</td><td><span class="tag ${r.urgency}">${r.urgency}</span></td>
      <td><span class="status ${r.status}">${r.status}</span></td><td>${esc(r.time)}</td>
      <td class="act"><button class="btn soft sm" data-a="view" data-v="${r.id}">View</button> ${rowActions(r)}</td></tr>`).join('')}
    </tbody></table>`;
  return `<div class="only-m">${cards}</div><div class="only-d">${table}</div>`;
}

function queueScreen() {
  const c = s => requests.filter(r => r.status === s).length;
  const p = pendingCount();
  return `<div class="page">
    <div class="hero nurse">
      ${heroTop('Student view', 'student')}
      <div class="hero-body"><h2>Today's requests</h2><p class="sub">${p} request${p === 1 ? '' : 's'} waiting for review</p></div>
      <div class="stats">
        <div class="stat"><b>${c('Pending')}</b><small>Pending</small></div>
        <div class="stat"><b>${c('Approved')}</b><small>Approved</small></div>
        <div class="stat"><b>${c('Dispensed')}</b><small>Dispensed</small></div>
        <div class="stat"><b>${c('Declined')}</b><small>Declined</small></div>
      </div>
    </div>
    <div class="top-actions">
      <div class="search">${ic('search', 18)}<input id="q-search" type="search" placeholder="Search name, ID or medicine" value="${esc(state.qSearch)}" autocomplete="off"></div>
      <button class="btn soft sm" data-a="export">${ic('download', 14)} CSV</button>
    </div>
    <div class="chips">${['All', 'Pending', 'Approved', 'Dispensed', 'Declined', 'Cancelled'].map(f => `<button class="chip ${state.qFilter === f ? 'on' : ''}" data-a="qchip" data-v="${f}">${f}</button>`).join('')}</div>
    <div id="qlist" style="padding-top:12px">${queueList()}</div>
  </div>`;
}

function stockScreen() {
  return `<div class="page">${topbar('Medicine Stock', false)}
    <div class="top-actions"><div style="flex:1" class="tagline">${inventory.filter(m => stockState(m) !== 'OK').length} item(s) need attention</div>
      <button class="btn pink sm" data-a="addmed">${ic('plus', 14, 2.4)} Add medicine</button></div>
    <div class="sgrid" style="padding-top:14px">${inventory.map(m => {
      const s = stockState(m), pct = Math.min(100, Math.round(m.stock / Math.max(m.min * 3, 1) * 100));
      return `<div class="srow"><div class="thumb" style="width:50px;height:50px">${art(m, 36)}</div>
        <div><b>${esc(m.name)}</b><div class="bar"><i class="${s === 'Low' ? 'low' : s === 'Out' ? 'out' : ''}" style="width:${pct}%"></i></div>
          <small class="${s === 'Low' ? 'low' : s === 'Out' ? 'out' : ''}">${s === 'Out' ? 'Out of stock' : s === 'Low' ? m.stock + ' left, running low' : m.stock + ' in stock'}</small></div>
        <button class="btn soft sm" data-a="restock" data-v="${m.id}">+10</button></div>`;
    }).join('')}</div></div>`;
}

function activityScreen() {
  return `<div class="page">${topbar('Activity Log', false)}
    <div class="card" style="margin-top:16px"><ul class="timeline">
      ${activity.slice(0, 60).map(a => `<li><time>${esc(a.time)}</time>${esc(a.text)}</li>`).join('')}
    </ul></div></div>`;
}

// ---------- render ----------
const SCREENS = { home: homeScreen, meds: medsScreen, detail: detailScreen, request: requestScreen, history: historyScreen,
  clinic: clinicScreen, queue: queueScreen, stock: stockScreen, activity: activityScreen };

function render(resetScroll = false) {
  const v = $('#view');
  const top = v.scrollTop;
  v.innerHTML = SCREENS[state.screen]();
  v.scrollTop = resetScroll ? 0 : top;
  renderNav();
  renderDeskbar();
}

// ---------- notifications ----------
function notifications() {
  const out = [];
  if (state.mode === 'nurse') {
    const p = pendingCount();
    if (p) out.push({ em: '📥', t: `${p} request${p === 1 ? ' is' : 's are'} waiting for review`, s: 'Open the queue' });
    inventory.forEach(m => { const s = stockState(m); if (s !== 'OK') out.push({ em: s === 'Out' ? '⛔' : '⚠️', t: `${m.name} is ${s === 'Out' ? 'out of stock' : 'running low (' + m.stock + ' left)'}`, s: 'Restock soon' }); });
  } else {
    myRequests().filter(r => r.status !== 'Pending').slice(0, 6).forEach(r =>
      out.push({ em: { Approved: '✅', Dispensed: '💊', Declined: '❌', Cancelled: '🚫' }[r.status], t: `Your request for ${r.medicine} is ${r.status.toLowerCase()}`, s: r.time }));
  }
  return out;
}

// ---------- actions ----------
const byId = id => requests.find(r => r.id === +id);

function setErr(id, msg) {
  const e = $(`.error[data-for="${id}"]`), i = $('#' + id);
  if (e) e.textContent = msg || '';
  if (i) i.classList.toggle('invalid', !!msg);
  return !msg;
}

function setDraft(id, qty) {
  const m = byMed(id);
  if (!m || m.stock <= 0) { toast('That medicine is out of stock.', 'bad'); return false; }
  state.draft = { id, qty: Math.min(qty, 5, m.stock) };
  return true;
}

function submit() {
  const d = state.draft, m = d && byMed(d.id), f = state.form;
  if (!m) { toast('Pick a medicine first.', 'warn'); return; }
  const name = f.name.trim(), sid = f.sid.trim(), section = f.section.trim(), sym = f.symptoms.trim();
  let ok = true;
  ok = setErr('f-name', name.length < 2 ? 'Please enter your full name.' : '') && ok;
  ok = setErr('f-sid', !sid ? 'Student ID is required.' : '') && ok;
  ok = setErr('f-section', !section ? 'Please add your section.' : '') && ok;
  ok = setErr('f-symptoms', sym.length < 5 ? 'Please describe your symptoms.' : '') && ok;
  if (!ok) { toast('Please fix the highlighted fields.', 'warn'); return; }
  if (m.stock < d.qty) { toast(`Not enough ${m.name} in stock.`, 'bad'); return; }
  if (requests.some(r => r.sid.toLowerCase() === sid.toLowerCase() && r.medicine === m.name && r.status === 'Pending')) {
    toast(`You already have a pending request for ${m.name}.`, 'warn'); return;
  }
  addRequest({ name, sid, section, medicine: m.name, qty: d.qty, symptoms: sym, allergy: f.allergy.trim(), urgency: f.urgency });
  log(`${name} requested ${d.qty} x ${m.name}${f.urgency === 'Urgent' ? ' (URGENT)' : ''}`);
  state.me = { name, sid, section };
  state.lookup = sid;
  state.draft = null; state.dqty = 1;
  state.form = { name, sid, section, symptoms: '', allergy: '', urgency: 'Normal' };
  toast('Request sent! The nurse will review it soon.', 'ok');
  go('history');
}

function approve(id) {
  const r = byId(id), m = r && byName(r.medicine);
  if (!r || r.status !== 'Pending') return;
  if (!m || m.stock < r.qty) { toast(`Not enough ${r.medicine} in stock.`, 'bad'); return; }
  r.status = 'Approved';
  log(`Approved request #${r.id}: ${r.qty} x ${r.medicine} for ${r.name}`);
  closeSheet(); render(); toast(`Approved request #${r.id}`, 'ok');
}
function dispense(id) {
  const r = byId(id), m = r && byName(r.medicine);
  if (!r || r.status !== 'Approved') return;
  if (!m || m.stock < r.qty) { toast(`Not enough ${r.medicine} in stock.`, 'bad'); return; }
  m.stock -= r.qty; r.status = 'Dispensed';
  log(`Dispensed ${r.qty} x ${r.medicine} to ${r.name} (stock now ${m.stock})`);
  closeSheet(); render();
  toast(`Dispensed. ${m.name} stock is now ${m.stock}.`, stockState(m) === 'OK' ? 'ok' : 'warn');
}
function askDecline(id) {
  const r = byId(id);
  if (!r) return;
  openSheet(`<h3>Decline request #${r.id}</h3><p class="muted">Tell ${esc(r.name)} why, so they know what to do next.</p>
    <div class="field"><label for="dec-reason">Reason</label><textarea id="dec-reason" placeholder="e.g. Please come to the clinic so I can check you first."></textarea></div>
    <div class="sheet-actions"><button class="btn soft" data-a="closesheet">Back</button><button class="btn danger" data-a="declineok" data-v="${r.id}">Decline request</button></div>`);
  $('#dec-reason').focus();
}
function showDetails(id) {
  const r = byId(id);
  if (!r) return;
  openSheet(`<h3>Request #${r.id}</h3>
    <p><span class="status ${r.status}">${r.status}</span> <span class="tag ${r.urgency}">${r.urgency}</span></p>
    <dl class="detail"><dt>Student</dt><dd>${esc(r.name)}</dd><dt>Student ID</dt><dd>${esc(r.sid)}</dd><dt>Section</dt><dd>${esc(r.section)}</dd>
      <dt>Medicine</dt><dd>${esc(r.medicine)} x${r.qty}</dd><dt>Symptoms</dt><dd>${esc(r.symptoms)}</dd>
      <dt>Allergies</dt><dd>${r.allergy ? esc(r.allergy) : 'None stated'}</dd><dt>Sent</dt><dd>${esc(r.time)}</dd>
      ${r.reason ? `<dt>Nurse note</dt><dd>${esc(r.reason)}</dd>` : ''}</dl>
    <div class="sheet-actions">
      ${r.status === 'Approved' || r.status === 'Dispensed' ? `<button class="btn soft" data-a="slip" data-v="${r.id}">${ic('printer', 14)} Print slip</button>` : ''}
      ${rowActions(r, false)}
    </div>`);
}
function openBell() {
  const n = notifications();
  openSheet(`<h3>Notifications</h3><p class="muted">${state.mode === 'nurse' ? 'Things that need your attention' : 'Updates on your requests'}</p>
    ${n.length ? n.map(x => `<div class="notif"><div class="em">${x.em}</div><div>${esc(x.t)}<small>${esc(x.s)}</small></div></div>`).join('')
      : '<div class="empty" style="padding:20px"><span class="big">🔔</span>Nothing new yet.</div>'}`);
}
function printSlip(id) {
  const r = byId(id);
  if (!r) return;
  $('#slip').innerHTML = `<h2>NVSU Clinic: Medicine Slip</h2><div class="slip-box"><table>
    <tr><th>Request #</th><td>${r.id}</td></tr><tr><th>Student</th><td>${esc(r.name)} (${esc(r.sid)})</td></tr>
    <tr><th>Section</th><td>${esc(r.section)}</td></tr><tr><th>Medicine</th><td>${esc(r.medicine)} x${r.qty}</td></tr>
    <tr><th>Status</th><td>${esc(r.status)}</td></tr><tr><th>Date</th><td>${esc(r.time)}</td></tr></table>
    <p style="margin-top:18px">Please show this slip and your school ID at the clinic.</p></div>`;
  window.print();
}
function exportCsv() {
  const cell = v => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [['ID', 'Name', 'Student ID', 'Section', 'Medicine', 'Qty', 'Urgency', 'Status', 'Symptoms', 'Time'].map(cell).join(',')]
    .concat(requests.map(r => [r.id, r.name, r.sid, r.section, r.medicine, r.qty, r.urgency, r.status, r.symptoms, r.time].map(cell).join(',')));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
  a.download = 'clinic-requests.csv'; a.click(); URL.revokeObjectURL(a.href);
  toast('Exported clinic-requests.csv', 'ok');
}
function openAddMed() {
  openSheet(`<h3>Add medicine</h3><p class="muted">It will show up for students right away.</p>
    <div class="field"><label for="m-name">Name</label><input id="m-name" placeholder="e.g. Vitamin C" autocomplete="off"></div>
    <div class="field"><label for="m-cat">Category</label><select id="m-cat">${CATS.map(c => `<option>${esc(c)}</option>`).join('')}</select></div>
    <div class="row2"><div class="field"><label for="m-stock">Starting stock</label><input id="m-stock" type="number" min="0" value="20"></div>
    <div class="field"><label for="m-min">Low-stock alert</label><input id="m-min" type="number" min="1" value="5"></div></div>
    <span class="error" id="m-err"></span>
    <div class="sheet-actions"><button class="btn soft" data-a="closesheet">Cancel</button><button class="btn pink" data-a="savemed">Add to stock</button></div>`);
  $('#m-name').focus();
}
function saveMed() {
  const name = $('#m-name').value.trim(), cat = $('#m-cat').value;
  const stock = parseInt($('#m-stock').value, 10), min = parseInt($('#m-min').value, 10), err = $('#m-err');
  if (name.length < 2) { err.textContent = 'Please enter a medicine name.'; return; }
  if (inventory.some(m => m.name.toLowerCase() === name.toLowerCase())) { err.textContent = 'That medicine is already in the list.'; return; }
  if (isNaN(stock) || stock < 0 || isNaN(min) || min < 1) { err.textContent = 'Stock and alert level must be valid numbers.'; return; }
  inventory.push({ id: 'm' + Date.now(), name, cat, stock, min, color: PALETTE[inventory.length % PALETTE.length], kind: 'bottle',
    desc: 'Added by the clinic nurse. Ask the nurse how to take it.', uses: ['Ask the nurse for guidance'] });
  log(`Added new medicine: ${name} (${stock} in stock)`);
  closeSheet(); render(); toast(`${name} added to stock`, 'ok');
}

// ---------- event wiring (one click handler for everything) ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-a]');
  if (!t) return;
  const a = t.dataset.a, v = t.dataset.v;
  switch (a) {
    case 'go': closeSheet(); go(v); break;
    case 'back': back(); break;
    case 'mode':
      state.mode = v; state.stack = []; state.screen = v === 'nurse' ? 'queue' : 'home'; closeSheet(); render(true); break;
    case 'cat': state.cat = v; state.search = ''; go('meds', {}, state.screen !== 'meds'); break;
    case 'chip': state.cat = v; render(); break;
    case 'med': state.dqty = 1; go('detail', { id: v }, true); break;
    case 'fav': state.fav.has(v) ? state.fav.delete(v) : state.fav.add(v); t.classList.toggle('on', state.fav.has(v)); break;
    case 'add':
      if (setDraft(v, 1)) { toast(`${byMed(v).name} added to your request`, 'ok'); renderNav(); }
      break;
    case 'dq': state.dqty = Math.max(1, Math.min(5, state.dqty + +v)); $('#dq').textContent = state.dqty; break;
    case 'reqnow': if (setDraft(v, state.dqty)) { state.stack = []; go('request'); } break;
    case 'rq': {
      const m = byMed(state.draft.id);
      state.draft.qty = Math.max(1, Math.min(5, m.stock, state.draft.qty + +v));
      $('#rq-n').textContent = state.draft.qty; $('#rq-sum').textContent = state.draft.qty; break;
    }
    case 'urg':
      state.form.urgency = v; $$('.pill').forEach(p => p.classList.toggle('on', p.dataset.v === v));
      $('#rq-urg').textContent = v; break;
    case 'submit': submit(); break;
    case 'lookup': state.lookup = $('#h-id').value.trim(); render(); break;
    case 'sample': state.lookup = '2023-0101'; render(); break;
    case 'cancel': {
      const r = byId(v);
      if (r && r.status === 'Pending') { r.status = 'Cancelled'; log(`${r.name} cancelled request #${r.id} (${r.medicine})`); render(); toast('Request cancelled.', 'warn'); }
      break;
    }
    case 'slip': printSlip(+v); break;
    case 'qchip': state.qFilter = v; render(); break;
    case 'view': showDetails(+v); break;
    case 'approve': approve(+v); break;
    case 'decline': askDecline(+v); break;
    case 'declineok': {
      const r = byId(v);
      r.status = 'Declined'; r.reason = $('#dec-reason').value.trim() || 'No reason given.';
      log(`Declined request #${r.id} from ${r.name}`); closeSheet(); render(); toast(`Declined request #${r.id}`, 'warn'); break;
    }
    case 'dispense': dispense(+v); break;
    case 'restock': { const m = byMed(v); m.stock += 10; log(`Restocked ${m.name} (+10, now ${m.stock})`); render(); toast(`${m.name} restocked to ${m.stock}`, 'ok'); break; }
    case 'addmed': openAddMed(); break;
    case 'savemed': saveMed(); break;
    case 'export': exportCsv(); break;
    case 'bell': openBell(); break;
    case 'closesheet': closeSheet(); break;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (e.target.matches('.pcard')) e.target.click();
    if (e.target.id === 'h-id') { state.lookup = e.target.value.trim(); render(); }
  }
});

// typing: update state without redrawing, so the cursor never jumps
const FORM_KEYS = { 'f-name': 'name', 'f-sid': 'sid', 'f-section': 'section', 'f-symptoms': 'symptoms', 'f-allergy': 'allergy' };
document.addEventListener('input', e => {
  const id = e.target.id;
  if (FORM_KEYS[id]) { state.form[FORM_KEYS[id]] = e.target.value; setErr(id, ''); }
  else if (id === 's-search') { state.search = e.target.value; $('#pgrid').innerHTML = gridHtml(); }
  else if (id === 'q-search') { state.qSearch = e.target.value; $('#qlist').innerHTML = queueList(); }
});

render(true);