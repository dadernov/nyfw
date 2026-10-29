import { trips } from '../src/data/trips';
import type { TripRequest } from '../src/data/types';

const base: TripRequest = { destination: 'Paris', start: '2026-11-03', end: '2026-11-06', purpose: 'business', dressCodes: ['Business'], luggage: 'suitcase', style: 'classic' };
const opts = { delayMs: 0 };

test('one day per date, inclusive', async () => {
  const t = await trips.buildTrip(base, [], opts);
  expect(t.days.map((d) => d.date)).toEqual(['2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06']);
});

test('carry-on capsule is not larger than the suitcase one', async () => {
  const s = await trips.buildTrip(base, [], opts);
  const c = await trips.buildTrip({ ...base, luggage: 'carry-on' }, [], opts);
  expect(c.capsule.length).toBeLessThan(s.capsule.length);
});

test('manual temperature overrides the forecast', async () => {
  const t = await trips.buildTrip({ ...base, tempC: 27 }, [], opts);
  expect(t.forecast).toMatchObject({ tempC: 27, manual: true });
});

test('known city gets a demo forecast', async () => {
  const t = await trips.buildTrip(base, [], opts);
  expect(t.forecast.manual).toBe(false);
  expect(typeof t.forecast.tempC).toBe('number');
});

test('empty closet: universal capsule with missing items', async () => {
  const t = await trips.buildTrip(base, [], opts);
  expect(t.basedOnWardrobe).toBe(false);
  expect(t.missing.length).toBeGreaterThan(0);
});

test('closet pieces are packed instead of buying them', async () => {
  const closet = [{ id: 'c1', name: 'My trench', category: 'outerwear' as const, color: 'Beige' }];
  const t = await trips.buildTrip(base, closet, opts);
  expect(t.basedOnWardrobe).toBe(true);
  expect(t.checklist.some((i) => i.closetId === 'c1')).toBe(true);
});

test('checklist covers all four groups', async () => {
  const t = await trips.buildTrip(base, [], opts);
  expect(new Set(t.checklist.map((i) => i.group))).toEqual(new Set(['clothing', 'shoes', 'accessories', 'essentials']));
});

test('end before start still yields one day', async () => {
  const t = await trips.buildTrip({ ...base, end: '2026-11-01' }, [], opts);
  expect(t.days).toHaveLength(1);
});

test('restyling a hot-weather day never picks a cold-weather look', async () => {
  const { nextDayLook } = await import('../src/data/trips');
  const { content } = await import('../src/data/content');
  const looks = await content.getLooks();
  let current = 'Somewhere Warm';
  for (let i = 0; i < 6; i++) {
    const next = nextDayLook(looks, current, 29);
    expect(next.title).not.toBe(current);
    expect(next.tempMax + 3).toBeGreaterThanOrEqual(29);
    current = next.title;
  }
});
