'use client';
import { useEffect, useState } from 'react';

// Event-Based Lead Gen "What you get": the 4 benefits on one event timeline
// (Before -> At the event -> After -> Result). Each stage has a small moving visual.
// Auto-advances every 4s; every stage is clickable.
const STAGES = ['Before the event', 'At the event', 'After the event', 'The result'];
const STEP = 4000;
const CAL_ON = [0, 2, 3, 5, 6, 8, 9, 11];
const CROWD = [[4, 4], [100, 2], [2, 60], [104, 64], [52, -4], [52, 70]];
const PC = ['#F0ABFC', '#C4B0FF', '#F0ABFC', '#B79CFF', '#B79CFF', '#F5C2FD'];

function Visual({ i, tick }) {
  if (i === 0) return <span className="evt-cal">{Array.from({ length: 12 }, (_, j) => <i key={j} className={j < Math.min(tick, 12) && CAL_ON.includes(j) ? 'on' : ''} />)}</span>;
  if (i === 1) return <span className="evt-crowd"><b />{CROWD.map(([x, y], j) => <i key={j} style={{ left: x, top: y, background: PC[j], '--dx': `${Math.round((56 - x) * 0.45)}px`, '--dy': `${Math.round((36 - y) * 0.45)}px`, animationDelay: `${j * 0.2}s` }} />)}</span>;
  if (i === 2) return <span className="evt-mail">{[0, 1, 2].map(j => <span key={j} style={{ animationDelay: `${j * 0.6}s` }}><svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#F0ABFC" strokeWidth="1.6" aria-hidden="true"><rect x="1" y="1" width="20" height="14" rx="2" /><path d="M1 2l10 7 10-7" /></svg><i /></span>)}</span>;
  return <span className="evt-bars">{[24, 36, 48, 62, 80].map((h, j) => <i key={j} style={{ height: h, animationDelay: `${j * 0.12}s` }} />)}</span>;
}

export default function EventTimeline({ items = [] }) {
  const [k, setK] = useState(0);
  const [r, setR] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setK(x => (x + 1) % items.length), STEP);
    return () => clearTimeout(t);
  }, [k, r, items.length]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTick(12); return; }
    const t = setInterval(() => setTick(x => (x + 1) % 14), 260);
    return () => clearInterval(t);
  }, []);

  const pick = i => { setK(i); setR(x => x + 1); };

  return (
    <div className="evt" style={{ '--p': `${k * 25}%` }}>
      <span className="evt-rail" aria-hidden="true" /><span className="evt-fill" aria-hidden="true" />
      <div className="evt-stages" role="tablist" aria-label="Event stages">
        {items.map(([t, d], i) => (
          <button key={t} type="button" role="tab" aria-selected={i === k} className={`evt-stage${i === k ? ' on' : ''}${i <= k ? ' done' : ''}`} onClick={() => pick(i)}>
            <span className="evt-vis" aria-hidden="true">{i === k && <Visual i={i} tick={tick} />}</span>
            <span className="evt-dot" aria-hidden="true" />
            <small>{STAGES[i]}</small>
            <h3>{t}</h3>
            <p>{d}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
