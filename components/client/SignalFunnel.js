'use client';
import { useEffect, useRef } from 'react';

// Home hero visual: contacts flow from the 115M+ database through three gates
// (ICP fit, intent signal, 3X QA™); the ones that pass all three come out as delivered MQLs.
// Counters and the lead feed are illustrative. Pauses off screen; static for reduced motion.

const fmtIN = n => Math.round(n).toLocaleString('en-IN');
const PEOPLE = [['Director of IT', 'Enterprise SaaS · NA'], ['VP Marketing', 'FinTech · EMEA'], ['Head of Demand Gen', 'MarTech · APAC'], ['CISO', 'Cybersecurity · NA'], ['HR Director', 'HRTech · ANZ'], ['CTO', 'Startup · LATAM'], ['Sales Ops Lead', 'SalesTech · EMEA']];
const GATES = [.32, .56, .80];
const PASS = [.5, .55, .8];

function run(root, RM) {
  const c = root.querySelector('canvas'), ctx = c.getContext('2d');
  let S = { w: 0, h: 0 };
  const size = () => { const r = c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); c.width = r.width * d; c.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); S = { w: r.width, h: r.height }; };
  size(); window.addEventListener('resize', size);

  const counts = [0, 0, 0], shown = [-1, -1, -1];
  const cEls = [...root.querySelectorAll('[data-c]')], mqlEl = root.querySelector('[data-mql]'), feed = root.querySelector('[data-feed]');
  let mql = 1284; mqlEl.textContent = fmtIN(mql);
  const ps = [];
  const spawn = () => ps.push({ x: -.02, y: .2 + Math.random() * .62, v: .0025 + Math.random() * .0018, st: 0, dead: 0, a: 1, vy: 0, r: 1.6 + Math.random() * 1.4 });

  let pi = 0;
  const ini = t => t.split(/\s+/).filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');
  feed.innerHTML = ''; // start clean (effects can run twice in development)
  const addLead = () => {
    const [a, b] = PEOPLE[pi++ % PEOPLE.length];
    const d = document.createElement('div'); d.className = 'tk new';
    d.innerHTML = `<span class="av">${ini(a)}</span><span class="who"><b>${a}</b><i>${b}</i></span><span class="okb">MQL ✓</span>`;
    [...feed.children].forEach(x => x.classList.remove('new'));
    feed.appendChild(d);
    while (feed.children.length > 4) feed.firstElementChild.remove();
  };
  addLead(); addLead();

  // reduced motion: lay out a still frame with particles spread along the path
  if (RM) for (let i = 0; i < 70; i++) { spawn(); const p = ps[ps.length - 1]; p.x = Math.random(); p.st = GATES.filter(g => p.x > g).length; }

  let alive = true, on = false, last = 0, lt = 0, raf = 0, prev = 0;
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !RM) { cancelAnimationFrame(raf); prev = 0; raf = requestAnimationFrame(frame); } }, { threshold: .05 });
  io.observe(root);

  function draw() {
    const { w, h } = S, LT = document.documentElement.dataset.theme === 'light';
    const col = LT ? ['#8E86B8', '#6D43E7', '#C930B5', '#6D43E7'] : ['#7C83B8', '#8B6BFF', '#D054E0', '#E05BEA'];
    ctx.clearRect(0, 0, w, h);
    const cy = h * .52;
    // funnel walls
    ctx.strokeStyle = LT ? 'rgba(109,67,231,.3)' : 'rgba(183,156,255,.14)'; ctx.lineWidth = LT ? 1.4 : 1;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, cy + s * h * .33); ctx.bezierCurveTo(w * .45, cy + s * h * .3, w * .6, cy + s * h * .1, w, cy + s * h * .06); ctx.stroke(); }
    // gates
    GATES.forEach((g, i) => {
      const gx = g * w, span = h * (.31 - .08 * i);
      const gr = ctx.createLinearGradient(gx, cy - span, gx, cy + span);
      gr.addColorStop(0, 'rgba(109,67,231,0)'); gr.addColorStop(.5, i === 2 ? (LT ? 'rgba(109,67,231,.85)' : 'rgba(224,91,234,.75)') : (LT ? 'rgba(170,40,170,.85)' : 'rgba(187,50,200,.8)')); gr.addColorStop(1, 'rgba(109,67,231,0)');
      ctx.fillStyle = gr; ctx.fillRect(gx - 1.5, cy - span, 3, span * 2);
      ctx.fillStyle = LT ? 'rgba(109,67,231,.07)' : 'rgba(187,50,200,.06)'; ctx.fillRect(gx - 14, cy - span, 28, span * 2);
    });
    // particles
    for (const p of ps) {
      const px = p.x * w, py = p.y * h;
      ctx.globalAlpha = p.a * (p.dead ? .6 : 1); ctx.fillStyle = p.dead ? (LT ? '#BB32C8' : '#E05BEA') : col[p.st];
      if (p.st === 3 && !p.dead) { ctx.shadowColor = col[3]; ctx.shadowBlur = 10; }
      ctx.beginPath(); ctx.arc(px, py, p.r + (p.st === 3 ? .8 : 0) + (LT ? .3 : 0), 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  function step(k = 1) {
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      if (!p.dead) {
        p.x += p.v * k; const target = .52 + (p.y - .52) * Math.max(.15, 1 - p.x * .95); p.y += (target - p.y) * Math.min(1, .02 * k);
        if (p.st < 3 && p.x >= GATES[p.st]) { if (Math.random() < PASS[p.st]) { counts[p.st]++; p.st++; } else { p.dead = 1; p.vy = .002 + Math.random() * .003; } }
        if (p.x > 1.02) { ps.splice(i, 1); mql++; mqlEl.textContent = fmtIN(mql); continue; }
      } else { p.y += p.vy * k; p.vy += .0002 * k; p.x += p.v * .3 * k; p.a -= .025 * k; if (p.a <= 0) { ps.splice(i, 1); continue; } }
    }
    counts.forEach((n, i) => { if (n !== shown[i]) { shown[i] = n; cEls[i].textContent = fmtIN(n * 1234); } });
  }

  function frame(t) {
    if (!alive || !on || document.hidden) return;
    raf = requestAnimationFrame(frame);
    const k = prev ? Math.min(4, (t - prev) / 16.67) : 1; prev = t; // time-based: same speed at any frame rate
    while (t - last > 45) { spawn(); last = last ? last + 45 : t; if (t - last > 400) last = t; }
    step(k); draw();
    if (t - lt > 2600) { addLead(); lt = t; }
  }

  const onTheme = () => draw();
  window.addEventListener('sg-theme', onTheme);
  if (RM) { counts[0] = 52; counts[1] = 29; counts[2] = 23; step(); draw(); }
  else draw();

  return () => { alive = false; feed.innerHTML = ''; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', size); window.removeEventListener('sg-theme', onTheme); };
}

export default function SignalFunnel() {
  const root = useRef(null);
  useEffect(() => run(root.current, window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
  return (
    <div className="gvis fvis fadeup" style={{ animationDelay: '.3s' }} ref={root}>
      <canvas aria-label="Animation: contacts from the 115M+ database pass ICP fit, intent and 3X QA checks before being delivered as MQLs" />
      <div className="f-lbl" style={{ left: '8%' }}><b>DATABASE</b><span>115M+</span></div>
      <div className="f-lbl" style={{ left: '32%' }}><b>ICP FIT</b><span data-c="0">0</span></div>
      <div className="f-lbl" style={{ left: '56%' }}><b>INTENT</b><span data-c="1">0</span></div>
      <div className="f-lbl" style={{ left: '80%' }}><b>3X QA™</b><span data-c="2">0</span></div>
      <div className="ticker" aria-hidden="true"><div className="track" data-feed="" /></div>
      <div className="chip f-out"><small>MQLs DELIVERED</small><b data-mql="">0</b></div>
    </div>
  );
}
