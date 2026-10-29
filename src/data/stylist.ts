import { content } from './content';
import type { Budget, ClosetItem, Look, Occasion, Product, StyleKey } from './types';

export interface StylistRequest { occasion: Occasion; style: StyleKey; budget: Budget; notes: string }

export interface StyledLook {
  look: Look;
  products: Product[];
  fromCloset: ClosetItem[];
  alternatives: Product[];
}

export interface StylistResult { looks: StyledLook[]; basedOnWardrobe: boolean }

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const HEELS = new Set(['p-pumps-ivory', 'p-pumps-black', 'p-sockboot']);
const FLAT_SHOE = 'p-suede-boot';

// The mock reads a few plain-language wishes; the real stylist passes notes to the LLM.
function readNotes(notes: string) {
  const n = notes.toLowerCase();
  return { noHeels: /heel/.test(n) && /(no|without|flat|avoid)/.test(n) || /flat shoes/.test(n), rain: /rain|wet/.test(n) };
}

function score(l: Look, r: StylistRequest) {
  const { rain } = readNotes(r.notes);
  return (l.occasion === r.occasion ? 4 : 0) + (l.style === r.style ? 2 : 0) + (l.budget === r.budget ? 1 : 0) +
    (rain && l.items.some((id) => id.startsWith('p-trench')) ? 5 : 0);
}

// Mock of the AI stylist: ranks curated looks against the request and swaps in closet pieces.
// The real service grounds an LLM in the same catalog, so the screen contract stays the same.
async function generateLooks(req: StylistRequest, closet: ClosetItem[], round: number, opts = { delayMs: import.meta.env.MODE === 'test' ? 0 : 1400 }): Promise<StylistResult> {
  const [looks, products] = await Promise.all([content.getLooks(), content.getProducts()]);
  const byId = new Map(products.map((p) => [p.id, p]));
  const ranked = [...looks].sort((a, b) => score(b, req) - score(a, req));
  const pool = Math.max(2, ranked.filter((l) => l.occasion === req.occasion).length);
  const lead = ranked[round % pool];
  const picked = [lead, ...ranked.filter((l) => l !== lead).slice(round % 3, (round % 3) + 2)];

  const styled = picked.map((look): StyledLook => {
    const used = new Set<string>();
    const fromCloset: ClosetItem[] = [];
    const items: Product[] = [];
    const { noHeels } = readNotes(req.notes);
    const ids = noHeels ? [...new Set(look.items.map((id) => (HEELS.has(id) ? FLAT_SHOE : id)))] : look.items;
    for (const id of ids) {
      const p = byId.get(id)!;
      const own = closet.find((c) => c.category === p.category && !used.has(c.id));
      if (own) { used.add(own.id); fromCloset.push(own); } else items.push(p);
    }
    return { look, products: items, fromCloset, alternatives: look.alternatives.filter((id) => !(noHeels && HEELS.has(id))).map((id) => byId.get(id)!) };
  });

  if (opts.delayMs) await wait(opts.delayMs);
  return { looks: styled, basedOnWardrobe: styled.some((s) => s.fromCloset.length > 0) };
}

export const stylist = { generateLooks };
