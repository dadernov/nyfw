import type { Category, Product } from '../types';
import { IMG, img } from './images';

type Row = [id: string, name: string, brand: string, designerId: string | undefined, category: Category, color: string, price: number, partner: string, affiliate: boolean, image: keyof typeof IMG];

// Demo catalog: names, prices and stores are illustrative and link to example.com.
const rows: Row[] = [
  ['p-blazer-ink', 'Cinched Wool Blazer', 'Maison Ardent', 'ardent', 'outerwear', 'Black', 690, 'Madison Edit', true, 'blazerBlack'],
  ['p-blazer-relaxed', 'Relaxed Boyfriend Blazer', 'Maison Ardent', 'ardent', 'outerwear', 'Black', 540, 'Hudson Archive', false, 'blazerTable'],
  ['p-blazer-camel', 'Camel Single-Breasted Blazer', 'Maison Ardent', 'ardent', 'outerwear', 'Camel', 620, 'Madison Edit', true, 'blazerBrown'],
  ['p-trench-classic', 'Classic Gabardine Trench', 'Wren & Hale', 'wren', 'outerwear', 'Beige', 980, 'Madison Edit', true, 'streetBeigeTrench'],
  ['p-trench-camel', 'Oversized Camel Trench', 'Wren & Hale', 'wren', 'outerwear', 'Camel', 1150, 'The Bowery Line', true, 'streetCamelTrench'],
  ['p-trench-black', 'Belted Black Trench', 'Wren & Hale', 'wren', 'outerwear', 'Black', 1040, 'Hudson Archive', false, 'blackTrench'],
  ['p-coat-white', 'Double-Breasted White Coat', 'Kōda Studio', 'koda', 'outerwear', 'White', 860, 'The Bowery Line', true, 'whiteCoat'],
  ['p-turtleneck', 'Fine Merino Turtleneck', 'Ilse Varga', 'varga', 'knitwear', 'Black', 280, 'Madison Edit', true, 'turtleneck'],
  ['p-cable-rust', 'Hand-Cable Sweater', 'Ilse Varga', 'varga', 'knitwear', 'Rust', 420, 'Hudson Archive', false, 'knitRust'],
  ['p-sweat-white', 'Boxy Cotton Sweatshirt', 'Kōda Studio', 'koda', 'knitwear', 'White', 160, 'The Bowery Line', true, 'sweatWhite'],
  ['p-blouse-blush', 'Tie-Waist Silk Blouse', 'Atelier Noor', 'noor', 'tops', 'Blush', 340, 'Madison Edit', true, 'blouse'],
  ['p-tee-white', 'Heavy Cotton Tee', 'Kōda Studio', 'koda', 'tops', 'White', 85, 'The Bowery Line', false, 'flatlayBoots'],
  ['p-stripe-tee', 'Breton Stripe Top', 'Kōda Studio', 'koda', 'tops', 'Navy / White', 120, 'Hudson Archive', true, 'denim'],
  ['p-jeans-straight', 'Straight Selvedge Jeans', 'Kōda Studio', 'koda', 'bottoms', 'Indigo', 230, 'The Bowery Line', true, 'denim'],
  ['p-trouser-wide', 'Wide Pleated Trousers', 'Maison Ardent', 'ardent', 'bottoms', 'Black', 390, 'Madison Edit', true, 'streetTrenchBW'],
  ['p-trouser-ivory', 'Ivory Wool Trousers', 'Maison Ardent', 'ardent', 'bottoms', 'Ivory', 410, 'Hudson Archive', false, 'whiteCoat'],
  ['p-slip-black', 'Bias-Cut Satin Slip Dress', 'Atelier Noor', 'noor', 'dresses', 'Black', 640, 'Madison Edit', true, 'streetSlipBW'],
  ['p-gown-ivory', 'Draped Ivory Gown', 'Atelier Noor', 'noor', 'dresses', 'Ivory', 1890, 'The Bowery Line', true, 'heroRunway'],
  ['p-gauze-dress', 'Layered Gauze Midi', 'Atelier Noor', 'noor', 'dresses', 'Sand', 780, 'Hudson Archive', false, 'runwayGauze'],
  ['p-pumps-ivory', 'Pointed Ivory Pumps', 'Halden', 'halden', 'shoes', 'Ivory', 450, 'Madison Edit', true, 'pumpsWhite'],
  ['p-pumps-black', 'Classic Black Stilettos', 'Halden', 'halden', 'shoes', 'Black', 420, 'The Bowery Line', true, 'heelBlack'],
  ['p-sockboot', 'Leather Sock Boots', 'Halden', 'halden', 'shoes', 'Black', 590, 'Hudson Archive', false, 'bootBlack'],
  ['p-suede-boot', 'Suede Ankle Boots', 'Halden', 'halden', 'shoes', 'Tan', 380, 'Madison Edit', true, 'bootsSuede'],
  ['p-bag-quilted', 'Quilted Top-Handle Bag', 'Wren & Hale', 'wren', 'bags', 'Beige', 1250, 'Madison Edit', true, 'bagQuilted'],
  ['p-bag-white', 'Structured White Tote', 'Kōda Studio', 'koda', 'bags', 'White', 720, 'The Bowery Line', true, 'bagWhite'],
  ['p-bag-duffle', 'Leather Weekender', 'Wren & Hale', 'wren', 'bags', 'Black', 890, 'Hudson Archive', false, 'bagBlack'],
  ['p-bag-metal', 'Metallic Mini Bag', 'Atelier Noor', 'noor', 'bags', 'Silver', 560, 'Madison Edit', true, 'bagMetal'],
  ['p-sunglasses', 'Clear-Frame Sunglasses', 'Kōda Studio', 'koda', 'accessories', 'Crystal / Brown', 240, 'The Bowery Line', true, 'sunglasses'],
  ['p-hoops', 'Molten Gold Hoops', 'Celeste Moreau', 'moreau', 'jewelry', 'Gold', 310, 'Madison Edit', true, 'hoops'],
  ['p-rings', 'Stacking Ring Trio', 'Celeste Moreau', 'moreau', 'jewelry', 'Gold', 260, 'Hudson Archive', false, 'rings'],
  ['p-pendant', 'Oval Pendant Necklace', 'Celeste Moreau', 'moreau', 'jewelry', 'Gold', 290, 'Madison Edit', true, 'pendant'],
  ['p-necklace', 'Flat Snake Chain', 'Celeste Moreau', 'moreau', 'jewelry', 'Gold', 340, 'The Bowery Line', true, 'blazerNecklace'],
  ['p-weekender', 'Hard-Shell Carry-On', 'Wren & Hale', 'wren', 'bags', 'Cognac', 650, 'Hudson Archive', true, 'suitcaseLeather'],
];

export const products: Product[] = rows.map(([id, name, brand, designerId, category, color, price, partner, affiliate, image]) => ({
  id, name, brand, designerId, category, color, price, partner, affiliate,
  currency: 'USD',
  url: `https://example.com/demo/shop/${id}`,
  image: img(IMG[image], 700),
}));
