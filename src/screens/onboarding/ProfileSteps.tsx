import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { designers } from '../../data/mock/designers';
import { IMG, img } from '../../data/mock/images';
import type { Budget, Occasion, Profile, StyleKey } from '../../data/types';
import { useDemo } from '../../state/store';
import { Button, Chip, Img } from '../../ui';

export const STYLES: { key: StyleKey; label: string; image: keyof typeof IMG }[] = [
  { key: 'minimal', label: 'Minimal', image: 'whiteCoat' },
  { key: 'classic', label: 'Classic', image: 'streetBeigeTrench' },
  { key: 'editorial', label: 'Editorial', image: 'runwayBW' },
  { key: 'relaxed', label: 'Relaxed', image: 'nycWalkersBW' },
  { key: 'romantic', label: 'Romantic', image: 'runwayGauze' },
];
export const BUDGETS: { key: Budget; label: string; note: string }[] = [
  { key: '$', label: 'Considered', note: 'Mostly under $300 a piece' },
  { key: '$$', label: 'Contemporary', note: '$300 – $800 a piece' },
  { key: '$$$', label: 'Investment', note: '$800+ for the right piece' },
];
export const SCENARIOS: { key: Occasion; label: string }[] = [
  { key: 'office', label: 'Office' }, { key: 'everyday', label: 'Everyday' }, { key: 'evening', label: 'Evenings out' },
  { key: 'event', label: 'Events & shows' }, { key: 'weekend', label: 'Weekends' }, { key: 'travel', label: 'Travel' },
];
const SIZES = { top: ['XS', 'S', 'M', 'L', 'XL'], bottom: ['24', '26', '28', '30', '32', '34'], shoe: ['5', '6', '7', '8', '9', '10', '11'] };

export function Toggle({ on }: { on: boolean }) { return <span className={`toggle${on ? ' on' : ''}`} aria-hidden />; }

export function ProfileSteps() {
  const nav = useNavigate();
  const { profile, setProfile } = useDemo();
  const [draft, setDraft] = useState<Profile>({ ...profile });
  const [step, setStep] = useState(0);
  const set = (patch: Partial<Profile>) => setDraft((d) => ({ ...d, ...patch }));
  const flip = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const steps: { title: string; hint: string; body: ReactNode; ready: boolean; optional?: boolean }[] = [
    {
      title: 'What should we call you?', hint: 'Your stylist will greet you by name.', ready: draft.name.trim().length > 0,
      body: <label className="field"><span>First name</span><input autoFocus value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Narine" /></label>,
    },
    {
      title: 'Your style, in a glance', hint: 'Pick any that feel like you.', ready: draft.styles.length > 0,
      body: (
        <div className="style-grid">
          {STYLES.map((s, i) => {
            const on = draft.styles.includes(s.key);
            return (
              <button key={s.key} aria-label={s.label} aria-pressed={on} className={`style-tile${on ? ' on' : ''}`}
                style={i === STYLES.length - 1 ? { gridColumn: '1 / -1' } : undefined} onClick={() => set({ styles: flip(draft.styles, s.key) })}>
                <Img src={img(IMG[s.image], 500)} alt="" />
                <span className="fade-bottom" />
                <b>{s.label}</b>
                <span className="check">{on && <Check size={14} />}</span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: 'A comfortable budget', hint: 'We’ll mix in pieces from every level — this just sets the tone.', ready: true,
      body: (
        <div className="option-list">
          {BUDGETS.map((b) => (
            <button key={b.key} className={`option${draft.budget === b.key ? ' on' : ''}`} onClick={() => set({ budget: b.key })}>
              <span><b>{b.label}</b><small>{b.note}</small></span><span className="eyebrow">{b.key}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Designers you love', hint: 'Optional — we’ll surface their collections first.', ready: draft.brands.length > 0, optional: true,
      body: <div className="chips wrap">{designers.map((d) => <Chip key={d.id} on={draft.brands.includes(d.id)} onClick={() => set({ brands: flip(draft.brands, d.id) })}>{d.name}</Chip>)}</div>,
    },
    {
      title: 'Where life takes you', hint: 'The moments you dress for most.', ready: draft.scenarios.length > 0, optional: true,
      body: <div className="chips wrap">{SCENARIOS.map((s) => <Chip key={s.key} on={draft.scenarios.includes(s.key)} onClick={() => set({ scenarios: flip(draft.scenarios, s.key) })}>{s.label}</Chip>)}</div>,
    },
    {
      title: 'Sizes, if you like', hint: 'Only used to filter the shop. You can skip this.', optional: true,
      ready: Boolean(draft.sizes.top || draft.sizes.bottom || draft.sizes.shoe),
      body: (
        <>
          {(Object.keys(SIZES) as (keyof typeof SIZES)[]).map((k) => (
            <label key={k} className="field">
              <span>{k === 'top' ? 'Tops' : k === 'bottom' ? 'Waist' : 'Shoes (US)'}</span>
              <select value={draft.sizes[k] ?? ''} onChange={(e) => set({ sizes: { ...draft.sizes, [k]: e.target.value || undefined } })}>
                <option value="">Not set</option>
                {SIZES[k].map((v) => <option key={v}>{v}</option>)}
              </select>
            </label>
          ))}
        </>
      ),
    },
    {
      title: 'Your privacy, your call', hint: 'Change these any time in your profile.', ready: true,
      body: (
        <div className="option-list">
          {([
            ['location', 'Use my location', 'For weather-aware looks'],
            ['photos', 'Access my photos', 'To add pieces to your closet'],
            ['personalization', 'Personalised recommendations', 'Based on your profile and saves'],
          ] as const).map(([k, label, note]) => (
            <button key={k} role="switch" aria-checked={draft.consents[k]} className="option" onClick={() => set({ consents: { ...draft.consents, [k]: !draft.consents[k] } })}>
              <span><b>{label}</b><small>{note}</small></span><Toggle on={draft.consents[k]} />
            </button>
          ))}
        </div>
      ),
    },
  ];

  const s = steps[step];
  const last = step === steps.length - 1;
  const next = () => {
    if (!last) return setStep(step + 1);
    setProfile({ ...draft, name: draft.name.trim(), onboarded: true });
    nav('/', { replace: true });
  };

  return (
    <div className="steps">
      <div className="top">
        <button className="icon-btn" aria-label="Back" onClick={() => (step ? setStep(step - 1) : nav(-1))}><ChevronLeft size={22} strokeWidth={1.5} /></button>
        <span className="eyebrow">{step + 1} / {steps.length}</span>
        <span style={{ width: 40 }} />
      </div>
      <div className="progress">{steps.map((_, i) => <span key={i} className={i <= step ? 'on' : ''} />)}</div>
      <AnimatePresence mode="wait">
        <motion.div key={step} className="body" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: .25 }}>
          <h2>{s.title}</h2>
          <p className="hint">{s.hint}</p>
          {s.body}
        </motion.div>
      </AnimatePresence>
      <div className="actions">
        {last ? <Button block onClick={next}>Start styling</Button>
          : s.optional && !s.ready ? <Button block variant="outline" onClick={next}>Skip</Button>
          : <Button block onClick={next} disabled={!s.ready}>Continue</Button>}
      </div>
    </div>
  );
}
