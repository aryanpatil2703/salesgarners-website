import { Head } from './ui';
import DiffBoard from './client/DiffBoard';

export default function Difference() {
  return (
    <section className="sec dfb-sec"><div className="wrap">
      <Head eb="Your pipeline, transformed | Your sales team, empowered" title="The SalesGarners Difference" />
      <DiffBoard items={[
        ['5MN+', 'Leads', 'Sales-Ready Leads, Not Just Names', 'Each lead is vetted, verified, and aligned to your ICP, so your team speaks only to decision-makers who are ready to talk.'],
        ['50MN+', 'Conversations', 'Real Conversations, Real Pipeline Growth', 'That’s 50 million meaningful B2B interactions we’ve powered – connecting buyers and sellers when timing matters most.'],
        ['100+', 'Brands', 'Global Brands Backed Us. You’re in Good Company', 'From fast-scaling startups to Fortune 500 giants, we’ve delivered results across every major B2B market.'],
      ]} />
    </div></section>
  );
}
