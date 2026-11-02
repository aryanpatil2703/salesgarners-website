'use client';
import { useEffect, useRef, useState } from 'react';

// Lead Generation hero: leads drop into the qualifying funnel, flow down the pipe and fill "Your pipeline" toward a monthly goal.
// Drawn on a fixed 560x560 stage that scales to fit its column. Counts are illustrative.
const GOALS = [50, 100, 200];
const COLS = ['#F0ABFC', '#C4B0FF', '#B79CFF', '#F0ABFC', '#F5C2FD'];
const ROLES = ['Director of IT', 'VP Marketing', 'Head of HR', 'CFO', 'CTO'];
const XS = [40, 90, 140, 190, 240, 65, 115, 165, 215, 260];

export default function PipelineTank() {
  const wrap = useRef(null);
  const [scale, setScale] = useState(1);
  const [gi, setGi] = useState(1);
  const [have, setHave] = useState(0);
  const goal = GOALS[gi];

  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const fit = () => setScale(Math.min(1, el.clientWidth / 560));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const step = Math.max(1, Math.round(goal / 40));
    const t = setInterval(() => setHave(h => (h + step >= goal ? 0 : h + step)), 700);
    return () => clearInterval(t);
  }, [goal]);

  return (
    <div className="ptk" ref={wrap} style={{ height: 560 * scale }}>
      <div className="ptk-stage" style={{ transform: `scale(${scale})` }}>
        <span className="ptk-label">Leads from every channel ↓</span>
        <svg className="ptk-funnel" width="300" height="330" viewBox="0 0 300 330" aria-hidden="true">
          <defs><linearGradient id="ptk-fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(183,156,255,0.28)" /><stop offset="1" stopColor="rgba(187,50,200,0.45)" /></linearGradient></defs>
          <path d="M20 70 L280 70 L175 230 L175 300 L125 300 L125 230 Z" fill="url(#ptk-fg)" stroke="#B79CFF" strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="150" cy="70" rx="130" ry="14" fill="rgba(109,67,231,0.25)" stroke="#B79CFF" strokeWidth="2" />
          <text x="150" y="150" textAnchor="middle" fill="#F4F3FF" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="1.5">QUALIFY</text>
          <text x="150" y="168" textAnchor="middle" fill="#D9CCFF" fontFamily="JetBrains Mono, monospace" fontSize="9.5" letterSpacing="1">ICP · INTENT · HUMAN QA</text>
        </svg>
        {XS.map((x, i) => (
          <span key={i} className="ptk-drop" aria-hidden="true"
            style={{ background: COLS[i % 5], boxShadow: `0 0 10px ${COLS[i % 5]}`, offsetPath: `path('M${x} 20 C ${x} 110, 150 190, 150 330')`, animationDelay: `${(i * 0.26).toFixed(2)}s` }} />
        ))}
        <div className="ptk-pipe-v" aria-hidden="true" />
        <div className="ptk-pipe-h" aria-hidden="true" />
        <div className="ptk-tank">
          <div className="ptk-liquid" style={{ height: `${Math.round((have / goal) * 100)}%` }}><span /></div>
          <div className="ptk-read" aria-live="polite"><small>Your pipeline</small><b>{have}</b><span>of {goal} SQLs</span></div>
        </div>
        <div key={have} className="ptk-toast" aria-hidden="true">+1 human-verified · {ROLES[have % 5]}</div>
        <div className="ptk-goals" role="group" aria-label="Monthly SQL goal">
          <small>Monthly goal</small>
          {GOALS.map((g, i) => (
            <button key={g} type="button" className={i === gi ? 'on' : ''} aria-pressed={i === gi} onClick={() => { setGi(i); setHave(0); }}>{g} SQLs</button>
          ))}

        </div>
      </div>
    </div>
  );
}
