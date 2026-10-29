import type { ReactNode } from 'react';
import './shell.css';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="stage">
      <aside className="aside">
        <h1>NYFW<br />Style</h1>
        <div className="sub">Your personal fashion week stylist</div>
        <p>An interactive prototype of the AI fashion advisor. Tap through it like the real app.</p>
        <div className="rule" />
        <div className="swatches">
          {['#0B0B0B', '#F7F3EC', '#D9CBB8', '#B8976A'].map((c) => <span key={c} style={{ background: c }} />)}
        </div>
        <small>Concept prototype · demo data · pending brand approval.<br />Not an official New York Fashion Week product.</small>
      </aside>
      <div className="device">{children}</div>
    </div>
  );
}
