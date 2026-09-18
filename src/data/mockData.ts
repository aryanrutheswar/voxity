import { Service, PortfolioItem, CaseStudy, Testimonial, PricingPlan, BlogPost, FAQItem, TeamMember } from '@/types';

export const HERO_STATS = [
  { label: 'Ad Capital Managed', value: 45, prefix: '₹', suffix: 'Cr+' },
  { label: 'Avg ROAS Generated', value: 4.8, suffix: 'x' },
  { label: 'Active Client Growth', value: 98, suffix: '%' },
  { label: 'Qualified Leads Delivered', value: 120, suffix: 'K+' }
];

export const CLIENT_LOGOS = [
  { name: 'Fintech Scale', symbol: 'AURA' },
  { name: 'SaaS Flow', symbol: 'NEXUS' },
  { name: 'E-Com Vault', symbol: 'PRISM' },
  { name: 'Health Pulse', symbol: 'VITA' },
  { name: 'AI Core', symbol: 'SYNAPSE' }
];

export const SERVICES: Service[] = [
  {
    id: 'ig-ads-boosting',
    title: 'Instagram Ads & Post Boosting',
    subtitle: 'Scale reach, engagement, and direct DM conversions',
    description: 'Hyper-targeted Instagram feed, story & reel ad campaigns combined with strategic post boosting for maximum profile traffic and sales leads.',
    shortDesc: 'Hyper-targeted Instagram feed, story & reel ads with strategic post boosting to drive direct DM leads and website sales.',
    iconName: 'Instagram',
    category: 'Growth',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    expectedROI: '3.8x - 6.2x Return on Ad Spend',
    metrics: { label: 'Target Benchmark', value: '4.5x ROAS' },
    features: ['Custom Audience & Interest Targeting', 'Story & Reel Ad Creatives', 'Strategic Post Boosting', 'Conversion Pixel & Retargeting']
  },
  {
    id: 'video-editing',
    title: 'Reels & Video Editing',
    subtitle: 'High-hook short-form videos engineered for virality',
    description: 'Professional editing for Instagram Reels, YouTube Shorts & TikTok. Complete with dynamic captions, sound design, hooks, and motion graphics.',
    shortDesc: 'High-hook short-form video editing for Reels & Shorts with motion graphics, viral captioning, and high-retention pacing.',
    iconName: 'Video',
    category: 'Creative',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
    expectedROI: '+300% Higher Watch Time',
    metrics: { label: 'Target Benchmark', value: '3x Organic Views' },
    features: ['High-Hook Opening Cuts', 'Dynamic Animated Captions', 'Color Grading & Sound FX', 'Ad Creative Iterations']
  },
  {
    id: 'meta-ads',
    title: 'Meta Performance Ads',
    subtitle: 'Full-funnel Facebook & Instagram ad scaling',
    description: 'Data-driven paid media execution on Facebook & Instagram. From cold prospect acquisition to lookalike scaling and dynamic catalog retargeting.',
    shortDesc: 'End-to-end Meta ad campaign management, creative testing, and funnel scaling for high-intent customer acquisition.',
    iconName: 'Target',
    category: 'Growth',
    badge: 'Scale Fast',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    expectedROI: '4.2x Average Campaign ROAS',
    metrics: { label: 'Target Benchmark', value: '+280% Sales Growth' },
    features: ['CPA & CAC Optimization', 'Creative Testing Framework', 'Dynamic Catalog & Retargeting', 'Real-Time Analytics Dashboard']
  },
  {
    id: 'google-ppc',
    title: 'Google Ads & PPC Search',
    subtitle: 'Dominate high-intent Google search & YouTube ads',
    description: 'Capture customers actively searching for your solutions. High-converting Google Search, Performance Max, Display, and YouTube ad funnels.',
    shortDesc: 'Capture high-intent buyers with Google Search PPC, Performance Max, and targeted YouTube Video advertising campaigns.',
    iconName: 'Search',
    category: 'Growth',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    expectedROI: '+180% High-Intent Leads',
    metrics: { label: 'Target Benchmark', value: '-35% Cost Per Lead' },
    features: ['High-Intent Keyword Bidding', 'Negative Keyword Audit', 'Landing Page Copy Alignment', 'Conversion & Tag Manager Setup']
  },
  {
    id: 'seo',
    title: 'Search Engine Optimization',
    subtitle: 'Rank #1 on search engines organically',
    description: 'Technical SEO audits, keyword strategy, high-authority backlink acquisition, and content optimization to capture sustainable search traffic.',
    shortDesc: 'Drive high-volume organic search traffic through technical site fixes, keyword-targeted content hubs, and link building.',
    iconName: 'TrendingUp',
    category: 'Growth',
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&q=80&w=800',
    expectedROI: '+310% Organic Traffic',
    metrics: { label: 'Target Benchmark', value: 'Top 3 Keyword Ranks' },
    features: ['Technical SEO Audits', 'High-DA Backlink Building', 'On-Page Content Structuring', 'Google Business & Local SEO']
  },
  {
    id: 'ugc-influencer',
    title: 'UGC & Influencer Marketing',
    subtitle: 'Creator partnerships that build instant social proof',
    description: 'Match your brand with vetted creators for authentic User-Generated Content (UGC) videos and micro-influencer product placement campaigns.',
    shortDesc: 'Vetted creator matchmaking for authentic User-Generated Content (UGC) videos that build trust and multiply ad conversions.',
    iconName: 'UserCheck',
    category: 'Creative',
    badge: 'High CVR',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    expectedROI: '2.4x Higher CTR on Ads',
    metrics: { label: 'Target Benchmark', value: '+40% Ad CTR' },
    features: ['Niche Creator Sourcing', 'High-Converting UGC Scripts', 'Usage Rights Licensing', 'Influencer Seeding & Outreach']
  },
  {
    id: 'content-copy',
    title: 'Copywriting & Content Strategy',
    subtitle: 'Words that sell, convince, and convert',
    description: 'Conversion-focused copywriting for ad campaigns, landing pages, email flows, and social media content strategies.',
    shortDesc: 'Strategic sales copy, ad headlines, video scripts, and landing page content tailored to convert cold prospects into buyers.',
    iconName: 'FileText',
    category: 'Creative',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    expectedROI: '+45% Higher Conversion Rate',
    metrics: { label: 'Target Benchmark', value: '2x Sales Conversion' },
    features: ['Ad Headline & Scriptwriting', 'Sales Landing Page Copy', 'Brand Voice & Messaging', 'SEO Content Strategy']
  },
  {
    id: 'brand-design',
    title: 'Graphic Design & Ad Branding',
    subtitle: 'Eye-catching social visual design & ad banners',
    description: 'Custom social media graphics, ad creatives, carousel slides, promotional banners, and visual brand identity assets.',
    shortDesc: 'High-impact social media creatives, ad banners, carousel carousels, and visual branding designed to stand out in feeds.',
    iconName: 'Palette',
    category: 'Creative',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    expectedROI: 'Instant Brand Recognition',
    metrics: { label: 'Target Benchmark', value: '+150% Feed Attention' },
    features: ['Social Ad Creative Kits', 'Carousel & Story Graphics', 'Brand Visual Guidelines', 'Promotional Banner Design']
  },
  {
    id: 'email-whatsapp',
    title: 'Email & WhatsApp Automation',
    subtitle: 'Automated retention and revenue recovery funnels',
    description: 'Setup automated email drip sequences, abandoned cart recovery, customer re-engagement campaigns, and official WhatsApp broadcast bots.',
    shortDesc: 'Automated email flows and WhatsApp broadcast bots to recover abandoned carts and maximize customer lifetime value.',
    iconName: 'Mail',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    expectedROI: '25-35% Total Revenue from Email',
    metrics: { label: 'Target Benchmark', value: '45% Open Rate' },
    features: ['Abandoned Cart Recovery', 'Klaviyo & Drip Automation', 'WhatsApp API Broadcasts', 'Customer Lifecycle Segmentation']
  },
  {
    id: 'web-cro',
    title: 'High-Converting Landing Pages',
    subtitle: 'Lightning-fast web pages optimized for conversion',
    description: 'Custom Next.js & React landing pages built specifically to maximize campaign conversions with sub-second speed and mobile UX.',
    shortDesc: 'Blazing-fast, custom landing pages and websites engineered with mobile-first UX and conversion rate optimization (CRO).',
    iconName: 'Code',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    expectedROI: '+60% Conversion Rate Increase',
    metrics: { label: 'Target Benchmark', value: '<1s Page Load Speed' },
    features: ['Sub-Second Page Speed', 'Mobile-First UX/UI', 'Conversion Funnel Tracking', 'A/B Split Testing Ready']
  },
  {
    id: 'ai-lead-gen',
    title: 'AI Lead Generation & Chatbots',
    subtitle: 'Automate customer acquisition with intelligent AI',
    description: 'Deploy 24/7 AI chat agents on your website and social channels to instantly qualify leads, capture contact info, and book sales calls.',
    shortDesc: 'Deploy 24/7 AI chat agents that automatically qualify prospects, capture contact details, and schedule sales appointments.',
    iconName: 'Cpu',
    category: 'AI',
    badge: 'AI Powered',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    expectedROI: '10x Faster Lead Response Time',
    metrics: { label: 'Target Benchmark', value: '24/7 Auto Booking' },
    features: ['24/7 Lead Qualification', 'Instant CRM Data Sync', 'Automated Appointment Booking', 'Multi-Channel AI Messaging']
  }
];

export const SERVICES_DATA = SERVICES;

export const PORTFOLIO_ITEMS: PortfolioItem[] = [];
export const CASE_STUDIES: CaseStudy[] = [];
export const TESTIMONIALS: Testimonial[] = [];
export const PRICING_PLANS: PricingPlan[] = [];
export const BLOG_POSTS: BlogPost[] = [];
export const FAQ_ITEMS: FAQItem[] = [];
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Aryan Rutheswar',
    role: 'Growth Director',
    bio: 'Performance marketing and growth engineering specialist.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  }
];
