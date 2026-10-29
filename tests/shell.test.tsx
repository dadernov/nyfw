import { screen } from '@testing-library/react';
import { renderAt } from './render';

test('home shows the five tabs', () => {
  renderAt('/');
  const nav = screen.getByRole('navigation', { name: 'Main' });
  for (const label of ['Home', 'Style', 'Closet', 'Shop', 'You']) {
    expect(nav).toHaveTextContent(label);
  }
});

test('onboarding hides the tab bar', () => {
  renderAt('/onboarding');
  expect(screen.queryByRole('navigation', { name: 'Main' })).toBeNull();
});
