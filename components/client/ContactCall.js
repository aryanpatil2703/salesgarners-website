'use client';
import { useEffect, useState } from 'react';

// Contact hero: a live call card. Someone calls, asks about leads, careers or services, our team
// replies and a next step appears. Fast cycle: one topic every ~2s. Topic tabs are clickable.
const CALLS = [
  { tab: 'Leads', who: 'B2B tech marketer', q: 'We need more qualified leads for next quarter. Can you help?', a: 'Yes. Let’s map your ideal buyers and plan content syndication and intent-based lead generation.', next: 'A plan to grow your pipeline', cta: 'Free pilot', href: '/pilot-campaign' },
  { tab: 'Careers', who: 'Job seeker', q: 'I’d love to work at SalesGarners. How do I apply?', a: 'Great to hear. See our open roles in Pune, or send us your CV and we’ll reach out.', next: 'Apply for an open role', cta: 'Open roles', href: '/careers#open-roles' },
  { tab: 'Services', who: 'Existing client', q: 'We also need clean data and an outbound program.', a: 'We can help with Data Services and our Outbound Sales Program. We’ll share a plan.', next: 'Talk to a strategist', cta: 'Book a demo', href: 'https://calendly.com/salesgarners' },
];
const TICK = 300; // ms per step
const LAST = 6;   // steps 0..6 -> ~2.1s per call
const BARS = Array.from({ length: 12 }, (_, i) => (0.5 + (i % 4) * 0.12).toFixed(2));

export default function ContactCall() {
  const [st, setSt] = useState({ k: 0, n: 0, r: 0 });
  const { k, n } = st;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setInterval(() => {
      setSt(s => (reduce ? { ...s, k: (s.k + 1) % CALLS.length, n: LAST } : s.n >= LAST ? { ...s, k: (s.k + 1) % CALLS.length, n: 0 } : { ...s, n: s.n + 1 }));
    }, reduce ? 4000 : TICK);
    return () => clearInterval(t);
  }, [st.r]);

  const pick = i => setSt(s => ({ k: i, n: 0, r: s.r + 1 }));
  const c = CALLS[k];
  const live = n >= 1;
  const ext = c.href.startsWith('http');

  return (
    <div className="ccl">
      <div className="ccl-tabs" role="tablist" aria-label="What the call is about">
        {CALLS.map((x, i) => (
          <button key={x.tab} type="button" role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => pick(i)}>{x.tab}</button>
        ))}
      </div>
      <div className="ccl-card">
        <div className="ccl-top">
          <span className={`ccl-ph${live ? ' live' : ''}`} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B0A22" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
          </span>
          <span className="ccl-who"><b>{c.who}</b><small className={live ? 'live' : ''}>{live ? 'CONNECTED' : 'INCOMING CALL…'}</small></span>
          <span className={`ccl-wave${live ? ' live' : ''}`} aria-hidden="true">{BARS.map((d, i) => <i key={i} style={{ animationDuration: `${d}s` }} />)}</span>
        </div>
        <div className="ccl-body" key={`${k}-${st.r}`} aria-live="polite">
          {n >= 1 && <div className="ccl-msg them"><small>{c.who}</small><span>{c.q}</span></div>}
          {n === 2 && <div className="ccl-typing" aria-label="Typing"><i /><i /><i /></div>}
          {n >= 3 && <div className="ccl-msg us"><small>SalesGarners team</small><span>{c.a}</span></div>}
          {n >= 4 && (
            <a className="ccl-next" href={c.href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span><small>✓ NEXT STEP</small><b>{c.next}</b></span><em>{c.cta} →</em>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
