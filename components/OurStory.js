import { Poppins } from 'next/font/google';
import { YEARS, SHOW_WEBSITE_REFRESH, STORY_PUBS, STORY_PHOTOS, STORY_REELS, STORY_INTRO, STORY_CATS } from '@/lib/ourStory';
import OurStoryClient from './client/OurStoryClient';
import './our-story.css';

// "Our Story: From a Vision to a Growing B2B Ecosystem" (About page).
// Self-contained: every class starts with .sgos, the font is scoped, and content lives in lib/ourStory.js.
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--sgos-font' });

const I = {
  heart: <path d="M12 20.5s-7.5-4.6-7.5-11A4.3 4.3 0 0 1 12 6.8a4.3 4.3 0 0 1 7.5 2.7c0 6.4-7.5 11-7.5 11z" />,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></>,
  pulse: <path d="M3 12h4l3-7 4 14 3-7h4" />,
  photo: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 8" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14.7-4.3L3 9" /><path d="M3 4v5h5" /><path d="M4 13a8 8 0 0 0 14.7 4.3L21 15" /><path d="M21 20v-5h-5" /></>,
  signal: <><path d="M4 20v-4M9 20v-8M14 20V8M19 20V4" /></>,
  team: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M16 14.2c2.8.3 5 2.6 5 5.8" /></>,
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  out: <><path d="M7 17L17 7" /><path d="M8 7h9v9" /></>,
};
const Svg = ({ n, size = 24, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...r}>{I[n]}</svg>
);

const Year = ({ y }) => (y
  ? <span className="sgos-chip">{y}</span>
  : <span className="sgos-chip sgos-chip--tbc" title="Placeholder: add the verified year in lib/ourStory.js">Year TBC</span>);

const Media = ({ src, alt, label, className = '' }) => (src
  ? <img className={`sgos-img ${className}`} src={src} alt={alt || ''} loading="lazy" decoding="async" />
  : <div className={`sgos-ph ${className}`} role="img" aria-label={`Photo placeholder: ${label}`}><Svg n="photo" size={30} /><span>{label}</span></div>);

const PubLogo = ({ p, size = 56 }) => (
  <img className="sgos-logo" src={`/publications/${p.slug}-mark-full-color.svg`} alt={`${p.name} logo`} width={size} height={size} loading="lazy" decoding="async" />
);

function milestones() {
  const list = [
    { id: 'begin', y: '2019', icon: 'flag', title: 'Company beginnings',
      text: 'SalesGarners Marketing Pvt. Ltd. was incorporated in Pune on 6 August 2019, with a simple ambition: help businesses find the right opportunities and reach the right audiences.',
      more: '[Add the founding story here: who started SalesGarners, the first office, the first campaign or client win.]' },
    { id: 'site', y: YEARS.websiteLaunch, icon: 'globe', title: 'Our website goes live',
      text: 'salesgarners.com launches, giving our services, our thinking and our story a home online.',
      more: '[Add what the first website offered and how clients first found us.]' },
  ];
  if (SHOW_WEBSITE_REFRESH) list.push({ id: 'refresh', y: YEARS.websiteRefresh, icon: 'refresh', title: 'A new website for a bigger offer',
    text: 'A refreshed website brings our services, publications and X-Engage together in one place.',
    more: '[Add the date and what changed in the redesign. Remove this milestone in lib/ourStory.js if it does not apply.]' });
  STORY_PUBS.forEach(p => list.push({ id: p.slug, y: YEARS.pubs[p.slug], pub: p, title: `${p.name} launches`, text: p.text, compact: true }));
  list.push({ id: 'xengage', y: YEARS.xengage, icon: 'signal', title: 'X-Engage: engagement you can see',
    text: 'We built X-Engage to capture every interaction with shared content at an individual contact level, so teams can see who is engaging, what they consume and when they are ready to convert.',
    more: '[Add when X-Engage was first used with clients and the problem it was built to solve.]', link: ['/x-engage', 'Explore X-Engage'] });
  list.push({ id: 'today', y: 'Today', icon: 'team', title: 'People, content, data and technology',
    text: 'From our office at Nyati Enthral in Kharadi, Pune, our team serves clients across North America, EMEA, APAC, LATAM and ANZ, and keeps building what comes next.',
    more: '[Add a line about the team today: size, roles or a recent milestone you are proud of.]' });
  return list;
}

// parts: which blocks to render. About uses intro/pillars/closing; Culture & Careers uses culture.
const ALL = ['intro', 'jump', 'pillars', 'milestones', 'culture', 'closing'];

export default function OurStory({ parts = ALL, dark = false }) {
  const has = p => parts.includes(p);
  const ms = milestones();
  const reels = STORY_REELS;
  return (
    <section id={has('intro') ? 'our-story' : 'culture'} className={`sgos${dark ? ' sgos--dark' : ''} ${poppins.variable}`} aria-labelledby={has('intro') ? 'sgos-title' : 'sgos-culture-title'}>
      {/* A. Story introduction */}
      {has('intro') && (<>
      <div className="sgos-wrap sgos-intro">
        <div className="sgos-intro__copy" data-sgos-reveal="">
          <p className="sgos-eyebrow">Our Journey</p>
          <h2 id="sgos-title" className="sgos-h1">Every Big Journey Starts With a Simple Idea.</h2>
          <p>At SalesGarners, we believe business growth starts with meaningful connections. We began with a simple ambition: help businesses find the right opportunities, reach the right audiences, and turn conversations into growth.</p>
          <p>As B2B marketing evolved, so did we. We expanded our capabilities across lead generation, demand generation, and data-driven engagement. We also built our publishing network to bring technology stories, insights, and industry conversations to a wider audience.</p>
          <p>Our journey is about more than campaigns and conversions. It’s about the people behind every idea, the teamwork behind every milestone, and the curiosity that keeps us moving forward.</p>
          <p>Today, we continue to combine people, content, data, and technology to help businesses grow with purpose.</p>
          <blockquote className="sgos-quote">We don’t just build pipelines. We build connections, capabilities, and a culture that grows together.</blockquote>
        </div>
        <div className="sgos-collage" data-sgos-reveal="">
          <Media className="sgos-collage__team" src={STORY_INTRO.team.src} alt={STORY_INTRO.team.alt} label="Team photograph (landscape, 1600 × 1100)" />
          <Media className="sgos-collage__moment" src={STORY_INTRO.moment.src} alt={STORY_INTRO.moment.alt} label="Office moment" />
          <div className="sgos-glass"><b>Since 2019</b><span>Pune, India</span></div>
        </div>
      </div>
      </>)}

      {/* In-section index (jump links) */}
      {has('jump') && (<>
      <div className="sgos-wrap">
        <nav className="sgos-jump" aria-label="Our story sections">
          {[['#sgos-pillars', 'Why, what & how'], ['#sgos-milestones', 'Milestones'], ['#sgos-culture', 'Culture & people']].map(([h, l]) => <a key={h} href={h}>{l}</a>)}
        </nav>
      </div>
      </>)}

      {/* B. Why / What / How */}
      {has('pillars') && (<>
      <div className="sgos-wrap" id="sgos-pillars">
        <ul className="sgos-pillars" role="list" aria-label="Why, what and how">
          <li className="sgos-pillar" data-sgos-reveal=""><span className="sgos-pillar__ic"><Svg n="heart" /></span><h3 className="sgos-label">Why we do it</h3><p>Help businesses find meaningful opportunities and build stronger connections with their audiences.</p></li>
          <li className="sgos-pillar sgos-pillar--accent" data-sgos-reveal=""><span className="sgos-pillar__ic"><Svg n="grid" /></span><h3 className="sgos-label">What we do</h3><p>B2B lead generation, demand generation, content syndication, data services, publishing, and X-Engage.</p></li>
          <li className="sgos-pillar" data-sgos-reveal=""><span className="sgos-pillar__ic"><Svg n="pulse" /></span><h3 className="sgos-label">How we do it</h3><p>Combine data-driven targeting, relevant content, audience engagement, and lead qualification to help businesses reach their goals.</p></li>
        </ul>
      </div>
      </>)}

      {/* C. Timeline */}
      {has('milestones') && (<>
      <div className="sgos-band" id="sgos-milestones">
        <div className="sgos-wrap sgos-tl-grid">
          <div className="sgos-tl-aside" data-sgos-reveal="">
            <p className="sgos-eyebrow">Milestones</p>
            <h3 className="sgos-h2">How we’ve grown, one step at a time.</h3>
            <p>From a newly incorporated company in 2019 to six publications and our own engagement platform. Open any milestone to read more.</p>
          </div>
          <ol className="sgos-tl">
            {ms.map(m => (
              <li key={m.id} className={`sgos-tl__item ${m.compact ? 'is-compact' : ''}`} data-sgos-reveal="">
                <span className="sgos-tl__dot" aria-hidden="true" />
                <article className="sgos-tl__card">
                  <div className="sgos-tl__head">
                    {m.pub ? <PubLogo p={m.pub} /> : <span className="sgos-tl__ic"><Svg n={m.icon} /></span>}
                    <div><Year y={m.y} /><h4 className="sgos-tl__title">{m.title}</h4></div>
                  </div>
                  <p>{m.text}</p>
                  {m.more && (
                    <details className="sgos-more">
                      <summary>Read our story</summary>
                      <p>{m.more}</p>
                    </details>
                  )}
                  {m.link && <a className="sgos-link" href={m.link[0]}>{m.link[1]} <Svg n="arrow" size={16} /></a>}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
      </>)}

      {/* E. Culture and people */}
      {has('culture') && (<>
      <div className="sgos-wrap sgos-culture" id="sgos-culture">
        <div className="sgos-head sgos-head--center" data-sgos-reveal="">
          <p className="sgos-eyebrow">Our Culture &amp; People</p>
          <h3 id="sgos-culture-title" className="sgos-h2">Behind Every Milestone, There’s a Team.</h3>
          <p>Festivals, traditional days, outings and Fun Fridays: the moments that make SalesGarners feel like SalesGarners.</p>
        </div>
        <div className="sgos-filters" role="group" aria-label="Filter the gallery">
          {STORY_CATS.map(([k, l], i) => <button key={k} type="button" data-sgos-filter={k} aria-pressed={i === 0 ? 'true' : 'false'}>{l}</button>)}
        </div>
        <p className="sgos-sr" aria-live="polite" data-sgos-status="" />
        <ul className="sgos-wall" role="list">
          {reels.slice(0, 1).map(r => (
            <li key={r.label} className="sgos-tile sgos-tile--tall" data-sgos-cat={r.cat}>
              <button type="button" className="sgos-video" data-sgos-video={r.url || ''} data-sgos-label={r.label}>
                {r.poster && <img src={r.poster} alt="" loading="lazy" decoding="async" />}
                <span className="sgos-video__play"><Svg n="play" size={26} /></span>
                <span className="sgos-video__label"><b>{r.label}</b><small>{r.url ? 'Play video' : 'Video placeholder: add a Reel link'}</small></span>
              </button>
            </li>
          ))}
          {STORY_PHOTOS.map((p, i) => (
            <li key={i} className={`sgos-tile ${p.size ? `sgos-tile--${p.size}` : ''}`} data-sgos-cat={p.cat}>
              <figure>
                <Media src={p.src} alt={p.alt} label={p.label} />
                <figcaption>{p.label}</figcaption>
              </figure>
            </li>
          ))}
          {reels.slice(1).map(r => (
            <li key={r.label} className="sgos-tile" data-sgos-cat={r.cat}>
              <button type="button" className="sgos-video sgos-video--small" data-sgos-video={r.url || ''} data-sgos-label={r.label}>
                {r.poster && <img src={r.poster} alt="" loading="lazy" decoding="async" />}
                <span className="sgos-video__play"><Svg n="play" size={22} /></span>
                <span className="sgos-video__label"><b>{r.label}</b><small>{r.url ? 'Play video' : 'Video placeholder'}</small></span>
              </button>
            </li>
          ))}
        </ul>
        <p className="sgos-follow"><a className="sgos-link" href="https://www.instagram.com/salesgarners/" target="_blank" rel="noopener noreferrer">See more on Instagram @salesgarners <Svg n="out" size={16} /><span className="sgos-sr"> (opens in a new tab)</span></a></p>
      </div>
      </>)}

      {/* F. Closing */}
      {has('closing') && (<>
      <div className="sgos-wrap">
        <div className="sgos-close" data-sgos-reveal="">
          <div>
            <h3 className="sgos-h2">The Best Part of Our Story Is What’s Next.</h3>
            <p>We’re continuing to learn, innovate, and build meaningful connections. And we’re excited about what we can create together.</p>
          </div>
          <a className="sgos-btn" href="/contact-us">Get to Know SalesGarners <Svg n="arrow" size={18} /></a>
        </div>
      </div>
      </>)}

      <dialog className="sgos-dialog" aria-labelledby="sgos-dtitle">
        <div className="sgos-dialog__bar"><b id="sgos-dtitle" data-sgos-dtitle="">Video</b><button type="button" data-sgos-close="" aria-label="Close video">✕</button></div>
        <div className="sgos-dialog__frame" data-sgos-frame="" />
        <p className="sgos-dialog__empty" data-sgos-empty="" hidden>This is a placeholder. Add an Instagram Reel or YouTube link in lib/ourStory.js and it will play here.</p>
      </dialog>
      <OurStoryClient />
    </section>
  );
}
