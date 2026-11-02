'use client';
import { useEffect, useState } from 'react';

// Case Study hero: the 4 case studies as file folders. Each folder shows the client, title,
// services, a short brief and a RESULT stamp. Auto-advances every 5s; tabs are clickable.
const CASES = [
  { slug: 'abm-partner', tab: 'ABM', client: 'ABM Partner', title: 'Building Trust Through Transparency: Our ABM Partner’s Success with SalesGarners and X-Engage', svc: ['Content Syndication', 'X-Engage'], brief: 'An ABM partner needed leads they could stand behind, with every touch visible in X-Engage.', big: 'Trust', sub: 'built on transparency' },
  { slug: 'converting-interest-to-action', tab: 'SAP', client: 'SAP', title: 'Converting Interest to Action: Multi-Touch MQL Campaign for SAP', svc: ['Content', 'Outreach', 'Conversations'], brief: 'One campaign combining content, outreach and conversations to move interested buyers to MQL.', big: 'MQLs', sub: 'multi-touch campaign' },
  { slug: 'empowering-our-demand-platform-partner', tab: 'Platform', client: 'Demand Platform Partner', title: 'Empowering our Demand Platform Partner to Secure Enterprise Budgets', svc: ['SalesGarners', 'X-Engage'], brief: 'A demand platform partner used SalesGarners and X-Engage to win enterprise-level budgets.', big: 'Enterprise', sub: 'budgets secured' },
  { slug: 'high-intent-content-syndication-at-scale', tab: 'Cyber', client: 'Global Cybersecurity Firm', title: 'Driving 4,000 Qualified Leads for a Global Cybersecurity Firm', svc: ['Content Syndication', 'High intent', 'At scale'], brief: 'High-intent content syndication at scale for a global cybersecurity firm.', big: '4,000', sub: 'qualified leads' },
];
const STEP = 5000;

export default function CaseFolders({ cases = [] }) {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setK(c => (c + 1) % CASES.length), STEP);
    return () => clearTimeout(t);
  }, [k, tick]);

  const pick = i => { setK(i); setTick(x => x + 1); };
  const c = CASES[k];
  const real = cases.find(x => x.slug === c.slug);
  const href = (real && real.external_url) || `/case-study/${c.slug}`;

  return (
    <div className="csf" aria-label="Case studies">
      <div className="csf-tabs" role="tablist" aria-label="Case files">
        {CASES.map((x, i) => (
          <button key={x.slug} type="button" role="tab" aria-selected={i === k} className={`csf-tab${i === k ? ' on' : ''}`} onClick={() => pick(i)}>
            <span>0{i + 1}</span> {x.tab}
          </button>
        ))}
      </div>
      <span className="csf-back b2" aria-hidden="true" />
      <span className="csf-back b1" aria-hidden="true" />
      <div className="csf-file" key={k} role="tabpanel">
        <span className="csf-meta"><span>CASE FILE 0{k + 1} / 0{CASES.length}</span><span>CLIENT: {c.client}</span></span>
        <b className="csf-title">{c.title}</b>
        <span className="csf-svc">{c.svc.map(s => <span key={s}>{s}</span>)}</span>
        <span className="csf-rule" aria-hidden="true" />
        <span className="csf-brief"><small>THE BRIEF</small>{c.brief}</span>
        <div className="csf-foot">
          <a href={href} className="csf-link">Read the case study →</a>
          <span className="csf-stamp"><small>RESULT</small><b>{c.big}</b><em>{c.sub}</em></span>
        </div>
      </div>
      <span className="csf-exp"><small>EXPERIENCE</small><b>7+ years</b></span>
    </div>
  );
}
