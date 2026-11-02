'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// About page "Who We Are?": centred heading and paragraph between two big counting numbers
// (100+ clients, 1.5M+ leads) and a row of our services underneath.
const SERVICES = [
  ['Demand Generation', null],
  ['Lead Generation', '/lead-generation'],
  ['Content Syndication', '/b2b-content-syndication'],
  ['Event-Based Lead Gen', '/event-based-lead-generation'],
  ['Outbound Sales Program', '/outbound-sales'],
  ['Data Services', '/data-services'],
  ['X-Engage', '/x-engage'],
];
const fmtLeads = m => (m >= 1.5 ? '1.5M' : m >= 0.1 ? `${m.toFixed(1)}M` : `${Math.round(m * 1000)}K`);

export default function WhoWeAre() {
  const box = useRef(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setP(1); return; }
    let iv;
    const run = () => {
      const start = Date.now();
      iv = setInterval(() => { const x = Math.min(1, (Date.now() - start) / 1800); setP(x); if (x >= 1) clearInterval(iv); }, 30);
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.3 });
    if (box.current) io.observe(box.current);
    return () => { io.disconnect(); clearInterval(iv); };
  }, []);

  const e = 1 - Math.pow(1 - p, 3);

  return (
    <div className="wwa" ref={box}>
      <div className="wwa-head">
        <span className="eyebrow">Who we are</span>
        <h2 className="h2">Who We Are?</h2>
      </div>
      <div className="wwa-row">
        <div className="wwa-stat l">
          <b aria-label="100+">{Math.round(e * 100)}+</b>
          <span><i aria-hidden="true" />Clients Served</span>
        </div>
        <div className="wwa-mid">
          <span className="wwa-line" aria-hidden="true"><i /></span>
          <p>SalesGarners helps B2B businesses grow faster by aligning sales and marketing through data driven strategies. With services like <strong>demand generation</strong> and our <strong className="x">X-Engage platform</strong>, we turn high intent leads into real results backed by a team that blends experience with fresh ideas.</p>
          <span className="wwa-line" aria-hidden="true"><i className="d" /></span>
        </div>
        <div className="wwa-stat r">
          <b aria-label="1.5M+">{fmtLeads(e * 1.5)}+</b>
          <span>Leads delivered<i aria-hidden="true" /></span>
        </div>
      </div>
      <div className="wwa-svc">
        <small>OUR SERVICES</small>
        <ul>
          {SERVICES.map(([t, href]) => <li key={t}>{href ? <Link href={href}>{t}</Link> : <span>{t}</span>}</li>)}
        </ul>
      </div>
    </div>
  );
}
