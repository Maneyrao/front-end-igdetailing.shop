export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'wash' | 'interior' | 'protection' | 'accessories' | 'kits';
  price: number;
  image: string;
  shortDescription: string;
  description: string;
  whatIsItFor: string;
  howToUse: string;
  isBestSeller?: boolean;
  isKit?: boolean;
  relatedProducts?: string[];
}

export const products: Product[] = [
  // KITS
  {
    id: 'beginner-kit',
    name: 'Beginner Detail Kit',
    slug: 'beginner-detail-kit',
    category: 'kits',
    price: 89990,
    image: 'https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXRhaWxpbmclMjBraXQlMjBwcm9kdWN0cyUyMHRvb2xzfGVufDF8fHx8MTc3NjQ0MTQwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Everything you need to start detailing like a pro',
    description: 'Complete starter kit with pH-neutral shampoo, premium microfiber towels, tire cleaner, and interior spray. Perfect for first-time detailers.',
    whatIsItFor: 'Getting professional results without confusion. This kit contains the essential products needed for a complete exterior and interior detail.',
    howToUse: '1. Start with the wash shampoo and microfiber mitt. 2. Dry with the drying towel. 3. Clean tires with tire cleaner. 4. Finish interior with quick detailer spray.',
    isKit: true,
    isBestSeller: true,
    relatedProducts: ['premium-shampoo', 'microfiber-set', 'tire-cleaner']
  },
  {
    id: 'interior-kit',
    name: 'Interior Refresh Kit',
    slug: 'interior-refresh-kit',
    category: 'kits',
    price: 79990,
    image: 'https://images.unsplash.com/photo-1590456744036-1467d08b88a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGNsZWFuJTIwbGVhdGhlcnxlbnwxfHx8fDE3NzY0NDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Deep clean and protect your interior surfaces',
    description: 'Specialized kit for leather, plastic, and fabric. Includes leather cleaner & conditioner, interior detailer, and premium microfiber cloths.',
    whatIsItFor: 'Restoring and protecting all interior surfaces including leather seats, dashboard, door panels, and center console.',
    howToUse: '1. Vacuum first. 2. Apply leather cleaner to seats. 3. Use interior detailer on plastics. 4. Condition leather surfaces. 5. Buff with microfiber.',
    isKit: true,
    isBestSeller: true,
    relatedProducts: ['leather-cleaner', 'interior-detailer', 'microfiber-set']
  },
  {
    id: 'shine-kit',
    name: 'Ultimate Shine Kit',
    slug: 'ultimate-shine-kit',
    category: 'kits',
    price: 129990,
    image: 'https://images.unsplash.com/photo-1723659081228-94b14d1e61d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkZXRhaWwlMjBzaGluZXxlbnwxfHx8fDE3NzYzODI1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Maximum gloss and protection for paint perfectionists',
    description: 'Premium paint correction and protection system. Includes clay bar, polish, ceramic spray wax, and applicators for showroom finish.',
    whatIsItFor: 'Achieving deep gloss and long-lasting protection. Removes light swirls and creates a hydrophobic barrier.',
    howToUse: '1. Wash and dry car. 2. Clay bar treatment. 3. Apply polish with applicator. 4. Buff off. 5. Apply ceramic spray wax. 6. Buff to shine.',
    isKit: true,
    isBestSeller: true,
    relatedProducts: ['ceramic-wax', 'clay-bar', 'paint-polish']
  },

  // WASH PRODUCTS
  {
    id: 'premium-shampoo',
    name: 'pH Neutral Car Shampoo',
    slug: 'ph-neutral-car-shampoo',
    category: 'wash',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1697273245326-1a3736f6f428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaGFtcG9vJTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzY0NDE0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Safe, streak-free wash for all paint types',
    description: 'Professional-grade pH neutral formula that safely removes dirt without stripping wax or sealant. High foam, high lubrication. 16 oz concentrate makes 32 washes.',
    whatIsItFor: 'Weekly maintenance washing that won\'t damage your paint, wax, or coating. Safe for all finishes including matte and wrapped vehicles.',
    howToUse: '1. Mix 1-2 oz with 3-5 gallons of water. 2. Use with wash mitt in straight lines. 3. Rinse thoroughly with clean water. 4. Dry immediately.',
    isBestSeller: true,
    relatedProducts: ['wash-mitt', 'drying-towel', 'wheel-cleaner']
  },
  {
    id: 'microfiber-set',
    name: 'Premium Microfiber Towel Set',
    slug: 'premium-microfiber-towel-set',
    category: 'accessories',
    price: 34990,
    image: 'https://images.unsplash.com/photo-1714058948946-8fc9c3fa6a67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2ZpYmVyJTIwdG93ZWwlMjBjbGVhbmluZ3xlbnwxfHx8fDE3NzY0NDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Ultra-soft 800 GSM professional towels (6-pack)',
    description: 'Professional quality microfiber in multiple colors for different tasks. Scratch-free, lint-free, super absorbent. Includes 2 drying, 2 buffing, 2 interior towels.',
    whatIsItFor: 'Safe drying, buffing, and interior cleaning without scratching. Different colors prevent cross-contamination between tasks.',
    howToUse: 'Use designated colors: Blue for drying, gray for buffing/wax removal, black for interior. Fold into quarters for multiple clean sides. Machine wash without fabric softener.',
    isBestSeller: true,
    relatedProducts: ['premium-shampoo', 'interior-detailer', 'ceramic-wax']
  },

  // PROTECTION
  {
    id: 'ceramic-wax',
    name: 'Ceramic Spray Wax',
    slug: 'ceramic-spray-wax',
    category: 'protection',
    price: 39990,
    image: 'https://images.unsplash.com/photo-1678383407784-41d006e088c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3YXglMjBwb2xpc2glMjBib3R0bGV8ZW58MXx8fHwxNzc2NDQxNDA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Easy spray-on protection with 3-month durability',
    description: 'Hybrid ceramic SiO2 formula provides instant shine and water beading. UV protection and hydrophobic properties. 16 oz bottle covers 15+ cars.',
    whatIsItFor: 'Adding a protective layer that repels water, makes future washing easier, and enhances gloss. Perfect as a drying aid or standalone sealant.',
    howToUse: '1. Apply to clean, wet or dry paint. 2. Spray on panel by panel. 3. Spread with microfiber towel. 4. Buff to high gloss. Can be used as drying aid.',
    isBestSeller: true,
    relatedProducts: ['premium-shampoo', 'microfiber-set', 'paint-polish']
  },

  // INTERIOR
  {
    id: 'leather-cleaner',
    name: 'Leather Cleaner & Conditioner',
    slug: 'leather-cleaner-conditioner',
    category: 'interior',
    price: 29990,
    image: 'https://images.unsplash.com/photo-1590456744036-1467d08b88a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGNsZWFuJTIwbGVhdGhlcnxlbnwxfHx8fDE3NzY0NDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Gentle cleaner + conditioner for leather seats',
    description: 'pH balanced formula safely cleans and conditions in one step. Removes dirt and body oils while preventing cracking and fading. Fresh leather scent.',
    whatIsItFor: 'Maintaining leather seats, steering wheels, and door panels. Prevents premature aging and keeps leather soft and supple.',
    howToUse: '1. Vacuum seats first. 2. Spray onto applicator or directly on leather. 3. Gently agitate with soft brush. 4. Wipe clean with microfiber. 5. Buff dry.',
    relatedProducts: ['interior-detailer', 'microfiber-set', 'interior-kit']
  },
  {
    id: 'interior-detailer',
    name: 'Interior Quick Detailer',
    slug: 'interior-quick-detailer',
    category: 'interior',
    price: 19990,
    image: 'https://images.unsplash.com/photo-1590456744036-1467d08b88a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGNsZWFuJTIwbGVhdGhlcnxlbnwxfHx8fDE3NzY0NDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Fast cleaner for dashboard, console, and plastics',
    description: 'Non-greasy spray for all interior plastics and vinyl. Anti-static formula repels dust. Leaves natural matte or satin finish, no shine.',
    whatIsItFor: 'Quick cleaning and protecting dashboard, door panels, center console, and other plastic surfaces between deep cleans.',
    howToUse: '1. Spray onto microfiber cloth (not directly on surface). 2. Wipe all plastic surfaces. 3. Buff with clean side of towel. Safe for screens when used on cloth.',
    relatedProducts: ['leather-cleaner', 'microfiber-set', 'interior-kit']
  },

  // ACCESSORIES
  {
    id: 'tire-cleaner',
    name: 'Tire & Wheel Cleaner',
    slug: 'tire-wheel-cleaner',
    category: 'accessories',
    price: 22990,
    image: 'https://images.unsplash.com/photo-1697273245326-1a3736f6f428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaGFtcG9vJTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzY0NDE0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Iron-removing formula for wheels and tires',
    description: 'Color-changing formula turns purple when dissolving brake dust. Safe for all wheel finishes. Acid-free, pH balanced.',
    whatIsItFor: 'Deep cleaning brake dust, road grime, and tar from wheels and tires. Restores like-new appearance.',
    howToUse: '1. Spray generously on cool, dry wheels. 2. Let dwell 3-5 minutes (watch it turn purple). 3. Agitate with brush. 4. Rinse thoroughly. Do not let dry.',
    relatedProducts: ['premium-shampoo', 'wheel-brush', 'tire-dressing']
  },
  {
    id: 'clay-bar',
    name: 'Clay Bar Kit',
    slug: 'clay-bar-kit',
    category: 'accessories',
    price: 27990,
    image: 'https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXRhaWxpbmclMjBraXQlMjBwcm9kdWN0cyUyMHRvb2xzfGVufDF8fHx8MTc3NjQ0MTQwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Remove embedded contaminants for glass-smooth paint',
    description: 'Medium-grade clay bar with lubricant spray. Safely removes overspray, tree sap, rail dust, and industrial fallout. Two 100g bars included.',
    whatIsItFor: 'Decontaminating paint before polishing or wax application. Removes bonded contaminants that washing can\'t remove.',
    howToUse: '1. Wash and dry car first. 2. Spray lubricant on small section. 3. Glide clay bar with light pressure. 4. Wipe clean. 5. Re-knead clay when dirty.',
    relatedProducts: ['paint-polish', 'ceramic-wax', 'shine-kit']
  },
  {
    id: 'paint-polish',
    name: 'One-Step Paint Polish',
    slug: 'one-step-paint-polish',
    category: 'protection',
    price: 32990,
    image: 'https://images.unsplash.com/photo-1723659081228-94b14d1e61d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkZXRhaWwlMjBzaGluZXxlbnwxfHx8fDE3NzYzODI1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    shortDescription: 'Remove light swirls and restore deep gloss',
    description: 'All-in-one polish removes light scratches, swirls, and oxidation while leaving a protective layer. Hand or machine application.',
    whatIsItFor: 'Correcting minor paint imperfections and restoring clarity and depth to faded or swirled paint.',
    howToUse: '1. Work on cool paint in shade. 2. Apply small amount to applicator. 3. Work in 2x2 sections with circular motions. 4. Buff off haze with microfiber.',
    relatedProducts: ['clay-bar', 'ceramic-wax', 'microfiber-set']
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category);
};

export const getBestSellers = (): Product[] => {
  return products.filter(p => p.isBestSeller);
};

export const getKits = (): Product[] => {
  return products.filter(p => p.isKit);
};

export const getRelatedProducts = (productId: string): Product[] => {
  const product = products.find(p => p.id === productId);
  if (!product || !product.relatedProducts) return [];
  
  return product.relatedProducts
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);
};
