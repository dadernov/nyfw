import { Route, Routes, useLocation } from 'react-router-dom';
import { TabBar } from './shell/TabBar';

function Placeholder({ title }: { title: string }) {
  return <h1 style={{ padding: 24 }}>{title}</h1>;
}

export function AppRoutes() {
  const { pathname } = useLocation();
  const showTabs = !pathname.startsWith('/onboarding');
  return (
    <>
      <main className={`viewport hide-scroll${showTabs ? ' with-tabs' : ''}`}>
        <Routes>
          <Route path="/" element={<Placeholder title="Home" />} />
          <Route path="/style/*" element={<Placeholder title="Style" />} />
          <Route path="/closet" element={<Placeholder title="Closet" />} />
          <Route path="/shop/*" element={<Placeholder title="Shop" />} />
          <Route path="/you" element={<Placeholder title="You" />} />
          <Route path="/onboarding/*" element={<Placeholder title="Welcome" />} />
        </Routes>
      </main>
      {showTabs && <TabBar />}
    </>
  );
}
