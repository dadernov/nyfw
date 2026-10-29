import { Link } from 'react-router-dom';
import { Heart, Shirt, ShoppingBag } from 'lucide-react';
import type { StyledLook } from '../../data/stylist';
import { useDemo } from '../../state/store';
import { Button, Img, money } from '../../ui';

const OCCASION: Record<string, string> = { office: 'Office', everyday: 'Everyday', evening: 'Evening', event: 'Event', weekend: 'Weekend', travel: 'Travel' };

export function LookCard({ styled, onSave }: { styled: StyledLook; onSave?: (saved: boolean) => void }) {
  const { saved, toggleSave } = useDemo();
  const { look, products, fromCloset, alternatives } = styled;
  const isSaved = saved.includes(look.id);
  const save = () => { toggleSave(look.id); onSave?.(!isSaved); };
  return (
    <article className="card look" aria-label={look.title}>
      <div className="hero">
        <Img src={look.image} alt={look.title} />
        <div className="tags"><span className="tag dark">{OCCASION[look.occasion]}</span><span className="tag dark">{look.style}</span></div>
      </div>
      <div className="body">
        <h3>{look.title}</h3>
        <p className="why"><b>Why it works · </b>{look.why}</p>

        <span className="eyebrow label">The pieces</span>
        <div className="items">
          {fromCloset.map((c) => (
            <div key={c.id} className="item-row">
              {c.photo ? <Img src={c.photo} alt={c.name} /> : <span className="ph"><Shirt size={20} strokeWidth={1.3} /></span>}
              <div className="meta"><div className="brand">From your closet</div><div className="name">{c.name}</div></div>
            </div>
          ))}
          {products.map((p) => (
            <Link key={p.id} to={`/shop/${p.id}`} className="item-row">
              <Img src={p.image} alt={p.name} />
              <div className="meta"><div className="brand">{p.brand}</div><div className="name">{p.name}</div></div>
              <div className="price">{money(p.price)}{p.affiliate && <div><span className="tag" style={{ marginTop: 4 }}>Affiliate</span></div>}</div>
            </Link>
          ))}
        </div>

        {alternatives.length > 0 && (
          <>
            <span className="eyebrow label">Or swap in</span>
            <div className="alts">
              {alternatives.map((p) => <Link key={p.id} to={`/shop/${p.id}`}><Img src={p.image} alt={p.name} /><span>{p.name}</span></Link>)}
            </div>
          </>
        )}

        <div className="actions">
          <Button variant={isSaved ? 'primary' : 'outline'} onClick={save} aria-label={isSaved ? 'Saved' : 'Save look'}>
            <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />{isSaved ? 'Saved' : 'Save'}
          </Button>
          <Link to={`/shop?look=${look.id}`} className="btn outline" aria-label="Shop similar"><ShoppingBag size={14} />Shop similar</Link>
        </div>
      </div>
    </article>
  );
}
