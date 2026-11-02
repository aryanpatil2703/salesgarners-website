'use client';
// Audience Overview: Employee / Job Role / Job Functions as a morphing tile map.
// Tile area = share of the audience. Tabs reshape the map; rows auto-step,
// hover / click / focus any tile to inspect it.
import { useEffect, useRef, useState } from 'react';

const STEP = 1800;

function squarify(vals, W, H) {
  const out = new Array(vals.length);
  const total = vals.reduce((a, b) => a + b, 0) || 1, scale = (W * H) / total;
  let rest = vals.map((v, i) => ({ i, a: v * scale })).sort((a, b) => b.a - a.a);
  let x = 0, y = 0, w = W, h = H;
  const worst = (row, side) => {
    const s = row.reduce((a, b) => a + b.a, 0); let mx = 0, mn = Infinity;
    row.forEach((r) => { mx = Math.max(mx, r.a); mn = Math.min(mn, r.a); });
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
  };
  while (rest.length) {
    const side = Math.min(w, h); const row = [rest[0]]; let j = 1;
    while (j < rest.length && worst([...row, rest[j]], side) <= worst(row, side)) { row.push(rest[j]); j++; }
    rest = rest.slice(j);
    const s = row.reduce((a, b) => a + b.a, 0);
    if (w >= h) { const cw = s / h; let cy = y; row.forEach((r) => { const rh = r.a / cw; out[r.i] = [x, cy, cw, rh]; cy += rh; }); x += cw; w -= cw; }
    else { const ch = s / w; let cx = x; row.forEach((r) => { const rw = r.a / ch; out[r.i] = [cx, y, rw, ch]; cx += rw; }); y += ch; h -= ch; }
  }
  return out;
}

export default function AudienceTiles({ tabs }) {
  const names = Object.keys(tabs);
  const [tab, setTab] = useState(names[0]);
  const [k, setK] = useState(0);
  const [box, setBox] = useState({ w: 1100, h: 520 });
  const ref = useRef(null);
  const hover = useRef(false);
  const T = tabs[tab], rows = T.rows;
  const total = rows.reduce((a, r) => a + r[1], 0), max = Math.max(...rows.map((r) => r[1]));
  const slots = Math.max(...names.map((n) => tabs[n].rows.length));

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => { const w = el.clientWidth; setBox({ w, h: w > 900 ? 520 : w > 600 ? 460 : 640 }); };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => { if (!hover.current) setK((v) => (v + 1) % rows.length); }, STEP);
    return () => clearInterval(t);
  }, [rows.length, tab]);

  const rects = squarify(rows.map((r) => r[1]), box.w, box.h);
  const kk = Math.min(k, rows.length - 1), cur = rows[kk];
  const share = (v) => `${((v / total) * 100).toFixed(1)}%`;
  const inspect = (i) => { hover.current = true; setK(i); };

  return (
    <div className="atm">
      <div className="atm-top">
        <div className="atm-tabs" role="tablist" aria-label="Audience breakdown">
          {names.map((n) => (
            <button key={n} type="button" role="tab" aria-selected={n === tab} className={n === tab ? 'on' : ''}
              onClick={() => { setTab(n); setK(0); }}>{n}</button>
          ))}
        </div>
        <span className="atm-total">Total: {T.total}</span>
      </div>
      <div className="atm-head" key={`${tab}-${kk}`}>
        <h3>{T.title}</h3>
        <span>{cur[0]} · {cur[1].toFixed(2)}M · {share(cur[1])}</span>
      </div>
      <div className="atm-map" ref={ref} style={{ height: box.h }} onMouseLeave={() => { hover.current = false; }}>
        {Array.from({ length: slots }, (_, i) => {
          const r = rows[i];
          if (!r) return <span key={i} className="atm-tile gone" style={{ left: box.w, top: box.h, width: 0, height: 0 }} aria-hidden="true" />;
          const [x, y, w, h] = rects[i], on = i === kk, area = w * h, t = r[1] / max;
          const size = Math.min(w, h) < 70 ? 'xs' : (w < 170 || area < 22000) ? 's' : (area > 60000 && w > 260) ? 'l' : 'm';
          return (
            <button key={i} type="button" className={`atm-tile ${size}${w < 120 && size !== 'xs' ? ' nar' : ''}${on ? ' on' : ''}`}
              style={{ left: x, top: y, width: w, height: h, '--a': (0.35 + t * 0.55).toFixed(2) }}
              aria-label={`${r[0]}: ${r[1].toFixed(2)} million, ${share(r[1])}`} aria-pressed={on}
              onMouseEnter={() => inspect(i)} onFocus={() => inspect(i)} onClick={() => inspect(i)}>
              <span className="atm-in">
                <span className="atm-t">{r[0]}</span>
                <span className="atm-b"><b>{r[1].toFixed(2)}M</b><small>{share(r[1])}</small></span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
