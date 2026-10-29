import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ui.css';

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' | 'light'; block?: boolean; small?: boolean };
export function Button({ variant = 'primary', block, small, className = '', ...rest }: BtnProps) {
  return <button className={`btn ${variant}${block ? ' block' : ''}${small ? ' small' : ''} ${className}`} {...rest} />;
}

export function Chip({ on, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { on?: boolean }) {
  return <button className={`chip${on ? ' on' : ''}`} aria-pressed={on} {...rest}>{children}</button>;
}

export function Img({ src, alt, className = '', style, eager }: { src: string; alt: string; className?: string; style?: React.CSSProperties; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`img${loaded ? ' loaded' : ''} ${className}`} style={style}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} />
    </div>
  );
}

export function Header({ title, clear, right, back = true }: { title?: string; clear?: boolean; right?: ReactNode; back?: boolean }) {
  const nav = useNavigate();
  return (
    <header className={`hdr${clear ? ' clear' : ''}`}>
      {back ? <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ChevronLeft size={22} strokeWidth={1.5} /></button> : <span />}
      {title && <span className="hdr-title">{title}</span>}
      {right ?? <span style={{ width: 40 }} />}
    </header>
  );
}

export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-label={label} className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
            <div className="grab" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useToast(): [ReactNode, (msg: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1800);
    return () => clearTimeout(t);
  }, [msg]);
  const node = (
    <AnimatePresence>
      {msg && <motion.div role="status" className="toast" initial={{ opacity: 0, y: 10, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, x: '-50%' }}>{msg}</motion.div>}
    </AnimatePresence>
  );
  return [node, setMsg];
}

export const money = (n: number) => `$${n.toLocaleString('en-US')}`;
