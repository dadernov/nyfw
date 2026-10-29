import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from './render';

test('first visit to home goes to onboarding', () => {
  renderAt('/', { onboarded: false });
  expect(screen.getByRole('button', { name: /begin/i })).toBeInTheDocument();
});

test('completing onboarding greets the user by name', async () => {
  const u = userEvent.setup();
  renderAt('/onboarding', { onboarded: false });
  await u.click(screen.getByRole('button', { name: /begin/i }));
  await u.click(screen.getByRole('button', { name: /continue with email/i }));
  await u.type(screen.getByLabelText(/first name/i), 'Narine');
  await u.click(screen.getByRole('button', { name: /^continue$/i }));
  await u.click(await screen.findByRole('button', { name: /minimal/i }));
  for (let i = 0; i < 5; i++) await u.click(await screen.findByRole('button', { name: /^(continue|skip)$/i }));
  await u.click(await screen.findByRole('button', { name: /start styling/i }));
  expect(await screen.findByText(/Welcome,/)).toHaveTextContent('Welcome, Narine');
});

test('guest goes straight to home', async () => {
  const u = userEvent.setup();
  renderAt('/onboarding', { onboarded: false });
  await u.click(screen.getByRole('button', { name: /begin/i }));
  await u.click(screen.getByRole('button', { name: /continue as guest/i }));
  expect(await screen.findByText(/Welcome,/)).toHaveTextContent('Welcome, Guest');
});
