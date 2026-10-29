export type StyleKey = 'minimal' | 'classic' | 'editorial' | 'relaxed' | 'romantic';
export type Occasion = 'office' | 'everyday' | 'evening' | 'event' | 'weekend' | 'travel';
export type Budget = '$' | '$$' | '$$$';
export type Category = 'outerwear' | 'tops' | 'knitwear' | 'bottoms' | 'dresses' | 'shoes' | 'bags' | 'accessories' | 'jewelry';

export interface Product {
  id: string;
  name: string;
  brand: string;
  designerId?: string;
  partner: string;
  category: Category;
  color: string;
  price: number;
  currency: 'USD';
  url: string;
  affiliate: boolean;
  image: string;
}

export interface Designer {
  id: string;
  name: string;
  city: string;
  tagline: string;
  bio: string;
  image: string;
  collection: { title: string; season: string; images: string[] };
  tags: string[];
  website: string;
}

export interface Trend {
  id: string;
  title: string;
  season: string;
  category: 'Silhouette' | 'Color' | 'Fabric' | 'Accessory';
  summary: string;
  body: string;
  colors: string[];
  silhouettes: string[];
  designers: string[];
  products: string[];
  image: string;
  updated: string;
  realLife: Record<StyleKey, string>;
}

export interface Look {
  id: string;
  title: string;
  occasion: Occasion;
  style: StyleKey;
  budget: Budget;
  tempMin: number;
  tempMax: number;
  why: string;
  items: string[];
  alternatives: string[];
  image: string;
}

export interface ClosetItem {
  id: string;
  name: string;
  category: Category;
  color: string;
  photo?: string;
}
