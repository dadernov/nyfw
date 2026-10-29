import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from './render';

async function generate() {
  const u = userEvent.setup();
  renderAt('/style');
  await u.click(screen.getByRole('button', { name: 'Office' }));
  await u.click(screen.getByRole('button', { name: /style me/i }));
  await screen.findAllByRole('article');
  return u;
}

test('submitting the brief shows two to four looks', async () => {
  await generate();
  const n = screen.getAllByRole('article').length;
  expect(n).toBeGreaterThanOrEqual(2);
  expect(n).toBeLessThanOrEqual(4);
});

test('without a closet it says looks come from the catalog', async () => {
  await generate();
  expect(screen.getByText(/not based on your wardrobe/i)).toBeInTheDocument();
});

test('save toggles the look into saved', async () => {
  const u = await generate();
  const [first] = screen.getAllByRole('button', { name: /^save look/i });
  await u.click(first);
  expect(screen.getAllByRole('button', { name: /^saved/i }).length).toBe(1);
});

test('regenerate changes the lead look', async () => {
  const u = await generate();
  const before = screen.getAllByRole('article')[0].getAttribute('aria-label');
  await u.click(screen.getByRole('button', { name: /regenerate/i }));
  await screen.findAllByRole('article');
  expect(screen.getAllByRole('article')[0].getAttribute('aria-label')).not.toBe(before);
});

test('shop similar opens the shop for that look', async () => {
  const u = await generate();
  await u.click(screen.getAllByRole('link', { name: /shop similar/i })[0]);
  expect(await screen.findByRole('heading', { level: 1, name: /shop/i })).toBeInTheDocument();
});
