import { stylist } from '../src/data/stylist';
import type { StylistRequest } from '../src/data/stylist';

const req: StylistRequest = { occasion: 'office', style: 'classic', budget: '$$$', notes: '' };
const opts = { delayMs: 0 };

test('returns between two and four looks', async () => {
  const r = await stylist.generateLooks(req, [], 0, opts);
  expect(r.looks.length).toBeGreaterThanOrEqual(2);
  expect(r.looks.length).toBeLessThanOrEqual(4);
});

test('puts a look for the requested occasion first', async () => {
  const r = await stylist.generateLooks({ ...req, occasion: 'evening' }, [], 0, opts);
  expect(r.looks[0].look.occasion).toBe('evening');
});

test('consecutive rounds never repeat the same lead look', async () => {
  let prev = '';
  for (let round = 0; round < 10; round++) {
    const r = await stylist.generateLooks(req, [], round, opts);
    expect(r.looks.length).toBeGreaterThan(0);
    expect(r.looks[0].look.id).not.toBe(prev);
    prev = r.looks[0].look.id;
  }
});

test('without a closet the result says it is not based on the wardrobe', async () => {
  const r = await stylist.generateLooks(req, [], 0, opts);
  expect(r.basedOnWardrobe).toBe(false);
  expect(r.looks.every((l) => l.fromCloset.length === 0)).toBe(true);
});

test('uses a matching closet item in place of a catalog piece', async () => {
  const closet = [{ id: 'c1', name: 'My black blazer', category: 'outerwear' as const, color: 'Black' }];
  const r = await stylist.generateLooks(req, closet, 0, opts);
  expect(r.basedOnWardrobe).toBe(true);
  expect(r.looks[0].fromCloset.map((c) => c.id)).toContain('c1');
});
