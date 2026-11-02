'use client';
// Data Services: "Purpose-Built B2B Data" as a 3D stack of data layers.
// Auto-advances every 2s, any layer / number can be clicked or hovered.
import { useEffect, useRef, useState } from 'react';

const STEP = 2000;
const Z = 62;      // gap between layers
const LIFT = 34;   // extra lift for the active layer
const TOP = 185;   // stack offset inside the stage (keeps the lifted top layer clear of the heading)

export default function DataLayers({ eb, title, items }) {
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
  const enter = (i) => { hover.current = true; if (i !== k) pick(i); };
  const leave = () => { hover.current = false; setRun((r) => r + 1); };

  const cur = items[k];
  const num = (i) => String(i + 1).padStart(2, '0');

  return (
    <div className="dly">
      <div className="dly-head">
        {eb && <span className="eyebrow">{eb}</span>}
        <h2 className="h2">{title}</h2>
      </div>
      <div className="dly-body">
        <div className="dly-stage" onMouseLeave={leave}>
          <div className="dly-stack" aria-hidden="true" style={{ top: TOP }}>
            {items.map((it, i) => {
              const on = i === k;
              const z = (n - 1 - i) * Z + (on ? LIFT : 0);
              return (
                <div key={i} className={`dly-layer${on ? ' on' : ''}`} onMouseEnter={() => { hover.current = true; }} onClick={() => pick(i)}
                  style={{ transform: `translate3d(${on ? '-26px,26px' : '0,0'},${z}px)` }}>
                  <i />
                </div>
              );
            })}
          </div>
          {items.map((it, i) => {
            const on = i === k;
            const z = (n - 1 - i) * Z + (on ? LIFT : 0);
            const y = TOP + 140 - Math.round(z * 0.85) - 22;
            return (
              <button key={i} type="button" className={`dly-lbl${on ? ' on' : ''}`} style={{ top: y }}
                aria-label={it[0]} onMouseEnter={() => enter(i)} onFocus={() => pick(i)} onClick={() => pick(i)}>
                <span>{num(i)}</span><i />
              </button>
            );
          })}
        </div>
        <div className="dly-copy" onMouseLeave={leave}>
          <div className="dly-tabs" role="tablist" aria-label="Data services">
            {items.map((it, i) => (
              <button key={i} type="button" role="tab" aria-selected={i === k} aria-label={it[0]}
                className={i === k ? 'on' : ''} onMouseEnter={() => enter(i)} onClick={() => pick(i)}>
                {num(i)}
                <span className="dly-track">{i === k && <span key={run} className="dly-fill" style={{ animationDuration: `${STEP}ms` }} />}</span>
              </button>
            ))}
          </div>
          <div className="dly-text" key={k} aria-live="polite">
            <small>LAYER {num(k)} OF {String(n).padStart(2, '0')}</small>
            <h3>{cur[0]}</h3>
            <p>{cur[1]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
