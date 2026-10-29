import type { Budget, Look, Occasion, StyleKey } from '../types';
import { IMG, img } from './images';

type Row = [id: string, title: string, occasion: Occasion, style: StyleKey, budget: Budget, temp: [number, number], image: keyof typeof IMG, items: string[], alternatives: string[], why: string];

const rows: Row[] = [
  ['l-office-ink', 'Ink Suit, Soft Edge', 'office', 'classic', '$$$', [8, 22], 'blazerNecklace', ['p-blazer-ink', 'p-trouser-wide', 'p-pumps-black', 'p-necklace'], ['p-blazer-relaxed', 'p-sockboot'],
    'A cinched blazer with wide trousers is this season’s Ink Tailoring trend in its most wearable form. The single gold chain keeps it from feeling corporate.'],
  ['l-office-minimal', 'Monochrome Meeting', 'office', 'minimal', '$$', [4, 18], 'turtleneck', ['p-turtleneck', 'p-trouser-wide', 'p-sockboot', 'p-bag-white'], ['p-trouser-ivory', 'p-suede-boot'],
    'Black on black in three textures — merino, wool and leather — looks deliberate without trying. The white tote breaks it up.'],
  ['l-office-camel', 'Camel Over Black', 'office', 'editorial', '$$$', [6, 16], 'streetCamelTrench', ['p-trench-camel', 'p-turtleneck', 'p-trouser-wide', 'p-suede-boot'], ['p-trench-classic', 'p-pumps-black'],
    'An oversized trench worn open over a single colour makes the coat the silhouette — exactly how it was styled outside the shows.'],
  ['l-everyday-denim', 'Weekday Uniform', 'everyday', 'relaxed', '$', [10, 24], 'flatlayBoots', ['p-tee-white', 'p-jeans-straight', 'p-suede-boot', 'p-hoops'], ['p-stripe-tee', 'p-sunglasses'],
    'A heavy white tee and straight selvedge jeans are the base; molten gold hoops are the one detail that makes it look styled.'],
  ['l-everyday-knit', 'Warm Archive', 'everyday', 'classic', '$$', [0, 12], 'knitRust', ['p-cable-rust', 'p-jeans-straight', 'p-suede-boot', 'p-bag-quilted'], ['p-turtleneck', 'p-trench-classic'],
    'Hand-made knits are a key FW 2026 trend. Rust against indigo denim and tan suede keeps the palette warm.'],
  ['l-everyday-white', 'White Space', 'everyday', 'minimal', '$$', [8, 20], 'whiteCoat', ['p-coat-white', 'p-sweat-white', 'p-jeans-straight', 'p-bag-white'], ['p-trouser-ivory', 'p-sunglasses'],
    'The white coat is the statement; everything underneath stays simple so it can shine.'],
  ['l-evening-slip', 'After Hours', 'evening', 'editorial', '$$$', [12, 26], 'streetSlipBW', ['p-slip-black', 'p-trench-black', 'p-sockboot', 'p-bag-metal'], ['p-pumps-black', 'p-hoops'],
    'Liquid satin under a long black trench is the downtown version of eveningwear. Sock boots keep it walkable.'],
  ['l-evening-romantic', 'Blush & Gold', 'evening', 'romantic', '$$', [16, 28], 'blouse', ['p-blouse-blush', 'p-trouser-ivory', 'p-pumps-ivory', 'p-pendant'], ['p-gauze-dress', 'p-rings'],
    'Soft blush silk with ivory trousers stays in the season’s pale palette. A single pendant adds the molten-gold detail.'],
  ['l-event-gown', 'Front Row', 'event', 'romantic', '$$$', [14, 30], 'heroRunway', ['p-gown-ivory', 'p-pumps-ivory', 'p-hoops', 'p-bag-metal'], ['p-gauze-dress', 'p-coat-white'],
    'Ivory Everything at its most dramatic: draped ivory with tonal pumps and sculptural gold.'],
  ['l-event-noir', 'Show Day Noir', 'event', 'editorial', '$$$', [5, 18], 'streetTrenchBW', ['p-trench-black', 'p-blazer-ink', 'p-trouser-wide', 'p-sunglasses'], ['p-sockboot', 'p-necklace'],
    'Street Noir done right: every black piece in a different texture, finished with clear-frame sunglasses.'],
  ['l-weekend-trench', 'Saturday Trench', 'weekend', 'classic', '$$', [8, 20], 'streetBeigeTrench', ['p-trench-classic', 'p-stripe-tee', 'p-jeans-straight', 'p-suede-boot'], ['p-sunglasses', 'p-bag-quilted'],
    'A long beige trench over a Breton top is timeless; the length makes jeans look intentional.'],
  ['l-weekend-relaxed', 'Gallery Hop', 'weekend', 'relaxed', '$', [10, 22], 'nycWalkersBW', ['p-sweat-white', 'p-trouser-wide', 'p-suede-boot', 'p-sunglasses'], ['p-tee-white', 'p-hoops'],
    'Wide trousers dress up a boxy sweatshirt — comfortable enough for a day on foot in the city.'],
  ['l-travel-carry', 'Plane to Meeting', 'travel', 'minimal', '$$', [8, 22], 'blackTrench', ['p-trench-black', 'p-turtleneck', 'p-trouser-wide', 'p-sockboot'], ['p-coat-white', 'p-suede-boot'],
    'Wrinkle-proof black layers you can step off a flight and into a meeting in.'],
  ['l-travel-sun', 'Somewhere Warm', 'travel', 'relaxed', '$', [20, 32], 'suitcaseHat', ['p-tee-white', 'p-jeans-straight', 'p-sunglasses', 'p-hoops'], ['p-blouse-blush', 'p-gauze-dress'],
    'Light basics that mix with everything in the capsule, plus sunglasses and gold to look put-together.'],
];

export const looks: Look[] = rows.map(([id, title, occasion, style, budget, [tempMin, tempMax], image, items, alternatives, why]) => ({
  id, title, occasion, style, budget, tempMin, tempMax, items, alternatives, why, image: img(IMG[image], 1000),
}));
