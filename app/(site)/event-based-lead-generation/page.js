import EventJourney from '@/components/client/EventJourney';
import Difference from '@/components/Difference';
import EventTimeline from '@/components/client/EventTimeline';
import { BtnP, CardsGrid, Cta, Head, NumberedSteps, PageHero } from '@/components/ui';

export const metadata = { title: 'Event-Based Lead Generation', description: 'Turn every event into a revenue opportunity with intent-rich, event-based lead generation.' };

export default function Page() {
  return (
    <>
      <PageHero visual={<EventJourney />} eb="Event-Based Lead Generation" title={<>Turn Every Event into a <span className="gt">Revenue Opportunity</span></>} lead="Industry events are more than networking , they’re where buying decisions are shaped. With Salesgarners, you don’t just attend or host events, you maximize them. We help you connect with the right decision makers, capture intent rich leads, and turn conversations into measurable pipeline growth.">
        <BtnP>Book a Demo</BtnP>
      </PageHero>
      <section className="sec alt"><div className="wrap">
        <Head eb="Why choose our event-based lead generation" title="Delivering Real, Revenue-Driving Impact" />
        <h3 className="h3" style={{ margin: '-20px 0 32px', textAlign: 'center' }} data-r="">How Our Event-Based Lead Generation Works</h3>
        <NumberedSteps items={[
          ['Research & Targeting', 'We analyze attendee lists, industry trends, and intent signals to identify high value accounts and contacts who fit your ICP.'],
          ['Pre-Event Outreach & Follow-Ups', 'We design and execute targeted campaigns that engage prospects before the event, setting the stage for warm conversations.'],
          ['On-Site Lead Engagement', 'From booth strategy to content delivery, we help your teams qualify leads in real time and make the right connections at the right moments.'],
          ['Post-Event Follow-Ups', 'Personalized, multi channel follow ups both before and after event ensure your event conversations don’t go cold. So that your sales teams can move fast on high intent opportunities.'],
        ]} />
      </div></section>
      <section className="sec evt-sec"><div className="wrap">
        <Head eb="What you get" title="Turn Events into Sales Accelerators" />
        <EventTimeline items={[
          ['Qualified Meetings Before You Even Arrive', 'Walk into the event with your calendar already filled. Decision makers from your ICP are lined up in advance, making every conversation warmer and more productive.'],
          ['Stronger Connections On-Site', 'In a sea of booths and noise, your message cuts through. You meet the right people at the right time, creating conversations that actually stick.'],
          ['Follow-Ups That Drive Momentum', 'Forget the generic “just checking in” emails. Post event outreach is tailored to context, keeping prospects engaged and moving them closer to conversion.'],
          ['ROI You Can See and Measure', 'Events stop being a cost center and start becoming a growth engine. Every interaction is captured, nurtured, and translated into pipeline impact.'],
        ]} />
      </div></section>
      <Difference />
      <Cta title="Ready to Get More Out of Your Next Event?" label="Start Building Pipeline" />
    </>
  );
}
