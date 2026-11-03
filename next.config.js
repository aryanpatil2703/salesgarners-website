/** @type {import('next').NextConfig} */

// Old WordPress URLs -> new pages (permanent). Old blog posts lived at the site root
// (/<post-slug>/); those are handled by app/(site)/[slug]/page.js, which forwards to /blog/<slug>.
const LEGACY = [
  ['/demand-generation', '/lead-generation'],
  ['/case-study/abm-partner', '/case-study/abm-partner'],
  ['/case-study/empowering-our-demand-platform-partner-3', '/case-study/empowering-our-demand-platform-partner'],
  ['/home', '/'],
  ['/blogs', '/blog'],
  ['/whitepapers', '/whitepaper'],
  ['/contact', '/contact-us'],
  ['/about-us', '/about'],
  ['/privacy', '/privacy-policy'],
  ['/terms', '/terms-conditions'],
  ['/feed', '/blog'],
  ['/category/:path*', '/blog'],
  ['/tag/:path*', '/blog'],
  ['/author/:path*', '/about'],
  ['/wp-admin', '/admin'],
  ['/wp-login.php', '/admin'],
].filter(([a, b]) => a !== b);

const nextConfig = {
  reactStrictMode: true,
  // Treat server-only database drivers as external packages
  serverExternalPackages: ['pg', 'mysql2'],
  // admin uploads (whitepaper PDFs up to 20 MB) go through server actions
  experimental: { serverActions: { bodySizeLimit: '25mb' } },
  async redirects() {
    return LEGACY.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

module.exports = nextConfig;
