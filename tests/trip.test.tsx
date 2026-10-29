import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from './render';

async function plan() {
  const u = userEvent.setup();
  const r = renderAt('/trip');
  await u.clear(screen.getByLabelText(/destination/i));
  await u.type(screen.getByLabelText(/destination/i), 'Paris');
  await u.click(screen.getByRole('button', { name: /pack my suitcase/i }));
  await screen.findByRole('heading', { name: /your capsule/i });
  return { u, ...r };
}

test('planning shows capsule, days and checklist', async () => {
  await plan();
  expect(screen.getByRole('heading', { name: /day by day/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /packing checklist/i })).toBeInTheDocument();
  expect(screen.getByText(/not based on your wardrobe/i)).toBeInTheDocument();
});

test('checked items persist after saving and reopening', async () => {
  const { u, unmount } = await plan();
  const list = screen.getByRole('list', { name: /checklist/i });
  const first = within(list).getAllByRole('checkbox')[0];
  await u.click(first);
  expect(first).toBeChecked();
  await u.click(screen.getByRole('button', { name: /save trip/i }));
  unmount();
  renderAt('/trip');
  await u.click(await screen.findByRole('link', { name: /paris/i }));
  const again = within(await screen.findByRole('list', { name: /checklist/i })).getAllByRole('checkbox')[0];
  expect(again).toBeChecked();
});

test('removing an item drops it from the checklist', async () => {
  const { u } = await plan();
  const list = screen.getByRole('list', { name: /checklist/i });
  const before = within(list).getAllByRole('checkbox').length;
  await u.click(within(list).getAllByRole('button', { name: /remove/i })[0]);
  expect(within(list).getAllByRole('checkbox').length).toBe(before - 1);
});

test('manual temperature is shown in the forecast', async () => {
  const u = userEvent.setup();
  renderAt('/trip');
  await u.click(screen.getByRole('switch', { name: /set temperature/i }));
  const t = screen.getByLabelText(/temperature/i, { selector: 'input[type=number]' });
  await u.clear(t);
  await u.type(t, '27');
  await u.click(screen.getByRole('button', { name: /pack my suitcase/i }));
  expect(await screen.findByText(/27°C/)).toBeInTheDocument();
});
