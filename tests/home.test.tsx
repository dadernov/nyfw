import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt, seed } from './render';

test('guest without a name is greeted as Guest', () => {
  renderAt('/');
  expect(screen.getByText(/Welcome,/)).toHaveTextContent('Welcome, Guest');
});

test.each([
  [/what to wear today/i, /what to wear today/i],
  [/pack my trip/i, /pack my trip/i],
  [/trend report/i, /trend report/i],
])('card %s opens its screen', async (card, heading) => {
  const u = userEvent.setup();
  seed({ profile: { onboarded: true, name: 'Narine' } });
  renderAt('/');
  await u.click(screen.getByRole('link', { name: card }));
  expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
});

test('saved looks appear on home', async () => {
  seed({ profile: { onboarded: true }, saved: ['l-office-ink'] });
  renderAt('/');
  expect(await screen.findByText('Ink Suit, Soft Edge')).toBeInTheDocument();
});
