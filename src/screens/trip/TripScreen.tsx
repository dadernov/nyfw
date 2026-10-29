import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, CloudSun, MapPin, RefreshCw, Sparkles, Thermometer, X } from 'lucide-react';
import { content } from '../../data/content';
import { IMG, img } from '../../data/mock/images';
import { trips } from '../../data/trips';
import type { ChecklistGroup, Look, Product, StyleKey, Trip, TripRequest } from '../../data/types';
import { useDemo } from '../../state/store';
import { Button, Chip, Header, Img, Screen, useToast } from '../../ui';
import { useAsync } from '../Home';
import { STYLES, Toggle } from '../onboarding/ProfileSteps';
import { Thinking } from '../style/StyleScreen';
import './trip.css';

const PURPOSES: { key: TripRequest['purpose']; label: string }[] = [
  { key: 'business', label: 'Business' }, { key: 'leisure', label: 'Leisure' }, { key: 'fashion-week', label: 'Fashion week' }, { key: 'wedding', label: 'Wedding' },
];
const CODES = ['Business', 'Smart casual', 'Cocktail', 'Black tie', 'Beach'];
const CITIES = ['Paris', 'Milan', 'London', 'Tokyo', 'Dubai'];
const GROUPS: { key: ChecklistGroup; label: string }[] = [
  { key: 'clothing', label: 'Clothing' }, { key: 'shoes', label: 'Shoes' }, { key: 'accessories', label: 'Accessories' }, { key: 'essentials', label: 'Essentials' },
];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const plus = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
export const fmtDate = (s: string) => new Date(`${s}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const weekday = (s: string) => new Date(`${s}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

export function TripPlanner() {
  const nav = useNavigate();
  const { profile, closet, trips: savedTrips } = useDemo();
  const [req, setReq] = useState<TripRequest>({
    destination: 'Paris', start: plus(7), end: plus(10), purpose: 'business', dressCodes: ['Business'],
    luggage: 'carry-on', style: profile.styles[0] ?? 'classic',
  });
  const [manual, setManual] = useState(false);
  const [temp, setTemp] = useState('18');
  const [trip, setTrip] = useState<Trip>();
  const [busy, setBusy] = useState(false);
  const flip = (v: string) => setReq({ ...req, dressCodes: req.dressCodes.includes(v) ? req.dressCodes.filter((x) => x !== v) : [...req.dressCodes, v] });

  const go = async () => {
    setBusy(true);
    const t = await trips.buildTrip({ ...req, destination: req.destination.trim() || 'Somewhere new', tempC: manual ? Number(temp) || 0 : undefined }, closet);
    setTrip(t); setBusy(false);
  };

  if (busy) return <Thinking title="Packing your suitcase…" steps={['Checking the forecast', 'Matching your dress codes', 'Building a capsule', 'Writing your checklist']} />;
  if (trip) return <TripResult initial={trip} onBack={() => setTrip(undefined)} />;

  return (
    <Screen>
      <div className="trip-hero hero-bleed">
        <Img src={img(IMG.suitcaseHat, 1000)} alt="Open suitcase with a hat and travel essentials" />
        <span className="fade-bottom" />
        <div className="txt">
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.8)' }}>AI Suitcase</div>
          <h1>Pack My Trip</h1>
          <p>Tell me where you’re going and I’ll create your perfect suitcase.</p>
        </div>
      </div>
      <div className="trip-form">
        {savedTrips.length > 0 && (
          <div className="saved-trips">
            <span className="eyebrow">Your trips</span>
            {savedTrips.map((t) => (
              <Link key={t.id} to={`/trip/${t.id}`} className="saved-trip" aria-label={`${t.request.destination}, ${fmtDate(t.request.start)}`}>
                <span><b>{t.request.destination}</b><small>{fmtDate(t.request.start)} – {fmtDate(t.request.end)} · {t.checklist.filter((c) => c.packed).length}/{t.checklist.length} packed</small></span>
                <ChevronRight size={18} strokeWidth={1.3} />
              </Link>
            ))}
          </div>
        )}
        <label className="field dest"><span>Destination</span><MapPin size={17} strokeWidth={1.5} />
          <input value={req.destination} onChange={(e) => setReq({ ...req, destination: e.target.value })} placeholder="City" />
        </label>
        <div className="chips wrap" style={{ marginTop: -6, marginBottom: 18 }}>{CITIES.map((c) => <Chip key={c} on={req.destination === c} onClick={() => setReq({ ...req, destination: c })}>{c}</Chip>)}</div>
        <div className="row2">
          <label className="field"><span>From</span><input type="date" value={req.start} onChange={(e) => setReq({ ...req, start: e.target.value })} /></label>
          <label className="field"><span>To</span><input type="date" value={req.end} min={req.start} onChange={(e) => setReq({ ...req, end: e.target.value })} /></label>
        </div>
        <div className="grp"><span className="eyebrow">Purpose</span>
          <div className="chips wrap">{PURPOSES.map((p) => <Chip key={p.key} on={req.purpose === p.key} onClick={() => setReq({ ...req, purpose: p.key })}>{p.label}</Chip>)}</div></div>
        <div className="grp"><span className="eyebrow">Dress codes</span>
          <div className="chips wrap">{CODES.map((c) => <Chip key={c} on={req.dressCodes.includes(c)} onClick={() => flip(c)}>{c}</Chip>)}</div></div>
        <div className="grp"><span className="eyebrow">Luggage</span>
          <div className="seg2">{(['carry-on', 'suitcase'] as const).map((l) => <button key={l} className={req.luggage === l ? 'on' : ''} aria-pressed={req.luggage === l} onClick={() => setReq({ ...req, luggage: l })}>{l === 'carry-on' ? 'Carry-on' : 'Suitcase'}</button>)}</div></div>
        <div className="grp"><span className="eyebrow">Style</span>
          <div className="chips wrap">{STYLES.map((s) => <Chip key={s.key} on={req.style === s.key} onClick={() => setReq({ ...req, style: s.key as StyleKey })}>{s.label}</Chip>)}</div></div>
        <div className="grp"><span className="eyebrow">Weather</span>
          <div className="weather-row">
            <button role="switch" aria-checked={manual} aria-label="Set temperature myself" onClick={() => setManual(!manual)} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <Toggle on={manual} /><span style={{ fontSize: 14 }}>{manual ? 'Set temperature myself' : 'Use forecast for destination'}</span>
            </button>
            {manual && <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="number" aria-label="Temperature in °C" value={temp} onChange={(e) => setTemp(e.target.value)} />°C</label>}
          </div>
        </div>
        <Button block onClick={go} style={{ marginTop: 8 }}><Sparkles size={15} />Pack my suitcase</Button>
      </div>
      <div style={{ height: 24 }} />
    </Screen>
  );
}

export function SavedTrip() {
  const { id } = useParams();
  const { trips: saved } = useDemo();
  const nav = useNavigate();
  const t = saved.find((x) => x.id === id);
  if (!t) return <Screen><Header /><div className="page"><h1 className="page-title">Trip not found</h1><Link className="link" to="/trip">Plan a trip</Link></div></Screen>;
  return <TripResult key={t.id} initial={t} onBack={() => nav('/trip')} />;
}

function TripResult({ initial, onBack }: { initial: Trip; onBack: () => void }) {
  const { trips: saved, saveTrip, removeTrip } = useDemo();
  const [trip, setTrip] = useState(initial);
  const [toast, showToast] = useToast();
  const isSaved = saved.some((t) => t.id === trip.id);
  const data = useAsync(() => Promise.all([content.getProducts(), content.getLooks()]));
  const [products, looks] = data ?? [[] as Product[], [] as Look[]];
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const update = (t: Trip) => { setTrip(t); if (isSaved) saveTrip(t); };
  const toggle = (id: string) => update({ ...trip, checklist: trip.checklist.map((c) => (c.id === id ? { ...c, packed: !c.packed } : c)) });
  const remove = (id: string) => update({ ...trip, checklist: trip.checklist.filter((c) => c.id !== id) });
  const restyle = (i: number) => {
    const cur = looks.findIndex((l) => l.title === trip.days[i].lookTitle);
    const next = looks[(cur + 1 + looks.length) % looks.length];
    update({ ...trip, days: trip.days.map((d, j) => (j === i ? { ...d, lookTitle: next.title, items: next.items } : d)) });
  };
  const packed = trip.checklist.filter((c) => c.packed).length;
  const r = trip.request;

  return (
    <Screen>
      <div className="trip-hero hero-bleed" style={{ height: 260 }}>
        <Img src={img(IMG.suitcaseBlack, 1000)} alt="Packed suitcase" />
        <span className="fade-bottom" />
        <Header clear />
        <div className="txt">
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.8)' }}>{fmtDate(r.start)} – {fmtDate(r.end)} · {trip.days.length} days · {r.luggage === 'carry-on' ? 'Carry-on' : 'Suitcase'}</div>
          <h1>{r.destination}</h1>
        </div>
      </div>

      <div className="forecast">
        {trip.forecast.manual ? <Thermometer size={26} strokeWidth={1.3} /> : <CloudSun size={26} strokeWidth={1.3} />}
        <span className="deg">{trip.forecast.tempC}°C</span>
        <span>{trip.forecast.summary}<small>{trip.forecast.manual ? 'Your temperature' : 'Demo forecast · live weather in the full app'}</small></span>
      </div>
      {!trip.basedOnWardrobe && <p className="note" style={{ margin: '12px 20px 0' }}>A universal capsule — not based on your wardrobe. Add pieces to your Closet and I’ll pack those first.</p>}

      <div className="section">
        <div className="section-head px"><h2>Your capsule</h2><span className="eyebrow">{trip.capsule.length} pieces</span></div>
        <div className="capsule">
          {trip.capsule.map((id) => { const p = byId.get(id); return p && <Link key={id} to={`/shop/${id}`}><Img src={p.image} alt={p.name} /><span>{p.name}</span></Link>; })}
        </div>
      </div>

      <div className="section">
        <div className="section-head px"><h2>Day by day</h2></div>
        <div className="days">
          {trip.days.map((d, i) => (
            <div key={d.date} className="day">
              <div className="top"><b>{d.lookTitle}</b><span className="eyebrow">{weekday(d.date)} {fmtDate(d.date)}</span></div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{d.label}</div>
              <div className="thumbs">
                {d.items.map((id) => { const p = byId.get(id); return p && <Img key={id} src={p.image} alt={p.name} />; })}
                <Button variant="ghost" small className="restyle" onClick={() => restyle(i)} aria-label={`Restyle ${fmtDate(d.date)}`}><RefreshCw size={13} /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head px"><h2>Packing checklist</h2><span className="eyebrow">{packed} of {trip.checklist.length}</span></div>
        <div className="packbar"><i style={{ width: `${trip.checklist.length ? (packed / trip.checklist.length) * 100 : 0}%` }} /></div>
        <div className="checklist" role="list" aria-label="Checklist">
          {GROUPS.map((g) => {
            const items = trip.checklist.filter((c) => c.group === g.key);
            return items.length > 0 && (
              <div key={g.key} className="check-group" role="listitem">
                <span className="eyebrow">{g.label}</span>
                <ul>
                  {items.map((c) => (
                    <li key={c.id} className={c.packed ? 'done' : ''}>
                      <label><input type="checkbox" checked={c.packed} onChange={() => toggle(c.id)} /><span>{c.label}</span></label>
                      {c.closetId && <span className="own">Yours</span>}
                      <button className="x" aria-label={`Remove ${c.label}`} onClick={() => remove(c.id)}><X size={15} /></button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {trip.basedOnWardrobe && trip.missing.length > 0 && (
        <div className="section">
          <div className="section-head px"><h2>Missing pieces</h2><Link className="link" to={`/shop?ids=${trip.missing.join(',')}`}>Shop all</Link></div>
          <div className="capsule">
            {trip.missing.map((id) => { const p = byId.get(id); return p && <Link key={id} to={`/shop/${id}`}><Img src={p.image} alt={p.name} /><span>{p.name}</span></Link>; })}
          </div>
        </div>
      )}

      <div className="trip-actions" style={{ marginTop: 24 }}>
        <Button variant="outline" onClick={onBack}>{isSaved ? 'All trips' : 'Start over'}</Button>
        {isSaved
          ? <Button variant="outline" onClick={() => { removeTrip(trip.id); onBack(); }}>Delete trip</Button>
          : <Button onClick={() => { saveTrip(trip); showToast('Trip saved'); }}>Save trip</Button>}
      </div>
      {toast}
    </Screen>
  );
}
