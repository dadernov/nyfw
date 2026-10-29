import { act, render } from '@testing-library/react';
import { DemoProvider, useDemo, type DemoApi } from '../src/state/store';

function mount() {
  const ref: { current: DemoApi | null } = { current: null };
  function Probe() { ref.current = useDemo(); return null; }
  const r = render(<DemoProvider><Probe /></DemoProvider>);
  return { api: () => ref.current!, unmount: r.unmount };
}

test('state survives a remount', () => {
  const a = mount();
  act(() => { a.api().setProfile({ name: 'Narine' }); a.api().toggleSave('l-office-ink'); });
  a.unmount();
  const b = mount();
  expect(b.api().profile.name).toBe('Narine');
  expect(b.api().saved).toEqual(['l-office-ink']);
});

test('toggleSave removes an already saved look', () => {
  const a = mount();
  act(() => a.api().toggleSave('x'));
  act(() => a.api().toggleSave('x'));
  expect(a.api().saved).toEqual([]);
});

test('reset clears everything', () => {
  const a = mount();
  act(() => { a.api().addItem({ name: 'Coat', category: 'outerwear', color: 'Black' }); a.api().setProfile({ name: 'A', onboarded: true }); });
  act(() => a.api().reset());
  expect(a.api().closet).toEqual([]);
  expect(a.api().profile.onboarded).toBe(false);
});

test('works in memory when localStorage throws', () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
  const a = mount();
  act(() => a.api().setProfile({ name: 'Private' }));
  expect(a.api().profile.name).toBe('Private');
  spy.mockRestore(); get.mockRestore();
});
