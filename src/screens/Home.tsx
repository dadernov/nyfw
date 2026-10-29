import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { content } from '../data/content';
import { IMG, img } from '../data/mock/images';
import type { Designer, Look, Trend } from '../data/types';
import { useDemo } from '../state/store';
import { Img, Screen } from '../ui';
import { Logo } from './onboarding/Logo';
import './home.css';

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): T | undefined {
  const [v, setV] = useState<T>();
  useEffect(() => {
    let live = true;
    fn().then((r) => live && setV(r));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return v;
}

export function Home() {
  const { profile, saved } = useDemo();
  const data = useAsync(() => Promise.all([content.getTrends(), content.getDesigners(), content.getLooks()]));
  const [trends, designers, looks] = data ?? [[] as Trend[], [] as Designer[], [] as Look[]];
  const savedLooks = saved.map((id) => looks.find((l) => l.id === id)).filter(Boolean) as Look[];
  const featured = trends[0];
  const fav = profile.brands.length ? [...designers].sort((a, b) => Number(profile.brands.includes(b.id)) - Number(profile.brands.includes(a.id))) : designers;

  return (
    <Screen>
      <section className="home-hero hero-bleed">
        <Img src={img(IMG.heroRunway, 1200)} alt="Model walking a runway in an ivory gown" />
        <div className="shade" />
        <div className="bar">
          <Logo />
          <button className="bell" aria-label="Notifications"><Bell size={21} strokeWidth={1.4} /><i /></button>
        </div>
        <div className="greet">
          <h1>Welcome, <br />{profile.name || 'Guest'}</h1>
          <p>Your Personal Fashion Week Stylist</p>
        </div>
      </section>

      <Link to="/style" className="card wear-card" aria-label="What to Wear Today">
        <div><h3>What to Wear Today</h3><div className="eyebrow">AI outfit recommendations</div></div>
        <ChevronRight size={22} strokeWidth={1.3} />
      </Link>

      <div className="duo">
        <Link to="/trip" className="card duo-card" aria-label="Pack My Trip">
          <Img src={img(IMG.suitcaseLeather, 500)} alt="Packed leather suitcase" />
          <div className="txt"><h3>Pack My Trip</h3><div className="eyebrow">AI suitcase</div></div>
        </Link>
        <Link to="/trends" className="card duo-card" aria-label="Trend Report">
          <Img src={img(IMG.nycSkylineBW, 500)} alt="New York skyline in black and white" />
          <div className="txt"><h3>Trend Report</h3><div className="eyebrow">NYFW insights</div></div>
        </Link>
      </div>

      {featured && (
        <div className="section">
          <div className="section-head px"><h2>Trend of the week</h2><Link className="link" to="/trends">All trends</Link></div>
          <Link to={`/trends/${featured.id}`} className="trend-strip">
            <Img src={featured.image} alt={featured.title} />
            <span className="fade-bottom" />
            <div className="txt"><span className="tag dark">{featured.season}</span><h3>{featured.title}</h3><p>{featured.summary}</p></div>
          </Link>
        </div>
      )}

      <div className="section">
        <div className="section-head px"><h2>Designers to Watch</h2><Link className="link" to="/designers">See all</Link></div>
        <div className="h-scroll hide-scroll">
          {fav.map((d) => (
            <Link key={d.id} to={`/designers/${d.id}`} className="designer-chip">
              <Img src={d.image} alt={d.name} /><b>{d.name}</b><small>{d.city}</small>
            </Link>
          ))}
        </div>
      </div>

      <div className="section" style={{ paddingBottom: 28 }}>
        <div className="section-head px"><h2>Saved looks</h2>{savedLooks.length > 0 && <Link className="link" to="/closet?tab=saved">View all</Link>}</div>
        {savedLooks.length ? (
          <div className="h-scroll hide-scroll">
            {savedLooks.map((l) => (
              <Link key={l.id} to={`/looks/${l.id}`} className="saved-tile"><Img src={l.image} alt={l.title} /><b>{l.title}</b></Link>
            ))}
          </div>
        ) : <p className="empty-saved">Looks you save from your stylist will live here.</p>}
      </div>
    </Screen>
  );
}
