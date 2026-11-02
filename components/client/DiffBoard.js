'use client';
import { useEffect, useState } from 'react';

// "The SalesGarners Difference" as a split-flap departure board. The active row's tiles flip
// through characters and land on the number; status turns Updating -> Delivered.
// Auto-advances every 4s; every row is clickable.
const STEP = 4000;
const FLIP = 70;
const SETTLED = 16;
const R = '0123456789MN+#%';

export default function DiffBoard({ items = [] }) {
  const [k, setK] = useState(0);
  const [n, setN] = useState(SETTLED);
  const [r, setR] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => { setK(x => (x + 1) % items.length); setN(0); }, STEP);
    return () => clearTimeout(t);
  }, [k, r, items.length]);

  useEffect(() => {
    if (n >= SETTLED) return;
    const t = setTimeout(() => setN(x => x + 1), FLIP);
    return () => clearTimeout(t);
  }, [n]);

  const pick = i => { setK(i); setN(0); setR(x => x + 1); };

  return (
    <div className="dfb">
      <div className="dfb-top"><span>DELIVERED</span><span><i aria-hidden="true" />LIVE BOARD</span></div>
      <div className="dfb-rows" role="tablist" aria-label="The SalesGarners difference">
        {items.map(([value, code, title], i) => {
          const on = i === k;
          return (
            <button key={title} type="button" role="tab" aria-selected={on} className={`dfb-row${on ? ' on' : ''}`} onClick={() => pick(i)}>
              <span className="dfb-tiles" aria-label={value}>
                {value.split('').map((ch, j) => {
                  const settled = !on || n >= 6 + j * 2;
                  const c = settled ? ch : R[(n * 7 + j * 3) % R.length];
                  return <span key={on ? `${j}-${settled ? 's' : n}` : `${j}-${ch}`} className="dfb-tile" aria-hidden="true">{c}</span>;
                })}
              </span>
              <span className="dfb-name"><small>{code}</small><b>{title}</b></span>
              <span className={`dfb-status${on ? (n >= SETTLED ? ' done' : ' busy') : ''}`}>{on ? (n >= SETTLED ? 'DELIVERED' : 'UPDATING') : 'ON TIME'}</span>
            </button>
          );
        })}
      </div>
      <p className="dfb-desc" key={`${k}-${r}`} aria-live="polite">{items[k] && items[k][3]}</p>
    </div>
  );
}
