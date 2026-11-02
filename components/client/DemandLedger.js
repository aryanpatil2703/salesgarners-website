'use client';
// Home: "Our Proven Demand Generation Approach" – a formal process ledger.
// Four open columns (no boxes); auto-advances, hover or click a step to see it.
import { useEffect, useRef, useState } from 'react';

const STEP = 2500;
const ICONS = [
  'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  'M3 11l18-8-8 18-2-8-8-2z',
  'M3 12h4l3-7 4 14 3-7h4',
  'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z',
];

export default function DemandLedger({ eb, title, items }) {
  const [k, setK] = useState(0);
  const [run, setRun] = useState(0);
  const hover = useRef(false);
  const n = items.length;

  useEffect(() => {
    const t = setInterval(() => {
      if (hover.current) return;
      setK((v) => (v + 1) % n);
      setRun((r) => r + 1);
    }, STEP);
    return () => clearInterval(t);
  }, [n, run]);

  const pick = (i) => { setK(i); setRun((r) => r + 1); };
  const num = (i) => String(i + 1).padStart(2, '0');

  return (
    <div className="dlg">
      <div className="dlg-head">
        <div>
          {eb && <span className="dlg-eb">{eb}</span>}
          <h2 className="h2">{title}</h2>
        </div>
        <div className="dlg-count" aria-hidden="true"><b key={k}>{num(k)}</b><span>/ {String(n).padStart(2, '0')}</span></div>
      </div>
      <div className="dlg-cols" role="tablist" aria-label="Demand generation approach"
        onMouseLeave={() => { hover.current = false; setRun((r) => r + 1); }}>
        {items.map((t, i) => {
          const state = i === k ? 'on' : i < k ? 'done' : '';
          return (
            <button key={i} type="button" role="tab" aria-selected={i === k} className={`dlg-col ${state}`}
              onMouseEnter={() => { hover.current = true; if (i !== k) pick(i); }}
              onFocus={() => pick(i)} onClick={() => pick(i)}>
              <span className="dlg-line">{i === k && <span key={run} className="dlg-fill" style={{ animationDuration: `${STEP}ms` }} />}</span>
              <span className="dlg-top">
                <span className="dlg-n">STEP {num(i)}</span>
                <span className="dlg-ic"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[i % 4]} /></svg></span>
              </span>
              <b className="dlg-t">{t}</b>
              <span className="dlg-st"><i />{i === k ? 'IN PROGRESS' : i < k ? 'COMPLETE' : 'NEXT'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
