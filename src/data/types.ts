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

export interface Profile {
  name: string;
  onboarded: boolean;
  styles: StyleKey[];
  budget: Budget;
  brands: string[];
  scenarios: Occasion[];
  sizes: { top?: string; bottom?: string; shoe?: string };
  consents: { location: boolean; photos: boolean; personalization: boolean };
}

export interface TripRequest {
  destination: string;
  start: string; // ISO date
  end: string;
  purpose: 'business' | 'leisure' | 'fashion-week' | 'wedding';
  dressCodes: string[];
  luggage: 'carry-on' | 'suitcase';
  style: StyleKey;
  tempC?: number;
}

export type ChecklistGroup = 'clothing' | 'shoes' | 'accessories' | 'essentials';

export interface ChecklistItem { id: string; group: ChecklistGroup; label: string; packed: boolean; productId?: string; closetId?: string }

export interface Trip {
  id: string;
  request: TripRequest;
  forecast: { tempC: number; summary: string; manual: boolean };
  capsule: string[];
  days: { date: string; label: string; lookTitle: string; items: string[] }[];
  checklist: ChecklistItem[];
  missing: string[];
  basedOnWardrobe: boolean;
}
