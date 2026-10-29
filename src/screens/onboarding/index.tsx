import { Route, Routes } from 'react-router-dom';
import { ProfileSteps } from './ProfileSteps';
import { SignIn } from './SignIn';
import { Splash } from './Splash';

export function Onboarding() {
  return (
    <Routes>
      <Route index element={<Splash />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="profile" element={<ProfileSteps />} />
    </Routes>
  );
}
