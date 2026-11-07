// Demo de teste: o herói REAL do site + o pacote isolado da animação.
import { createRoot } from 'react-dom/client';
import '../../src/fonts.css';
import '../../src/index.css';
import Hero from '../../src/components/Hero.jsx';
import { HeroAnimation } from '../src/index.js';

createRoot(document.getElementById('root')).render(
  <div style={{ minHeight: '200vh' }}>
    <Hero />
    <HeroAnimation logo="/brand/logo-720.webp" logoAlt="Barones Labs" onDone={() => { window.__heroDone = true; }} />
  </div>
);
