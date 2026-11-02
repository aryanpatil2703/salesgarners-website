'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// About page: Vision / Mission / Expertise as a "mission control" console with a looping rocket launch.
const TABS = [
  ['Our Vision', 'Where we are headed', 'Vision · Destination'],
  ['Our Mission', 'How we fly every campaign', 'Mission · Flight plan'],
  ['Our Expertise', 'What powers the launch', 'Expertise · Engines'],
];
const COUNT = ['T-3', 'T-2', 'T-1', 'LIFTOFF', 'ASCENDING', 'ASCENDING'];
const STATS = [['7+', 'Years in B2B'], ['100+', 'Clients served'], ['1.5M+', 'Leads delivered'], ['6', 'Own publications']];

const svg = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const ICONS = [
  <svg key="v" {...svg}><path d="M3 13l13-6 2.5 5-13 6z" /><path d="M16 7l3-1.5 2 4-3 1.5" /><path d="M10 16l-3 6M12 15.5l3 6.5" /></svg>,
  <svg key="m" {...svg}><path d="M12 2c4 3 5 8 4 13H8C7 10 8 5 12 2z" /><circle cx="12" cy="9" r="2" /><path d="M8 13l-3 5h3.5M16 13l3 5h-3.5M10.5 18l1.5 4 1.5-4" /></svg>,
  <svg key="e" {...svg}><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></svg>,
];

export default function MissionControl({ services = [] }) {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => (x + 1) % COUNT.length), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mc" data-r="">
      <div className="mc-bar">
        <span>SalesGarners · Mission control</span>
        <span className="mc-go"><i />All systems go</span>
      </div>
      <div className="mc-grid">
        <div className="mc-tabs" role="tablist" aria-label="About SalesGarners">
          {TABS.map(([n, sub], i) => (
            <button key={n} type="button" role="tab" id={`mc-tab-${i}`} aria-controls="mc-panel" aria-selected={i === k}
              className={`mc-tab${i === k ? ' on' : ''}`} onClick={() => setK(i)}>
              <span className="mc-ic">{ICONS[i]}</span>
              <span><b>{n}</b><small>{sub}</small></span>
            </button>
          ))}
        </div>

        <div className="mc-stage" aria-hidden="true">
          <div className={`mc-count${tick >= 3 ? ' hot' : ''}`}>{COUNT[tick]}</div>
          <div className="mc-rocket">
            <svg width="72" height="132" viewBox="0 0 64 120">
              <defs>
                <linearGradient id="mcb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#C9BBF5" /></linearGradient>
                <linearGradient id="mcf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0ABFC" /><stop offset=".5" stopColor="#F0ABFC" /><stop offset="1" stopColor="#BB32C8" stopOpacity="0" /></linearGradient>
              </defs>
              <g className="mc-flame"><path d="M24 80 Q32 122 40 80Z" fill="url(#mcf)" /></g>
              <path d="M32 4 C46 18 50 40 48 70 L16 70 C14 40 18 18 32 4Z" fill="url(#mcb)" />
              <circle cx="32" cy="36" r="8" fill="#6D43E7" stroke="#FFFFFF" strokeWidth="3" />
              <path d="M16 52 L4 78 L16 72Z" fill="#BB32C8" />
              <path d="M48 52 L60 78 L48 72Z" fill="#BB32C8" />
              <path d="M22 70 L42 70 L39 80 L25 80Z" fill="#6D43E7" />
            </svg>
          </div>
          <span className="mc-smoke l" /><span className="mc-smoke r" />
          <div className="mc-pad" />
          <div className="mc-padlabel">Launchpad · your next growth stage</div>
        </div>

        <div className="mc-side">
          <div className="mc-read" id="mc-panel" role="tabpanel" aria-labelledby={`mc-tab-${k}`} aria-live="polite">
            <span className="mc-head">{TABS[k][2]}</span>
            {k === 0 && <p key="v">SalesGarners aspires to be a global leader in Sales and Marketing services, driving measurable growth for businesses across industries. We are committed to empowering our clients by enhancing their marketing &amp; sales funnels and achieving sustainable success.</p>}
            {k === 1 && <p key="m">With a team of dedicated professionals possessing profound expertise and a deep understanding of diverse business landscapes, we design tailored solutions to address each client’s unique needs. Our passion lies in fostering long-term relationships between our clients and their audiences through impactful and seamless digital campaigns.</p>}
            {k === 2 && (
              <div key="e" className="mc-chips">
                {services.map(s => <Link key={s.slug} href={`/${s.slug}`}>{s.short}</Link>)}
                <Link href="/x-engage">X-Engage platform</Link>
              </div>
            )}
          </div>
          <div className="mc-stats">
            {STATS.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
