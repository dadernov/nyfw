import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Download } from 'lucide-react';
import { content } from '../../data/content';
import type { Profile } from '../../data/types';
import { stylist } from '../../data/stylist';
import { useDemo } from '../../state/store';
import { Button, Header, Screen, Sheet, useToast } from '../../ui';
import { useAsync } from '../Home';
import { BUDGETS, STYLES, Toggle } from '../onboarding/ProfileSteps';
import { LookCard } from '../style/LookCard';
import { NotFound } from '../trends/Trends';
import './closet.css';

export function You() {
  const nav = useNavigate();
  const demo = useDemo();
  const { profile, setProfile, closet, saved, trips, reset } = demo;
  const [confirm, setConfirm] = useState<'reset' | 'delete'>();
  const [toast, showToast] = useToast();
  const name = profile.name || 'Guest';
  const consent = (k: keyof Profile['consents']) => setProfile({ consents: { ...profile.consents, [k]: !profile.consents[k] } });
  const exportData = () => {
    const { profile: p, closet: c, saved: s, trips: t } = demo;
    const url = URL.createObjectURL(new Blob([JSON.stringify({ profile: p, closet: c, saved: s, trips: t }, null, 2)], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'nyfw-style-my-data.json' });
    a.click(); URL.revokeObjectURL(url);
    showToast('Your data was exported');
  };
  const wipe = () => { reset(); setConfirm(undefined); nav('/onboarding', { replace: true }); };

  return (
    <Screen>
      <div className="you-head">
        <div className="avatar">{name[0].toUpperCase()}</div>
        <h1>{name}</h1>
        <div className="chips wrap">
          {profile.styles.map((s) => <span key={s} className="tag">{STYLES.find((x) => x.key === s)?.label}</span>)}
          <span className="tag">{BUDGETS.find((b) => b.key === profile.budget)?.label}</span>
        </div>
      </div>
      <div className="stats">
        <div><b>{closet.length}</b><span>Pieces</span></div>
        <div><b>{saved.length}</b><span>Looks</span></div>
        <div><b>{trips.length}</b><span>Trips</span></div>
      </div>

      <span className="eyebrow list-title">Style Profile</span>
      <div className="list">
        <Link to="/onboarding/profile"><span>Edit style, budget & designers<small>Retake the 2-minute profile</small></span><ChevronRight size={18} strokeWidth={1.3} /></Link>
        <Link to="/closet?tab=saved"><span>Saved looks</span><ChevronRight size={18} strokeWidth={1.3} /></Link>
        <Link to="/trip"><span>My trips</span><ChevronRight size={18} strokeWidth={1.3} /></Link>
      </div>

      <span className="eyebrow list-title">Privacy</span>
      <div className="list">
        {([['location', 'Location', 'Weather-aware looks'], ['photos', 'Photos', 'Adding pieces to your closet'], ['personalization', 'Personalised recommendations', 'Based on your profile and saves']] as const).map(([k, label, note]) => (
          <button key={k} role="switch" aria-checked={profile.consents[k]} aria-label={label} onClick={() => consent(k)}>
            <span>{label}<small>{note}</small></span><Toggle on={profile.consents[k]} />
          </button>
        ))}
      </div>

      <span className="eyebrow list-title">Your data</span>
      <div className="list">
        <button onClick={exportData}><span>Export my data<small>Download everything as JSON</small></span><Download size={17} strokeWidth={1.4} /></button>
        <button onClick={() => setConfirm('delete')}><span className="danger">Delete account and data</span></button>
      </div>

      <span className="eyebrow list-title">Prototype</span>
      <div className="list">
        <button onClick={() => setConfirm('reset')}><span>Reset demo<small>Start again from the welcome screen</small></span></button>
        <div><span>Version<small>Concept prototype · demo data</small></span><span style={{ color: 'var(--muted)' }}>0.1</span></div>
      </div>
      <div style={{ height: 32 }} />

      <Sheet open={Boolean(confirm)} onClose={() => setConfirm(undefined)} label={confirm === 'delete' ? 'Delete account' : 'Reset demo'}>
        <h2 style={{ fontSize: 26 }}>{confirm === 'delete' ? 'Delete your account?' : 'Reset the demo?'}</h2>
        <p style={{ color: 'var(--ink-2)', margin: '8px 0 22px' }}>
          {confirm === 'delete' ? 'Your profile, closet, saved looks and trips will be permanently removed.' : 'This clears the profile, closet, saved looks and trips on this device.'}
        </p>
        <div style={{ display: 'grid', gap: 8 }}>
          <Button block onClick={wipe}>{confirm === 'delete' ? 'Delete everything' : 'Reset'}</Button>
          <Button block variant="ghost" onClick={() => setConfirm(undefined)}>Cancel</Button>
        </div>
      </Sheet>
      {toast}
    </Screen>
  );
}

export function LookPage() {
  const { id = '' } = useParams();
  const { closet } = useDemo();
  const styled = useAsync(async () => {
    const look = await content.getLook(id);
    if (!look) return null;
    const r = await stylist.generateLooks({ occasion: look.occasion, style: look.style, budget: look.budget, notes: '' }, closet, 0, { delayMs: 0 });
    return r.looks.find((s) => s.look.id === id) ?? { look, products: await content.getProducts({ ids: look.items }), fromCloset: [], alternatives: await content.getProducts({ ids: look.alternatives }) };
  }, [id]);
  if (styled === undefined) return <Screen><Header /></Screen>;
  if (!styled) return <NotFound what="Look" back="/closet?tab=saved" label="Saved looks" />;
  return (
    <Screen>
      <Header title="Look" />
      <div style={{ padding: '4px 16px 28px' }}><LookCard styled={styled} /></div>
    </Screen>
  );
}
