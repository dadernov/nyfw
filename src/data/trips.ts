import { content } from './content';
import type { ChecklistGroup, ChecklistItem, ClosetItem, Look, Occasion, Product, Trip, TripRequest } from './types';

// Demo climate table; the real service calls a weather API and falls back to this manual path.
const CLIMATE: Record<string, { tempC: number; summary: string }> = {
  'new york': { tempC: 9, summary: 'Crisp, sunny spells' },
  paris: { tempC: 11, summary: 'Mild with light rain' },
  london: { tempC: 10, summary: 'Overcast, showers likely' },
  milan: { tempC: 12, summary: 'Cool and clear' },
  tokyo: { tempC: 15, summary: 'Dry and bright' },
  dubai: { tempC: 29, summary: 'Hot and sunny' },
  miami: { tempC: 27, summary: 'Warm, humid' },
  'los angeles': { tempC: 21, summary: 'Sunny' },
  copenhagen: { tempC: 7, summary: 'Windy, cold evenings' },
};

const PURPOSE: Record<TripRequest['purpose'], Occasion[]> = {
  business: ['office', 'travel', 'evening'],
  leisure: ['weekend', 'everyday', 'travel'],
  'fashion-week': ['event', 'evening', 'office'],
  wedding: ['event', 'evening', 'weekend'],
};

const GROUP: Record<Product['category'], ChecklistGroup> = {
  outerwear: 'clothing', tops: 'clothing', knitwear: 'clothing', bottoms: 'clothing', dresses: 'clothing',
  shoes: 'shoes', bags: 'accessories', accessories: 'accessories', jewelry: 'accessories',
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function tripDates(start: string, end: string, max = 14): string[] {
  const d = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  const out: string[] = [];
  do {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  } while (d <= last && out.length < max);
  return out;
}

export function forecastFor(req: TripRequest): Trip['forecast'] {
  if (req.tempC !== undefined) return { tempC: req.tempC, summary: 'Set by you', manual: true };
  const c = CLIMATE[req.destination.trim().toLowerCase()];
  return c ? { ...c, manual: false } : { tempC: 18, summary: 'Seasonal average — adjust if you know better', manual: false };
}

function rankLooks(looks: Look[], req: TripRequest, tempC: number) {
  const occasions = PURPOSE[req.purpose];
  const s = (l: Look) =>
    (occasions.includes(l.occasion) ? 3 - occasions.indexOf(l.occasion) : 0) +
    (l.style === req.style ? 2 : 0) +
    (tempC >= l.tempMin - 3 && tempC <= l.tempMax + 3 ? 3 : 0);
  return [...looks].sort((a, b) => s(b) - s(a));
}

function essentials(tempC: number, days: number): string[] {
  const list = ['Passport & documents', 'Phone charger & adapter', 'Travel steamer', 'Skincare minis'];
  if (tempC < 14) list.push('Compact umbrella');
  if (tempC >= 22) list.push('SPF 50');
  if (days > 4) list.push('Laundry bag');
  return list;
}

// Mock of "Pack My Trip": builds a capsule from curated looks, preferring the user's own pieces.
async function buildTrip(req: TripRequest, closet: ClosetItem[], opts = { delayMs: import.meta.env.MODE === 'test' ? 0 : 1600 }): Promise<Trip> {
  const [looks, products] = await Promise.all([content.getLooks(), content.getProducts()]);
  const byId = new Map(products.map((p) => [p.id, p]));
  const forecast = forecastFor(req);
  const dates = tripDates(req.start, req.end);
  const ranked = rankLooks(looks, req, forecast.tempC);
  const size = req.luggage === 'carry-on' ? 8 : 12;

  const capsule: string[] = [];
  for (const look of ranked) for (const id of look.items) if (capsule.length < size && !capsule.includes(id)) capsule.push(id);

  const usable = ranked.filter((l) => l.items.every((id) => capsule.includes(id)));
  const dayLooks = usable.length ? usable : ranked.slice(0, 1);
  const days = dates.map((date, i) => {
    const look = dayLooks[i % dayLooks.length];
    const label = i === 0 ? 'Arrival' : i === dates.length - 1 ? 'Departure' : req.dressCodes[(i - 1) % Math.max(1, req.dressCodes.length)] ?? 'City day';
    return { date, label, lookTitle: look.title, items: look.items };
  });

  const used = new Set<string>();
  const checklist: ChecklistItem[] = [];
  const missing: string[] = [];
  for (const id of capsule) {
    const p = byId.get(id)!;
    const own = closet.find((c) => c.category === p.category && !used.has(c.id));
    if (own) {
      used.add(own.id);
      checklist.push({ id: `k-${own.id}`, group: GROUP[p.category], label: own.name, packed: false, closetId: own.id });
    } else {
      checklist.push({ id: `k-${id}`, group: GROUP[p.category], label: p.name, packed: false, productId: id });
      missing.push(id);
    }
  }
  essentials(forecast.tempC, dates.length).forEach((label, i) =>
    checklist.push({ id: `e-${i}`, group: 'essentials', label, packed: false }));

  if (opts.delayMs) await wait(opts.delayMs);
  return {
    id: `t-${Date.now().toString(36)}`, request: req, forecast, capsule, days, checklist,
    missing: missing.slice(0, 5), basedOnWardrobe: used.size > 0,
  };
}

// Next look for one day of a trip that still suits the weather.
export function nextDayLook(looks: Look[], currentTitle: string, tempC: number): Look {
  const fits = looks.filter((l) => tempC >= l.tempMin - 3 && tempC <= l.tempMax + 3);
  const pool = fits.length > 1 ? fits : looks;
  const i = pool.findIndex((l) => l.title === currentTitle);
  return pool[(i + 1) % pool.length];
}

export const trips = { buildTrip };
