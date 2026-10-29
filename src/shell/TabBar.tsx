import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, Shirt, ShoppingBag, User } from 'lucide-react';

const TABS = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/style', label: 'Style', Icon: Sparkles },
  { to: '/closet', label: 'Closet', Icon: Shirt },
  { to: '/shop', label: 'Shop', Icon: ShoppingBag },
  { to: '/you', label: 'You', Icon: User },
];

export function TabBar() {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId="tab-dot" className="dot" />}
              <Icon size={21} strokeWidth={isActive ? 1.8 : 1.4} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
