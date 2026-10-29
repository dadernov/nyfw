import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useDemo } from '../../state/store';
import { Button, Screen } from '../../ui';
import { Logo } from './Logo';

const Apple = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>;
const Google = () => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8C3.9 20.6 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.8 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7H2.1C1.4 8.5 1 10.2 1 12s.4 3.5 1.1 5l3.7-2.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.4 2.1 7l3.7 2.8c.9-2.6 3.3-4.4 6.2-4.4z"/></svg>;

export function SignIn() {
  const nav = useNavigate();
  const { setProfile } = useDemo();
  const steps = () => nav('/onboarding/profile');
  const guest = () => { setProfile({ onboarded: true, name: '' }); nav('/', { replace: true }); };
  return (
    <Screen className="signin">
      <Logo />
      <h2>Create your Style Profile</h2>
      <p className="sub">Two minutes, and every look is tailored to you.</p>
      <div className="stack">
        <Button block onClick={steps}><Apple /> Continue with Apple</Button>
        <Button block variant="outline" onClick={steps}><Google /> Continue with Google</Button>
        <Button block variant="outline" onClick={steps}><Mail size={16} strokeWidth={1.5} /> Continue with email</Button>
        <Button block variant="ghost" onClick={guest}>Continue as guest</Button>
      </div>
      <small>For ages 18+. By continuing you agree to the Terms and Privacy Policy.<br />Prototype: sign-in is simulated.</small>
    </Screen>
  );
}
