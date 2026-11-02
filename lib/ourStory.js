// Content for the About page "Our Story" section (components/OurStory.js).
// Edit this file to fill in verified years, photos and reels. Anything left as null
// shows a clearly labelled placeholder on the page, so nothing unverified is published.

// ---- Verified years -------------------------------------------------------------
// Only 2019 (incorporation, 6 Aug 2019) is verified. Replace each null with a year
// like '2021' once confirmed. Leave websiteRefresh as null to hide that milestone.
export const YEARS = {
  websiteLaunch: null,
  websiteRefresh: null,
  xengage: null,
  pubs: {
    techmediaglobal: null,
    martech360hub: null,
    fintech360hub: null,
    hrtech360hub: null,
    salestech360hub: null,
    startup360hub: null,
  },
};
export const SHOW_WEBSITE_REFRESH = true; // set false to hide the "website evolution" milestone

// ---- Publications ---------------------------------------------------------------
// Logos are the official marks already in /public/publications.
export const STORY_PUBS = [
  { slug: 'techmediaglobal', name: 'TechMediaGlobal', focus: 'Enterprise technology', url: 'https://techmediaglobal.com',
    text: 'Global technology news and analysis, from cybersecurity and AI to quantum computing, semiconductors and digital infrastructure.' },
  { slug: 'martech360hub', name: 'MarTech360Hub', focus: 'Marketing technology', url: 'https://martech360hub.com',
    text: 'Marketing technology news, interviews and guest columns for the people running campaigns, content and customer data.' },
  { slug: 'fintech360hub', name: 'FinTech360Hub', focus: 'Financial technology', url: 'https://fintech360hub.com',
    text: 'Coverage of digital payments, banking and AI in finance, with fraud, funding and fintech regulation.' },
  { slug: 'hrtech360hub', name: 'HRTech360Hub', focus: 'HR & workplace technology', url: 'https://hrtech360hub.com',
    text: 'News and analysis on hiring, payroll and workforce technology, plus workplace trends and leadership appointments.' },
  { slug: 'salestech360hub', name: 'SalesTech360Hub', focus: 'Sales & revenue technology', url: 'https://salestech360hub.com',
    text: 'Sales and revenue technology coverage for teams that own pipeline, from revenue operations to lead generation.' },
  { slug: 'startup360hub', name: 'Startup360Hub', focus: 'Startups & funding', url: 'https://startup360hub.com',
    text: 'Startup news and funding stories, with deep tech, AI, enterprise technology and cybersecurity.' },
];

// ---- Photos -----------------------------------------------------------------------
// Put image files in /public/story/ and set src: '/story/diwali-2025.jpg'.
// alt must describe the photo, e.g. 'The SalesGarners team in traditional wear for Diwali'.
// size: 'wide' | 'tall' | undefined (normal tile)
export const STORY_PHOTOS = [
  { cat: 'festive', label: 'Festive celebrations', src: null, alt: '', size: 'wide' },
  { cat: 'traditional', label: 'Traditional days', src: null, alt: '' },
  { cat: 'outings', label: 'Team outings', src: null, alt: '' },
  { cat: 'achievements', label: 'Employee achievements', src: null, alt: '', size: 'tall' },
  { cat: 'events', label: 'Office events', src: null, alt: '' },
  { cat: 'bts', label: 'Behind the scenes', src: null, alt: '' },
  { cat: 'fridays', label: 'Fun Fridays', src: null, alt: '' },
];

// ---- Videos -----------------------------------------------------------------------
// url: an Instagram Reel link (https://www.instagram.com/reel/XXXX/) or a YouTube link.
// poster: optional cover image in /public/story/. Videos only load when clicked, never autoplay.
export const STORY_REELS = [
  { cat: 'festive', label: 'Diwali at SalesGarners', url: null, poster: null },
  { cat: 'fridays', label: 'A day at the office', url: null, poster: null },
];

// Intro images (team photograph + one supporting photo)
export const STORY_INTRO = {
  team: { src: null, alt: 'The SalesGarners team' },
  moment: { src: null, alt: '' },
};

// Our Journey "Then / Now" photos. Put files in /public/story/ and set src, e.g. '/story/old-office.jpg'.
export const STORY_OFFICES = {
  old: { src: null, alt: 'The first SalesGarners office' },
  now: { src: null, alt: 'The SalesGarners office at Nyati Enthral, Kharadi, Pune' },
};

export const STORY_CATS = [
  ['all', 'All'], ['festive', 'Festive celebrations'], ['traditional', 'Traditional days'], ['outings', 'Team outings'],
  ['events', 'Office events'], ['achievements', 'Achievements'], ['bts', 'Behind the scenes'], ['fridays', 'Fun Fridays'],
];
