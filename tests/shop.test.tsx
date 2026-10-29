import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from './render';

test('affiliate product is labelled, non-affiliate is not', async () => {
  renderAt('/shop/p-blazer-ink');
  expect(await screen.findByRole('heading', { level: 1, name: 'Cinched Wool Blazer' })).toBeInTheDocument();
  expect(screen.getByText(/affiliate link/i)).toBeInTheDocument();
});

test('non-affiliate product has no affiliate label', async () => {
  renderAt('/shop/p-blazer-relaxed');
  await screen.findByRole('heading', { level: 1, name: 'Relaxed Boyfriend Blazer' });
  expect(screen.queryByText(/affiliate/i)).toBeNull();
});

test('partner store button opens a demo sheet with the store link', async () => {
  const u = userEvent.setup();
  renderAt('/shop/p-blazer-ink');
  await u.click(await screen.findByRole('button', { name: /shop at madison edit/i }));
  const sheet = screen.getByRole('dialog');
  expect(within(sheet).getByRole('link', { name: /continue to madison edit/i })).toHaveAttribute('href', 'https://example.com/demo/shop/p-blazer-ink');
});

test('category filter narrows the grid', async () => {
  const u = userEvent.setup();
  renderAt('/shop');
  await screen.findByRole('link', { name: 'Cinched Wool Blazer' });
  await u.click(screen.getByRole('button', { name: 'Shoes' }));
  expect(screen.queryByRole('link', { name: 'Cinched Wool Blazer' })).toBeNull();
  expect(screen.getByRole('link', { name: 'Pointed Ivory Pumps' })).toBeInTheDocument();
});

test('shop similar shows the look pieces', async () => {
  renderAt('/shop?look=l-office-ink');
  expect(await screen.findByText(/shop the look/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Flat Snake Chain' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Leather Weekender' })).toBeNull();
});
