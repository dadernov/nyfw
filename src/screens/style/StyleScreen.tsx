import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stylist, type StylistRequest, type StylistResult } from '../../data/stylist';
import type { Budget, Occasion, StyleKey } from '../../data/types';
import { useDemo } from '../../state/store';
import { Button, Chip, Screen, useToast } from '../../ui';
import { BUDGETS, STYLES } from '../onboarding/ProfileSteps';
import { LookCard } from './LookCard';
import './style.css';

const OCCASIONS: { key: Occasion; label: string }[] = [
  { key: 'office', label: 'Office' }, { key: 'everyday', label: 'Everyday' }, { key: 'evening', label: 'Evening' },
  { key: 'event', label: 'Event' }, { key: 'weekend', label: 'Weekend' }, { key: 'travel', label: 'Travel' },
];
const PROMPTS = ['No heels today', 'It might rain', 'Client meeting at 3', 'Dinner after work'];
const STEPS = ['Reading your Style Profile', 'Checking this season’s trends', 'Pairing pieces from the catalog', 'Writing your stylist notes'];

function Thinking() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => Math.min(n + 1, STEPS.length - 1)), 380); return () => clearInterval(t); }, []);
  return (
    <div className="thinking" role="status">
      <div className="orb" />
      <h2>Styling your looks…</h2>
      <AnimatePresence mode="wait"><motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{STEPS[i]}</motion.p></AnimatePresence>
    </div>
  );
}

export function StyleScreen() {
  const { profile, closet } = useDemo();
  const [req, setReq] = useState<StylistRequest>({
    occasion: profile.scenarios[0] ?? 'everyday', style: profile.styles[0] ?? 'classic', budget: profile.budget, notes: '',
  });
  const [phase, setPhase] = useState<'brief' | 'thinking' | 'results'>('brief');
  const [result, setResult] = useState<StylistResult>();
  const [round, setRound] = useState(0);
  const [active, setActive] = useState(0);
  const [toast, showToast] = useToast();
  const scroller = useRef<HTMLDivElement>(null);

  const run = async (r: number) => {
    setPhase('thinking');
    const res = await stylist.generateLooks(req, closet, r);
    setResult(res); setRound(r); setActive(0); setPhase('results');
    scroller.current?.scrollTo({ left: 0 });
  };

  return (
    <Screen>
      {phase === 'brief' && (
        <div className="brief">
          <div className="page" style={{ paddingBottom: 0 }}>
            <div className="eyebrow" style={{ marginTop: 18 }}>AI Personal Stylist</div>
            <h1 className="page-title">What to Wear Today</h1>
            <p className="lede">Tell me about your day — I’ll put together looks with a note on why each one works.</p>
          </div>
          <div className="group"><span className="eyebrow">The occasion</span>
            <div className="chips hide-scroll">{OCCASIONS.map((o) => <Chip key={o.key} on={req.occasion === o.key} onClick={() => setReq({ ...req, occasion: o.key })}>{o.label}</Chip>)}</div>
          </div>
          <div className="group"><span className="eyebrow">The mood</span>
            <div className="chips hide-scroll">{STYLES.map((s) => <Chip key={s.key} on={req.style === s.key} onClick={() => setReq({ ...req, style: s.key as StyleKey })}>{s.label}</Chip>)}</div>
          </div>
          <div className="group"><span className="eyebrow">Budget</span>
            <div className="seg">{BUDGETS.map((b) => <button key={b.key} className={req.budget === b.key ? 'on' : ''} aria-pressed={req.budget === b.key} onClick={() => setReq({ ...req, budget: b.key as Budget })}>{b.label}</button>)}</div>
          </div>
          <div className="group"><span className="eyebrow">Anything else?</span>
            <label className="field notes"><textarea aria-label="Notes for your stylist" value={req.notes} placeholder="Wishes or limits — e.g. flat shoes, it’s cold…" onChange={(e) => setReq({ ...req, notes: e.target.value })} /></label>
            <div className="prompts">{PROMPTS.map((p) => <button key={p} onClick={() => setReq({ ...req, notes: req.notes ? `${req.notes}, ${p.toLowerCase()}` : p })}>+ {p}</button>)}</div>
          </div>
          <div className="cta"><Button block onClick={() => run(0)}><Sparkles size={15} />Style me</Button></div>
        </div>
      )}

      {phase === 'thinking' && <Thinking />}

      {phase === 'results' && result && (
        <>
          <div className="results-head">
            <div className="eyebrow" style={{ marginTop: 18 }}>{OCCASIONS.find((o) => o.key === req.occasion)?.label} · {STYLES.find((s) => s.key === req.style)?.label}</div>
            <h1 className="page-title">What to Wear Today</h1>
            <p className="lede">Your AI stylist created {result.looks.length} looks for today.</p>
            {!result.basedOnWardrobe && (
              <p className="note" style={{ marginTop: 14 }}>Styled from the partner catalog — not based on your wardrobe. <Link className="link" to="/closet">Add pieces</Link></p>
            )}
            <div className="row">
              <Button variant="ghost" small onClick={() => setPhase('brief')}><SlidersHorizontal size={14} />Edit brief</Button>
              <Button variant="ghost" small onClick={() => run(round + 1)} aria-label="Regenerate looks"><RefreshCw size={14} />Regenerate</Button>
            </div>
          </div>
          <div className="carousel hide-scroll" ref={scroller}
            onScroll={(e) => { const el = e.currentTarget; setActive(Math.round(el.scrollLeft / (el.clientWidth - 28))); }}>
            {result.looks.map((s) => <LookCard key={s.look.id} styled={s} onSave={(on) => showToast(on ? 'Saved to your looks' : 'Removed from saved')} />)}
          </div>
          <div className="dots">{result.looks.map((s, i) => <span key={s.look.id} className={i === active ? 'on' : ''} />)}</div>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 11.5, padding: '18px 32px 24px' }}>Prototype: looks are selected from a demo catalog. Prices and stores are illustrative.</p>
        </>
      )}
      {toast}
    </Screen>
  );
}
