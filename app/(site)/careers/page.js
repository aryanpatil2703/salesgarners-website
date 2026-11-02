import Link from 'next/link';
import { Icon } from '@/components/Icon';
import ApplyForm from '@/components/client/ApplyForm';
import JobFilters from '@/components/client/JobFilters';
import { CAREERS } from '@/lib/content';
import { getOpenJobs, JOB_TYPES, WORK_MODES } from '@/lib/data';
import { Arrow, Head, PageHero } from '@/components/ui';
import OurStory from '@/components/OurStory';
import CareerPath from '@/components/client/CareerPath';
import PerksWheel from '@/components/client/PerksWheel';

export const metadata = { title: 'Culture & Careers', description: 'Life at SalesGarners and open roles in Pune. Join our demand generation, data and technology teams.' };
export const revalidate = 60;

export default async function Careers() {
  const jobs = await getOpenJobs();
  const cards = jobs.map(j => ({
    ...j,
    node: (
      <Link className="card job" href={`/careers/${j.slug}`} key={j.slug}>
        <div className="job-top">
          {j.department && <span className="tag">{j.department.toUpperCase()}</span>}
          <span className="job-meta">{JOB_TYPES[j.job_type]} · {WORK_MODES[j.work_mode]}</span>
        </div>
        <h3 className="h3">{j.title}</h3>
        {j.summary && <p>{j.summary}</p>}
        <div className="job-foot">
          <span className="job-meta"><Icon name="pin" size={15} color="#B79CFF" /> {j.location || 'Pune'}{j.experience ? ` · ${j.experience}` : ''}</span>
          <span className="link">View role <Arrow /></span>
        </div>
      </Link>
    ),
  }));

  return (
    <>
      <PageHero visual={<CareerPath />} eb={CAREERS.eyebrow} title={CAREERS.title} lead={CAREERS.lead}>
        <a className="btn p" href="#open-roles">See open roles <Arrow /></a><a className="btn s" href="#culture">See our culture <Arrow /></a>
      </PageHero>

      <section className="sec pkw-sec" aria-label="Why work at SalesGarners"><div className="wrap"><PerksWheel perks={CAREERS.perks} /></div></section>

      <OurStory parts={['culture']} dark />

      <section className="sec" id="open-roles"><div className="wrap">
        <Head eb={`${jobs.length} open ${jobs.length === 1 ? 'role' : 'roles'}`} title="Open roles" />
        {jobs.length === 0 ? (
          <div className="card" style={{ maxWidth: 720, marginInline: 'auto', padding: 40, textAlign: 'center', alignItems: 'center' }} data-r="">
            <h3 className="h3">No open roles right now</h3>
            <p>We’re always happy to hear from good people. Send us your CV below and we’ll reach out when something fits.</p>
          </div>
        ) : <JobFilters jobs={cards.map(({ node, ...j }) => j)}>{cards.map(c => c.node)}</JobFilters>}
      </div></section>

      <section className="sec alt"><div className="wrap split" style={{ alignItems: 'start' }}>
        <div className="stack" data-r="">
          <span className="eyebrow">General application</span>
          <h2 className="h2">Don’t see the right role?</h2>
          <p className="lead">Send your CV and a short note about what you’d like to work on. We keep every application on file.</p>
        </div>
        <div className="card" style={{ padding: 32 }} data-r=""><ApplyForm jobId={null} /></div>
      </div></section>
    </>
  );
}
