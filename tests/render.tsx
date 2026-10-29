import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../src/App';
import { DemoProvider, emptyProfile } from '../src/state/store';
import type { Profile } from '../src/data/types';

export function seed(state: { profile?: Partial<Profile>; saved?: string[]; closet?: unknown[]; trips?: unknown[] }) {
  localStorage.setItem('nyfw-demo-v1', JSON.stringify({ ...state, profile: { ...emptyProfile, ...state.profile } }));
}

export function renderAt(path: string, { onboarded = true } = {}) {
  if (onboarded && !localStorage.getItem('nyfw-demo-v1')) seed({ profile: { onboarded: true } });
  return render(
    <DemoProvider>
      <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </MemoryRouter>
    </DemoProvider>,
  );
}
