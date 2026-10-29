import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './screens/Home';
import { Onboarding } from './screens/onboarding';
import { StyleScreen } from './screens/style/StyleScreen';
import { SavedTrip, TripPlanner } from './screens/trip/TripScreen';
import { ProductDetail, ShopScreen } from './screens/shop/Shop';
import { Closet } from './screens/closet/Closet';
import { LookPage, You } from './screens/closet/You';
import { DesignerDetail, DesignerList, NotFound, TrendDetail, TrendFeed } from './screens/trends/Trends';
import { TabBar } from './shell/TabBar';
import { useDemo } from './state/store';

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
          <Route path="/trip" element={<TripPlanner />} />
          <Route path="/trip/:id" element={<SavedTrip />} />
          <Route path="/trends" element={<TrendFeed />} />
          <Route path="/trends/:id" element={<TrendDetail />} />
          <Route path="/designers" element={<DesignerList />} />
          <Route path="/designers/:id" element={<DesignerDetail />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/looks/:id" element={<LookPage />} />
          <Route path="/shop" element={<ShopScreen />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/you" element={<You />} />
          <Route path="*" element={<NotFound what="Page" back="/" label="Go home" />} />
          <Route path="/onboarding/*" element={<Onboarding />} />
        </Routes>
      </main>
      {showTabs && <TabBar />}
    </>
  );
}
