import { Link } from 'react-router-dom';
import type { Product } from '../../data/types';
import { Img, money } from '../../ui';

export function ProductTile({ p }: { p: Product }) {
  return (
    <Link to={`/shop/${p.id}`} className="ptile" aria-label={p.name}>
      <div className="ptile-img">
        <Img src={p.image} alt={p.name} />
        {p.affiliate && <span className="tag ptile-tag">Affiliate</span>}
      </div>
      <div className="ptile-brand">{p.brand}</div>
      <div className="ptile-name">{p.name}</div>
      <div className="ptile-price">{money(p.price)}</div>
    </Link>
  );
}
