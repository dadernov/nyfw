import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../src/App';
import { DemoProvider } from '../src/state/store';

export function renderAt(path: string) {
  return render(
    <DemoProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </DemoProvider>,
  );
}
