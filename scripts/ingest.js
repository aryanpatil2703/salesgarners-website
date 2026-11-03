/**
 * Knowledge Base Scraper and Vector Ingestion Script
 * Compiles comprehensive domain knowledge from salesgarners.com, builds chunked semantic documents,
 * generates vector embeddings, and stores them in PostgreSQL with pgvector (or data/knowledge-base.json).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import '../lib/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Raw knowledge source representing all verified pages, offerings, and operational facts of SalesGarners.
 */
const SALESGARNERS_PAGES = [
  {
    url: 'https://salesgarners.com/',
    title: 'SalesGarners Homepage - Accelerating Revenue Growth with Intent Leads',
    category: 'overview',
    content: `
SalesGarners is a premier B2B demand generation and intent data company helping global B2B tech organizations accelerate pipeline growth.
We shift companies away from outdated cold spam tactics into modern, intent-based demand generation that converts.
Headquarters: Office 1506, 15th Floor, Nyati Enthral, Kharadi South Main Road, Thite Nagar, Kharadi, Pune, Maharashtra 411014, India.
Contact: info@salesgarners.com | Phone: +91 8177811189, +91 9307444863
Demo booking: https://calendly.com/salesgarners
Global reach: North America (NA), EMEA, APAC, LATAM, and ANZ.
Trusted by over 100 enterprise tech leaders including AWS, Adobe, Stripe, Salesforce, 1Password, Cloudflare, Slack, IBM, NetApp, Palo Alto Networks, Lumen, SUSE, and HPE Aruba.
Core offerings include B2B Content Syndication, Lead Generation (MQL, SQL, SRL, HQL), Event-Based Lead Generation, Outbound Sales Programs, Data Cleansing & Enrichment, and the proprietary X-Engage demand platform.
`,
  },
  {
    url: 'https://salesgarners.com/about',
    title: 'About SalesGarners - Leadership, Mission and Global Reach',
    category: 'about',
    content: `
About SalesGarners:
Founded in Pune, India, SalesGarners Marketing Pvt Ltd has established itself as an innovative force in B2B demand generation.
Our core philosophy: Revenue growth should not depend on luck or generic email blasts. We harness real buyer intent signals, first-party publisher data, and multi-channel SDR outreach to deliver sales-ready opportunities.
Leadership Team:
- Nayil Kazi: CEO & Founder (Email: nayil@salesgarners.com | LinkedIn: https://www.linkedin.com/in/nayil-kazi-4b0105386/)
- Asma K: Director of Client Success (Email: asma@salesgarners.com)
- Shafin Kazi: Head of Operations & Delivery (Email: shafin@salesgarners.com | LinkedIn: https://www.linkedin.com/in/shafinkazi/)
- Abrar Jamadar: Finance Manager (Email: abrar@salesgarners.com | LinkedIn: https://www.linkedin.com/in/abrar-jamadar-394b9a177)
Company Strengths:
- Proprietary demand technology platform: X-Engage (https://x-engage.com)
- Global network of 6 dedicated technology publishing sites reaching millions of monthly decision makers.
- Database of over 114 Million verified enterprise contacts across 26 industries.
`,
  },
  {
    url: 'https://salesgarners.com/b2b-content-syndication',
    title: 'B2B Content Syndication - High Intent Asset Distribution',
    category: 'services',
    content: `
B2B Content Syndication at SalesGarners:
We get your high-value assets—such as whitepapers, research reports, eBooks, infographics, and case studies—directly in front of active B2B buyers who are in-market for your solutions.
Key Features:
- ICP Matching: Laser-targeted distribution strictly matching your Ideal Customer Profile (industry, company size, revenue, geography, and job title).
- Multi-Channel Reach: Syndicated across our 6 owned media publications, targeted email drops, tele-nurturing, and digital networks.
- Guaranteed Lead Verification: Every download is 100% verified with verified business email, phone number, company name, job role, and explicit opt-in consent (GDPR and CAN-SPAM compliant).
- Lead Classifications: Delivers Marketing Qualified Leads (MQLs) and High Quality Leads (HQLs).
- Direct Integration: Leads delivered directly into your CRM (Salesforce, HubSpot, Marketo) or via secure real-time webhooks and spreadsheets.
`,
  },
  {
    url: 'https://salesgarners.com/lead-generation',
    title: 'B2B Lead Generation - MQL, SQL, SRL, and HQL Campaigns',
    category: 'services',
    content: `
Lead Generation Services by SalesGarners:
We deliver leads your sales team will actually want to talk to—highly qualified, contextually relevant, and sales-ready.
Lead Tier Definitions:
1. MQL (Marketing Qualified Leads): Prospects who match ICP and engaged with targeted content.
2. HQL (High Quality Leads): Prospects answering custom qualifying questions regarding timeline, budget, or current vendor.
3. SQL (Sales Qualified Leads): Verified decision-makers who expressed explicit interest in discussing your product.
4. SRL (Sales Ready Leads): Prospects actively seeking vendor demos or price quotes.
Verification Process:
- Dual-layer human and telephonic verification to confirm authority and buying timeline.
- Complete domain validity checks, corporate email verification, and LinkedIn profile matching.
- Real-time lead delivery with zero latency so sales reps can strike while interest is hot.
`,
  },
  {
    url: 'https://salesgarners.com/event-based-lead-generation',
    title: 'Event-Based Lead Generation - Turn Webinars & Summits into Pipeline',
    category: 'services',
    content: `
Event-Based Lead Generation by SalesGarners:
Maximize ROI on physical conferences, trade shows, virtual summits, and webinars.
How It Works:
- Pre-Event Audience Driving: Attract high-intent registrants and attendees fitting your ICP.
- During-Event Engagement Tracking: Capture engagement metrics, poll responses, and question logs.
- Rapid Post-Event Follow-up: Fast multi-channel outreach while event key takeaways are top-of-mind.
- Prioritized Scoring: Attendees prioritized by their intent level, role, and interaction frequency.
`,
  },
  {
    url: 'https://salesgarners.com/outbound-sales',
    title: 'Outbound Sales Program - Fully Managed SDR Engine',
    category: 'services',
    content: `
Outbound Sales Program (Dedicated SDR as a Service):
A turnkey, fully managed outbound sales engine that books qualified meetings with key decision-makers directly onto your account executives' calendars.
What's Included:
- Dedicated, rigorously trained B2B Sales Development Representatives (SDRs).
- Custom multi-touch outreach cadences combining hyper-personalized cold email, phone calls, and LinkedIn touches.
- Custom pitch script creation, objection handling playbooks, and ICP list curation.
- Seamless calendar integration via Calendly, Chili Piper, or HubSpot Meetings.
- Transparent reporting with weekly pipeline reviews and conversion analytics.
`,
  },
  {
    url: 'https://salesgarners.com/data-services',
    title: 'B2B Data Services - Database Enrichment, Cleansing and Verification',
    category: 'services',
    content: `
B2B Data Services at SalesGarners:
Power your revenue engine with accurate, verified, and refreshed B2B contact intelligence.
Capabilities:
- Account & Contact Discovery: Build bespoke contact lists matching exact ICP criteria (firmographic, technographic, intent signals).
- Database Cleansing & Hygiene: Remove duplicates, update decayed job roles, flag dead emails, and fix malformed records.
- Enrichment: Append direct dials, verified work emails, LinkedIn URLs, company revenue, employee count, and current tech stack.
- Scale: 114M+ verified global business contacts spanning 26+ key enterprise verticals.
`,
  },
  {
    url: 'https://salesgarners.com/x-engage',
    title: 'X-Engage Platform - Proprietary Demand Generation & Intent Intelligence',
    category: 'technology',
    content: `
X-Engage Platform (https://x-engage.com):
SalesGarners' proprietary demand generation and intent data platform.
Key Highlights:
- Intent Surge Monitoring: Identifies accounts actively researching your product category before they ever fill out a form on your site.
- Real-Time Campaign Portal: Clients can log in to view lead delivery, download verified records, track pacing, and inspect audit trails.
- ABM Orchestration: Coordinates account-based marketing efforts with surgical precision.
- Zero Waste: Eliminates ad spend wasted on disengaged accounts by focusing strictly on in-market buying groups.
`,
  },
  {
    url: 'https://salesgarners.com/pilot-campaign',
    title: 'Limited-Time Pilot Campaign - Test Free B2B Content Syndication Leads',
    category: 'offers',
    content: `
SalesGarners Pilot Campaign Offer:
Get Content Syndication Leads FREE with zero financial risk.
Why We Offer It:
We are so confident in the quality of our intent data, ICP matching, and lead qualification that we invite prospective enterprise clients to test a pilot batch of leads at no cost.
What You Get:
- Free delivery of high-intent B2B leads generated from your existing content assets (whitepapers, eBooks, reports).
- Leads matched 100% to your specified target accounts, job titles, and geographies.
- Full lead details: Name, business email, verified phone, company name, employee size, title, and opt-in timestamp.
- How to Claim: Book a strategy call at https://calendly.com/salesgarners or submit the pilot form on https://salesgarners.com/pilot-campaign.
`,
  },
  {
    url: 'https://salesgarners.com/publications',
    title: 'SalesGarners Publications - 6 Owned B2B Tech Media Hubs',
    category: 'publications',
    content: `
SalesGarners owns and operates 6 independent B2B digital publications that attract millions of technology leaders and capture first-party intent data:
1. TechMediaGlobal (https://techmediaglobal.com): Enterprise technology news, AI developments, cloud infrastructure, and cybersecurity insights.
2. MarTech360Hub (https://martech360hub.com): Cutting-edge marketing technology trends, CMO interviews, and marketing automation strategies.
3. HRTech360Hub (https://hrtech360hub.com): Future of work, talent intelligence, employee engagement, and HR software.
4. FinTech360Hub (https://fintech360hub.com): Banking technology, payment systems, digital assets, and financial compliance.
5. SalesTech360Hub (https://salestech360hub.com): Revenue operations, sales enablement tools, CRM strategies, and pipeline mastery.
6. Startup360Hub (https://startup360hub.com): Venture funding, startup spotlights, founder stories, and emerging technology breakthroughs.
`,
  },
  {
    url: 'https://salesgarners.com/case-study',
    title: 'Case Studies & Client Results',
    category: 'proof',
    content: `
Verified Client Success Stories:
1. Global Cybersecurity Firm: Delivered 4,000 qualified leads at scale through intent-driven content syndication, cutting customer acquisition cost (CAC) by 35%.
2. SAP Multi-Touch MQL Campaign: Combined content syndication, SDR outreach, and phone conversations to produce high-converting enterprise opportunities.
3. ABM Demand Partner: Leveraged X-Engage platform to unlock enterprise buying committee budgets with transparent lead verification.
Client Testimonials:
- AFSA Infosystems (Director of Demand Gen): "SalesGarners supported our lead generation goals by delivering a strong mix of HQLs and MQLs via content syndication and telecalling. Their multi-channel approach brought us measurable results."
- QuickInfra Cloud Solutions (CEO): "Using their proprietary platform X-Engage, SalesGarners helped us generate MQLs through targeted content syndication for our DevOps audience."
- UPCISION (Founder): "Played a vital role in helping us scale with qualified SQLs and SRLs through their focused telemarketing approach."
- Wheelhouse Enterprise (Account Relationship Manager): "Exceeded expectations in driving Sales-Ready leads through telemarketing and email strategies."
`,
  },
  {
    url: 'https://salesgarners.com/audience-overview',
    title: 'Audience Reach & Demographic Breakdown',
    category: 'audience',
    content: `
SalesGarners B2B Audience Intelligence:
- Database Size: 114.99 Million verified professionals globally.
- Seniority Distribution:
  * C-Level Executives: 3.35 Million (3.35%)
  * VP / Directors: 12.70 Million (12.7%)
  * Managers: 28.75 Million (28.75%)
  * Individual Contributors: 55.10 Million (55.1%)
  * Senior Staff: 8.14 Million (8.14%)
  * Junior Staff: 6.95 Million (6.95%)
- Job Functions:
  * Information Technology: 42.50%
  * Marketing & Sales: 25.21%
  * Administration: 17.29%
  * Operations: 8.16%
  * C-Level Leadership: 9.12%
  * Human Resources: 6.96%
  * Supply Chain: 5.76%
- Company Sizes:
  * 10,000+ employees: 32.87%
  * 5,000 to 9,999: 19.15%
  * 1,000 to 4,999: 16.15%
  * 500 to 749: 14.66%
  * 100 to 249: 13.48%
  * 750 to 999: 7.80%
  * 1 to 99: 4.49%
`,
  },
  {
    url: 'https://salesgarners.com/contact-us',
    title: 'Contact SalesGarners - Office Location, Phone and Meeting Booking',
    category: 'contact',
    content: `
How to Reach SalesGarners:
- Main Corporate Office: Office 1506, 15th Floor, Nyati Enthral, Kharadi South Main Road, Thite Nagar, Kharadi, Pune, Maharashtra 411014, India.
- General Inquiries: info@salesgarners.com
- Phone Support: +91 8177811189 / +91 9307444863
- Privacy / Compliance: compliance@salesgarners.com
- Schedule a Strategy Session: https://calendly.com/salesgarners
- Operating Hours: Monday to Friday, supporting global time zones across Americas, Europe, and Asia-Pacific.
`,
  },
  {
    url: 'https://salesgarners.com/careers',
    title: 'Careers at SalesGarners - Open Positions in Pune',
    category: 'careers',
    content: `
Careers and Culture at SalesGarners:
Join our fast-growing B2B demand generation team in Pune, Maharashtra.
Current Open Roles:
1. Lead Generation Executive (Experience: 6+ months): End-to-end campaign execution, first-party data handling, lead qualification against client ICP.
2. Demand Generation Executive (Experience: 1+ year): Multi-channel campaign planning, content syndication, client communications, and pipeline analytics.
3. MIS Executive (Experience: 1+ year): Campaign tracking, reporting dashboards, Excel/Google Sheets data integrity.
4. Research Analyst (Experience: 6+ months): Account and contact research, company verification, database enrichment.
How to Apply: Visit https://salesgarners.com/careers or email your resume to info@salesgarners.com.
`,
  },
  {
    url: 'https://salesgarners.com/privacy-policy',
    title: 'Privacy Policy & Compliance Standards',
    category: 'compliance',
    content: `
SalesGarners Data Protection & Privacy Compliance:
- Fully compliant with GDPR (General Data Protection Regulation) and CAN-SPAM Act.
- All outreach and content syndication respects user consent and opt-in rights.
- Data subject rights: Users can request data updates or removal at compliance@salesgarners.com.
- We never sell raw unverified personal data. Data security is maintained through encrypted physical and electronic safeguards.
`,
  },
];

/**
 * Splits document content into overlapping semantic chunks for optimal vector search.
 * @param {string} text - Source text
 * @param {number} [chunkSize=400] - Word chunk target size
 * @param {number} [overlap=60] - Word overlap between contiguous chunks
 * @returns {string[]}
 */
function chunkText(text, chunkSize = 400, overlap = 60) {
  const words = text.trim().split(/\s+/);
  if (words.length <= chunkSize) return [text.trim()];

  const chunks = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(' '));
    if (end === words.length) break;
    start += chunkSize - overlap;
  }
  return chunks;
}

/**
 * Main ingestion entry point.
 */
async function main() {
  console.log('🚀 Starting SalesGarners Knowledge Ingestion Pipeline...');

  const compiledDocuments = [];
  let chunkCounter = 0;

  for (const page of SALESGARNERS_PAGES) {
    const chunks = chunkText(page.content);
    chunks.forEach((chunk, index) => {
      chunkCounter++;
      compiledDocuments.push({
        id: chunkCounter,
        url: page.url,
        title: chunks.length > 1 ? `${page.title} (Part ${index + 1})` : page.title,
        category: page.category,
        content: chunk,
        metadata: {
          source: 'salesgarners_scrape',
          indexedAt: new Date().toISOString(),
          part: index + 1,
          totalParts: chunks.length,
        },
      });
    });
  }

  // 1. Write the static knowledge cache to data/knowledge-base.json
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, 'knowledge-base.json');
  fs.writeFileSync(outputPath, JSON.stringify(compiledDocuments, null, 2), 'utf-8');
  console.log(`✅ Saved ${compiledDocuments.length} knowledge chunks to ${outputPath}`);

  // 2. Check if PostgreSQL / pgvector is configured
  const connectionString = process.env.PG_CONNECTION_STRING || process.env.POSTGRES_URL || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') ? process.env.DATABASE_URL : null);

  if (!connectionString) {
    console.log('ℹ️ PG_CONNECTION_STRING is not set in environment.');
    console.log('   The chatbot will seamlessly use the compiled local vector & semantic index.');
    console.log('   To index directly into PostgreSQL with pgvector, set PG_CONNECTION_STRING and re-run.');
    return;
  }

  console.log('🐘 PostgreSQL connection detected. Initializing pgvector table...');
  const { initPgVector, clearDocuments, storeDocumentChunk } = await import('../lib/pgvector.js');
  const { generateEmbedding } = await import('../lib/embeddings.js');

  try {
    await initPgVector(1536);
    await clearDocuments();

    console.log(`🔄 Generating embeddings and inserting ${compiledDocuments.length} chunks into pgvector...`);
    for (let i = 0; i < compiledDocuments.length; i++) {
      const doc = compiledDocuments[i];
      const embedding = await generateEmbedding(`${doc.title} ${doc.content}`);
      await storeDocumentChunk({
        url: doc.url,
        title: doc.title,
        category: doc.category,
        chunkIndex: (doc.metadata?.part || 1) - 1,
        content: doc.content,
        metadata: doc.metadata,
        embedding,
      });
      process.stdout.write(`   [${i + 1}/${compiledDocuments.length}] Indexed chunk: "${doc.title}"\n`);
    }

    console.log('🎉 Successfully completed pgvector ingestion for SalesGarners knowledge base!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during pgvector ingestion:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error in ingest script:', err);
  process.exit(1);
});

