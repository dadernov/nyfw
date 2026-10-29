import type { Designer } from '../types';
import { IMG, img } from './images';

// Fictional demo designers: the real roster comes from the CMS once partnerships are signed.
export const designers: Designer[] = [
  {
    id: 'ardent', name: 'Maison Ardent', city: 'New York', tagline: 'Sharp tailoring, soft shoulders.',
    bio: 'A Garment District label rethinking the power suit: fluid trousers, cinched blazers and an ivory-to-ink palette built for long city days.',
    image: img(IMG.blazerNecklace), tags: ['Tailoring', 'Quiet luxury', 'Monochrome'], website: 'https://example.com/demo/ardent',
    collection: { title: 'Ink & Ivory', season: 'FW 2026', images: [img(IMG.runwaySuits), img(IMG.blackTrench), img(IMG.blazerBlack)] },
  },
  {
    id: 'varga', name: 'Ilse Varga', city: 'Brooklyn', tagline: 'Hand-finished knits with a runway edge.',
    bio: 'Chunky cables, sculpted collars and rust-to-camel tones. Every piece is finished by hand in a Red Hook studio.',
    image: img(IMG.turtleneck), tags: ['Knitwear', 'Craft', 'Earth tones'], website: 'https://example.com/demo/varga',
    collection: { title: 'Warm Archive', season: 'FW 2026', images: [img(IMG.knitRust), img(IMG.turtleneck), img(IMG.streetCamelTrench)] },
  },
  {
    id: 'koda', name: 'Kōda Studio', city: 'New York', tagline: 'Minimalism, engineered.',
    bio: 'Clean volumes, technical fabrics and nothing extra. Kōda designs the pieces you reach for every morning.',
    image: img(IMG.whiteCoat), tags: ['Minimal', 'Outerwear', 'Utility'], website: 'https://example.com/demo/koda',
    collection: { title: 'White Space', season: 'SS 2027', images: [img(IMG.whiteCoat), img(IMG.sweatWhite), img(IMG.runwayBW)] },
  },
  {
    id: 'noor', name: 'Atelier Noor', city: 'New York', tagline: 'Eveningwear that moves.',
    bio: 'Bias-cut slips, liquid satins and gauze layers made for nights that start at a show and end downtown.',
    image: img(IMG.runwayGauze), tags: ['Eveningwear', 'Romantic', 'Draping'], website: 'https://example.com/demo/noor',
    collection: { title: 'After Hours', season: 'FW 2026', images: [img(IMG.runwayGauze), img(IMG.heroRunway), img(IMG.streetSlipBW)] },
  },
  {
    id: 'wren', name: 'Wren & Hale', city: 'New York', tagline: 'The trench, reconsidered.',
    bio: 'A outerwear house obsessed with one coat. Classic gabardine, oversized lapels and linings worth showing off.',
    image: img(IMG.streetBeigeTrench), tags: ['Outerwear', 'Classic', 'Heritage'], website: 'https://example.com/demo/wren',
    collection: { title: 'Rain Season', season: 'FW 2026', images: [img(IMG.streetBeigeTrench), img(IMG.streetCamelTrench), img(IMG.streetTrenchBW)] },
  },
  {
    id: 'moreau', name: 'Celeste Moreau', city: 'Paris · New York', tagline: 'Gold that feels like sculpture.',
    bio: 'Recycled-gold hoops, molten rings and pendants cast from hand-carved wax. Designed to be worn every day.',
    image: img(IMG.hoops), tags: ['Jewelry', 'Gold', 'Sculptural'], website: 'https://example.com/demo/moreau',
    collection: { title: 'Molten', season: 'SS 2027', images: [img(IMG.hoops), img(IMG.rings), img(IMG.pendant)] },
  },
  {
    id: 'halden', name: 'Halden', city: 'New York', tagline: 'Shoes for walking the city in.',
    bio: 'Pointed pumps, sock boots and suede ankle boots with cushioned soles — tested on twelve-hour show days.',
    image: img(IMG.pumpsWhite), tags: ['Footwear', 'Leather', 'Comfort'], website: 'https://example.com/demo/halden',
    collection: { title: 'Pavement', season: 'FW 2026', images: [img(IMG.pumpsWhite), img(IMG.bootBlack), img(IMG.heelBlack)] },
  },
];
