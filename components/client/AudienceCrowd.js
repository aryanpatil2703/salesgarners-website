'use client';
import { useEffect, useState } from 'react';

// Audience Overview hero: a crowd of 60 readers split across the six SalesGarners audiences.
// Each group lights up in turn (every 5 seconds, looping) with bubbles showing what they read;
// clicking a group shows it and restarts the timer. Reader groups and topics come from the publications.
const GROUPS = [
  { n: 'Tech leaders', readers: 'Technology decision-makers', pub: 'TechMediaGlobal', c: '#9B7BFF', topics: ['Cybersecurity', 'AI', 'Semiconductors'] },
  { n: 'Marketers', readers: 'Marketers and martech teams', pub: 'MarTech360Hub', c: '#E05BEA', topics: ['Marketing tech', 'Data management', 'AI'] },
  { n: 'HR leaders', readers: 'HR leaders and recruiters', pub: 'HRTech360Hub', c: '#F0ABFC', topics: ['Recruitment', 'Payroll', 'AI in HR'] },
  { n: 'Finance', readers: 'Fintech, banking and payments readers', pub: 'FinTech360Hub', c: '#6D43E7', topics: ['Digital payments', 'Banking', 'Fraud & security'] },
  { n: 'Sales leaders', readers: 'Revenue and sales leaders', pub: 'SalesTech360Hub', c: '#BB32C8', topics: ['Revenue operations', 'Lead generation', 'M&A'] },
  { n: 'Founders', readers: 'Founders and investors', pub: 'Startup360Hub', c: '#C4B0FF', topics: ['Funding', 'Deep tech', 'AI'] },
];
const SECTIONS = ['News', 'Interview', 'Guest Column', 'Event', 'Resource'];
const REGIONS = ['NA', 'EMEA', 'APAC', 'LATAM', 'ANZ'];
const COLS = 12, ROWS = 5, N = COLS * ROWS;
const grpOf = i => (i + Math.floor(i / COLS)) % GROUPS.length; // 10 readers per group

export default function AudienceCrowd() {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setK(x => (x + 1) % GROUPS.length), 5000);
    return () => clearInterval(t);
  }, [tick]);

  const g = GROUPS[k];
  const mine = [];
  for (let i = 0; i < N; i++) if (grpOf(i) === k) mine.push(i);
  const bubbles = [0, 1, 2].map(j => {
    const i = mine[(j * 4 + 1) % mine.length];
    const col = i % COLS, row = Math.floor(i / COLS);
    return { key: `${k}-${j}-${tick}`, x: Math.min(Math.max((col + 0.5) / COLS * 100, 16), 84), y: row / ROWS * 100, t: `${SECTIONS[(k + j) % SECTIONS.length]} · ${g.topics[j]}`, d: j * 0.5 };
  });

  return (
    <div className="acr">
      <div className="acr-stage">
        <span className="acr-cap">The B2B decision makers we reach</span>
        <div className="acr-reg" aria-hidden="true">{REGIONS.map(r => <span key={r}>{r}</span>)}</div>
        <div className="acr-grid" aria-hidden="true">
          {Array.from({ length: N }, (_, i) => {
            const on = grpOf(i) === k;
            return (
              <span key={i} className={`acr-p${on ? ' on' : ''}`} style={{ '--pc': on ? g.c : '#3B3760' }}>
                <svg viewBox="0 0 30 34"><circle cx="15" cy="10" r="7" /><path d="M2 34c0-8 6-13 13-13s13 5 13 13z" /></svg>
              </span>
            );
          })}
          {bubbles.map(b => (
            <span key={b.key} className="acr-bub" style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${b.d}s` }}>{b.t}</span>
          ))}
        </div>
      </div>
      <div className="acr-tabs" role="tablist" aria-label="Audience groups">
        {GROUPS.map((x, i) => (
          <button key={x.n} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''}
            onClick={() => { setK(i); setTick(t => t + 1); }}>
            <i style={{ background: x.c }} />{x.n}
          </button>
        ))}
      </div>
      <div key={k} className="acr-bar" aria-live="polite">
        <span><b>{g.readers}</b> read <b>{g.pub}</b></span>
        <small>{g.topics.join(' · ')}</small>
      </div>
    </div>
  );
}
