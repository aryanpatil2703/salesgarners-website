'use client';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';

// Careers perks: a ring split into 4 arcs, one per perk. The active arc fills like a timer (5s),
// the centre shows that perk's icon, title and description. Perk names around the ring are clickable.
const STEP = 5000;
const R = 190, C = 230;
const pt = a => [(C + R * Math.cos((a * Math.PI) / 180)).toFixed(1), (C + R * Math.sin((a * Math.PI) / 180)).toFixed(1)];
const arc = i => { const s = -90 + i * 90 + 4, e = s + 82, A = pt(s), B = pt(e); return `M${A[0]} ${A[1]} A${R} ${R} 0 0 1 ${B[0]} ${B[1]}`; };
const ARCS = [0, 1, 2, 3].map(arc);

export default function PerksWheel({ perks = [] }) {
  const list = perks.slice(0, 4);
  const [k, setK] = useState(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setK(x => (x + 1) % list.length), STEP);
    return () => clearTimeout(t);
  }, [k, r, list.length]);

  const pick = i => { setK(i); setR(x => x + 1); };
  const cur = list[k] || [];
  const label = (i, side) => {
    const p = list[i]; if (!p) return null;
    return (
      <button key={p[1]} type="button" className={`pkw-lbl ${side}${i === k ? ' on' : ''}`} aria-pressed={i === k} onClick={() => pick(i)}>
        <small>0{i + 1}</small><b>{p[1]}</b><i aria-hidden="true" />
      </button>
    );
  };

  return (
    <div className="pkw">
      <div className="pkw-side l">{label(3, 'l')}{label(2, 'l')}</div>
      <div className="pkw-ring">
        <svg viewBox="0 0 460 460" aria-hidden="true">
          <g className="pkw-dash"><circle cx="230" cy="230" r="222" fill="none" stroke="rgba(183,156,255,.22)" strokeDasharray="2 8" /></g>
          <circle cx="230" cy="230" r="150" fill="rgba(16,13,44,.6)" stroke="rgba(183,156,255,.15)" />
          {ARCS.map((d, i) => <path key={i} d={d} fill="none" stroke={i === k ? 'rgba(109,67,231,.35)' : 'rgba(183,156,255,.16)'} strokeWidth="14" strokeLinecap="round" />)}
          <path key={`${k}-${r}`} className="pkw-prog" d={ARCS[k]} fill="none" stroke="url(#pkw-g)" strokeWidth="14" strokeLinecap="round" />
          <defs><linearGradient id="pkw-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#6D43E7" /><stop offset="1" stopColor="#F0ABFC" /></linearGradient></defs>
        </svg>
        <div className="pkw-mid" key={k} aria-live="polite">
          <span className="pkw-ic">{cur[0] && <Icon name={cur[0]} size={26} />}</span>
          <small>0{k + 1} / 0{list.length}</small>
          <h3>{cur[1]}</h3>
          <p>{cur[2]}</p>
        </div>
      </div>
      <div className="pkw-side r">{label(0, 'r')}{label(1, 'r')}</div>
    </div>
  );
}
