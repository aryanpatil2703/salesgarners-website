// ===== SalesGarners content (copied from salesgarners.com) =====
export const SG = {};

SG.promo = ['LIMITED TIME PILOT OFFER','Get Content Syndication Leads FREE','Generate High Intent Leads','Start Your Pilot Campaign Today','BOOK NOW →'];

SG.services = [
  {slug:'b2b-content-syndication', nav:'B2B Content Syndication', short:'Content Syndication', icon:'file',
   desc:'We get your content in front of the right people - those who are actively looking for solutions like yours.',
   bullets:['Share your assets with high-intent prospects.','Engage across email, media platforms, and more.','Fill your pipeline with interested buyers.']},
  {slug:'lead-generation', nav:'Lead Generation', short:'Lead Generation', icon:'target',
   desc:'We generate leads that your sales team will actually want to talk to - highly qualified, contextually relevant, and sales-ready.',
   bullets:['Custom targeting based on your ICP.','Real-time qualification and intent signals.','Delivered directly to your CRM or inbox.']},
  {slug:'event-based-lead-generation', nav:'Event-Based Lead Generation', short:'Event-Based Lead Gen', icon:'calendar',
   desc:'Turn event attendees into qualified leads with targeted follow-up built around real buying intent.',
   bullets:['Capture intent from webinars and conferences.','Prioritize leads by engagement signals.','Fast follow-up while interest is highest.']},
  {slug:'outbound-sales', nav:'Outbound Sales Program', short:'Outbound Sales Program', icon:'phone',
   desc:'A fully managed outbound engine that books meetings with the decision-makers who matter.',
   bullets:['Multi-channel outreach, built around your ICP.','Trained SDRs handling every conversation.','Meetings booked straight onto your calendar.']},
  {slug:'data-services', nav:'Data Services', short:'Data Services', icon:'database',
   desc:'Get access to clean, verified data that powers your marketing and sales efforts.',
   bullets:['Identify the right accounts and decision-makers.','Enrich and update your lead database.','Unlock deeper insights and new growth segments.']},
];

// [monogram, name, description, url, brand colour (light bg), brand colour (dark bg), logo file prefix in /public/publications]
SG.publications = [
  ['TMG','TechMediaGlobal',"Technology news, insight and analysis helping enterprise decision-makers understand what's next.",'https://techmediaglobal.com','#0284C7','#38BDF8','techmediaglobal'],
  ['MT','MarTech360Hub','Stay ahead with news, expert insights, trends and interviews at the intersection of marketing and technology.','https://martech360hub.com','#EA5A0C','#FF7A1A','martech360hub'],
  ['HR','HRTech360Hub','Your source for HR tech news, expert insights and analysis for leaders shaping the future of work.','https://hrtech360hub.com','#DB2777','#FF3D9A','hrtech360hub'],
  ['FT','FinTech360Hub','Where finance meets innovation: curated fintech news, expert voices and the trends moving money.','https://fintech360hub.com','#16A34A','#4ADE80','fintech360hub'],
  ['ST','SalesTech360Hub','Sales technology news, strategies and insights that help revenue leaders sell smarter.','https://salestech360hub.com','#DC2626','#FF4D4D','salestech360hub'],
  ['SU','Startup360Hub',"Startup news, founder stories and funding insights for the people building what's next.",'https://startup360hub.com','#A16207','#FACC15','startup360hub'],
];

SG.testimonials = [
  ['AFSA Infosystems','Director of Demand Generation','SalesGarners supported our lead generation goals by delivering a strong mix of HQLs and MQLs via content syndication and telecalling. Their multi-channel approach brought us measurable results.'],
  ['QuickInfra Cloud Solutions','CEO','Using their proprietary platform X-Engage, SalesGarners helped us generate Marketing Qualified Leads through targeted content syndication. Their data-driven strategy aligned perfectly with our DevOps audience.'],
  ['UPCISION','Founder','SalesGarners played a vital role in helping us scale with qualified SQLs and SRLs through their focused telemarketing approach. Their execution was both swift and effective.'],
  ['Wheelhouse Enterprise','Account Relationship Manager','We partnered with SalesGarners to drive Sales-Ready and SQL leads, and they exceeded expectations. Their team delivered highly convertible leads through a combination of telemarketing and email strategies.'],
];

SG.cases = [
  ["Building Trust Through Transparency: Our ABM Partner's Success with SalesGarners and X-Engage",'#6D43E7','#2563EB'],
  ['Converting Interest to Action: Multi-Touch MQL Campaign for SAP Combining Content, Outreach, and Conversations','#BB32C8','#6D43E7'],
  ['Empowering our Demand Platform Partner to Secure Enterprise Budgets with SalesGarners and X-Engage','#0EA5E9','#6D43E7'],
  ['Driving 4,000 Qualified Leads for a Global Cybersecurity Firm: High-Intent Content Syndication at Scale','#DB2777','#7C3AED'],
];

SG.blogs = [
  ['AI-Powered B2B Demand Generation in 2026: How Buyer Intent Is Changing the Game','October 14, 2026'],
  ["Demand Generation: How to Build a Pipeline That Doesn't Depend on Luck",''],
  ['B2B Demand Generation: Strategies to Attract and Convert the Right Buyers',''],
  ['Demand Generation: How B2B Companies Can Build Interest Before the Buyer Is Ready to Buy',''],
  ['Content Syndication: How B2B Brands Can Reach the Right Buyers Beyond Their Own Website',''],
  ['Content Syndication: The B2B Lead Generation Channel That Scales',''],
];

SG.whitepapers = ['SMART LEAD TARGETING PLAYBOOK','UNLOCK 3X ROI WITH THE POWER OF INTENT-DRIVEN DEMAND GENERATION',"THE INTENT DATA BUYER'S GUIDE",'CLIENT EXPERIENCE PLAYBOOK'];

// Leadership. photo: file name in /public/team (used when present), legacy: old WordPress URL used as a fallback.
SG.team = [
  { name: 'Nayil Kazi', role: 'CEO / Founder', photo: 'nayil.png', legacy: 'https://salesgarners.com/wp-content/uploads/2026/03/Nayil-4.png', linkedin: 'https://www.linkedin.com/in/nayil-kazi-4b0105386/', email: 'nayil@salesgarners.com' },
  { name: 'Asma K', role: 'Director – Client Success', photo: 'asma.png', legacy: 'https://salesgarners.com/wp-content/uploads/2026/03/ASMA-0-e1774459475747.png', linkedin: '', email: 'asma@salesgarners.com' },
  { name: 'Shafin Kazi', role: 'Head of Operations & Delivery', photo: 'shafin.png', legacy: 'https://salesgarners.com/wp-content/uploads/2025/10/1.png', linkedin: 'https://www.linkedin.com/in/shafinkazi/', email: 'shafin@salesgarners.com' },
  { name: 'Abrar Jamadar', role: 'Finance Manager', photo: 'abrar.jpeg', legacy: 'https://salesgarners.com/wp-content/uploads/2026/02/2026-02-25-at-4.49.57-PM.jpeg', linkedin: 'https://www.linkedin.com/in/abrar-jamadar-394b9a177', email: 'abrar@salesgarners.com' },
];

SG.audience = {
  industries:[['Business Services',10.48],['Banking & Financial Services',9.32],['Healthcare & Biotech',8.15],['Insurance',6.98],['Consumer Goods & Services',6.98],['MSPs, Service Providers & Resellers',6.98],['Technology',5.82],['Education',5.82],['Construction & Agriculture',5.82],['Manufacturing & Materials',5.82],['Retail & Wholesale',4.65],['Energy Utilities',4.65],['Recreation & Hospitality',4.65],['Media & Entertainment',3.49],['Publishing',3.49],['Advertising',2.76],['Automotive & Transportation',2.76],['Aerospace & Defense',2.33],['Pharmaceuticals',2.33],['Legal',2.33],['Government',2.33],['Food & Beverage',2.33],['Staffing & Recruiting',1.17],['Travel',1.17],['Telecommunications & VoIP',1.17],['Non-Profit Organizations & Associations',1.17]],
  tabs:{
    'Employee':{title:'Number of Employees by Range',total:'150.00M',rows:[['1 to 99',6.02],['100 to 249',18.07],['250 to 499',4.43],['500 to 749',19.65],['750 to 999',10.45],['1000 to 4999',21.65],['5000 to 9999',25.67],['10,000 +',44.06]]},
    'Job Role':{title:'Number of Employees by Job Role',total:'150.00M',rows:[['C-Level',4.37],['VP / Director',16.57],['Manager',37.50],['Individual Contrib.',71.87],['Senior Staff',10.62],['Junior Staff',9.07]]},
    'Job Functions':{title:'Number of Employees by Job Function',total:'150.00M',rows:[['Information Technology',55.44],['C- Level',11.90],['Marketing & Sales',32.88],['Supply Chain',7.51],['Administrative',22.55],['Human Resource',9.08],['Operations',10.64]]},
  }
};

SG.trustedText = 'We are proud to collaborate with some of the most innovative minds in the demand generation industry. By partnering with leading agencies, we help deliver impactful campaigns that drive stronger engagement, higher quality leads, and better conversions for several top global brands.';
SG.dbText = 'Our global network of publishing sites captures high intent demand at scale, giving you direct access to the right audience. We are privileged to work with hundred future thinking awesome businesses including many of the world.';
SG.pubText = 'SalesGarners runs six independent B2B technology news sites. Each one publishes daily news, expert interviews, guest columns and research for the people who buy, build and sell technology.';
SG.ctaText = 'Don’t let outdated strategies stop you from driving growth. Book a strategy session with Salesgarners to accelerate toward your revenue goals.';
SG.address = 'SalesGarners Marketing Pvt Ltd, Office Number - 1506, 15th Floor, Nyati Enthral, Kharadi South Main Road, Thite Nagar, Kharadi, Pune, Maharashtra 411014';

SG.privacy = [
 ['', ['SalesGarners comply with various global data security laws such as Global Data Protection Right (GDPR) and CAN-SPAM Act. Our team is well informed of changes happening in the law and enforcement methods. We track all the website data entries that are stored or transferred or deleted to ensure the data security of our visitors. Preventing breaches and ensuring data safety is our top priority. We also adhere to the CAN-SPAM Act for our commercial email to the clients. We respect our customer’s rights and comply for the better benefit of all.',
  'SalesGarners understands the importance of your personal privacy. Therefore, we have created this Privacy Policy so that you know how we use and disclose your information when you make it available to us. The Privacy Policy below discloses our practices regarding information collection and usage website located at www.salesgarners.com the related mobile website, and the mobile application (collectively, the “Websites”) and the service provided thereon (the “Service”).',
  'By using or accessing the Websites and the Service, you signify your agreement to be bound by this Privacy Policy. IF YOU DO NOT AGREE TO THIS PRIVACY POLICY YOU MAY NOT ACCESS OR OTHERWISE USE OUR SERVICE OR PARTICIPATE IN OUR SERVICES.',
  'Key aspects of our privacy practices described in this Privacy Policy include the following explanations:',
  ['The information we collect and why we collect it;','How we use that information;','How we share information; and','The choices we offer.']]],
 ['Personally Identifiable Information That We Collect', ['We may ask you for, or you may voluntarily submit, personally identifiable information when you are using the Service. The personally identifiable information which you may provide to us could include, but is not limited to:',
  ['Your name','Your contact information (including, without limitation, address and email address);','Your IP address; and','Other personal information.']]],
 ['Non-Personal Or Aggregate Information That We Collect', ['When you access our Service, we may automatically collect non-personally identifiable information from you, such as IP host address, web pages viewed, browser type, operating system, referring service, search information, device type, page views, usage and browsing habits on the Service and similar data. We may also aggregate demographic information collected from our users (such as the number of users in a geographical location) in a manner which does not identify any one individual. We may also aggregate information collected offline in connection with the Service, obtain non-personally identifiable information from third party sources and develop aggregate information by anonymizing previously collected personally identifiable information.',
  'It is possible at times when collecting non-personally identifiable information through automatic means that we may unintentionally collect or receive personally identifiable information that is mixed in with the non-personally identifiable information. While we will make reasonable efforts to prevent such incidental data collection, the possibility still exists. If you believe that we have inadvertently collected your personal information, please notify us at compliance@salesgarners.com']],
 ['Information Usage', ['We will only use your personally identifiable information as described below, unless you have specifically consented to another type of use, either at the time the personally identifiable information is collected from you or through some other form of consent from you or notification to you:',
  ['We may share your personally identifiable information collected in connection with providing the Service.','We may use your personally identifiable information to respond to your inquiries or requests.','We may use your personally identifiable information to send you emails from time to time about our services, but we will not provide your personally identifiable information to third parties for them to contact you directly unless otherwise permitted by this Privacy Policy or you provide your consent.','We may share your personally identifiable information with third parties (collectively, the “Third Party Vendors”) to further the purpose for which you provided such information to us. For example, we may share your information with Email Service Providers, for the purpose of sending emails. We urge you to read the privacy practices of all our Third-Party Vendors before submitting any personally identifiable information through the Service.','We may disclose personally identifiable information as required by law or legal process.','We may disclose personally identifiable information to investigate suspected fraud, harassment or other violations of any law, rule or regulation, or the terms or policies for our services or our sponsors.','We may transfer your personally identifiable information in connection with the sale or merger or change of control of SalesGarners or the division responsible for the services with which your personally identifiable information is associated.','We may share your personally identifiable information with an affiliate of SalesGarners who is in the same corporate family as us as long as their privacy practices are substantially similar to ours.'],
  'Non-personally identifiable or aggregate information may be used by us for any purposes permitted by law and may be shared with any number of parties, provided that such information shall not specifically identify you.']],
 ['Cookies and Similar Technologies', ['“Cookies” are pieces of information that may be placed on your computer by a service for the purpose of facilitating and enhancing your communication and interaction with that service. Many services use cookies for these purposes. We may use cookies (and similar items such as clear gifs, web beacons, tags, etc.) on our Service to customize your visit and for other purposes to make your visit more convenient or to enable us to enhance our Service. We may also use and place cookies (and similar items) on your computer from our third-party service providers in connection with the Service, such as an analytics provider that helps us manage and analyze Service usage, as described more fully below. In addition, our advertisers and business partners may set cookies and similar items on your computer when you use our Service. You may stop or restrict the placement of cookies on your computer or flush them from your browser by adjusting your web browser preferences, in which case you may still use our Service, but it may interfere with some of its functionality. Cookies and similar items are not used by us to automatically retrieve personally identifiable information from your computer without your knowledge.',
  'If you delete your cookies, change browsers or use a different cookie, our cookie (or an opt-out cookie) may no longer work and you will have to re-input (or opt-out) again.']],
 ['Analytics and Conversion Tracking', ['We may use analytics services that use cookies, javascript and similar technologies to help us analyze how users use the Service. The information generated by these services about your use of the Service (including your IP address or a truncated version of your IP address) is transmitted to and stored by analytics service providers on their servers. Those service providers will use this information for the purpose of evaluating your, and other users’, use of the Service, compiling reports for us on website activity and providing other services relating to website activity and Internet usage.',
  'We may collect information about your computer, including your IP address, operating system and browser type, for system administration and in order to create reports. This is statistical data about our users’ browsing actions and patterns and does not identify any individual.',
  'For example, we use cookies on our site for Google Analytics (the “Analytics Service”). The Analytics Service is a web-based analytics tool that helps website owners understand how visitors engage with their website. The Analytics Service customers can view a variety of reports about how visitors interact with their website so that they can improve it.',
  'Like many services, the Analytics Service uses first-party cookies to track visitor interactions as in our case, where they are used to collect information about how visitors use our site. We then use the information to compile reports and to help us improve our site.',
  'The Analytics Service collects information anonymously. They report website trends without identifying individual visitors. You can opt out of the Analytics Service without affecting how you visit our site. For more information on opting out of being tracked by Google Analytics across all websites you use, visit https://tools.google.com/dlpage/gaoptout.',
  'We may also use Google conversion tracking and/or similar services to help us understand your and other users’ use of the Service.']],
 ['Automatically Collected Information', ['When you access the Service or open one of our HTML emails, we may automatically record certain information from your system by using cookies and other types of tracking technologies. This “automatically collected” information may include Internet Protocol address (“IP Address”), a unique user ID, device type, device identifiers, browser types and language, referring and exit pages, platform type, version of software installed, system type, the content and pages that you access on the Service, the number of clicks, the amount of time spent on pages, the dates and times that you visit the Service, and other similar information. Depending on the law of your country of residence, your IP address may legally be considered personally identifiable information.']],
 ['Security', ['The security of your personally identifiable information is very important to us. When we collect your personally identifiable information online, we use reasonable efforts to protect it from unauthorized access. However, due to the inherent open nature of the Internet, we cannot guarantee that your personally identifiable information will be completely free from unauthorized access by third parties such as hackers and your use of our Service demonstrates your assumption of this risk. We have put in place reasonable physical, electronic, and managerial procedures to safeguard the information we collect. Only those employees who need access to your information in order to perform their duties are authorized to have access to your personally identifiable information. For more information on protecting your privacy, please visit www.ftc.gov/privacy.']],
 ['Your Disclosures in Blogs and Other Social Media', ['You should be aware that personally identifiable information which you voluntarily include and transmit online on the Service or in a publicly accessible blog, chat room, social media platform or otherwise online, or that you share in an open forum such as an in-person panel or survey, may be viewed and used by others without any restrictions. We are unable to control such uses of your personally identifiable information, and by using the Service or any other online services you assume the risk that the personally identifiable information provided by you may be viewed and used by third parties for any number of purposes.',
  'If you login to the Websites and/or Service through your Facebook account, connect to a third party service such as Facebook or Twitter through an icon or link on the Service or otherwise link your SalesGarners account with a third party service, we may share the contents of your post and associated information (such as your user name, the fact that your connection originated from the Service, and other relevant usage and diagnostic information) with such third party. With your one-time consent, we may also send information about the content you watch and your activities on the Service to such third parties. Once such information is shared, the use of your information will be subject to that service’s privacy policy and this Privacy Policy will not apply.']],
 ['Protection for Children', ['We generally do not collect personally identifiable information from children under the age of 13. If at any time in the future we plan to collect personally identifiable information from children under 13, such collection and use, to the extent applicable, shall, when required, be done in compliance with the Children’s Online Privacy Protection Act (“COPPA”) and appropriate consent from the child’s parent or guardian will be sought where required by COPPA. When we become aware that personally identifiable information from a child under 13 has been collected without such child’s parent or guardian’s consent, we will use all reasonable efforts to delete such information from our database.']],
 ['Other Services', ['As a convenience to you, we may provide links to third-party Services from within our Service. We are not responsible for the privacy practices or content of these third-party sites. When you link away from our Service, you do so at your own risk.']],
 ['Changes to this Privacy Policy', ['We reserve the right, at our discretion, to change, modify, add, or remove portions from this Privacy Policy at any time. However, if at any time in the future we plan to use personally identifiable information in a way that materially differs from this Privacy Policy, including sharing such information with more third parties, we will post such changes here and provide you the opportunity to opt-out of such differing uses. Your continued use of the Service and our services following the posting of any changes to this Privacy Policy means you accept such changes.']],
 ['Opt-Out Process', ['All unsubscribe or opt-out requests may be made by clicking the “unsubscribe” link at the bottom of the relevant email. We will process your request within a reasonable time after receipt. However, we are not responsible for, and in some cases we are incapable of, removing your personally identifiable information from the lists of any third party who has previously been provided your information in accordance with this Privacy Policy or your consent. You should contact such third parties directly. If you would like to update or correct any personally identifiable information that you have provided to us, please email us at compliance@salesgarners.com and once we confirm your information, we will update such information within a reasonable amount of time.']],
 ['Communications with SalesGarners', ['By providing your contact information to us (including, without limitation, your email address, physical address, and phone number) (collectively the “Channels”) to us, you expressly consent to receive communications from us. We may use the Channels to communicate with you, to send information that you have requested or to send information about other products or services developed or provided by us or our business partners, provided that, we will not give your contact information to another party to promote their products or services directly to you without your consent or as set forth in this Privacy Policy.',
  'By providing your phone number to us, you expressly consent to receive phone calls and/or text messages from us. We will not give your phone number to another party to promote their products or services directly to you without your consent or as set forth in this Privacy Policy.',
  'Any phone calls and/or text messages delivered to your phone or device may cause you to incur extra data, text messaging, or other charges from your wireless carrier. MESSAGE AND DATA RATES MAY APPLY. You are solely responsible for any carrier charges incurred as a result of phone and/or text communications from SalesGarners.',
  'Any communication or material you transmit to us by email or otherwise, including any data, questions, comments, suggestions, or the like is, and will be treated as, non-confidential and non-proprietary. Except to the extent expressly covered by this Privacy Policy, anything you transmit, or post may be used by us for any purpose, including but not limited to, reproduction, disclosure, transmission, publication, broadcast and posting. Furthermore, you expressly agree that we are free to use any ideas, concepts, know-how, or techniques contained in any communication you send to us, as well as any data developed using the content of such communication, without compensation and for any purpose whatsoever, including but not limited to, developing, manufacturing and marketing products and services using such information.']],
 ['No Rights of Third Parties', ['This Privacy Policy does not create rights enforceable by third parties, nor does it require disclosure of any personal information relating to users of the Service.']],
 ['Servers', ['Our servers are maintained in India and the United States. By using the Service, you freely and specifically give us your consent to export your personally identifiable information to India and the United States and to store and use it in India and the United States as specified in this Privacy Policy. You understand that data stored in India and the United States may be subject to lawful requests by the courts or law enforcement authorities in India and the United States.']],
 ['Contact', ['For questions or concerns relating to privacy, we can be contacted at compliance@salesgarners.com']],
 ['Effective Date', ['This Privacy Policy was last updated on 15 March 2025.']],
];

SG.terms = [
 ['Ownership of Site; Agreement to Terms of Use', ['These Terms and Conditions of Use (the “Terms of Use”) apply to the SalesGarners Marketing Pvt. Ltd. website located at www.salesgarners.com and all associated sites linked to www.salesgarners.com by SalesGarners Marketing Pvt. Ltd. (collectively, the “Site”). The Site is the property of SalesGarners Marketing Pvt. Ltd. (“SalesGarners”) and its licensors. BY USING THE SITE, YOU AGREE TO THESE TERMS OF USE; IF YOU DO NOT AGREE, DO NOT USE THE SITE.',
  'SalesGarners reserves the right, at its sole discretion, to change, modify, add, or remove portions of these Terms of Use at any time. It is your responsibility to check these Terms of Use periodically for changes. Your continued use of the Site following the posting of changes will mean that you accept and agree to the changes. As long as you comply with these Terms of Use, SalesGarners grants you a personal, non-exclusive, non-transferable, limited privilege to enter and use the Site.']],
 ['Content', ['All text, graphics, user interfaces, visual interfaces, photographs, trademarks, logos, artwork, and computer code (collectively, “Content”), including but not limited to the design, structure, selection, coordination, expression, “look and feel” and arrangement of such Content, contained on the Site is owned, controlled, or licensed by or to SalesGarners and is protected by trade dress, copyright, patent, and trademark laws.',
  'Except as expressly provided in these Terms of Use, no part of the Site and no Content may be copied, reproduced, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, or distributed in any way for any commercial enterprise, without SalesGarners’ express prior written consent.']],
 ['Your Use of the Site', ['You may not:', ['Use any automatic device, algorithm, or methodology to access, acquire, copy, or monitor any portion of the Site.','Attempt to gain unauthorized access to any portion of the Site or any other systems connected to the Site.','Probe, scan, or test the vulnerability of the Site or any network connected to the Site.','Use the Site for any unlawful or prohibited purpose.']]],
 ['Purchases; Other Terms and Conditions', ['Additional terms and conditions may apply to purchases of goods or services and to specific portions or features of the Site. You agree to abide by such terms and conditions, including where applicable, representing that you are of sufficient legal age to use or participate in such service or feature.']],
 ['Accounts, Passwords, and Security', ['Certain features or services offered on or through the Site may require you to open an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify SalesGarners immediately of any unauthorized use of your account or password.']],
 ['Privacy', ['SalesGarners’ Privacy Policy applies to use of this Site and its terms are made a part of these Terms of Use by this reference. By using the Site, you acknowledge that Internet transmissions are never completely private or secure.']],
 ['Links to Other Sites', ['This Site may contain links to other independent third-party websites (“Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under SalesGarners’ control, and SalesGarners is not responsible for their content.']],
 ['Disclaimers', ['SalesGarners DOES NOT PROMISE THAT THE SITE OR ANY CONTENT, SERVICE, OR FEATURE OF THE SITE WILL BE ERROR-FREE OR UNINTERRUPTED. THE SITE AND ITS CONTENT ARE DELIVERED ON AN “AS-IS” AND “AS-AVAILABLE” BASIS. SalesGarners DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED.']],
 ['Limitation of Liability', ['TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SALES GARNERS, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SITE.']],
 ['Indemnity', ['You agree to defend, indemnify, and hold SalesGarners harmless from and against any claims, liabilities, damages, judgments, or losses arising out of or relating to your violation of these Terms of Use or your use of the Site.']],
 ['Governing Law', ['These Terms of Use shall be governed by and construed in accordance with the laws of India. You agree to submit to the personal jurisdiction of the courts located in India for the resolution of any disputes.']],
 ['Changes to These Terms of Use', ['SalesGarners reserves the right to change these Terms of Use at any time. Any changes will be effective immediately upon posting on the Site, and your continued use of the Site constitutes your acceptance of the new Terms of Use.']],
 ['Contact Information', ['If you have any questions about these Terms of Use, please contact us at:', 'SalesGarners Marketing Pvt. Ltd.', 'Email: info@salesgarners.com', 'Phone: +91 9307444863']],
];

export const LINKS = { demo: 'https://calendly.com/salesgarners', portal: 'https://x-engage.com/', calc: 'https://sg-pipeline-calculator.vercel.app/' };
export const NAV_MAIN = [['Home','/'],['About','/about'],['Our Services','/b2b-content-syndication'],['Audience Overview','/audience-overview'],['Publications','/publications'],['X-Engage','/x-engage'],['Contact Us','/contact-us']];
export const RESOURCES = [['Blogs','/blog','file'],['Case Study','/case-study','trending'],['WhitePaper','/whitepaper','download'],['Culture & Careers','/careers','users']];

// Careers page copy (new page, not on the current site: edit freely)
export const CAREERS = {
  eyebrow: 'Culture & Careers at SalesGarners',
  title: 'Build the future of B2B demand generation',
  lead: 'Join a team in Pune that runs six B2B technology publications, the X-Engage platform and global demand generation campaigns for brands across NA, EMEA, APAC, LATAM and ANZ.',
  perks: [
    ['globe', 'Global campaigns', 'Work on campaigns for B2B tech brands in every major market.'],
    ['activity', 'Data and product', 'Get hands-on with first-party data, intent signals and X-Engage.'],
    ['users', 'Small, sharp team', 'Ownership from day one and direct access to leadership.'],
    ['trending', 'Room to grow', 'Clear growth paths across marketing, sales, data and technology.'],
  ],
};

// Client logos for the "Trusted by" strip: [slug, name, colour file extension].
// Grey: /public/clients/<slug>.png · Colour (shown on hover): /public/clients/color/<slug>.<ext>
export const CLIENTS = [
  ['lumen', 'Lumen', 'svg'],
  ['suse', 'SUSE', 'svg'],
  ['secureworks', 'Secureworks', 'svg'],
  ['1password', '1Password', 'svg'],
  ['aws', 'AWS', 'svg'],
  ['stripe', 'Stripe', 'svg'],
  ['aon', 'Aon', 'svg'],
  ['adobe', 'Adobe', 'svg'],
  ['autodesk', 'Autodesk', 'svg'],
  ['genesys', 'Genesys', 'svg'],
  ['salesforce', 'Salesforce', 'svg'],
  ['airwallex', 'Airwallex', 'png'],
  ['netapp', 'NetApp', 'png'],
  ['paloalto', 'Palo Alto Networks', 'svg'],
  ['bloomberg', 'Bloomberg', 'svg'],
  ['hpe-aruba', 'HPE Aruba Networking', 'svg'],
  ['slack', 'Slack', 'svg'],
  ['ibm', 'IBM', 'svg'],
  ['shopify', 'Shopify', 'svg'],
  ['cumulocity', 'Cumulocity', 'svg'],
  ['cloudflare', 'Cloudflare', 'svg'],
  ['creatio', 'Creatio', 'svg'],
  ['3cx', '3CX', 'svg'],
];

// Official social profiles (footer, menu and Google structured data)
export const SOCIAL = [
  ['IG', 'Instagram', 'https://www.instagram.com/salesgarners/'],
  ['in', 'LinkedIn', 'https://www.linkedin.com/company/salesgarners/'],
  ['f', 'Facebook', 'https://www.facebook.com/salesgarners/'],
  ['X', 'X', 'https://x.com/salesgarners'],
];
