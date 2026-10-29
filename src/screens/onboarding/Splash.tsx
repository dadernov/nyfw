import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IMG, img } from '../../data/mock/images';
import { Button, Img } from '../../ui';
import { Logo } from './Logo';
import './onboarding.css';

export function Splash() {
  const nav = useNavigate();
  return (
    <div className="splash">
      <Img eager className="bg" src={img(IMG.runwaySunglasses, 1200)} alt="Model on a runway" />
      <div className="shade" />
      <motion.div className="top-logo" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .8 }}>
        <Logo />
      </motion.div>
      <motion.div className="content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .8, ease: [0.22, 1, 0.36, 1] }}>
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,.75)', marginBottom: 14 }}>Your personal fashion week stylist</div>
        <h1>From the runway<br />to your day.</h1>
        <p>Looks for today, a packed suitcase for your next trip, and the season’s trends — styled for you.</p>
        <Button variant="light" block onClick={() => nav('/onboarding/sign-in')}>Begin</Button>
      </motion.div>
    </div>
  );
}
