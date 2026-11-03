import './globals.css';
import './theme.css';

export const metadata = {
  metadataBase: new URL('https://salesgarners.com'),
  title: { default: 'SalesGarners | Accelerating Revenue Growth', template: '%s | SalesGarners' },
  description: 'We help B2B tech companies shift from outdated lead generation tactics to modern, intent-based demand generation that builds pipeline.',
  openGraph: { siteName: 'SalesGarners', type: 'website', locale: 'en_US', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'SalesGarners: Accelerate pipeline growth with high-quality intent leads' }] },
  twitter: { card: 'summary_large_image', images: [{ url: '/og.png', alt: 'SalesGarners: Accelerate pipeline growth with high-quality intent leads' }] },
  // each page's canonical URL is its own path on salesgarners.com
  alternates: { canonical: './' },
};

export const viewport = { themeColor: '#06081A', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

/**
 * Root layout component injecting global CSS stylesheets and HTML shell.
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
