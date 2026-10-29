import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './screens/Home';
import { Onboarding } from './screens/onboarding';
import { StyleScreen } from './screens/style/StyleScreen';
import { TabBar } from './shell/TabBar';
import { useDemo } from './state/store';

function Placeholder({ title }: { title: string }) {
  return <h1 style={{ padding: 24 }}>{title}</h1>;
}

export function AppRoutes() {
  const { pathname } = useLocation();
  const { profile } = useDemo();
  const showTabs = !pathname.startsWith('/onboarding');
  return (
    <>
      <main className={`viewport hide-scroll${showTabs ? ' with-tabs' : ''}`}>
        <Routes>
          <Route path="/" element={profile.onboarded ? <Home /> : <Navigate to="/onboarding" replace />} />
          <Route path="/style" element={<StyleScreen />} />
          <Route path="/trip/*" element={<Placeholder title="Pack My Trip" />} />
          <Route path="/trends/*" element={<Placeholder title="Trend Report" />} />
          <Route path="/closet" element={<Placeholder title="Closet" />} />
          <Route path="/shop/*" element={<Placeholder title="Shop" />} />
          <Route path="/you" element={<Placeholder title="You" />} />
          <Route path="/onboarding/*" element={<Onboarding />} />
        </Routes>
      </main>
      {showTabs && <TabBar />}
    </>
  );
}
