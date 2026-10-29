import { content } from '../src/data/content';

test('every product links to an https url and has price data', async () => {
  const products = await content.getProducts();
  expect(products.length).toBeGreaterThanOrEqual(30);
  for (const p of products) {
    expect(p.url).toMatch(/^https:\/\//);
    expect(p.price).toBeGreaterThan(0);
    expect(p.currency).toBe('USD');
    expect(typeof p.affiliate).toBe('boolean');
  }
});

test('catalog sizes are big enough for a demo', async () => {
  expect((await content.getTrends()).length).toBeGreaterThanOrEqual(8);
  expect((await content.getDesigners()).length).toBeGreaterThanOrEqual(6);
  expect((await content.getLooks()).length).toBeGreaterThanOrEqual(12);
});

test('every reference resolves', async () => {
  const ids = new Set((await content.getProducts()).map((p) => p.id));
  const designers = new Set((await content.getDesigners()).map((d) => d.id));
  for (const l of await content.getLooks()) for (const id of [...l.items, ...l.alternatives]) expect(ids).toContain(id);
  for (const t of await content.getTrends()) {
    for (const id of t.products) expect(ids).toContain(id);
    for (const d of t.designers) expect(designers).toContain(d);
  }
  for (const p of await content.getProducts()) if (p.designerId) expect(designers).toContain(p.designerId);
});

test('unknown ids resolve to undefined', async () => {
  expect(await content.getTrend('nope')).toBeUndefined();
  expect(await content.getProduct('nope')).toBeUndefined();
});
