import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { content } from '../../data/content';
import type { Designer, Product, StyleKey, Trend } from '../../data/types';
import { useDemo } from '../../state/store';
import { Button, Chip, Header, Img, Screen } from '../../ui';
import { useAsync } from '../Home';
import { STYLES } from '../onboarding/ProfileSteps';
import { ProductTile } from '../shop/ProductTile';
import './trends.css';

const CATS = ['All', 'Silhouette', 'Color', 'Fabric', 'Accessory'] as const;
const fmt = (s: string) => new Date(`${s}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export function TrendFeed() {
  const trends = useAsync(() => content.getTrends()) ?? [];
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const list = trends.filter((t) => cat === 'All' || t.category === cat);
  const [lead, ...rest] = list;
  return (
    <Screen>
      <Header />
      <div className="page" style={{ paddingTop: 0 }}>
        <h1 className="page-title">NYFW<br />Trend Report</h1>
        <p className="lede">Runway trends, designer highlights and how to wear them in real life.</p>
      </div>
      <div className="chips hide-scroll" style={{ marginBottom: 18 }}>{CATS.map((c) => <Chip key={c} on={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
      {lead && (
        <Link to={`/trends/${lead.id}`} className="feature">
          <Img src={lead.image} alt={lead.title} />
          <span className="fade-bottom" />
          <div className="txt"><span className="tag dark">Key trend · {lead.season}</span><h3>{lead.title}</h3><p>{lead.summary}</p></div>
        </Link>
      )}
      <div className="tgrid">
        {rest.map((t) => (
          <Link key={t.id} to={`/trends/${t.id}`} className="tcard"><Img src={t.image} alt={t.title} /><b>{t.title}</b><small>{t.season} · {t.category}</small></Link>
        ))}
      </div>
      <div className="section" style={{ paddingBottom: 28 }}>
        <Link to="/designers" className="card dcard" style={{ margin: '0 20px' }}>
          <span style={{ padding: '6px 8px' }}><span className="eyebrow">Designers to Watch</span><b style={{ marginTop: 6 }}>Meet the collections behind the trends</b></span>
        </Link>
      </div>
    </Screen>
  );
}

export function TrendDetail() {
  const { id = '' } = useParams();
  const { profile } = useDemo();
  const data = useAsync(async () => {
    const t = await content.getTrend(id);
    if (!t) return { t: null };
    const [products, designers] = await Promise.all([content.getProducts({ ids: t.products }), content.getDesigners()]);
    return { t, products, designers: designers.filter((d) => t.designers.includes(d.id)) };
  }, [id]);
  const [style, setStyle] = useState<StyleKey>(profile.styles[0] ?? 'classic');

  if (!data) return <Screen><Header /></Screen>;
  if (!data.t) return <NotFound what="Trend" back="/trends" label="All trends" />;
  const { t, products, designers } = data as { t: Trend; products: Product[]; designers: Designer[] };
  return (
    <Screen>
      <div className="t-hero hero-bleed">
        <Img src={t.image} alt={t.title} />
        <span className="fade-bottom" />
        <Header clear />
        <div className="txt"><span className="tag dark">{t.season} · {t.category}</span><h1>{t.title}</h1></div>
      </div>
      <div className="t-body">
        <p className="summary">{t.summary}</p>
        <div className="meta"><span>NYFW Style editors</span><span>Updated {fmt(t.updated)}</span></div>
        <p className="text">{t.body}</p>
        <div className="section" style={{ marginTop: 26 }}>
          <span className="eyebrow">The palette</span>
          <div className="swatches" style={{ marginTop: 10 }}>{t.colors.map((c) => <span key={c} style={{ background: c }} title={c} />)}</div>
        </div>
        <div className="section" style={{ marginTop: 22 }}>
          <span className="eyebrow">Key silhouettes</span>
          <div className="chips wrap" style={{ marginTop: 10 }}>{t.silhouettes.map((s) => <span key={s} className="chip" style={{ display: 'inline-flex', alignItems: 'center' }}>{s}</span>)}</div>
        </div>
      </div>

      <div className="real-life">
        <span className="eyebrow">AI Stylist</span>
        <h2>From Runway to Real Life</h2>
        <p className="advice">{t.realLife[style]}</p>
        <div className="chips">{STYLES.map((s) => <Chip key={s.key} on={style === s.key} onClick={() => setStyle(s.key)}>{s.label}</Chip>)}</div>
        <small>{profile.styles.includes(style) ? 'Tailored to your Style Profile.' : 'Showing another style — your profile stays the same.'}</small>
      </div>

      <div className="section">
        <div className="section-head px"><h2>Shop the trend</h2><Link className="link" to={`/shop?ids=${t.products.join(',')}`}>View all</Link></div>
        <div className="h-scroll hide-scroll">{products.map((p) => <ProductTile key={p.id} p={p} />)}</div>
      </div>
      <div className="section" style={{ paddingBottom: 28 }}>
        <div className="section-head px"><h2>Seen at</h2></div>
        <div className="dgrid">{designers.map((d) => <DesignerCard key={d.id} d={d} />)}</div>
      </div>
    </Screen>
  );
}

export function NotFound({ what, back, label }: { what: string; back: string; label: string }) {
  return (
    <Screen>
      <Header />
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div className="eyebrow">404</div>
        <h1 className="page-title">{what} not found</h1>
        <p className="lede" style={{ margin: '0 auto 24px' }}>It may have been unpublished by the editors.</p>
        <Link className="link" to={back}>{label}</Link>
      </div>
    </Screen>
  );
}

function DesignerCard({ d }: { d: Designer }) {
  return (
    <Link to={`/designers/${d.id}`} className="dcard" aria-label={d.name}>
      <Img src={d.image} alt={d.name} />
      <span><b>{d.name}</b><p>{d.tagline}</p><span className="tags">{d.tags.slice(0, 2).map((t) => <span key={t} className="tag">{t}</span>)}</span></span>
    </Link>
  );
}

export function DesignerList() {
  const designers = useAsync(() => content.getDesigners()) ?? [];
  return (
    <Screen>
      <Header />
      <div className="page" style={{ paddingTop: 0 }}>
        <h1 className="page-title">Designers to Watch</h1>
        <p className="lede">The collections shaping this season — and where to find them.</p>
      </div>
      <div className="dgrid" style={{ paddingBottom: 28 }}>{designers.map((d) => <DesignerCard key={d.id} d={d} />)}</div>
    </Screen>
  );
}

export function DesignerDetail() {
  const { id = '' } = useParams();
  const data = useAsync(async () => {
    const d = await content.getDesigner(id);
    return d ? { d, products: await content.getProducts({ designerId: d.id }) } : { d: null };
  }, [id]);
  if (!data) return <Screen><Header /></Screen>;
  if (!data.d) return <NotFound what="Designer" back="/designers" label="All designers" />;
  const { d, products } = data as { d: Designer; products: Product[] };
  return (
    <Screen>
      <div className="t-hero hero-bleed" style={{ height: 440 }}>
        <Img src={d.image} alt={d.name} />
        <span className="fade-bottom" />
        <Header clear />
        <div className="txt"><span className="tag dark">{d.city}</span><h1>{d.name}</h1></div>
      </div>
      <div className="t-body">
        <p className="summary">{d.tagline}</p>
        <p className="text">{d.bio}</p>
        <div className="chips wrap" style={{ marginTop: 16 }}>{d.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      </div>
      <div className="section">
        <div className="section-head px"><h2>{d.collection.title}</h2><span className="eyebrow">{d.collection.season}</span></div>
        <div className="gallery">{d.collection.images.map((src, i) => <Img key={i} src={src} alt={`${d.name} ${d.collection.title} look ${i + 1}`} />)}</div>
      </div>
      <div className="section">
        <div className="section-head px"><h2>Shop {d.name}</h2></div>
        <div className="pgrid">{products.map((p) => <ProductTile key={p.id} p={p} />)}</div>
      </div>
      <div style={{ padding: '28px 20px' }}>
        <Button variant="outline" block onClick={() => window.open(d.website, '_blank', 'noopener')}><ExternalLink size={14} />Official website</Button>
      </div>
    </Screen>
  );
}
