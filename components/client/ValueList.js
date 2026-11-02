'use client';
import { useEffect, useState } from 'react';

// "What you get" as a numbered list (left) and a live detail (right) with a big outlined number.
// Auto-advances every 3.5s; any line is clickable (timer restarts). No cards, no icons.
const STEP = 3500;

export default function ValueList({ eyebrow, title, items = [] }) {
  const [k, setK] = useState(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !items.length) return;
    const t = setTimeout(() => setK(x => (x + 1) % items.length), STEP);
    return () => clearTimeout(t);
  }, [k, r, items.length]);

  const pick = i => { setK(i); setR(x => x + 1); };
  const cur = items[k] || [];
  const num = String(k + 1).padStart(2, '0');

  return (
    <div className="vls">
      <div className="vls-left">
        <div className="vls-head">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="h2">{title}</h2>
        </div>
        <div className="vls-list" role="tablist" aria-label={eyebrow}>
          {items.map(([t], i) => (
            <button key={t} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => pick(i)}>
              <small>{String(i + 1).padStart(2, '0')}</small>
              <b>{t}</b>
              <span aria-hidden="true">→</span>
              {i === k && <i key={`${k}-${r}`} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
      <div className="vls-detail" key={`${k}-${r}`} aria-live="polite">
        <span className="vls-num" aria-hidden="true">{num}</span>
        <small>{num} / {String(items.length).padStart(2, '0')}</small>
        <h3>{cur[0]}</h3>
        <p>{cur[1]}</p>
      </div>
    </div>
  );
}
