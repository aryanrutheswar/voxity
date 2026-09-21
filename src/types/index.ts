export type Theme = 'dark' | 'light';

export interface Service {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  shortDesc?: string;
  fullDesc?: string;
  iconName: string;
  category: 'Growth' | 'Creative' | 'Technology' | 'AI';
  badge?: string;
  metrics?: {
    label: string;
    value: string;
  };
  features: string[];
  deliverables?: string[];
  expectedROI?: string;
  image?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  image: string;
  description: string;
  summary?: string;
  challenge?: string;
  solution?: string;
  tags?: string[];
  results?: {
    label: string;
    value: string;
  }[];
  metrics?: {
    label: string;
    value: string;
  }[];
}

export interface CaseStudy {
  id: string;
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  metrics: {
    label: string;
    value: string;
  }[];
  quote?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  verified?: boolean;
  resultsAchieved?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  notIncluded?: string[];
  ctaText?: string;
  popular?: boolean;
}

export interface BlogAuthor {
  name: string;
  role?: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date?: string;
  publishedAt?: string;
  image: string;
  content?: string;
  author: BlogAuthor;
  tags?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  avatar?: string;
  specialty?: string;
  linkedin?: string;
  twitter?: string;
}
