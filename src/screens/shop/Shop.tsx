import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Info, X } from 'lucide-react';
import { content } from '../../data/content';
import type { Category, Look, Product } from '../../data/types';
import { Button, Chip, Header, Img, Screen, Sheet, money } from '../../ui';
import { useAsync } from '../Home';
import { NotFound } from '../trends/Trends';
import { ProductTile } from './ProductTile';

const CATS: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'outerwear', label: 'Outerwear' }, { key: 'knitwear', label: 'Knitwear' }, { key: 'tops', label: 'Tops' },
  { key: 'bottoms', label: 'Bottoms' }, { key: 'dresses', label: 'Dresses' }, { key: 'shoes', label: 'Shoes' }, { key: 'bags', label: 'Bags' },
  { key: 'jewelry', label: 'Jewelry' }, { key: 'accessories', label: 'Accessories' },
];

export function ShopScreen() {
  const [params, setParams] = useSearchParams();
  const lookId = params.get('look');
  const ids = params.get('ids')?.split(',').filter(Boolean);
  const [cat, setCat] = useState<Category | 'all'>('all');
  const data = useAsync(async () => {
    const look = lookId ? await content.getLook(lookId) : undefined;
    const only = look ? [...look.items, ...look.alternatives] : ids;
    return { look, products: await content.getProducts(only ? { ids: only } : undefined) };
  }, [lookId, params.get('ids')]);
  const products = (data?.products ?? []).filter((p) => cat === 'all' || p.category === cat);
  const scoped = Boolean(lookId || ids);

  return (
    <Screen>
      <div className="page" style={{ paddingBottom: 14 }}>
        <div className="eyebrow" style={{ marginTop: 18 }}>Smart Shopping</div>
        <h1 className="page-title">Shop</h1>
        <p className="lede">Pieces from designers and partner stores, picked for your profile.</p>
      </div>
      {scoped && (
        <div className="note" style={{ margin: '0 20px 14px', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{data?.look ? <>Shop the look · <b style={{ fontWeight: 500 }}>{data.look.title}</b></> : 'Selected pieces'}</span>
          <button aria-label="Show all products" onClick={() => setParams({})}><X size={16} /></button>
        </div>
      )}
      <div className="chips hide-scroll" style={{ marginBottom: 18 }}>
        {CATS.map((c) => <Chip key={c.key} on={cat === c.key} onClick={() => setCat(c.key)}>{c.label}</Chip>)}
      </div>
      <div className="pgrid">{products.map((p) => <ProductTile key={p.id} p={p} />)}</div>
      {data && products.length === 0 && <p className="empty-saved" style={{ margin: '0 20px' }}>Nothing here yet in this category.</p>}
      <p style={{ display: 'flex', gap: 8, color: 'var(--muted)', fontSize: 11.5, padding: '26px 20px 28px' }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />Some links are affiliate links and we may earn a commission. Styling advice never depends on it. Prototype: prices and stores are illustrative.
      </p>
    </Screen>
  );
}

export function ProductDetail() {
  const { id = '' } = useParams();
  const [open, setOpen] = useState(false);
  const data = useAsync(async () => {
    const p = await content.getProduct(id);
    if (!p) return { p: null };
    const [looks, designer] = await Promise.all([content.getLooks(), p.designerId ? content.getDesigner(p.designerId) : undefined]);
    return { p, designer, looks: looks.filter((l) => l.items.includes(p.id)).slice(0, 4) };
  }, [id]);
  if (!data) return <Screen><Header /></Screen>;
  if (!data.p) return <NotFound what="Product" back="/shop" label="Back to shop" />;
  const { p, designer, looks } = data as { p: Product; designer?: { id: string; name: string }; looks: Look[] };

  return (
    <Screen>
      <div className="t-hero hero-bleed" style={{ height: 500, color: 'var(--ink)' }}>
        <Img src={p.image.replace('w=700', 'w=1100')} alt={p.name} />
        <Header clear />
      </div>
      <div className="t-body">
        {designer ? <Link to={`/designers/${designer.id}`} className="eyebrow">{p.brand}</Link> : <span className="eyebrow">{p.brand}</span>}
        <h1 style={{ fontSize: 32, marginTop: 8 }}>{p.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 500 }}>{money(p.price)}</span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>{p.currency} · {p.color}</span>
        </div>
        <div className="rule" style={{ margin: '18px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--muted)' }}>Sold by</span><span>{p.partner}</span>
        </div>
        {p.affiliate && <p className="note" style={{ marginTop: 14 }}><Info size={15} style={{ flexShrink: 0 }} />Affiliate link — NYFW Style may earn a commission at no cost to you.</p>}
        <Button block style={{ marginTop: 20 }} onClick={() => setOpen(true)}>Shop at {p.partner}<ArrowUpRight size={15} /></Button>
      </div>

      {looks.length > 0 && (
        <div className="section" style={{ paddingBottom: 28 }}>
          <div className="section-head px"><h2>Style it with</h2></div>
          <div className="h-scroll hide-scroll">
            {looks.map((l) => <Link key={l.id} to={`/looks/${l.id}`} className="saved-tile"><Img src={l.image} alt={l.title} /><b>{l.title}</b></Link>)}
          </div>
        </div>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} label="Leaving NYFW Style">
        <div className="eyebrow">External checkout</div>
        <h2 style={{ fontSize: 26, margin: '8px 0 6px' }}>You’re heading to {p.partner}</h2>
        <p style={{ color: 'var(--ink-2)', fontSize: 14 }}>Checkout, delivery and returns are handled by the partner store. We track the click — never your payment.</p>
        <div className="card" style={{ display: 'flex', gap: 12, padding: 10, margin: '18px 0', alignItems: 'center' }}>
          <Img src={p.image} alt="" style={{ width: 56, height: 68, borderRadius: 10 }} />
          <span style={{ flex: 1 }}><div className="eyebrow">{p.brand}</div><div style={{ fontSize: 14 }}>{p.name}</div></span>
          <b style={{ fontWeight: 500 }}>{money(p.price)}</b>
        </div>
        <a className="btn primary block" href={p.url} target="_blank" rel="noopener noreferrer sponsored">Continue to {p.partner}<ArrowUpRight size={15} /></a>
        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', marginTop: 12 }}>Prototype: this opens a demo page.</p>
      </Sheet>
    </Screen>
  );
}
