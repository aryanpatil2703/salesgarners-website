import { WhitepaperGrid } from '@/components/client/Widgets';
import { getWhitepapers } from '@/lib/data';
import { BtnP, Cta, PageHero } from '@/components/ui';
import WhitepaperBeam from '@/components/client/WhitepaperBeam';

export const metadata = { title: 'WhitePaper', description: 'Download SalesGarners playbooks and guides on intent-driven demand generation.' };
export const revalidate = 60;

export default async function Page() {
  const items = (await getWhitepapers()).map(w => ({ id: w.id, title: w.title, description: w.description, cover: w.cover_image, hasPdf: !!Number(w.has_pdf) }));
  return (
    <>
      <PageHero visual={<WhitepaperBeam titles={items.map(w => w.title)} />} eb="Resources" title="WhitePaper" lead="Free guides on intent data, lead targeting and demand generation. Pick one and download it in a few seconds."><BtnP>Book a Demo</BtnP></PageHero>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap">
        {items.length ? <WhitepaperGrid items={items} /> : <p className="lead" style={{ textAlign: 'center', marginInline: 'auto' }}>New whitepapers are on the way.</p>}
      </div></section>
      <Cta />
    </>
  );
}
