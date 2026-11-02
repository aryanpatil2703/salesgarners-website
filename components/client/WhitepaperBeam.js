'use client';
import { useEffect, useState } from 'react';

// WhitePaper hero: the whitepaper library on a shelf. The selected guide sends a PDF down a beam
// into an inbox card (0-100% bar, then "Delivered"). Auto-advances (~5s per guide); covers are clickable.
const FALLBACK = ['Smart Lead Targeting Playbook', 'Unlock 3X ROI with the Power of Intent-Driven Demand Generation', 'The Intent Data Buyer’s Guide', 'Client Experience Playbook'];
const COLORS = ['#6D43E7', '#BB32C8', '#8B5CF6', '#A21FAF'];
const STEPS = ['Choose a guide', 'Share your work email', 'PDF delivered'];
const TICK = 500;  // ms per tick
const LAST = 9;    // ticks per guide (0..9 -> 5s)

const nice = t => /[a-z]/.test(t) ? t : t.toLowerCase().replace(/(^|[\s-])(\w)/g, (m, a, b) => a + b.toUpperCase()).replace(/\b(With|The|Of|And|For|To|In)\b/g, (w, x, i) => i === 0 ? w : w.toLowerCase()).replace(/\b3x\b/i, '3X').replace(/\bRoi\b/, 'ROI').replace(/’S\b|'S\b/g, m => m.toLowerCase());

export default function WhitepaperBeam({ titles = [] }) {
  const list = (titles.filter(Boolean).length ? titles.filter(Boolean) : FALLBACK).slice(0, 4).map(nice);
  const len = list.length;
  const [st, setSt] = useState({ k: 0, n: 0, r: 0 });
  const { k, n } = st;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setInterval(() => {
      setSt(s => (reduce ? { ...s, k: (s.k + 1) % len, n: LAST } : s.n >= LAST ? { ...s, k: (s.k + 1) % len, n: 0 } : { ...s, n: s.n + 1 }));
    }, reduce ? 5000 : TICK);
    return () => clearInterval(t);
  }, [len, st.r]);

  const pick = i => setSt(s => ({ k: i, n: 0, r: s.r + 1 }));
  const pct = Math.min(100, Math.round((n / 6) * 100));
  const done = n >= 6;
  const step = n < 2 ? 0 : n < 6 ? 1 : 2;
  const x = `${((k + 0.5) / len) * 100}%`;
  const title = list[k] || '';

  return (
    <div className="wpb" style={{ '--x': x }}>
      <span className="wpb-lbl">THE SALESGARNERS LIBRARY</span>
      <div className="wpb-shelf" role="tablist" aria-label="Whitepapers" style={{ gridTemplateColumns: `repeat(${len}, minmax(0, 1fr))` }}>
        {list.map((t, i) => (
          <button key={t} type="button" role="tab" aria-selected={i === k} className={`wpb-cov${i === k ? ' on' : ''}`} style={{ '--a': COLORS[i % COLORS.length] }} onClick={() => pick(i)}>
            <small>WHITEPAPER</small><span>{t}</span>
          </button>
        ))}
      </div>
      <div className="wpb-beam" aria-hidden="true">
        <span className="wpb-cone" />
        <span className="wpb-line" />
        <span className="wpb-pdf" key={`${k}-${st.r}`}><i>PDF</i></span>
      </div>
      <div className="wpb-inbox" aria-live="polite">
        <div className="wpb-top"><b>Your inbox</b><span className={done ? 'ok' : ''}>{done ? 'Delivered ✓' : `${pct}%`}</span></div>
        <span className="wpb-bar"><span style={{ width: `${pct}%` }} /></span>
        <div className="wpb-body">
          {done ? (
            <div className="wpb-mail" key={k}>
              <span className="wpb-av">SG</span>
              <span className="wpb-txt"><b>Your whitepaper: {title}</b><small>Your download is ready.</small></span>
              <i className="wpb-tag">PDF</i>
            </div>
          ) : <span className="wpb-wait">Delivering “{title}”…</span>}
        </div>
      </div>
      <div className="wpb-steps">
        {STEPS.map((s, i) => <span key={s} className={i <= step ? 'on' : ''}><i>{i + 1}</i>{s}</span>)}
      </div>
    </div>
  );
}
