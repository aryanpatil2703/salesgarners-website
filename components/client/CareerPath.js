'use client';
import { useEffect, useState } from 'react';

// Careers hero: a growth staircase (Join → Learn → Own → Grow). A "You" marker climbs one step
// every 2s and loops. Steps are clickable; auto-play resumes after a click.
const STEPS = [
  ['Join', 'Day one in Pune with ownership from the start'],
  ['Learn', 'Hands-on with first-party data, intent signals and X-Engage'],
  ['Own', 'Campaigns for B2B tech brands in every major market'],
  ['Grow', 'Growth paths across marketing, sales, data and technology'],
];
const STEP = 2000;

export default function CareerPath() {
  const [at, setAt] = useState(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setAt(a => (a + 1) % STEPS.length), at === STEPS.length - 1 ? STEP * 1.5 : STEP);
    return () => clearTimeout(t);
  }, [at, r]);

  const pick = i => { setAt(i); setR(x => x + 1); };

  return (
    <div className="cpth" aria-label="Your growth path at SalesGarners">
      <div className="cpth-stage">
        {STEPS.map(([k, v], i) => (
          <button key={k} type="button" className={`cpth-step${i <= at ? ' on' : ''}${i === at ? ' cur' : ''}`} style={{ '--i': i }} onClick={() => pick(i)} aria-pressed={i === at}>
            <span className="cpth-k"><i>{i + 1}</i>{k}</span>
            <span className="cpth-v">{v}</span>
          </button>
        ))}
        <span className="cpth-me" style={{ '--i': at }} aria-hidden="true">
          <b>You</b>
          <span className="cpth-av"><svg width="30" height="32" viewBox="0 0 56 60"><circle cx="28" cy="22" r="12" fill="#fff" /><path d="M4 60c0-14 11-22 24-22s24 8 24 22z" fill="#fff" /></svg></span>
        </span>
      </div>
      <p className="cpth-cap" aria-live="polite"><b>{STEPS[at][0]}</b> {STEPS[at][1]}</p>
    </div>
  );
}
