import AudienceCrowd from '@/components/client/AudienceCrowd';
import AudienceTiles from '@/components/client/AudienceTiles';
import IndustryHoneycomb from '@/components/client/IndustryHoneycomb';
import { SG } from '@/lib/content';
import { BtnP, BtnS, Cta, DatabaseSection, Head, PageHero, Publications, Trusted } from '@/components/ui';

export const metadata = { title: 'Audience Overview', description: 'Exclusive first party contact database: industry coverage, company size, job role and job function breakdown.' };

export default function Page() {
  return (
    <>
      <PageHero visual={<AudienceCrowd />} chip={['Delivered','1.5M+ leads']} eb="SalesGarners" title="Audience Overview" lead="Explore the B2B decision makers we reach, broken down by industry, job function, seniority and region."><BtnP>Book a Demo</BtnP><BtnS href="/contact-us">Talk to an Expert</BtnS></PageHero>
      <DatabaseSection standalone />
      <section className="sec alt"><div className="wrap">
        <Head title="Industry Coverage" />
        <IndustryHoneycomb items={SG.audience.industries} />
      </div></section>
      <section className="sec"><div className="wrap">
        <AudienceTiles tabs={SG.audience.tabs} />
      </div></section>
      <Publications dark />
      <Trusted title="Trusted by forward-thinking B2B marketers" text="" />
      <Cta />
    </>
  );
}
