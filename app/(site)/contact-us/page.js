import { Icon } from '@/components/Icon';
import LeadForm from '@/components/client/LeadForm';
import { CopyButton } from '@/components/client/Widgets';
import { BtnP, BtnS, PageHero } from '@/components/ui';
import ContactCall from '@/components/client/ContactCall';

export const metadata = { title: 'Contact Us', description: 'Get in touch with SalesGarners. Offices in Kharadi and Wanowrie, Pune.' };

const OFFICES = [
  ['The Headquarter', 'SalesGarners Marketing Pvt Ltd, Nyati Enthral, Office Number - 1506, 15th Floor, Kharadi South Main Road, Thite Nagar, Kharadi, Pune, Maharashtra 411014.', '+91 8177811189'],
  ['Other Location', 'SalesGarners Marketing Pvt. Ltd. Flora Heights, Office number 303, Wanowrie, Jambulkar Chowk, Pune-411040', '020 44473448'],
];

export default function Page() {
  return (
    <>
      <PageHero visual={<ContactCall />} eb="Contact Us" title="Get in Touch with Us Today" lead="Tell us about your goals and our team will get back to you with a plan to grow your pipeline."><BtnP>Book a Demo</BtnP><BtnS href="/pilot-campaign">Start a Free Pilot</BtnS></PageHero>
      <section className="sec" style={{ paddingTop: 10 }}><div className="wrap split" style={{ alignItems: 'start' }}>
        <div className="stack">
          {OFFICES.map(([k, a, p]) => (
            <div className="ccard" data-r="" key={k}>
              <span className="k">{k.toUpperCase()}</span>
              <p style={{ display: 'flex', gap: 10 }}><Icon name="pin" size={18} color="#B79CFF" /><span>{a}</span></p>
              <p style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="phone" size={16} color="#B79CFF" /><a href={`tel:${p.replace(/\s/g, '')}`}>IND: {p}</a><CopyButton value={p} /></p>
              <p style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="mail" size={16} color="#B79CFF" /><a href="mailto:info@salesgarners.com">info@salesgarners.com</a><CopyButton value="info@salesgarners.com" /></p>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 32 }} data-r="">
          <LeadForm id="contact" type="CONTACT" rows={[['firstName'], ['email'], ['phone'], ['message']]} required={['firstName', 'email']} />
        </div>
      </div></section>
    </>
  );
}
