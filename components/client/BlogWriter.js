'use client';
import { useEffect, useState } from 'react';

// Blog page hero: a blog editor where a post title types itself out, paragraph lines fill in,
// the post is published and reader badges arrive. Loops through the latest blog titles.
// Reader roles are illustrative.
const FALLBACK = [
  'Content Syndication: The B2B Lead Generation Channel That Scales',
  'Demand Generation: How to Build a Pipeline That Doesn’t Depend on Luck',
  'AI-Powered B2B Demand Generation in 2026: How Buyer Intent Is Changing the Game',
];
const READERS = [['CMO', '#F0ABFC'], ['VP', '#C4B0FF'], ['CTO', '#F0ABFC'], ['DG', '#B79CFF'], ['CRO', '#F5C2FD'], ['HR', '#B79CFF']];
const LINES = ['100%', '94%', '97%', '70%', '88%'];
const STEP = 55;   // ms per typed character / tick
const HOLD = 60;   // ticks to hold after typing (publish + readers)

const catOf = t => /intent/i.test(t) ? 'Buyer intent' : /syndication/i.test(t) ? 'Content syndication' : /demand/i.test(t) ? 'Demand generation' : 'Insights';

export default function BlogWriter({ titles = [] }) {
  const clean = titles.filter(Boolean);
  const list = clean.length ? clean : FALLBACK;
  const key = list.join('|');
  const [st, setSt] = useState({ k: 0, n: 0 });
  const { k, n } = st;

  useEffect(() => {
    const L = key.split('|');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setInterval(() => {
      setSt(({ k: ck, n: cn }) => {
        const full = L[ck % L.length].length;
        if (cn > full + HOLD) return { k: (ck + 1) % L.length, n: 0 };
        return { k: ck, n: reduce && cn < full ? full + 13 : cn + 1 };
      });
    }, STEP);
    return () => clearInterval(t);
  }, [key]);

  const title = list[k % list.length];
  const full = title.length;
  const done = n >= full, pub = n > full + 12;
  const shown = pub ? Math.min(READERS.length, Math.floor((n - full - 12) / 6) + 1) : 0;

  return (
    <div className="bwr" aria-hidden="true">
      <div className="bwr-ed">
        <div className="bwr-bar">
          <span className="bwr-dots"><i /><i /><i /></span>
          <span className="bwr-name">SalesGarners · Blog editor</span>
          <span className={`bwr-pub${pub ? ' live' : ''}`}>{pub ? '✓ Published' : done ? 'Publishing…' : 'Draft'}</span>
        </div>
        <div className="bwr-body">
          <span className="bwr-cat">{catOf(title)}</span>
          <b className="bwr-title">{title.slice(0, n)}<span className={`bwr-caret${done ? ' off' : ''}`} /></b>
          {done && LINES.map((w, i) => <span key={`${k}-${i}`} className="bwr-line" style={{ width: w, animationDelay: `${i * 0.12}s` }} />)}
        </div>
      </div>
      <div className="bwr-readers">
        <span className="bwr-rl"><b className={pub ? 'on' : ''}>{pub ? '● Live · readers arriving' : 'Waiting to publish'}</b><small>B2B tech teams reading now</small></span>
        <span className="bwr-av">{READERS.slice(0, shown).map(([i, c]) => <i key={`${k}-${i}`} style={{ background: c }}>{i}</i>)}</span>
      </div>
    </div>
  );
}
