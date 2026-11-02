'use client';
import { useEffect, useState } from 'react';

// About page: Why / How / What as three rings (Why in the centre). Auto-advances every 4s and every
// ring / tab is clickable. Services orbit the outer ring, methods orbit the middle ring.
const ITEMS = [
  { short: 'WHY', label: 'Why we do it', t: 'Help businesses find meaningful opportunities and build stronger connections with their audiences.' },
  { short: 'HOW', label: 'How we do it', t: 'Combine data-driven targeting, relevant content, audience engagement, and lead qualification to help businesses reach their goals.' },
  { short: 'WHAT', label: 'What we do', t: 'B2B lead generation, demand generation, content syndication, data services, publishing, and X-Engage.' },
];
const WHAT = ['Lead generation', 'Demand generation', 'Content syndication', 'Data services', 'Publishing', 'X-Engage'];
const HOW = ['Targeting', 'Content', 'Engagement', 'Qualification'];
const STEP = 4000;
const pos = (n, r) => Array.from({ length: n }, (_, i) => { const a = ((-90 + (i * 360) / n) * Math.PI) / 180; return { left: `${50 + r * Math.cos(a)}%`, top: `${50 + r * Math.sin(a)}%` }; });
const WP = pos(WHAT.length, 40), HP = pos(HOW.length, 24);

const ICONS = [
  <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><path d="M16 8l4.5-4.5" /><path d="M18 3.5h2.5V6" /></>,
  <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /><circle cx="12" cy="12" r="6.5" /></>,
  <><path d="M12 2.5c3.5 2 5.5 5.6 5.5 9.5v4h-11v-4c0-3.9 2-7.5 5.5-9.5z" /><circle cx="12" cy="10" r="2" /><path d="M6.5 13.5L4 16v3l2.5-1.5M17.5 13.5L20 16v3l-2.5-1.5" /><path d="M10 19.5c.5 1 1.2 1.8 2 2.2.8-.4 1.5-1.2 2-2.2" /></>,
];

export default function WhyHowWhat() {
  const [k, setK] = useState(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setK(x => (x + 1) % ITEMS.length), STEP);
    return () => clearTimeout(t);
  }, [k, r]);

  const pick = i => { setK(i); setR(x => x + 1); };
  const cur = ITEMS[k];

  return (
    <div className="whw">
      <div className="whw-stage">
        <div className="whw-rings">
          <span className="whw-dash" aria-hidden="true" />
          <button type="button" className={`whw-ring r2${k === 2 ? ' on' : ''}`} onClick={() => pick(2)} aria-label="What we do" />
          <button type="button" className={`whw-ring r1${k === 1 ? ' on' : ''}`} onClick={() => pick(1)} aria-label="How we do it" />
          <button type="button" className={`whw-ring r0${k === 0 ? ' on' : ''}`} onClick={() => pick(0)} aria-label="Why we do it">
            <span className="whw-ic"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k]}</svg></span>
            <b>{cur.short}</b>
          </button>
          <div className="whw-orbit o2" aria-hidden="true">{WHAT.map((t, i) => <span key={t} className={k === 2 ? 'on' : ''} style={WP[i]}>{t}</span>)}</div>
          <div className="whw-orbit o1" aria-hidden="true">{HOW.map((t, i) => <span key={t} className={k === 1 ? 'on' : ''} style={HP[i]}>{t}</span>)}</div>
          <span className={`whw-tag t2${k === 2 ? ' on' : ''}`} aria-hidden="true">WHAT</span>
          <span className={`whw-tag t1${k === 1 ? ' on' : ''}`} aria-hidden="true">HOW</span>
        </div>
        <div className="whw-copy">
          <div className="whw-tabs" role="tablist" aria-label="Why, how and what">
            {ITEMS.map((x, i) => (
              <button key={x.short} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => pick(i)}>
                {x.short}{i === k && <i key={`${k}-${r}`} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="whw-text" key={`${k}-${r}`} aria-live="polite">
            <h3>{cur.label}</h3>
            <p>{cur.t}</p>
          </div>
        </div>
      </div>
      <div className="whw-close">
        <div>
          <h2>The Best Part of Our Story Is <span>What’s Next.</span></h2>
          <p>We’re continuing to learn, innovate, and build meaningful connections. And we’re excited about what we can create together.</p>
        </div>
        <a className="whw-btn" href="/contact-us">Get to Know SalesGarners <span aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}
