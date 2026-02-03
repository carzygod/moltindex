export type Pricing = "free" | "freemium" | "paid";

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  categories: string[];
  tags: string[];
  pricing: Pricing;
  openSource: boolean;
  cnAvailable: boolean;
  popularity: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  name: string;
  description: string;
  url: string;
  tags?: string[];
  rating?: number;
  updatedAt: string;
  sourceUrl?: string;
  category?: string | null;
}
