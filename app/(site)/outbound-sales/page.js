import PricingPasses from '@/components/client/PricingPasses';
import FitCheck from '@/components/client/FitCheck';
import ForecastGauge from '@/components/client/ForecastGauge';
import NoiseSignal from '@/components/client/NoiseSignal';
import OutboundPanels from '@/components/client/OutboundPanels';
import OutboundCircuit from '@/components/client/OutboundCircuit';
import { Icon } from '@/components/Icon';
import { LINKS } from '@/lib/content';
import FaqConsole from '@/components/client/FaqConsole';
import { BtnP, CardsGrid, Compare, Cta, Head, PageHero, Trusted } from '@/components/ui';
import Difference from '@/components/Difference';

export const metadata = { title: 'Outbound Sales Program', description: 'Predictable pipeline and qualified sales meetings from a multi channel outbound engine powered by intent data.' };

const QUOTES = [
  ['AFSA Infosystems', 'Director of Demand Generation', '"We had no idea which contacts from our ABM list were actually reading our reports. X-Engage changed that overnight. Our SDR team now has a daily prioritised call list, and pipeline has genuinely moved."'],
  ['QuickInfra Cloud Solutions', 'VP of Sales', '"The intent scores are surprisingly accurate. When we call contacts with a score above 85, the meeting rate is through the roof. It\'s become our most important sales tool."'],
  ['Wheelhouse Enterprise', 'Head of Marketing', '"Before X-Engage we were flying blind on content ROI. Now we know which assets generate high-intent contacts and we double down on those. Marketing and sales are finally aligned."'],
  ['Upcision', 'Founder', '"Setup was painless and the dashboard is genuinely intuitive. We started seeing actionable data within a day. The real-time alerts have been a game changer for our SMB sales motion."'],
];
const FAQ = [
  ['How quickly can we expect meetings?', 'Most clients see their first qualified meetings booked within 3–4 weeks, as soon as ICP mapping and outreach sequences go live.', 'meetings'],
  ['Do you require long-term contracts?', 'No. Our engagements are built around results, not lock-in periods. We\u2019ll walk you through flexible options on your strategy call.', 'contracts'],
  ['What industries do you work with?', 'We specialize in B2B SaaS and technology companies.', 'industries'],
  ['How is this different from an in-house SDR team?', 'You get a complete outbound engine (ICP mapping, verified data, intent tracking and SDR execution) without hiring, training and ramping up a team yourself.', 'vs-inhouse-sdr'],
  ['What do you need from us to get started?', 'Just a short onboarding call to align on your ICP, messaging and calendar access. We handle the rest.', 'onboarding'],
];
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function Page() {
  return (
    <>
      <PageHero visual={<OutboundPanels />} chip={['Outbound','Qualified sales meetings']} eb="Outbound Sales Program" title={<>Predictable Pipeline. Qualified Sales Meetings. <span className="gt">Real Revenue.</span></>} lead="SalesGarners helps SaaS & tech companies scale pipeline fast by generating high‑intent sales meetings and revenue opportunities through a multi channel outbound engine powered by intent data and conversion strategy.">
        <BtnP href={LINKS.calc}>Get Your Pipeline Forecast</BtnP>
      </PageHero>
      <Trusted />

      <section className="sec"><div className="wrap">
        <FitCheck />
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Head title="Why Pipeline Feels Unpredictable" lead="Without a connected system, pipeline stays a guessing game until now." />
        <ForecastGauge />
      </div></section>

      <section className="sec"><div className="wrap split">
        <div className="stack" data-r="">
          <h2 className="h2">A Complete Outbound Engine Built for Conversion</h2>
          <p className="lead">We don&apos;t just send emails or make calls.<br />We build a structured outbound system:</p>
          <p style={{ fontWeight: 700, color: 'var(--lilac)' }}>Every step is optimized to generate sales ready conversations</p>
        </div>
        <div className="stack" style={{ gap: 10 }}>
          {['ICP Mapping & Target Account List', 'Verified Contact Data', 'Multi-channel Outreach (Email + LinkedIn + Calling)', 'Engagement Tracking & Intent Signals', 'Lead Scoring & Qualification', 'SDR Activation & Meeting Booking'].map((t, i) => (
            <div className="card" key={t} style={{ flexDirection: 'row', alignItems: 'center', padding: '16px 20px', gap: 16 }} data-r=""><span className="num">0{i + 1}</span><b style={{ fontWeight: 700 }}>{t}</b></div>
          ))}
        </div>
      </div></section>

      <section className="sec obc-sec" aria-label="How Our Outbound Engine Works"><div className="wrap">
        <OutboundCircuit title="How Our Outbound Engine Works" items={[['Target the Right Accounts', 'We map your ICP and build verified, high fit target account lists.'], ['Engage Across Channels', 'Multi-channel outreach via email, LinkedIn, and calling personalized to each account.'], ['Track Real Buyer Intent', 'We monitor engagement, content interaction, and signals using X-Engage.'], ['Convert to Sales Meetings', 'Only qualified, high intent leads are handed to SDRs for conversion.']]} />
      </div></section>

      <section className="sec"><div className="wrap">
        <Head title="Flexible Pricing for Every Sales Growth Stage" lead="Select the pricing model that aligns with your sales goals and growth strategy." />
        <PricingPasses />
        <div className="btns" style={{ justifyContent: 'center', marginTop: 36 }}><BtnP>Book a Strategy Call</BtnP></div>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Head title="Most outbound agencies stop here." lead="More emails + more calls = more noise" />
        <NoiseSignal />
        <div style={{ marginTop: 64 }}>
          <Head eb="We go one step further" />
          <CardsGrid cols={3} icons={['eye', 'database', 'clock']} items={[["Who's engaging", 'We identify the right accounts showing real interest in your solution.'], ['Verified intent data', 'We use advanced intent signals to find buyers actively researching solutions like yours.'], ['Sales-ready timing', 'We engage when buyers are ready, so your team talks to real opportunities.']]} />
        </div>
      </div></section>

      <Difference />

      <Cta />

      <section className="sec"><div className="wrap split">
        <div className="stack" data-r="">
          <span className="eyebrow">Turn outbound into a number</span>
          <h2 className="h2">Turn Your Outbound Strategy Into a 90-Day Forecast.</h2>
          <p className="lead">Find out what your sales engine could generate in meetings, pipeline and revenue.</p>
          <div className="btns"><BtnP href={LINKS.calc}>Calculate My 90-Day Forecast</BtnP></div>
          <div className="chips">{['Free', 'Takes 3 minutes', 'No commitment'].map(t => <span className="chip" key={t}><span className="v">✓</span>{t}</span>)}</div>
        </div>
        <div className="card" style={{ padding: 26, gap: 18 }} data-r="" data-forecast="">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="note">OUTBOUND PERFORMANCE</span><span className="live">LIVE</span></div>
          <div><span className="note">POTENTIAL PIPELINE</span><b style={{ display: 'block', font: '800 40px/1.1 var(--display)', letterSpacing: '-.03em' }}>$<span data-count="420000" data-fmt="comma">420,000</span></b><small style={{ color: 'var(--mint)', fontWeight: 700 }}>↑ 28.4% vs. previous period</small></div>
          <svg viewBox="0 0 440 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }} role="img" aria-label="Projected meetings, pipeline and revenue over 90 days">
            {[0, 1, 2, 3, 4, 5].map(i => <g key={i}><line x1="40" x2="430" y1={170 - i * 30} y2={170 - i * 30} stroke="rgba(255,255,255,.07)" /><text x="0" y={174 - i * 30} fill="#6C7397" fontSize="10" fontFamily="JetBrains Mono">${i * 100}K</text></g>)}
            {['Day 1', '15', '30', '45', '60', '75', '90'].map((d, i) => <text key={d} x={40 + i * 65} y="192" fill="#6C7397" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">{d}</text>)}
            <defs><linearGradient id="gA" x1="0" x2="1"><stop offset="0" stopColor="#6D43E7" /><stop offset="1" stopColor="#BB32C8" /></linearGradient></defs>
            <path className="ln" d="M40 165 C105 160,170 150,235 130 S365 70,430 44" fill="none" stroke="url(#gA)" strokeWidth="3" />
            <path className="ln" d="M40 168 C105 165,170 160,235 152 S365 132,430 122" fill="none" stroke="#34D399" strokeWidth="2.5" />
            <path className="ln" d="M40 169 C105 168,170 166,235 160 S365 150,430 141" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5 5" />
          </svg>
          <div className="chips">{[['#A855F7', 'Pipeline'], ['#34D399', 'Revenue'], ['#38BDF8', 'Meetings']].map(([c, l]) => <span className="chip" key={l} style={{ padding: '5px 10px', fontSize: 12 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}</span>)}</div>
          <div className="g3" style={{ gap: 10 }}>{[['MEETINGS', '124', '18%'], ['PIPELINE', '$420K', '28%'], ['REVENUE', '$96K', '22%']].map(([a, b, c]) => <div className="met" key={a}><span>{a}</span><b>{b}</b><small style={{ color: 'var(--mint)', fontWeight: 700, fontSize: 12 }}>↑ {c}</small></div>)}</div>
        </div>
      </div></section>

      <section className="sec alt" id="faqs" aria-label="FAQs"><div className="wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
        <Head eb="FAQs" title="Frequently Asked Questions" lead="Quick answers to what B2B teams ask us before starting an outbound program." />
        <FaqConsole items={FAQ} ctaHref={LINKS.demo} />
      </div></section>
    </>
  );
}
