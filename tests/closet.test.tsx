import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt, seed } from './render';

test('adding an item shows it in the closet', async () => {
  const u = userEvent.setup();
  renderAt('/closet');
  await u.click(screen.getByRole('button', { name: /add item/i }));
  const sheet = screen.getByRole('dialog');
  await u.type(within(sheet).getByLabelText(/name/i), 'Vintage trench');
  await u.selectOptions(within(sheet).getByLabelText(/category/i), 'outerwear');
  await u.click(within(sheet).getByRole('button', { name: /add to closet/i }));
  expect(await screen.findByText('Vintage trench')).toBeInTheDocument();
});

test('saved tab lists saved looks', async () => {
  seed({ profile: { onboarded: true }, saved: ['l-evening-slip'] });
  renderAt('/closet?tab=saved');
  expect(await screen.findByText('After Hours')).toBeInTheDocument();
});

test('reset demo empties the closet and returns to onboarding', async () => {
  const u = userEvent.setup();
  seed({ profile: { onboarded: true, name: 'Narine' }, closet: [{ id: 'c1', name: 'Coat', category: 'outerwear', color: 'Black' }] });
  renderAt('/you');
  await u.click(screen.getByRole('button', { name: /reset demo/i }));
  await u.click(within(screen.getByRole('dialog')).getByRole('button', { name: /reset/i }));
  expect(await screen.findByRole('button', { name: /begin/i })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('nyfw-demo-v1')!).closet).toEqual([]);
});

test('profile shows the name and consent toggles persist', async () => {
  const u = userEvent.setup();
  seed({ profile: { onboarded: true, name: 'Narine' } });
  renderAt('/you');
  expect(screen.getByRole('heading', { level: 1, name: 'Narine' })).toBeInTheDocument();
  const loc = screen.getByRole('switch', { name: /location/i });
  await u.click(loc);
  expect(JSON.parse(localStorage.getItem('nyfw-demo-v1')!).profile.consents.location).toBe(true);
});

test('saved look page opens from a link', async () => {
  seed({ profile: { onboarded: true }, saved: ['l-office-ink'] });
  renderAt('/looks/l-office-ink');
  expect(await screen.findByRole('article', { name: 'Ink Suit, Soft Edge' })).toBeInTheDocument();
});
