/* share: a 1080×1920 story card drawn on a canvas. phones get the share sheet; desktops download it. */
(() => {
'use strict';
const { S, guest, fmt, toast, track, play } = window.OW;

function wrap(c, text, x, y, maxW, lh) {
  const words = text.split(' '); let line = '', yy = y;
  for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { c.fillText(line, x, yy); line = w; yy += lh; } else line = t; }
  if (line) c.fillText(line, x, yy); return yy;
}
function diya(c, x, y, s) {
  // bowl
  const g = c.createLinearGradient(0, y, 0, y + 40 * s); g.addColorStop(0, '#e08a3c'); g.addColorStop(.6, '#a4501c'); g.addColorStop(1, '#6a2a0c');
  c.fillStyle = g; c.beginPath(); c.moveTo(x - 50 * s, y); c.quadraticCurveTo(x, y + 70 * s, x + 50 * s, y); c.closePath(); c.fill();
  // glow + flame
  const h = c.createRadialGradient(x, y - 40 * s, 0, x, y - 40 * s, 150 * s); h.addColorStop(0, 'rgba(255,190,80,.55)'); h.addColorStop(1, 'rgba(255,120,30,0)');
  c.fillStyle = h; c.beginPath(); c.arc(x, y - 40 * s, 150 * s, 0, 7); c.fill();
  const f = c.createRadialGradient(x, y - 22 * s, 2, x, y - 30 * s, 40 * s); f.addColorStop(0, '#fffef2'); f.addColorStop(.35, '#ffc94d'); f.addColorStop(1, '#e8500f');
  c.fillStyle = f; c.beginPath(); c.moveTo(x, y - 80 * s); c.quadraticCurveTo(x + 26 * s, y - 30 * s, x, y - 6 * s); c.quadraticCurveTo(x - 26 * s, y - 30 * s, x, y - 80 * s); c.fill();
}
async function render() {
  if (document.fonts) await document.fonts.ready;
  const W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#120a2a'); bg.addColorStop(.6, '#2a1a5e'); bg.addColorStop(1, '#3a1d6e'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 220; i++) { c.fillStyle = `rgba(255,243,220,${Math.random() * .7 + .1})`; c.beginPath(); c.arc(Math.random() * W, Math.random() * H * .6, Math.random() * 2.4, 0, 7); c.fill(); }
  c.textAlign = 'center';
  c.fillStyle = '#f5a524'; c.font = '600 40px Outfit, sans-serif'; c.fillText(S.brand.name.toUpperCase().split('').join(' '), W / 2, 220);
  c.fillStyle = '#fff3dc'; c.font = '400 118px "Yatra One", sans-serif'; c.shadowColor = '#e4407b'; c.shadowOffsetY = 8;
  let y = wrap(c, `happy diwali, ${guest.first}`, W / 2, 420, 920, 130); c.shadowColor = 'transparent'; c.shadowOffsetY = 0;
  // the five diyas, each with its number
  const xs = [150, 345, 540, 735, 930], ys = [1060, 1010, 980, 1010, 1060];
  S.stats.slice(0, 5).forEach((st, i) => {
    diya(c, xs[i], ys[i], 1.15);
    c.fillStyle = '#ffd36b'; c.font = '800 54px Outfit, sans-serif'; c.fillText(fmt(st.value, st.fmt) + st.suffix, xs[i], ys[i] - 170);
    c.fillStyle = '#fff3dc'; c.font = '500 26px Outfit, sans-serif'; wrap(c, st.label, xs[i], ys[i] - 130, 180, 30);
  });
  c.fillStyle = '#fff3dc'; c.font = '500 50px Outfit, sans-serif';
  wrap(c, `${guest.first} lit five diyas with ${S.brand.name} this diwali.`, W / 2, 1300, 880, 64);
  c.fillStyle = '#f5a524'; c.font = '400 64px "Yatra One", sans-serif'; c.fillText('shubh deepavali 🪔', W / 2, 1560);
  c.fillStyle = 'rgba(255,243,220,.7)'; c.font = '500 34px Outfit, sans-serif'; c.fillText(S.brand.site.replace(/^https?:\/\//, '').replace(/\/$/, ''), W / 2, H - 110);
  return new Promise(r => cv.toBlob(r, 'image/png'));
}
async function share() {
  play('tap');
  const blob = await render(); if (!blob) return;
  const file = new File([blob], `owled-diwali-${guest.first.toLowerCase()}.png`, { type: 'image/png' });
  const text = `${guest.first} lit five diyas with ${S.brand.name} 🪔 shubh deepavali!`;
  track('share');
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); return; } }
  catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
  try { await navigator.clipboard.writeText(text); } catch (e) {}
  toast('card saved, caption copied');
}
document.getElementById('shareBtn').addEventListener('click', share);
window.OWShare = { render };
})();
