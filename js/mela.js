/* the mela: numbers, "made for you", five stalls of work, the work viewer, the outro. */
(() => {
'use strict';
const { S, guest, fill, fmt, play, track, toast, reduced, clamp } = window.OW;
const $ = s => document.querySelector(s);
const WORK = window.OWLED_WORK || [];
const STALL = Object.fromEntries(S.stalls.map(s => [s.id, s]));

/* ── words ── */
function words() {
  $('#melaT').textContent = fill(S.copy.melaTitle); $('#melaS').textContent = S.copy.melaSub;
  $('#outroT').textContent = fill(S.copy.outroTitle); $('#outroL').textContent = S.copy.outroLede;
  $('#forYouT').textContent = fill(S.copy.forYouTitle);
  $('#footBrand').textContent = S.brand.name; $('#footTag').textContent = S.brand.tagline;
  const C = S.contact;
  $('#wishWa').href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(fill(C.wishText))}`;
  $('#mailBtn').href = `mailto:${C.email}?subject=${encodeURIComponent('Diwali hello from ' + guest.first)}`;
}
words(); window.addEventListener('ow:named', words);

/* ── numbers: count up when they scroll in ── */
const numGrid = $('#numGrid');
S.stats.forEach(st => {
  const d = document.createElement('div'); d.className = 'num reveal';
  const b = document.createElement('b'); b.textContent = '0'; const sp = document.createElement('span'); sp.textContent = st.label;
  d.append(b, sp); numGrid.appendChild(d); d._st = st; d._b = b;
});
function countUp(el, st) {
  const t0 = performance.now(), dur = reduced ? 1 : 1400;
  const tick = now => { const k = clamp((now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
    el.textContent = fmt(st.value * e, st.fmt) + (k >= 1 ? st.suffix : ''); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}

/* ── a work card (used by the rail and the booth grid) ── */
const ICON = {
  rangoli: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="24" cy="24" r="5"/><path d="M24 4c4 6 4 10 0 14-4-4-4-8 0-14zM24 44c-4-6-4-10 0-14 4 4 4 8 0 14zM4 24c6-4 10-4 14 0-4 4-8 4-14 0zM44 24c-6 4-10 4-14 0 4-4 8-4 14 0z"/></svg>',
  reel: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="24" cy="24" r="18"/><circle cx="24" cy="14" r="4"/><circle cx="24" cy="34" r="4"/><circle cx="14" cy="24" r="4"/><circle cx="34" cy="24" r="4"/></svg>',
  rocket: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M24 4c8 6 10 16 6 28H18C14 20 16 10 24 4z"/><path d="M18 32l-6 8h8M30 32l6 8h-8M24 32v10"/><circle cx="24" cy="18" r="3"/></svg>',
  chat: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M6 10h26v18H16l-8 7v-7H6z"/><path d="M36 18h6v16h-3v6l-7-6H20v-4"/></svg>',
  brush: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M40 6L22 26l-4-4L36 4z"/><path d="M18 22c-6 0-9 4-9 9 0 4-3 6-5 7 8 2 18 0 18-10z"/></svg>',
};
function cover(w) {
  const c = document.createElement('div'); c.className = 'cov';
  if (w.thumb) { const i = document.createElement('img'); i.src = w.thumb; i.alt = ''; i.loading = 'lazy'; i.decoding = 'async'; c.appendChild(i); }
  else {
    const g = document.createElement('div'); g.className = 'cover-gen'; g.style.setProperty('--c', (STALL[w.cat] || {}).color || '#7b5cff');
    const t = document.createElement('span'); t.className = 't'; t.textContent = w.title;
    const p = document.createElement('span'); p.className = 'play'; p.textContent = w.cat === 'design' ? '✦' : '▶';
    g.append(p, t); c.appendChild(g);
  }
  const pf = document.createElement('span'); pf.className = 'pf'; pf.textContent = w.platform; c.appendChild(pf);
  return c;
}
function card(w, list) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'wk';
  b.setAttribute('aria-label', `${w.title}, ${w.client}${w.views ? ', ' + fmt(w.views) + ' views' : ''}`);
  const m = document.createElement('div'); m.className = 'meta';
  const t = document.createElement('b'); t.textContent = w.title;
  const row = document.createElement('span'); const cl = document.createElement('span'); cl.textContent = [w.client, w.month].filter(Boolean).join(" · ");
  row.appendChild(cl);
  if (w.views) { const v = document.createElement('span'); v.className = 'v'; v.textContent = `👁 ${fmt(w.views)}`; row.appendChild(v); }
  m.append(t, row); b.append(cover(w), m);
  b.addEventListener('click', () => openModal(list, list.indexOf(w)));
  return b;
}

/* ── made for you: only when the link carries ?c= and that client has picks ── */
(() => {
  const c = guest.client; if (!c || !c.picks || !c.picks.length) return;
  const picks = c.picks.map(id => WORK.find(w => w.id === id)).filter(Boolean); if (!picks.length) return;
  const rail = $('#forYouRail'); picks.forEach(w => rail.appendChild(card(w, picks)));
  $('#forYou').hidden = false;
})();

/* ── stalls + booth ── */
const row = $('#stallRow'), grid = $('#grid'), booth = $('#booth');
let current = '';
S.stalls.forEach(s => {
  const n = WORK.filter(w => w.cat === s.id).length; if (!n) return;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'stall reveal'; b.dataset.id = s.id; b.setAttribute('role', 'tab');
  b.style.setProperty('--c', s.color);
  b.innerHTML = `<span class="aw"></span>${ICON[s.icon] || ICON.reel}<b></b><small></small>`;
  b.querySelector('b').textContent = s.name; b.querySelector('small').textContent = `${n} piece${n > 1 ? 's' : ''}`;
  b.addEventListener('click', () => { play('tap'); openStall(s.id, true); });
  row.appendChild(b);
});
function openStall(id, user) {
  if (id === current) return; current = id;
  const s = STALL[id], list = WORK.filter(w => w.cat === id);
  row.querySelectorAll('.stall').forEach(b => { const on = b.dataset.id === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  booth.style.setProperty('--c', s.color);
  $('#boothT').textContent = s.name; $('#boothS').textContent = s.sub;
  grid.replaceChildren(...list.map(w => card(w, list)));
  grid.classList.remove('swap'); void grid.offsetWidth; grid.classList.add('swap');
  if (user) { track('stall', id); booth.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}
if (S.stalls.length) openStall((S.stalls.find(s => WORK.some(w => w.cat === s.id)) || S.stalls[0]).id, false);

/* ── the work viewer ── */
const modal = $('#modal'); let mList = [], mI = 0, lastFocus = null;
function showWork() {
  const w = mList[mI], s = STALL[w.cat] || {};
  const cv = $('#mCover'); cv.replaceChildren(cover(w)); cv.firstChild.style.height = '100%';
  $('#mKick').textContent = s.name || '';
  $('#mTitle').textContent = w.title;
  $('#mMeta').textContent = [w.client, w.platform, w.month, w.views ? fmt(w.views) + ' views' : ''].filter(Boolean).join(' · ');
  $('#mBlurb').textContent = w.blurb || '';
  const a = $('#mWatch'); a.hidden = !w.link; if (w.link) a.href = w.link;
  const multi = mList.length > 1; $('#mPrev').hidden = !multi; $('#mNext').hidden = !multi;
}
function openModal(list, i) {
  mList = list; mI = i; lastFocus = document.activeElement; showWork();
  modal.hidden = false; document.body.style.overflow = 'hidden'; $('#mX').focus(); play('open'); track('work', list[i].id);
}
function closeModal() { modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
const stepM = d => { mI = (mI + d + mList.length) % mList.length; showWork(); play('tap'); };
$('#mX').addEventListener('click', closeModal);
$('#mPrev').addEventListener('click', () => stepM(-1));
$('#mNext').addEventListener('click', () => stepM(1));
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
window.addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape') closeModal(); else if (e.key === 'ArrowLeft') stepM(-1); else if (e.key === 'ArrowRight') stepM(1);
});
// swipe left / right on phones
let sx = null; modal.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
modal.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50 && mList.length > 1) stepM(dx < 0 ? 1 : -1); sx = null; });

/* ── footer ticker + outro ── */
const TICK = ['shubh deepavali', 'more views, more diyas', 'owled it', 'saal mubarak', 'see you in 2027', 'happy diwali from the whole nest'];
$('#tick').innerHTML = TICK.concat(TICK).map(t => `<span>${t}</span>`).join('');
$('#replay').addEventListener('click', () => { play('tap'); window.OWScene && window.OWScene.replay(); });

/* ── scroll-in reveals + number count-ups ── */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
  if (e.target._st) countUp(e.target._b, e.target._st);
}), { threshold: .25 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
