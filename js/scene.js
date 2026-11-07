/* the scene: loader → the owl holds a lit diya → carry its flame to five diyas → each one shows a number → fireworks → the mela.
   phases: load → ask (one real tap) → play → reveal → done */
(() => {
'use strict';
const { S, guest, fill, fmt, play, buzz, initAudio, setSound, track, clamp, lerp, rnd, reduced, coarse, audio } = window.OW;
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));

const scene = $('#scene'), sky = $('#sky'), sctx = sky.getContext('2d'), fxc = $('#fxc'), fx = fxc.getContext('2d'), night = $('#night'), nctx = night.getContext('2d');
const carryEl = $('#carry'), srcEl = $('#src'), capEl = $('#cap'), autoBtn = $('#auto'), owl = $('#owl');
const ST = { ph: 'load', carrying: false, flying: false, lit: 0, idle: 0, dark: 1, t: 0 };
let W = 0, H = 0, dpr = 1, src = { x: 0, y: 0 }, flame = { x: 0, y: 0, on: false }, eye = { x: 0, y: 0 };

/* ── build: five diya slots from site.js stats ── */
const slots = S.stats.slice(0, 5).map((st, i) => {
  const slot = document.createElement('div'); slot.className = 'slot';
  slot.innerHTML = `<div class="stat"><b>0</b><span></span></div><i class="ring"></i>` +
    `<button class="diya" type="button" aria-label="light diya ${i + 1}: ${st.label}"><i class="bowl"></i><i class="fl"></i></button>`;
  slot.querySelector('.stat span').textContent = st.label;
  $('#diyas').appendChild(slot);
  const o = { el: slot, btn: slot.querySelector('.diya'), num: slot.querySelector('.stat b'), stat: st, lit: false, x: 0, y: 0, glow: 0 };
  o.btn.addEventListener('click', () => { if (ST.ph === 'play' && !o.lit && !ST.carrying) fly(o); });
  return o;
});

/* ── toran: marigolds + mango leaves along the top ── */
function buildToran() {
  const el = $('#toran'), n = Math.ceil(W / 46) + 1; let h = '<i class="str"></i>';
  for (let i = 0; i < n; i++) {
    const d = (-(i * .37) % 3).toFixed(2), sw = (2.4 + (i * .53) % 1.6).toFixed(2);
    h += `<i class="fl" style="left:${i * 46}px;--d:${d}s;--sw:${sw}s"></i><i class="lf" style="left:${i * 46 + 26}px;--d:${d}s;--sw:${(+sw + .6).toFixed(2)}s"></i>`;
  }
  el.innerHTML = h;
}

/* ── stars: diwali falls on amavasya, the new moon, so the sky is all stars and no moon ── */
const stars = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random() * .7, r: rnd(.4, 1.6), ph: rnd(0, 6.3), sp: rnd(.6, 2) }));

function measure() {
  const r = scene.getBoundingClientRect();
  W = r.width; H = r.height; dpr = Math.min(2, window.devicePixelRatio || 1);
  [sky, fxc].forEach(c => { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
  night.width = Math.round(W * dpr * .5); night.height = Math.round(H * dpr * .5);   // half-res: it's all soft gradients anyway
  const pt = el => { const b = el.getBoundingClientRect(); return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height * .15 }; };
  src = pt(srcEl);
  slots.forEach(s => Object.assign(s, pt(s.btn)));
  if (!flame.on) { flame.x = src.x; flame.y = src.y; }
  buildToran();
}

/* ── particles ── */
const parts = [], PMAX = coarse ? 320 : 600;
const spawn = o => { if (parts.length < PMAX) parts.push(o); };
function sparks(x, y, n = 40, hue = 40) {
  for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), sp = rnd(80, 420);
    spawn({ k: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, life: 0, max: rnd(.4, .9), hue: hue + rnd(-10, 15) }); }
}
const FW = [[45, 100], [330, 90], [175, 80], [265, 90], [20, 95]];   // marigold, rani pink, teal, violet, orange (hue, sat)
function rocket(delay = 0) {
  setTimeout(() => {
    const x = rnd(W * .15, W * .85), ty = rnd(H * .12, H * .42), c = FW[(Math.random() * FW.length) | 0];
    spawn({ k: 'rocket', x, y: H + 10, vx: rnd(-30, 30), vy: -rnd(H * 1.1, H * 1.5), ty, life: 0, max: 3, c });
    play('whoosh');
  }, delay);
}
function burst(x, y, [h, s]) {
  const n = reduced ? 30 : 90;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rnd(-.05, .05), sp = rnd(120, 340);
    spawn({ k: 'fw', x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rnd(1.1, 1.8), h: h + rnd(-12, 12), s }); }
  play('boom'); play('crackle'); buzz(20);
}
function stepParts(dt, now) {
  fx.setTransform(dpr, 0, 0, dpr, 0, 0); fx.clearRect(0, 0, W, H); fx.globalCompositeOperation = 'lighter';
  for (let i = parts.length - 1; i >= 0; i--) {
    const o = parts[i]; o.life += dt;
    if (o.k === 'rocket') {
      o.x += o.vx * dt; o.y += o.vy * dt; o.vy += 260 * dt;
      if (Math.random() < .8) spawn({ k: 'ember', x: o.x, y: o.y, vx: rnd(-20, 20), vy: rnd(20, 60), life: 0, max: rnd(.3, .6), r: rnd(.8, 1.8), ph: 0 });
      if (o.y <= o.ty || o.vy >= 0) { burst(o.x, o.y, o.c); parts.splice(i, 1); }
      continue;
    }
    if (o.life > o.max) { parts.splice(i, 1); continue; }
    const t = o.life / o.max;
    if (o.k === 'spark') {
      o.vy += 700 * dt; o.vx *= .98; const x0 = o.x, y0 = o.y; o.x += o.vx * dt; o.y += o.vy * dt;
      fx.strokeStyle = `hsla(${o.hue},100%,${65 + 25 * (1 - t)}%,${1 - t})`; fx.lineWidth = 1.6;
      fx.beginPath(); fx.moveTo(x0, y0); fx.lineTo(o.x, o.y); fx.stroke();
    } else if (o.k === 'fw') {
      const k = Math.exp(-1.8 * dt); o.vx *= k; o.vy = o.vy * k + 90 * dt;
      o.px = o.x; o.py = o.y; o.x += o.vx * dt; o.y += o.vy * dt;
      const tw = t > .6 ? (Math.sin(now * 30 + i) > 0 ? 1 : .3) : 1;     // the tail end crackles
      fx.strokeStyle = `hsla(${o.h},${o.s}%,${60 + 30 * (1 - t)}%,${(1 - t) * tw})`; fx.lineWidth = 2;
      fx.beginPath(); fx.moveTo(o.px, o.py); fx.lineTo(o.x, o.y); fx.stroke();
    } else {   // ember: rises and flickers
      o.vx += Math.sin(now * 3 + o.ph) * 20 * dt; o.vy -= 10 * dt; o.x += o.vx * dt; o.y += o.vy * dt;
      fx.fillStyle = `rgba(255,${150 + 80 * (1 - t) | 0},70,${(1 - t) * (.6 + .4 * Math.sin(now * 20 + o.ph))})`;
      fx.beginPath(); fx.arc(o.x, o.y, o.r * (1 - t * .5), 0, 7); fx.fill();
    }
  }
  fx.globalCompositeOperation = 'source-over';
}

/* ── night: a dark veil with soft holes wherever there's a flame ── */
function drawNight(now) {
  const nw = night.width, nh = night.height, k = nw / W;
  nctx.setTransform(1, 0, 0, 1, 0, 0); nctx.globalCompositeOperation = 'source-over'; nctx.clearRect(0, 0, nw, nh);
  nctx.fillStyle = `rgba(6,2,16,${(.9 * ST.dark).toFixed(3)})`; nctx.fillRect(0, 0, nw, nh);
  nctx.globalCompositeOperation = 'destination-out';
  const flick = .9 + .06 * Math.sin(now * 23) + .05 * Math.sin(now * 37 + 1.3);
  const m = Math.min(W, H), lights = [{ x: src.x, y: src.y - 40, r: m * .34 * flick, a: .95 }];
  if (flame.on) lights.push({ x: flame.x, y: flame.y, r: m * .3 * flick, a: .95 });
  slots.forEach(s => { if (s.glow > .01) lights.push({ x: s.x, y: s.y - 20, r: m * (.18 + .14 * s.glow) * flick, a: .9 * s.glow }); });
  for (const L of lights) {
    const g = nctx.createRadialGradient(L.x * k, L.y * k, 0, L.x * k, L.y * k, L.r * k);
    g.addColorStop(0, `rgba(0,0,0,${L.a})`); g.addColorStop(.5, `rgba(0,0,0,${L.a * .6})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    nctx.fillStyle = g; nctx.beginPath(); nctx.arc(L.x * k, L.y * k, L.r * k, 0, 7); nctx.fill();
  }
}

function drawSky(now) {
  sctx.setTransform(dpr, 0, 0, dpr, 0, 0); sctx.clearRect(0, 0, W, H);
  for (const s of stars) { sctx.fillStyle = `rgba(255,243,220,${(.35 + .45 * Math.sin(now * s.sp + s.ph) ** 2).toFixed(2)})`; sctx.beginPath(); sctx.arc(s.x * W, s.y * H, s.r, 0, 7); sctx.fill(); }
}

/* ── the owl: eyes follow the flame (or your finger), blinks now and then ── */
const pupils = [['#pL', '#gL', 68, 84], ['#pR', '#gR', 132, 84]].map(([p, g, cx, cy]) => ({ p: $(p), g: $(g), cx, cy }));
function owlLook() {
  const r = owl.getBoundingClientRect(), sr = scene.getBoundingClientRect(), sx = r.width / 200;
  pupils.forEach(e => {
    const ex = r.left - sr.left + e.cx * sx, ey = r.top - sr.top + e.cy * sx;
    const dx = eye.x - ex, dy = eye.y - ey, d = Math.hypot(dx, dy) || 1, m = Math.min(9, d / 30);
    const px = e.cx + dx / d * m, py = e.cy + dy / d * m;
    e.p.setAttribute('cx', px.toFixed(1)); e.p.setAttribute('cy', py.toFixed(1));
    e.g.setAttribute('cx', (px - 5).toFixed(1)); e.g.setAttribute('cy', (py - 5).toFixed(1));
  });
}
(function blink() { setTimeout(() => { if (!owl.classList.contains('happy')) { owl.classList.add('blink'); setTimeout(() => owl.classList.remove('blink'), 140); } blink(); }, rnd(2600, 5200)); })();

/* ── captions ── */
let lastCap = '';
function say(text) {
  if (text === lastCap) return; lastCap = text; capEl.classList.add('swap');
  setTimeout(() => { capEl.textContent = text; capEl.classList.remove('swap'); }, 220);
}
function progressCap() {
  if (ST.lit === 0) say(coarse ? S.copy.sceneHintTouch : S.copy.sceneHint);
  else if (ST.lit < 5) say(`${ST.lit} of 5 lit · ${['keep going', 'nice', 'more light', 'one more!'][ST.lit - 1]}`);
}

/* ── lighting a diya ── */
function countUp(el, st) {
  const t0 = performance.now(), dur = reduced ? 1 : 1100;
  const tick = now => { const k = clamp((now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(st.value * e, st.fmt) + (k >= 1 ? st.suffix : ''); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function light(s) {
  if (s.lit) return; s.lit = true; ST.lit++; ST.idle = 0;
  s.el.classList.add('lit'); countUp(s.num, s.stat);
  sparks(s.x, s.y - 10, reduced ? 10 : 46); play('light', ST.lit - 1); buzz(25);
  progressCap();
  if (ST.lit === slots.length) setTimeout(reveal, 750);
}
// tap a diya (or "light them for me"): the flame flies over from the owl's lamp on its own
function fly(s) {
  if (ST.flying || s.lit) return Promise.resolve();
  ST.flying = true; flame.on = true; carryEl.classList.add('on'); srcEl.classList.add('empty'); play('pick');
  const from = { x: src.x, y: src.y }, t0 = performance.now(), dur = reduced ? 1 : 560;
  return new Promise(res => {
    const step = now => {
      const k = clamp((now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      flame.x = lerp(from.x, s.x, e); flame.y = lerp(from.y, s.y, e) - Math.sin(e * Math.PI) * 70;
      if (k < 1) return requestAnimationFrame(step);
      light(s); ST.flying = false; dropFlame(); res();
    };
    requestAnimationFrame(step);
  });
}
function dropFlame() { flame.on = false; carryEl.classList.remove('on'); srcEl.classList.remove('empty'); flame.x = src.x; flame.y = src.y; }

/* ── dragging the flame ── */
const local = e => { const r = scene.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
scene.addEventListener('pointerdown', e => {
  if (ST.ph !== 'play' || ST.flying) return;
  const p = local(e);
  if (e.target.closest('.diya:not(.src)')) return;                                   // that's a tap on a diya: click handles it
  if (Math.hypot(p.x - src.x, p.y - src.y) > (coarse ? 90 : 70) && !e.target.closest('.src')) return;
  e.preventDefault(); initAudio(); ST.carrying = true; ST.idle = 0;
  try { scene.setPointerCapture(e.pointerId); } catch (err) {}
  flame.on = true; carryEl.classList.add('on'); srcEl.classList.add('empty'); play('pick'); buzz(10);
  moveFlame(e);
});
function moveFlame(e) {
  const p = local(e), off = e.pointerType === 'touch' ? 48 : 10;                    // keep the flame above the finger, where you can see it
  flame.x = p.x; flame.y = p.y - off;
  slots.forEach(s => { if (!s.lit && Math.hypot(flame.x - s.x, flame.y - s.y) < 46) light(s); });
}
scene.addEventListener('pointermove', e => {
  const p = local(e); eye.x = p.x; eye.y = p.y;
  if (ST.carrying) moveFlame(e);
});
const endCarry = () => { if (!ST.carrying) return; ST.carrying = false; dropFlame(); };
scene.addEventListener('pointerup', endCarry);
scene.addEventListener('pointercancel', endCarry);

async function auto() {
  autoBtn.hidden = true; initAudio();
  for (const s of slots) { if (ST.ph !== 'play') return; if (!s.lit) { await fly(s); await sleep(reduced ? 0 : 220); } }
}
autoBtn.textContent = S.copy.sceneAuto;
autoBtn.addEventListener('click', auto);
window.addEventListener('keydown', e => {
  if (ST.ph === 'play' && (e.key === 'Enter' || e.key === ' ') && !(e.target.closest && e.target.closest('button, a, input'))) { e.preventDefault(); auto(); }
});

/* ── the reveal ── */
function fillGreeting() {
  $('#gKick').textContent = S.copy.heroKick;
  $('#gTitle').textContent = fill(S.copy.heroTitle);
  $('#gLede').textContent = S.copy.heroLede;
  const c = guest.client; if (c && c.note) { $('#gNote').textContent = c.note; $('#gNote').hidden = false; }
}
function reveal() {
  if (ST.ph !== 'play') return;
  ST.ph = 'reveal'; autoBtn.hidden = true; say(fill(S.copy.sceneDone));
  owl.classList.add('happy'); play('win');
  const n = reduced ? 2 : 6; for (let i = 0; i < n; i++) rocket(i * 380);
  setTimeout(() => {
    document.body.classList.add('revealed');
    setTimeout(() => { document.body.classList.remove('locked'); ST.ph = 'done'; window.dispatchEvent(new Event('ow:revealed')); }, 1200);
  }, 500);
  track('reveal');
}
$('#toMela').addEventListener('click', () => { play('tap'); $('#mela').scrollIntoView({ behavior: 'smooth' }); });

window.OWScene = {
  replay() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      document.body.classList.add('locked'); document.body.classList.remove('revealed'); owl.classList.remove('happy');
      slots.forEach(s => { s.lit = false; s.glow = 0; s.el.classList.remove('lit'); s.num.textContent = '0'; });
      ST.lit = 0; ST.dark = 1; ST.idle = 0; ST.ph = 'play'; lastCap = ''; progressCap(); autoBtn.hidden = true;
      setTimeout(measure, 1100);   // the diyas slide back up first
    }, 500);
  },
};

/* ── frame loop ── */
let last = performance.now();
function frame(ms) {
  requestAnimationFrame(frame);
  const dt = Math.min(.05, (ms - last) / 1000), now = ms / 1000; last = ms;
  if (!W) return;
  ST.idle += dt;
  if (ST.ph === 'play') {
    if (ST.idle > 1.6 && autoBtn.hidden && ST.lit < 5) autoBtn.hidden = false;
    if (ST.idle > 7 && ST.lit < 5) say('tip: you can also just tap a diya');
  }
  // the room gets lighter with every diya; fully lit at the reveal (then the veil fades out in css)
  ST.dark = lerp(ST.dark, 1 - ST.lit * .1, .04);
  slots.forEach(s => { s.glow = lerp(s.glow, s.lit ? 1 : 0, .08); if (s.lit && !reduced && Math.random() < dt * 4) spawn({ k: 'ember', x: s.x + rnd(-4, 4), y: s.y - 14, vx: rnd(-10, 10), vy: rnd(-50, -25), life: 0, max: rnd(.8, 1.6), r: rnd(.8, 1.8), ph: rnd(0, 9) }); });
  if (!flame.on && ST.ph === 'play') { eye.x = lerp(eye.x, src.x, .02); eye.y = lerp(eye.y, src.y, .02); }
  if (flame.on) { eye.x = flame.x; eye.y = flame.y; carryEl.style.transform = `translate(${(flame.x - 10).toFixed(1)}px,${(flame.y - 36).toFixed(1)}px)`; }
  if (document.body.classList.contains('locked') || parts.length) { drawSky(now); stepParts(dt, now); }
  if (ST.ph !== 'done') { drawNight(now); owlLook(); }
}

/* ── loader → boot ── */
const ldr = $('#ldr'), bar = $('#ldrBar');
const setBar = k => { bar.style.width = (k * 100).toFixed(0) + '%'; };
$('#ldrT').textContent = guest.full ? fill(S.copy.loader) : 'your diwali wish is on its way';
$('#ldrS').textContent = S.copy.loaderSub;
const sndBtn = $('#snd'); setSound(audio.on);
sndBtn.addEventListener('click', () => setSound(!audio.on));
setBar(.25);
const fontsReady = (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setBar(.7));
const loaded = new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
const T0 = performance.now();
Promise.race([Promise.all([fontsReady, loaded]), sleep(6000)]).then(async () => {
  setBar(1); await sleep(Math.max(0, 800 - (performance.now() - T0)));
  measure(); requestAnimationFrame(frame);
  ST.ph = 'ask';
  const go = $('#ldrGo'), nameIn = $('#ldrName');
  $('#ldrS').hidden = true; go.hidden = false;
  const enter = () => {
    initAudio(); play('open');
    ldr.classList.add('out'); setTimeout(() => ldr.remove(), 700);
    sndBtn.hidden = false; fillGreeting(); measure();
    ST.ph = 'play'; ST.idle = 0; progressCap(); track('open');
  };
  if (!guest.full && S.askName) {   // a bare link: ask their name (only if site.js → askName is true) so the owl knows who it's lighting up for
    nameIn.hidden = false; nameIn.focus({ preventScroll: true });
    const named = () => {
      const n = nameIn.value.trim().replace(/\s+/g, ' ').slice(0, 32);
      if (!n) { nameIn.classList.remove('bad'); void nameIn.offsetWidth; nameIn.classList.add('bad'); return; }
      guest.full = n.replace(/(^|\s)(\p{Ll})/gu, (m, a, b) => a + b.toUpperCase()); window.dispatchEvent(new Event('ow:named')); enter();
    };
    go.addEventListener('click', named); nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') named(); });
  } else { go.focus({ preventScroll: true }); go.addEventListener('click', enter, { once: true }); }
});
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(measure, 120); });
addEventListener('scroll', () => { if (document.body.classList.contains('locked') && scrollY > 0) scrollTo(0, 0); }, { passive: true });
})();
