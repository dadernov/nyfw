import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt, seed } from './render';

test('feed filters by category', async () => {
  const u = userEvent.setup();
  renderAt('/trends');
  await screen.findByText('Ink Tailoring');
  await u.click(screen.getByRole('button', { name: 'Fabric' }));
  expect(screen.queryByText('Ink Tailoring')).toBeNull();
  expect(screen.getByText('Liquid Satin')).toBeInTheDocument();
});

test('trend detail adapts the advice to the profile style', async () => {
  seed({ profile: { onboarded: true, styles: ['minimal'] } });
  renderAt('/trends/ink-tailoring');
  expect(await screen.findByRole('heading', { name: /from runway to real life/i })).toBeInTheDocument();
  expect(screen.getByText(/white tee and flat leather shoes/i)).toBeInTheDocument();
});

test('unknown trend shows not found with a way back', async () => {
  renderAt('/trends/unknown');
  expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /all trends/i })).toBeInTheDocument();
});

test('designer page lists their pieces', async () => {
  renderAt('/designers/halden');
  expect(await screen.findByRole('heading', { level: 1, name: 'Halden' })).toBeInTheDocument();
  expect(screen.getByText('Pointed Ivory Pumps')).toBeInTheDocument();
});

test('designers list links to each designer', async () => {
  renderAt('/designers');
  expect(await screen.findByRole('link', { name: /maison ardent/i })).toHaveAttribute('href', '/designers/ardent');
});
