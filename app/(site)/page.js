import Link from 'next/link';
import { Icon } from '@/components/Icon';
import SignalFunnel from '@/components/client/SignalFunnel';
import Carousel from '@/components/client/Carousel';
import { SG } from '@/lib/content';
import { getCases } from '@/lib/data';
import { Arrow, BtnP, BtnS, CaseCards, ServiceBadge, Cta, DatabaseSection, Head, Publications, Signals, SplitTitle, StatBand, Testimonials, Trusted } from '@/components/ui';
import DemandLedger from '@/components/client/DemandLedger';

export const revalidate = 300;

export default async function Home() {
  const cases = await getCases();
  return (
    <>
      <section className="hero">
        <div className="grid" /><div className="glow a" /><div className="glow b" />
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="eyebrow fadeup">Stop Guessing. Start Connecting.</span>
            <SplitTitle plain="Accelerate Pipeline Growth with" accent="High‑Quality Intent Leads" />
            <p className="lead fadeup" style={{ animationDelay: '.55s' }}>We help B2B tech companies shift from outdated lead generation tactics to modern, intent-based demand generation, fueling pipeline growth with highly engaged leads, greater ROI, and reduced acquisition costs</p>
            <div className="btns fadeup" style={{ animationDelay: '.7s' }}><BtnP href="#services">Learn More</BtnP><BtnS>Book a Demo</BtnS></div>
            <div className="hstats fadeup" style={{ animationDelay: '.85s' }}>
              <div><b>7+</b><span>Years of experience</span></div><div><b>1.5M+</b><span>Leads delivered</span></div><div><b>6</b><span>Owned publications</span></div>
            </div>
          </div>
          <SignalFunnel />
        </div>
      </section>

      <Trusted />

      <section className="sec alt"><div className="wrap">
        <DemandLedger eb="Here's how we approach demand generation" title="Our Proven Demand Generation Approach Delivers Buyers Who Engage, Convert, and Grow Your Business" items={['Utilize Our First-Party Data', 'Intent-Based, Multi-Channel Outreach', 'Smart Engagement Insights', 'Deliver High-Quality Leads (MQLs)']} />
      </div></section>

      <section className="sec"><div className="wrap split">
        <div className="stack" data-r="">
          <span className="eyebrow">We have 7+ years of experience</span>
          <h2 className="h2">Why Intent-Based Demand Generation?</h2>
          <p className="lead">Stop chasing uninterested leads. Our approach identifies prospects actively looking for solutions you offer, then reaches them through content syndication, lead generation, events and outbound, so every touchpoint builds pipeline.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingTop: 8 }}>
            <b className="gt" style={{ font: '800 96px/1 var(--display)', letterSpacing: '-.05em' }}><span data-count="7">7</span>+</b>
            <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 18, lineHeight: 1.35 }}>Years of<br />experience</span>
          </div>
        </div>
        <div className="stack">
          {[['database', 'First-Party Data Accuracy', 'Our unique database captures millions of qualified buyers actively showing purchase intent.'], ['target', 'Multi-Channel, Targeted Outreach', 'Reach decision-makers with the right message across content, events, email and outbound.'], ['trending', 'Higher Conversion Rates', 'Engage buyers exactly at their moment of decision, boosting your pipeline with genuinely interested leads.']].map(([i, t, d]) => (
            <article className="card" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 20 }} data-r="" key={t}>
              <div className="it"><Icon name={i} size={24} /></div>
              <div className="stack" style={{ gap: 8 }}><h3 className="h3">{t}</h3><p>{d}</p></div>
            </article>
          ))}
        </div>
      </div></section>

      <DatabaseSection />
      <Publications dark />

      <section className="sec" style={{ overflow: 'hidden' }}>
        <div className="glow a" style={{ left: '30%', top: 0, opacity: 0.6 }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <Head eb="Trust & Compliance" title="Enterprise-Grade Data & Compliance" lead="Every campaign is governed by enterprise level data standards GDPR-aligned, ISO-informed, and designed for organizations where compliance is non negotiable." />
          <div className="g4">
            {[['lock', 'GDPR-Aligned Data Practices', 'All data is collected and processed with a consent first approach, fully aligned with global privacy regulations.'], ['shield', 'Verified First-Party Data Sources', 'We rely on direct, first party engagement, ensuring every lead is authentic, permission based, and compliant.'], ['badge', '3X QA™ Lead Validation', 'Every lead undergoes our 3 layer quality check - Verified. Compliant. Ready. No exceptions, no compromises.'], ['eye', 'Transparent & Auditable Delivery', 'Complete visibility into lead engagement and campaign performance ensuring accountability and eliminating black box delivery.']].map(([i, t, d], k) => (
              <article className="card" data-r="" key={t}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div className="it ghost"><Icon name={i} size={22} /></div><span className="num">0{k + 1}</span></div>
                <h3 className="h3" style={{ fontSize: 19 }}>{t}</h3><p style={{ fontSize: 15 }}>{d}</p>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 72 }}><StatBand items={[['100', '+', 'Clients Served'], ['1.5', 'M+', 'Lead delivered'], ['115', 'M+', 'Database'], ['22', 'M+', 'Total Accounts']]} /></div>
        </div>
      </section>

      <section className="sec alt" id="services"><div className="wrap">
        <Head eb="What We Do" title="Modernize Your B2B Growth with Our Services" lead="We help B2B companies grow smarter with targeted, performance driven, and scalable demand gen services. Here’s how we do it" />
        <div className="svc">
          {[...SG.services].sort((a, b) => (b.slug === 'lead-generation') - (a.slug === 'lead-generation')).map((s, i) => (
            <Link className={`card ${i ? '' : 'feat'}`} href={`/${s.slug}`} data-r="" key={s.slug}>
              <ServiceBadge slug={s.slug} />
              <h3 className="h3">{s.short}</h3><p>{s.desc}</p>
              <ul>{s.bullets.map(b => <li key={b}><span className="tick"><Icon name="check" size={12} color="#D9CCFF" /></span>{b}</li>)}</ul>
              <span className="link more" style={i ? undefined : { color: '#fff' }}>Explore More <Arrow /></span>
            </Link>
          ))}
        </div>
      </div></section>

      <section className="sec"><div className="wrap">
        <Carousel eb="We let the results speak" title="Your Goals Become Our Goals" headExtra={<Link className="link" href="/case-study">See all of our demand generation results <Arrow /></Link>}>
          {CaseCards({ cases })}
        </Carousel>
      </div></section>

      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap"><div className="xpanel">
        <div className="glow" />
        <div className="stack" data-r="">
          <span className="eyebrow">X-Engage</span>
          <h2 className="h2">Smart Engagement Insights for Faster, Sharper Lead Gen</h2>
          <p className="lead" style={{ color: '#C8C4E8' }}>Go beyond opens and downloads with granular engagement signals. Give your sales team the real time insights they need to prioritize smarter and convert faster.</p>
          <div className="btns"><BtnP>Start Now</BtnP></div>
        </div>
        <Signals />
      </div></div></section>

      <Testimonials />
      <Cta />
    </>
  );
}
