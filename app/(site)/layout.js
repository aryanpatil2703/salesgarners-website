import Header from '@/components/client/Header';
import Footer from '@/components/Footer';
import Interactions from '@/components/client/Interactions';
import Consent from '@/components/client/Consent';
import Chatbot from '@/components/client/Chatbot';
import { SOCIAL } from '@/lib/content';

const THEME_BOOT = `(function(){var r=document.documentElement,m='dark';try{m=localStorage.getItem('sg-theme')||'dark'}catch(e){}if(m!=='light'&&m!=='auto'&&m!=='dark')m='dark';var t=m==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):m;r.dataset.theme=t;r.dataset.mode=m})()`;

// Company details for search engines (Organization structured data)
const ORG = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'SalesGarners', legalName: 'SalesGarners Marketing Pvt Ltd',
  url: 'https://salesgarners.com', logo: 'https://salesgarners.com/brand/salesgarners-icon-512.png', email: 'info@salesgarners.com', telephone: '+91 8177811189',
  address: { '@type': 'PostalAddress', streetAddress: 'Office 1506, 15th Floor, Nyati Enthral, Kharadi South Main Road, Thite Nagar, Kharadi', addressLocality: 'Pune', addressRegion: 'Maharashtra', postalCode: '411014', addressCountry: 'IN' },
  sameAs: SOCIAL.map(x => x[2]),
};

/**
 * Global site layout wrapper providing navigation, footer, theme bootstrapping, and AI Concierge.
 * @param {object} props
 * @param {React.ReactNode} props.children - Route child components
 * @returns {JSX.Element}
 */
export default function SiteLayout({ children }) {
  return (
    <>
      {/* Apply the saved theme before anything paints (default: dark) */}
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <Interactions />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Consent />
      <Chatbot />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }} />
    </>
  );
}
