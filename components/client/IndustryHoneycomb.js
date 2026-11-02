'use client';
// Audience Overview: "Industry Coverage" as a honeycomb heatmap.
// Biggest audiences sit at the core; colour runs cooler (violet) -> hotter (pink).
// Auto-steps through industries; hover / click / focus any cell to inspect it.
import { useEffect, useMemo, useRef, useState } from 'react';

const STEP = 1800;
const W = 112, H = 128, SX = 122, SY = 104; // cell size + spacing (clear gaps, no overlap)
const SHORT = {
  'Banking & Financial Services': 'Banking & Finance',
  'Consumer Goods & Services': 'Consumer Goods',
  'MSPs, Service Providers & Resellers': 'MSPs & Resellers',
  'Construction & Agriculture': 'Construction & Agri',
  'Manufacturing & Materials': 'Manufacturing',
  'Automotive & Transportation': 'Automotive & Transport',
  'Telecommunications & VoIP': 'Telecom & VoIP',
  'Non-Profit Organizations & Associations': 'Non-Profit',
};
const STOPS = [[42, 22, 112], [109, 67, 231], [187, 50, 200]];
const heat = (t) => {
  const u = t < 0.5 ? t * 2 : (t - 0.5) * 2, A = STOPS[t < 0.5 ? 0 : 1], B = STOPS[t < 0.5 ? 1 : 2];
  return `rgb(${A.map((a, i) => Math.round(a + (B[i] - a) * u)).join(',')})`;
};

function layout(n) {
  const rows = []; let left = n, wide = false;
  while (left > 0) { const c = Math.min(left, wide ? 7 : 6); rows.push(c); left -= c; wide = !wide; }
  const maxC = Math.max(...rows);
  const pts = [];
  rows.forEach((c, r) => { const off = ((maxC - c) * SX) / 2; for (let i = 0; i < c; i++) pts.push([off + i * SX, r * SY]); });
  const cx = ((maxC - 1) * SX) / 2, cy = ((rows.length - 1) * SY) / 2;
  pts.sort((a, b) => Math.hypot(a[0] - cx, (a[1] - cy) * 1.15) - Math.hypot(b[0] - cx, (b[1] - cy) * 1.15) || a[0] - b[0]);
  return { pts, w: (maxC - 1) * SX + W, h: (rows.length - 1) * SY + H };
}

export default function IndustryHoneycomb({ items }) {
  const data = useMemo(() => [...items].sort((a, b) => b[1] - a[1]), [items]);
  const { pts, w, h } = useMemo(() => layout(data.length), [data.length]);
  const [k, setK] = useState(0);
  const hover = useRef(false);
  const n = data.length, max = data[0][1], min = data[n - 1][1];

  useEffect(() => {
    const t = setInterval(() => { if (!hover.current) setK((v) => (v + 1) % n); }, STEP);
    return () => clearInterval(t);
  }, [n]);

  const pick = (i) => { hover.current = true; setK(i); };
  const cur = data[k];

  return (
    <div className="ihc">
      <div className="ihc-info" key={k} aria-live="polite">
        <small>CELL #{k + 1} OF {n}</small>
        <h3>{cur[0]}</h3>
        <b className="ihc-v">{cur[1].toFixed(2)}M</b>
        <span className="ihc-scale"><i style={{ left: `${Math.round(((cur[1] - min) / (max - min)) * 100)}%` }} /></span>
        <span className="ihc-legend"><span>COOLER</span><span>HOTTER</span></span>
        <span className="ihc-hint">Biggest audiences sit at the core · hover any cell</span>
      </div>
      <div className="ihc-board-wrap">
        <div className="ihc-board" style={{ width: w, height: h }} onMouseLeave={() => { hover.current = false; }}>
          {data.map(([t, v], i) => {
            const on = i === k, heatT = (v - min) / (max - min || 1);
            return (
              <button key={t} type="button" className={`ihc-cell${on ? ' on' : ''}`}
                style={{ left: pts[i][0], top: pts[i][1], '--c': heat(heatT), animationDelay: `${i * 0.04}s` }}
                aria-label={`${t}: ${v.toFixed(2)} million`} aria-pressed={on}
                onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => pick(i)}>
                <span className="ihc-in">
                  <b>{v.toFixed(2)}M</b>
                  <span>{SHORT[t] || t}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
