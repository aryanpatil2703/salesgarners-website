import DataRail from '@/components/client/DataRail';
import DataCleanTable from '@/components/client/DataCleanTable';
import DataLayers from '@/components/client/DataLayers';
import { BtnP, Cta, Head, PageHero, StatBand, Trusted } from '@/components/ui';
import Difference from '@/components/Difference';

export const metadata = { title: 'Data Services', description: 'Precision built, human verified B2B data that fuels every step of the buyer journey.' };

export default function Page() {
  return (
    <>
      <PageHero visual={<DataCleanTable />} chip={['B2B data','Verified & enriched']} eb="B2B Data Services" title={<>Power Your Demand Gen with <span className="gt">Smarter B2B Data</span></>} lead="When data works for you, campaigns don’t just perform they convert. We give your marketing and sales teams access to precision built, human verified insights that fuel every step of the buyer journey. From identifying your ideal customers to enriching and scoring prospect data in real-time, we help you make better decisions, run sharper campaigns, and generate more qualified opportunities.">
        <BtnP href="/contact-us">Talk to an Expert</BtnP>
      </PageHero>
      <Trusted />
      <section className="sec alt"><div className="wrap">
        <Head title="Turning Insight-Rich Data into Real Pipeline Impact" />
        <DataRail />
      </div></section>
      <section className="sec dly-sec" aria-label="How our data services get you better leads"><div className="wrap">
        <DataLayers eb="How our data services get you better leads" title="Purpose-Built B2B Data That Fuels Growth Across Every Funnel Stage" items={[
          ['Build Stronger Campaigns with Custom, Always-Fresh Data', 'Every business is different , your data should be too. Our bespoke B2B data solutions combine deep research, expert validation, and AI driven enrichment so your teams always engage the right contacts with the right messaging at the right time.'],
          ['Turn Raw Data into Real Insights', 'Move beyond “lists” and build a data strategy that actually supports revenue generation. We blend large scale enrichment and modeling techniques to extract insights your sales and marketing teams can act on immediately.'],
          ['Scaling With You: On-Demand & Fully Managed Delivery', 'Whether you need one time data support or a fully managed engagement, our delivery models adapt to your internal bandwidth and campaign timelines.'],
          ['Compliance-Ready, Globally Trusted Data', 'Our data isn’t just accurate, it’s compliant. Every record is sourced and processed with GDPR, CCPA, and regional privacy standards in mind, so your teams can engage prospects confidently without worrying about risk or regulation.'],
        ]} />
      </div></section>
      <section className="sec"><div className="wrap">
        <Head eb="The SalesGarners Impact" lead="Delivering measurable impact for modern B2B revenue teams - across industries, markets, and use cases." />
        <StatBand items={[['10', 'MN+', 'ICP-aligned contacts delivered'], ['120', '+', 'Industries supported'], ['60', '+', 'Countries covered'], ['100', '+', 'Long-term client engagements']]} />
      </div></section>
      <Difference />
      <Cta label="Talk to an Expert" href="/contact-us" />
    </>
  );
}
