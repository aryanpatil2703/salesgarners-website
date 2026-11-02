import { getCases } from '@/lib/data';
import { BtnP, BtnS, CaseCards, Cta, PageHero } from '@/components/ui';
import CaseFolders from '@/components/client/CaseFolders';

export const metadata = { title: 'Case Study', description: 'Results from SalesGarners content syndication and demand generation campaigns.' };
export const revalidate = 300;

export default async function Page() {
  const cases = await getCases();
  return (
    <>
      <PageHero visual={<CaseFolders cases={cases.map(c => ({ slug: c.slug, external_url: c.external_url || null }))} />} eb="We let the results speak" title="Case Study" lead="How B2B tech brands use SalesGarners and X-Engage to reach the right buyers and turn engagement into pipeline."><BtnP>Book a Demo</BtnP><BtnS href="/pilot-campaign">Start a Free Pilot</BtnS></PageHero>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap"><div className="g2">{CaseCards({ cases, reveal: true })}</div></div></section>
      <Cta />
    </>
  );
}
