import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Camera, Plus, Shirt } from 'lucide-react';
import { content } from '../../data/content';
import { IMG, img } from '../../data/mock/images';
import type { Category, ClosetItem, Look } from '../../data/types';
import { useDemo } from '../../state/store';
import { Button, Chip, Img, Screen, Sheet, useToast } from '../../ui';
import { useAsync } from '../Home';
import './closet.css';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'outerwear', label: 'Outerwear' }, { key: 'tops', label: 'Tops' }, { key: 'knitwear', label: 'Knitwear' }, { key: 'bottoms', label: 'Bottoms' },
  { key: 'dresses', label: 'Dresses' }, { key: 'shoes', label: 'Shoes' }, { key: 'bags', label: 'Bags' }, { key: 'accessories', label: 'Accessories' }, { key: 'jewelry', label: 'Jewelry' },
];
const FILTERS: { key: string; label: string; cats: Category[] }[] = [
  { key: 'all', label: 'All', cats: [] }, { key: 'clothing', label: 'Clothing', cats: ['outerwear', 'tops', 'knitwear', 'bottoms', 'dresses'] },
  { key: 'shoes', label: 'Shoes', cats: ['shoes'] }, { key: 'bags', label: 'Bags', cats: ['bags'] }, { key: 'acc', label: 'Accessories', cats: ['accessories', 'jewelry'] },
];
const COLORS: [string, string][] = [['Black', '#0B0B0B'], ['White', '#FFFFFF'], ['Ivory', '#F3EBDD'], ['Beige', '#D9CBB8'], ['Camel', '#B8976A'], ['Brown', '#6B4A33'], ['Grey', '#9A9A9A'], ['Navy', '#1F2A44'], ['Blue', '#6C8EBF'], ['Red', '#9B2C2C'], ['Pink', '#E8C4C4'], ['Green', '#5E6B4E']];
const SAMPLE: Omit<ClosetItem, 'id'>[] = [
  { name: 'Black blazer', category: 'outerwear', color: 'Black', photo: img(IMG.blazerTable, 400) },
  { name: 'White tee', category: 'tops', color: 'White', photo: img(IMG.flatlayBoots, 400) },
  { name: 'Straight jeans', category: 'bottoms', color: 'Blue', photo: img(IMG.denim, 400) },
  { name: 'Rust knit', category: 'knitwear', color: 'Red', photo: img(IMG.knitRust, 400) },
  { name: 'Black boots', category: 'shoes', color: 'Black', photo: img(IMG.bootBlack, 400) },
  { name: 'Gold hoops', category: 'jewelry', color: 'Gold', photo: img(IMG.hoops, 400) },
];

// Shrinks a picked photo so the demo closet fits comfortably in local storage.
function toThumb(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const im = new Image();
      im.onerror = reject;
      im.onload = () => {
        const scale = Math.min(1, 480 / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = im.width * scale; c.height = im.height * scale;
        c.getContext('2d')!.drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      im.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function AddItem({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addItem } = useDemo();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('tops');
  const [color, setColor] = useState('Black');
  const [photo, setPhoto] = useState<string>();
  const input = useRef<HTMLInputElement>(null);
  const submit = () => {
    addItem({ name: name.trim() || `${color} ${CATEGORIES.find((c) => c.key === category)!.label.toLowerCase()}`, category, color, photo });
    setName(''); setPhoto(undefined); onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} label="Add item">
      <h2 style={{ fontSize: 26, marginBottom: 16 }}>Add to your closet</h2>
      <button className="photo-drop" style={{ width: '100%' }} onClick={() => input.current?.click()} aria-label="Add a photo">
        {photo ? <img src={photo} alt="" /> : <span style={{ display: 'grid', justifyItems: 'center', gap: 8 }}><Camera size={26} strokeWidth={1.3} />Photo or screenshot</span>}
      </button>
      <input ref={input} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await toThumb(f).catch(() => undefined)); }} />
      <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Camel coat" /></label>
      <label className="field"><span>Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>{CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</select>
      </label>
      <div className="field"><span>Colour · {color}</span></div>
      <div className="colors" style={{ marginTop: -8 }}>{COLORS.map(([n, hex]) => <button key={n} aria-label={n} className={color === n ? 'on' : ''} style={{ background: hex }} onClick={() => setColor(n)} />)}</div>
      <Button block onClick={submit}>Add to closet</Button>
      <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', marginTop: 12 }}>Wardrobe Lite: automatic recognition and background removal come in phase 2.</p>
    </Sheet>
  );
}

export function Closet() {
  const { closet, saved, addItem, removeItem } = useDemo();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'saved' ? 'saved' : 'pieces';
  const [filter, setFilter] = useState('all');
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<ClosetItem>();
  const [toast, showToast] = useToast();
  const looks = useAsync(() => content.getLooks()) ?? [];
  const savedLooks = saved.map((id) => looks.find((l) => l.id === id)).filter(Boolean) as Look[];
  const cats = FILTERS.find((f) => f.key === filter)!.cats;
  const items = closet.filter((c) => !cats.length || cats.includes(c.category));

  return (
    <Screen>
      <div className="page" style={{ paddingBottom: 14 }}>
        <div className="eyebrow" style={{ marginTop: 18 }}>Wardrobe Lite</div>
        <h1 className="page-title">Your Closet</h1>
        <p className="lede">Organize, style and create new looks with your own pieces.</p>
      </div>
      <div className="tabs">
        <button className={tab === 'pieces' ? 'on' : ''} onClick={() => setParams({})}>Pieces · {closet.length}</button>
        <button className={tab === 'saved' ? 'on' : ''} onClick={() => setParams({ tab: 'saved' })}>Saved looks · {saved.length}</button>
      </div>

      {tab === 'pieces' && (
        closet.length === 0 ? (
          <div className="empty">
            <Shirt size={30} strokeWidth={1.2} color="var(--champagne)" />
            <h3>Start your closet</h3>
            <p>Add a few pieces you love and your stylist will build looks and trips around them.</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <Button block onClick={() => setAdding(true)}>Add your first piece</Button>
              <Button block variant="ghost" onClick={() => { SAMPLE.forEach(addItem); showToast('Sample closet added'); }}>Try a sample closet</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="chips hide-scroll" style={{ marginBottom: 16 }}>{FILTERS.map((f) => <Chip key={f.key} on={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</Chip>)}</div>
            <div className="cgrid">
              {items.map((c) => (
                <button key={c.id} className="citem" onClick={() => setSelected(c)}>
                  {c.photo ? <Img src={c.photo} alt={c.name} /> : <span className="ph"><Shirt size={26} strokeWidth={1.2} /></span>}
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </>
        )
      )}

      {tab === 'saved' && (
        savedLooks.length ? (
          <div className="sgrid">{savedLooks.map((l) => <Link key={l.id} to={`/looks/${l.id}`} className="saved-tile"><Img src={l.image} alt={l.title} /><b>{l.title}</b></Link>)}</div>
        ) : (
          <div className="empty"><h3>No saved looks yet</h3><p>Tap Save on any look from your stylist.</p><Link to="/style" className="btn primary block">Get styled</Link></div>
        )
      )}
      <div style={{ height: 90 }} />

      <button className="fab" aria-label="Add item" onClick={() => setAdding(true)}><Plus size={24} strokeWidth={1.5} /></button>
      <AddItem open={adding} onClose={() => setAdding(false)} />
      <Sheet open={Boolean(selected)} onClose={() => setSelected(undefined)} label="Closet item">
        {selected && (
          <>
            {selected.photo && <Img src={selected.photo} alt={selected.name} style={{ height: 260, borderRadius: 16, marginBottom: 16 }} />}
            <h2 style={{ fontSize: 26 }}>{selected.name}</h2>
            <p style={{ color: 'var(--muted)', margin: '4px 0 20px', textTransform: 'capitalize' }}>{selected.category} · {selected.color}</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <Link to="/style" className="btn primary block">Style this piece</Link>
              <Button block variant="ghost" onClick={() => { removeItem(selected.id); setSelected(undefined); showToast('Removed from closet'); }}>Remove</Button>
            </div>
          </>
        )}
      </Sheet>
      {toast}
    </Screen>
  );
}
