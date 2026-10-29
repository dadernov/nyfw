import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { PhoneFrame } from './shell/PhoneFrame';
import { DemoProvider } from './state/store';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PhoneFrame>
          <AppRoutes />
        </PhoneFrame>
      </BrowserRouter>
    </DemoProvider>
  </React.StrictMode>,
);
