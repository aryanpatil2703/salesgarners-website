'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// About page "Our Journey": the story on the left, a glowing journey road on the right.
// Steps advance every 3s; any step can be clicked (auto-play restarts from it).
const STEPS = [
  ['2019', 'Company beginnings', 'SalesGarners Marketing Pvt. Ltd. was incorporated in Pune on 6 August 2019, with a simple ambition: help businesses find the right opportunities and reach the right audiences.', 'Started with 20 people'],
  ['Growth', 'Growing our capabilities', 'We expanded across lead generation, demand generation and data-driven engagement as B2B marketing evolved.'],
  ['Publishing', 'Six B2B publications', 'TechMediaGlobal, MarTech360Hub, FinTech360Hub, HRTech360Hub, SalesTech360Hub and Startup360Hub bring technology stories to a wider audience.'],
  ['Platform', 'X-Engage', 'Our own platform captures every interaction with shared content at an individual contact level, so teams see who is ready to convert.'],
  ['Today', 'People, content, data and technology', 'From Nyati Enthral in Kharadi, Pune, our team serves clients across North America, EMEA, APAC, LATAM and ANZ.', '100+ people today'],
];
const STEP = 3000;

function Photo({ p, label }) {
  return p && p.src
    ? <img src={p.src} alt={p.alt || ''} loading="lazy" decoding="async" />
    : <span className="jrd-ph" role="img" aria-label={`Photo placeholder: ${label}`}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 8" /></svg>{label}</span>;
}

export default function JourneyRoad({ oldOffice, newOffice }) {
  const [k, setK] = useState(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setK(x => (x + 1) % STEPS.length), STEP);
    return () => clearTimeout(t);
  }, [k, r]);

  const road = useRef(null);
  const [fill, setFill] = useState(0);
  // Fill the rail exactly to the centre of the active step's dot (steps change height when opened).
  useLayoutEffect(() => {
    const measure = () => {
      const el = road.current; if (!el) return;
      const rail = el.querySelector('.jrd-rail'), dot = el.querySelectorAll('.jrd-dot')[k];
      if (!rail || !dot) return;
      const a = rail.getBoundingClientRect(), b = dot.getBoundingClientRect();
      const z = parseFloat(getComputedStyle(document.documentElement).zoom) || 1; // page zoom on small laptops
      setFill(Math.max(0, (b.top + b.height / 2 - a.top) / z));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [k]);

  const pick = i => { setK(i); setR(x => x + 1); };

  // Team growth counter (20 -> 100+) runs once when the Then / Now strip scrolls into view.
  const strip = useRef(null);
  const [team, setTeam] = useState(20);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTeam(100); return; }
    let iv;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = Date.now();
      iv = setInterval(() => { const x = Math.min(1, (Date.now() - start) / 1600); setTeam(Math.round(20 + 80 * (1 - Math.pow(1 - x, 3)))); if (x >= 1) clearInterval(iv); }, 30);
    }, { threshold: 0.3 });
    if (strip.current) io.observe(strip.current);
    return () => { io.disconnect(); clearInterval(iv); };
  }, []);

  return (
    <div className="jrd">
      <div className="jrd-copy">
        <span className="eyebrow">Our Journey</span>
        <h2 className="h2">Every Big Journey Starts With a Simple Idea.</h2>
        <p>At SalesGarners, we believe business growth starts with meaningful connections. We began with a simple ambition: help businesses find the right opportunities, reach the right audiences, and turn conversations into growth.</p>
        <p>As B2B marketing evolved, so did we. We expanded our capabilities across lead generation, demand generation, and data-driven engagement. We also built our publishing network to bring technology stories, insights, and industry conversations to a wider audience.</p>
        <p>Our journey is about more than campaigns and conversions. It’s about the people behind every idea, the teamwork behind every milestone, and the curiosity that keeps us moving forward.</p>
        <p>Today, we continue to combine people, content, data, and technology to help businesses grow with purpose.</p>
        <blockquote>We don’t just build pipelines. We build connections, capabilities, and a culture that grows together.</blockquote>
      </div>
      <div className="jrd-road" ref={road}>
        <span className="jrd-rail" aria-hidden="true"><i style={{ height: fill }} /></span>
        <ol role="tablist" aria-label="The SalesGarners journey">
          {STEPS.map(([y, t, d, tag], i) => (
            <li key={t}>
              <button type="button" role="tab" aria-selected={i === k} className={`jrd-step${i <= k ? ' done' : ''}${i === k ? ' on' : ''}`} onClick={() => pick(i)}>
                <span className="jrd-dot">0{i + 1}</span>
                <span className="jrd-txt">
                  <span className="jrd-head"><small>{y}</small><b>{t}</b></span>
                  {i === k && <span className="jrd-d">{d}{tag && <em>{tag}</em>}</span>}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="jrd-then" ref={strip}>
        <figure className="jrd-frame">
          <Photo p={oldOffice} label="Old office photo" />
          <figcaption><small>THEN · 2019</small><b>Where we started</b><span>20 people</span></figcaption>
        </figure>
        <div className="jrd-grow" role="img" aria-label="Our team grew from 20 to 100+ people">
          <small>OUR TEAM</small>
          <b>{team}{team >= 100 ? '+' : ''}</b>
          <span>people</span>
          <i />
          <em>20 → 100+</em>
        </div>
        <figure className="jrd-frame">
          <Photo p={newOffice} label="New office photo" />
          <figcaption><small>NOW · KHARADI, PUNE</small><b>Where we are today</b><span>100+ people</span></figcaption>
        </figure>
      </div>
    </div>
  );
}
