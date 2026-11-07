/* core: who's visiting, number formatting, synthesised sound, tracking, small helpers. Everything else reads window.OW. */
(() => {
'use strict';
const S = window.OWLED, CLIENTS = window.OWLED_CLIENTS || {};
const store = {
  get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
};

/* ── the guest: ?name=Riya+Shah&c=acme  (or #name=Riya+Shah&c=acme, or just #Riya — the part after # survives host redirects) ── */
const qs = new URLSearchParams(location.search);
const hash = decodeURIComponent(location.hash.slice(1).replace(/\+/g, ' '));
if (hash && !qs.get('name')) {
  const hq = new URLSearchParams(location.hash.slice(1));
  if (hq.get('name')) { qs.set('name', hq.get('name')); if (hq.get('c')) qs.set('c', hq.get('c')); }
  else if (!hash.includes('=')) qs.set('name', hash.replace(/[-_]+/g, ' '));   // #Riya-Shah → "Riya Shah"
}
const nice = v => String(v || '').trim().replace(/\s+/g, ' ').slice(0, 32).replace(/(^|\s)(\p{Ll})/gu, (m, a, b) => a + b.toUpperCase());
const guest = {
  full: nice(qs.get('name')),
  clientId: (qs.get('c') || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40),
  get first() { return (this.full || '').split(' ')[0] || S.defaultName; },
  get client() { return CLIENTS[this.clientId] || null; },
};
const fill = s => String(s || '').replace(/\{name\}/g, guest.first);

/* ── numbers: 4200000 → 4.2M ── */
function fmt(v, kind = 'short') {
  if (kind === 'int') return Math.round(v).toLocaleString('en-IN');
  if (kind === 'dec') return v.toFixed(1);
  const a = Math.abs(v);
  if (a >= 1e9) return (v / 1e9).toFixed(a >= 1e10 ? 0 : 1).replace(/\.0$/, '') + 'B';
  if (a >= 1e6) return (v / 1e6).toFixed(a >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (a >= 1e3) return (v / 1e3).toFixed(a >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(Math.round(v));
}

/* ── sound: all synthesised, so there are no files to load. unlocked by the loader's tap ── */
const A = { on: store.get('ow:snd') !== '0', ac: null, master: null, buf: null };
function initAudio() {
  if (A.ac) { if (A.ac.state !== 'running') A.ac.resume().catch(() => {}); return; }
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}   // iPhone silent switch
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const master = ac.createGain(); master.gain.value = A.on ? .8 : 0; master.connect(ac.destination);
    const len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    Object.assign(A, { ac, master, buf });
  } catch (e) {}
}
function noise(dur, type, f0, f1, peak, q = 1, delay = 0) {
  if (!A.ac) return;
  const ac = A.ac, t = ac.currentTime + delay, s = ac.createBufferSource(); s.buffer = A.buf;
  const f = ac.createBiquadFilter(); f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const g = ac.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .008); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(f); f.connect(g); g.connect(A.master); s.start(t, Math.random()); s.stop(t + dur + .05);
}
function bell(f0 = 660, v = .5, delay = 0) {
  if (!A.ac) return;
  const ac = A.ac, t = ac.currentTime + delay;
  [[1, .4], [2.76, .16], [5.4, .07]].forEach(([r, g0]) => {
    const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f0 * r;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(g0 * v, t + .01); g.gain.exponentialRampToValueAtTime(.0005, t + 2.2 / Math.sqrt(r));
    o.connect(g); g.connect(A.master); o.start(t); o.stop(t + 2.6);
  });
}
// a pentatonic scale, so five diyas lit in any order always sound like a little tune
const NOTES = [523.25, 587.33, 659.25, 783.99, 880];
const sfx = {
  tap() { noise(.04, 'bandpass', 1800, 1200, .3, 3); },
  pick() { noise(.25, 'bandpass', 2600, 900, .5, 1.2); },
  whoosh() { noise(.35, 'bandpass', 600, 2400, .25, .8); },
  light(i = 0) { noise(.3, 'bandpass', 3200, 1200, .6); noise(.6, 'lowpass', 300, 1600, .35, .7, .03); bell(NOTES[i % 5], .45, .05); },
  boom() { noise(.9, 'lowpass', 400, 60, .9, .7); noise(1.2, 'highpass', 5000, 2500, .12, .7, .15); },
  crackle() { for (let i = 0; i < 6; i++) noise(.03, 'highpass', 3000 + Math.random() * 2000, 1500, .15 + Math.random() * .2, 1, .2 + i * .07 + Math.random() * .05); },
  win() { [0, 2, 4].forEach((n, k) => bell(NOTES[n] * 2, .35, k * .12)); },
  open() { noise(.3, 'bandpass', 1200, 500, .3, 2); bell(880, .25, .1); },
};
const play = (n, ...a) => { if (A.on && sfx[n]) sfx[n](...a); };
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
function setSound(on) {
  A.on = on; store.set('ow:snd', on ? '1' : '0');
  if (A.master) A.master.gain.setTargetAtTime(on ? .8 : 0, A.ac.currentTime, .05);
  const b = document.getElementById('snd'); if (b) { b.classList.toggle('off', !on); b.setAttribute('aria-label', on ? 'Sound on' : 'Sound off'); }
}

/* ── tracking: optional Google Form (site.js → track.form). no form = nothing leaves the page ── */
function track(event, detail = '') {
  const T = S.track; if (!T || !T.form) return;
  const body = new URLSearchParams(), data = { name: guest.full || S.defaultName, client: guest.clientId, event, detail: String(detail).slice(0, 140) };
  Object.entries(T.fields).forEach(([k, entry]) => body.append(entry, data[k] || ''));
  try { fetch(T.form, { method: 'POST', mode: 'no-cors', keepalive: true, body }); } catch (e) {}
}

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('on'));
  setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 400); }, 2600);
}

window.OW = {
  S, guest, fill, fmt, store, toast, track, buzz, play, initAudio, setSound, audio: A,
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  coarse: matchMedia('(pointer: coarse)').matches,
  clamp: (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)),
  lerp: (a, b, t) => a + (b - a) * t,
  rnd: (a, b) => a + Math.random() * (b - a),
};
})();
