import { Fragment } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';
import { SG, LINKS, CLIENTS } from '@/lib/content';
import Carousel from './client/Carousel';
import Newsstand from './client/Newsstand';
import RegionMap from './client/RegionMap';
import ParticleShape from './client/ParticleShape';
import CtaShell from '@/components/client/CtaShell';

export const Arrow = () => <span className="ar">→</span>;
export const initials = s => s.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

function SmartLink({ href, className, children, style, ...rest }) {
  const ext = href.startsWith('http');
  if (ext) return <a className={className} style={style} href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
  return <Link className={className} style={style} href={href} {...rest}>{children}</Link>;
}

export const BtnP = ({ children, href = LINKS.demo, className = '' }) => <SmartLink className={`btn p ${className}`} href={href}>{children} <Arrow /></SmartLink>;
export const BtnS = ({ children, href = LINKS.demo, className = '' }) => <SmartLink className={`btn s ${className}`} href={href}>{children} <Arrow /></SmartLink>;
export const BtnW = ({ children, href = LINKS.demo }) => <SmartLink className="btn w mag" href={href}>{children} <Arrow /></SmartLink>;
export { SmartLink };

export function Head({ eb, title, lead, center = true }) {
  return (
    <div className={`head ${center ? 'center' : ''}`} data-r="">
      {eb && <span className="eyebrow">{eb}</span>}
      {title && <h2 className="h2">{title}</h2>}
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

export function PageHero({ eb, title, lead, children, center = false, shape, chip, visual }) {
  const split = !!shape || !!visual;
  return (
    <section className={`phero ${center && !split ? 'c' : ''} ${split ? 'pv' : ''}`}>
      <div className="glow a" /><div className="glow b" />{split && <div className="grid" />}
      <div className={`wrap ${split ? 'pgrid' : ''}`}><div className="in">
        {eb && <span className="eyebrow fadeup">{eb}</span>}
        <h1 className="fadeup" style={{ animationDelay: '.08s' }}>{title}</h1>
        {lead && <p className="lead fadeup" style={{ animationDelay: '.16s' }}>{lead}</p>}
        {children && <div className="btns fadeup" style={{ animationDelay: '.24s' }}>{children}</div>}
      </div>{split && (visual || <ParticleShape shape={shape} chip={chip} />)}</div>
    </section>
  );
}

export function CardsGrid({ items, cols = 3, icons }) {
  return (
    <div className={`g${cols}`}>
      {items.map(([t, d], i) => (
        <article className="card" data-r="" key={t}>
          {icons && <div className="it"><Icon name={icons[i % icons.length]} size={24} /></div>}
          <h3 className="h3">{t}</h3>
          {d && <p>{d}</p>}
        </article>
      ))}
    </div>
  );
}

export function NumberedSteps({ items }) {
  const icons = ['target', 'send', 'activity', 'zap'];
  return (
    <div className="steps"><div className="line"><i /></div>
      <div className="g4">
        {items.map(([t, d], i) => (
          <article className="card step" data-r="" key={t}>
            <div className="top"><div className="it"><Icon name={icons[i % 4]} size={24} /></div><span className="n">{String(i + 1).padStart(2, '0')}</span></div>
            <h3 className="h3">{t}</h3>
            {d && <p>{d}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

// items: [value, suffix, label, note?]
export function StatBand({ items }) {
  return (
    <div className="band" style={{ '--c': items.length }} data-r="">
      {items.map(([n, s, l, p]) => (
        <div key={l}><b><span data-count={n}>{n}</span>{s}</b><span>{l}</span>{p && <p>{p}</p>}</div>
      ))}
    </div>
  );
}

export function Trusted({ title = 'Trusted by Leading Companies, Advertisers, and Agencies Worldwide', text = SG.trustedText }) {
  // Grey logo by default; the official colour logo fades in on hover (tile turns white so dark logos stay readable)
  const half = Math.ceil(CLIENTS.length / 2);
  const rows = [CLIENTS.slice(0, half), CLIENTS.slice(half)];
  const tiles = (list, copy) => list.map(([slug, name, ext]) => (
    <div className="lg" key={`${copy}-${slug}`} aria-hidden={copy ? 'true' : undefined} title={copy ? undefined : name}>
      <img className="lg-g" src={`/clients/${slug}.png`} alt={copy ? '' : name} loading="lazy" decoding="async" />
      <img className="lg-c" src={`/clients/color/${slug}.${ext}`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
    </div>
  ));
  return (
    <section className="logos">
      <div className="wrap stack center" style={{ marginBottom: 36 }} data-r="">
        <h2 className="h3" style={{ fontSize: 'clamp(20px,2.4vw,26px)' }}>{title}</h2>
        {text && <p className="lead" style={{ fontSize: 15.5, maxWidth: 'min(1120px, 100%)', textWrap: 'balance' }}>{text}</p>}
      </div>
      <div className="mask">
        <div className="lrow">{tiles(rows[0], 0)}{tiles(rows[0], 1)}</div>
        <div className="lrow rev">{tiles(rows[1], 0)}{tiles(rows[1], 1)}</div>
      </div>
    </section>
  );
}

export function Testimonials({ items = SG.testimonials, eb = 'Client Feedback', title = 'Hear from our Happy Partners', lead = 'We are always thinking of our customers so that the customer is satisfied with us.', stars = false }) {
  // Continuous right-to-left scroll; pauses on hover/focus. The second copy is hidden from screen readers.
  let base = items;
  while (base.length < 6) base = base.concat(items);
  const card = ([co, ro, q], k, copy) => (
    <article className="card quote" key={`${copy}-${k}`} aria-hidden={copy ? 'true' : undefined}>
      {stars ? <div className="stars">★★★★★</div> : <div className="qm">“</div>}
      <blockquote>{q}</blockquote>
      <div className="who2"><div className="av">{initials(co)}</div><div><b>{co}</b><small>{ro}</small></div></div>
    </article>
  );
  return (
    <section className="sec alt"><div className="wrap">
      <Head eb={eb} title={title} lead={lead || undefined} />
    </div>
      <div className="tmarq" data-r="">
        <div className="tmarq-track" style={{ '--dur': `${base.length * 9}s` }}>
          {base.map((it, k) => card(it, k, false))}
          {base.map((it, k) => card(it, k, true))}
        </div>
      </div>
    </section>
  );
}

const CTA_LABEL = 'Book a Free Strategy Session';
const CTA_STRIP_A = [...SG.services.map(s => s.short), 'X-Engage'];
const CTA_STRIP_B = ['NA', 'EMEA', 'APAC', 'LATAM', 'ANZ', '115M+ contacts', '3X QA checks'];
const Strip = ({ items, kind }) => (
  <div className={`ctx-strip ${kind}`} aria-hidden="true">
    <div className="track">{[0, 1, 2, 3].map(k => items.map((t, i) => <Fragment key={`${k}-${i}`}><span>{t}</span><i>✦</i></Fragment>))}</div>
  </div>
);

export function Cta({ title = 'Looking for growth? We help you as a Partner, not an Agency', text = SG.ctaText, label = CTA_LABEL, href = LINKS.demo, note }) {
  const small = note === undefined ? (label === CTA_LABEL ? 'Free · No sales pitch' : null) : note;
  const unit = `${label.toUpperCase()} ✦ `;
  const ring = unit.repeat(Math.max(1, Math.round(42 / unit.length)));
  return (
    <CtaShell>
      <Strip items={CTA_STRIP_A} kind="a" />
      <div className="wrap ctx-in" data-r="">
        <div className="ctx-copy"><h2>{title}</h2><p>{text}</p></div>
        <div className="ctx-act">
          <SmartLink className="ctx-badge" href={href} aria-label={label}>
            <svg className="ctx-ring" viewBox="0 0 220 220" aria-hidden="true">
              <defs><path id="ctx-ring-path" d="M110,110 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" /></defs>
              <circle cx="110" cy="110" r="108" fill="none" />
              <text textLength="548" lengthAdjust="spacing"><textPath href="#ctx-ring-path">{ring}</textPath></text>
            </svg>
            <span className="ctx-core"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg></span>
          </SmartLink>
          {small && <small>{small}</small>}
        </div>
      </div>
      <Strip items={CTA_STRIP_B} kind="b" />
    </CtaShell>
  );
}

// Illustrated service badge (gradient circle + orbit ring + label chip), used on the home "Our Services" cards.
const BADGE_ICONS = {
  'lead-generation': [<circle key="1" cx="11" cy="13" r="8" />, <circle key="2" cx="11" cy="13" r="4.5" />, <circle key="3" cx="11" cy="13" r="1.3" fill="currentColor" />, <path key="4" d="M12 12l8-8M16 4h4v4" />],
  'b2b-content-syndication': [<path key="1" d="M3 4h8l3 3v13H3z" />, <path key="2" d="M11 4v3h3M6 11h5M6 14h5M6 17h3" />, <path key="3" d="M17.5 9.5a3.5 3.5 0 0 1 0 5M20 7a7 7 0 0 1 0 10" />],
  'event-based-lead-generation': [<rect key="1" x="3" y="5" width="18" height="16" rx="2.5" />, <path key="2" d="M3 10h18M8 3v4M16 3v4" />, <path key="3" fill="currentColor" d="M12 12.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" />],
  'outbound-sales': [<path key="1" d="M4 14v-2a8 8 0 0 1 16 0v2" />, <rect key="2" x="3" y="13" width="4.5" height="7" rx="1.8" />, <rect key="3" x="16.5" y="13" width="4.5" height="7" rx="1.8" />, <path key="4" d="M19 20c0 1.4-1.8 2-4 2h-2" />],
  'data-services': [<ellipse key="1" cx="11" cy="5" rx="7.5" ry="2.8" />, <path key="2" d="M3.5 5v6c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8V5M3.5 11v6c0 1.6 3.4 2.8 7.5 2.8" />, <path key="3" d="M16 18l1.5 1.5 3-3.2" />],
};
const BADGE_CHIPS = { 'lead-generation': 'ICP', 'b2b-content-syndication': 'INTENT', 'event-based-lead-generation': 'LIVE', 'outbound-sales': 'SDR', 'data-services': 'VERIFIED' };
export function ServiceBadge({ slug }) {
  return (
    <div className="sbadge" aria-hidden="true">
      <span className="sbadge-ring" /><i className="sbadge-dot a" /><i className="sbadge-dot b" />
      <span className="sbadge-core">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{BADGE_ICONS[slug]}</svg>
      </span>
      {BADGE_CHIPS[slug] && <span className="sbadge-chip">{BADGE_CHIPS[slug]}</span>}
    </div>
  );
}

export function Publications({ dark = false }) {
  return (
    <section className={`sec light${dark ? ' pubd' : ''}`}><div className="wrap">
      <Head title="Our publications" lead={SG.pubText} />
      <Newsstand publications={SG.publications} />
    </div></section>
  );
}

export function DatabaseSection({ standalone = false }) {
  return (
    <section className={`sec ${standalone ? '' : 'alt'}`}>
      <RegionMap>
        {!standalone && <span className="eyebrow">Global reach</span>}
        <h2 className="h2">Exclusive First Party Contact Database</h2>
        <p className="lead">{SG.dbText}</p>
      </RegionMap>
    </section>
  );
}

export function Compare({ left, right, leftTitle, rightTitle, leftTag, rightTag, leftResult, rightResult }) {
  return (
    <div className="cmp" data-r="">
      <div className="bad">
        <h3>{leftTitle} {leftTag && <span className="note">{leftTag}</span>}</h3>
        <ul>{left.map(t => <li key={t}><span className="x">✕</span>{t}</li>)}</ul>
        {leftResult}
      </div>
      <div className="good">
        <h3>{rightTitle} {rightTag && <span className="note" style={{ color: 'var(--lilac)' }}>{rightTag}</span>}</h3>
        <ul>{right.map(t => <li key={t}><span className="v">✓</span>{t}</li>)}</ul>
        {rightResult}
      </div>
    </div>
  );
}

export function Signals() {
  const rows = [['mail', 'Email opened', 'Asset delivery', '92%', 92], ['download', 'Asset downloaded', 'Whitepaper', 'High', 75], ['mouse', 'Content engaged', 'Scroll depth 85%', 'High', 80], ['clock', 'Time on content', '4m 12s', 'Strong', 70]];
  return (
    <div className="tl" data-signals="" data-r="">
      <div className="th"><span>Engagement signals <small className="note" style={{ display: 'block', fontWeight: 500 }}>Illustrative example</small></span><span className="score">Intent score <span data-score="">92</span></span></div>
      {rows.map(([i, a, b, v, w]) => (
        <div className="sig" key={a}>
          <span className="si"><Icon name={i} size={18} color="#D9CCFF" /></span>
          <div className="tx"><b>{a}</b><small>{b}</small></div>
          <div style={{ display: 'grid', gap: 5, justifyItems: 'end' }}><span className="mono" style={{ fontSize: 12, color: 'var(--mint)', fontWeight: 600 }}>{v}</span><div className="meter" style={{ '--w': w + '%' }}><i /></div></div>
        </div>
      ))}
    </div>
  );
}

export function CaseCards({ cases, reveal = false }) {
  const grads = [['#6D43E7', '#9B7BFF'], ['#BB32C8', '#6D43E7'], ['#9B7BFF', '#6D43E7'], ['#C930B5', '#7C3AED']];
  return cases.map((c, i) => {
    const [a, b] = grads[i % grads.length];
    const href = c.external_url || `/case-study/${c.slug}`;
    return (
      <SmartLink className="card case" href={href} style={{ '--a': a, '--b': b }} key={c.slug} {...(reveal ? { 'data-r': '' } : {})}>
        <div className="cov">{c.cover_image ? <img src={c.cover_image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <b>{String(i + 1).padStart(2, '0')}</b>}</div>
        <div className="body"><span className="tag">CASE STUDY</span><h3>{c.title}</h3><span className="link">Read the case study <Arrow /></span></div>
      </SmartLink>
    );
  });
}

// Headline that rises in word by word; `accent` words get the gradient
export function SplitTitle({ plain, accent, className = 'h1' }) {
  let i = 0;
  const words = (t, cls) => t.split(' ').filter(Boolean).map(w => (
    <Fragment key={`${cls}-${i}`}><span className="w"><span className={cls} style={{ animationDelay: `${0.1 + i++ * 0.06}s` }}>{w}</span></span>{' '}</Fragment>
  ));
  return <h1 className={className}>{words(plain, '')}{words(accent, 'gt')}</h1>;
}
