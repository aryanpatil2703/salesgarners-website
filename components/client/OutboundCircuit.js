'use client';
// Outbound Sales: "How Our Outbound Engine Works" as a circuit board.
// A signal runs ICP chip -> 3 channels -> X-Engage chip -> Meeting chip.
// Auto-advances; hover or click any chip / channel / step to see it.
import { useEffect, useRef, useState } from 'react';

const STEP = 2500;
const SEG = [
  [0, 'M0 220 H40'],
  [1, 'M140 220 H190 V90 H240'], [1, 'M140 220 H240'], [1, 'M140 220 H190 V350 H240'],
  [2, 'M300 90 H350 V220 H400'], [2, 'M300 220 H400'], [2, 'M300 350 H350 V220 H400'],
  [3, 'M500 220 H570'],
];
const CX = [90, 270, 450, 620];

const IcTarget = () => (<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>);
const IcPulse = () => (<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3-7 4 14 3-7h4" /></svg>);
const IcCal = () => (<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /><path d="M9 15l2 2 4-4" /></svg>);
const IcMail = () => (<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>);
const IcPhone = () => (<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>);

export default function OutboundCircuit({ title, items }) {
  const [k, setK] = useState(0);
  const [run, setRun] = useState(0);
  const hover = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (hover.current) return;
      setK((v) => (v + 1) % 4);
      setRun((r) => r + 1);
    }, STEP);
    return () => clearInterval(t);
  }, [run]);

  const pick = (i) => { setK(i); setRun((r) => r + 1); };
  const over = (i) => () => { hover.current = true; if (i !== k) pick(i); };
  const out = () => { hover.current = false; setRun((r) => r + 1); };
  const st = (i) => (i === k ? ' on' : i < k ? ' done' : '');
  const num = (i) => String(i + 1).padStart(2, '0');
  const bind = (i) => ({ onMouseEnter: over(i), onFocus: () => pick(i), onClick: () => pick(i) });

  return (
    <div className="obc">
      <div className="obc-copy">
        <h2 className="h2">{title}</h2>
        <div className="obc-text" key={k} aria-live="polite">
          <small>STEP {num(k)} / 04</small>
          <h3>{items[k][0]}</h3>
          <p>{items[k][1]}</p>
        </div>
        <div className="obc-tabs" role="tablist" aria-label="Engine steps" onMouseLeave={out}>
          {items.map((it, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === k} aria-label={it[0]} className={i === k ? 'on' : ''} {...bind(i)}>
              {num(i)}
              <span className="obc-track">{i === k && <span key={run} className="obc-fill" style={{ animationDuration: `${STEP}ms` }} />}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="obc-board-wrap">
        <div className="obc-board" onMouseLeave={out}>
          <svg aria-hidden="true" className="obc-svg" width="700" height="480" viewBox="0 0 700 480">
            {SEG.map(([s, d], i) => (
              <path key={i} d={d} className={`obc-trace${s < k ? ' done' : s === k ? ' on' : ''}`} />
            ))}
          </svg>
          {SEG.filter(([s]) => s === k).map(([, d], i) => (
            <span key={`${run}-${k}-${i}`} aria-hidden="true" className="obc-pulse" style={{ offsetPath: `path('${d}')`, animationDelay: `${i * 0.15}s` }} />
          ))}

          <button type="button" className={`obc-chip${st(0)}`} style={{ left: 40 }} aria-label={items[0][0]} {...bind(0)}><IcTarget /><span>ICP</span></button>
          {[90, 220, 350].map((y, i) => (
            <button key={i} type="button" className={`obc-node${st(1)}`} style={{ top: y - 30 }} aria-label={`${['Email', 'LinkedIn', 'Calling'][i]}: ${items[1][0]}`} {...bind(1)}>
              {i === 0 ? <IcMail /> : i === 1 ? <b>in</b> : <IcPhone />}
            </button>
          ))}
          <button type="button" className={`obc-chip${st(2)}`} style={{ left: 400 }} aria-label={items[2][0]} {...bind(2)}><IcPulse /><span>X-ENGAGE</span></button>
          <button type="button" className={`obc-chip${st(3)}`} style={{ left: 570 }} aria-label={items[3][0]} {...bind(3)}><IcCal /><span>MEETING</span></button>
          <span aria-hidden="true" className={`obc-led${k === 3 ? ' on' : ''}`} />

          {items.map((it, i) => (
            <button key={i} type="button" className={`obc-cap${i === k ? ' on' : ''}`} style={{ left: CX[i] }} tabIndex={-1} {...bind(i)}>
              <span>{num(i)}</span><b>{it[0]}</b>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
