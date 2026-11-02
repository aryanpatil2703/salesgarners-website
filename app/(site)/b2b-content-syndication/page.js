import SyndicationFlow from '@/components/client/SyndicationFlow';
import WhyPillars from '@/components/client/WhyPillars';
import GrowthResults from '@/components/client/GrowthResults';
import ValueList from '@/components/client/ValueList';
import { BtnP, BtnS, CardsGrid, Cta, Head, PageHero, Trusted } from '@/components/ui';
import Difference from '@/components/Difference';

export const metadata = { title: 'B2B Content Syndication', description: 'Reach the right buyers at scale with intent-based B2B content syndication.' };

const Result = ({ n, label, w, grad }) => (
  <div className="res"><b className={grad ? 'gt' : ''}><span data-count={n}>{n}</span>+</b><small>{label}</small><div className="hb" style={{ marginTop: 12 }}><div className="tr"><i data-w={w} /></div></div></div>
);

export default function Page() {
  return (
    <>
      <PageHero visual={<SyndicationFlow />} eb="B2B Content Syndication" title={<>Reach the Right Buyers. <span className="gt">At Scale</span></>} lead="Stop letting great content sit idle. We push it to targeted, verified decision makers where it gets noticed and acted on. With intent data, smart distribution, and lead level engagement, your content starts working harder. It’s syndication that delivers, not just distributes.">
        <BtnP>Book a Demo</BtnP><BtnS href="/pilot-campaign">Start Your Pilot</BtnS>
      </PageHero>
      <Trusted />
      <section className="sec wcs-sec"><div className="wrap"><WhyPillars /></div></section>
      <section className="sec vls-sec"><div className="wrap">
        <ValueList eyebrow="What you get" title="Built for Conversion. Backed by Strategy. Delivered by Us" items={[
          ['Intent Signals That Actually Mean Something', 'We don’t just collect signals, we act on them. Every campaign is based on real buyer behavior, not vague keyword matches.'],
          ['Targeted Delivery, Not Blasts', 'Your content lands with decision makers who fit your ICP. No rented lists, no spray and pray just strategic placement that drives action.'],
          ['Verified Leads with Rich Context', 'You get more than a name and email. Each lead comes enriched with firmographic, demographic, and engagement-level insights.'],
          ['Brand Touchpoints That Stick', 'We follow up beyond the first click, with remarketing and nurturing that reinforces your message and brand at every stage.'],
          ['Predictable Outcomes. Scalable Process.', 'With fixed CPL and transparent reporting, you’ll always know what to expect and how to scale it with no hidden costs, no surprises.'],
          ['Multi-Channel Reach, Single Cohesive Strategy', 'Your content meets buyers wherever they are across trusted industry sites, newsletters, and professional communities, all while staying consistent with your brand voice and messaging.'],
        ]} />
      </div></section>
      <section className="sec gg-sec"><div className="wrap">
        <Head eb="How We Turn Your Content Into Qualified Pipeline" title="The Road From Guesswork to Growth" lead="How switching syndication partners changes the outcome" />
        <GrowthResults
          left={['Bulk sends to cold lists', 'Basic filters, no real intent', 'One-time distribution', 'Unqualified form fills', 'No content performance visibility', 'Quantity-first mindset']}
          right={['Targeted outreach to high-intent accounts', 'Built on real buyer signals + firmographic fit', 'Multi-touch delivery + strategic retargeting', 'Lead-level tracking with full engagement data', 'Conversion-focused strategy, not just volume', 'Dedicated support + campaign optimization']} />
      </div></section>
      <Difference />
      <Cta />
    </>
  );
}
