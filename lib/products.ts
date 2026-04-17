export interface Product {
  id: string
  name: string
  price: number
  image: string
  images?: string[]
  category: string
  description?: string
  details?: string[]
  forWhom?: string
  howToUse?: string
  sizes?: string[]
  featured?: boolean
  bestSeller?: boolean
  isKit?: boolean
}

export const products: Product[] = [
  // Kits (Featured)
  {
    id: "kit-beginner",
    name: "Beginner Detailing Kit",
    price: 89.99,
    image: "/products/beginner-kit.jpg",
    images: ["/products/beginner-kit.jpg", "/products/beginner-kit-2.jpg", "/products/beginner-kit-3.jpg"],
    category: "Kits",
    description: "Everything you need to start your car detailing journey. This comprehensive kit includes our best-selling shampoo, microfiber towels, and quick detailer for a showroom-ready finish.",
    details: [
      "1x Car Shampoo (500ml)",
      "1x Quick Detailer Spray (500ml)",
      "3x Premium Microfiber Towels",
      "1x Wash Mitt",
      "Step-by-step guide included"
    ],
    forWhom: "Perfect for beginners who want to learn proper car care",
    howToUse: "Follow our included guide for best results. Start with wash, dry, then detail.",
    sizes: ["Standard Kit"],
    featured: true,
    isKit: true
  },
  {
    id: "kit-interior",
    name: "Interior Care Kit",
    price: 79.99,
    image: "/products/interior-kit.jpg",
    images: ["/products/interior-kit.jpg", "/products/interior-kit-2.jpg", "/products/interior-kit-3.jpg"],
    category: "Kits",
    description: "Complete interior detailing solution. Clean and protect your dashboard, seats, and all interior surfaces with professional-grade products.",
    details: [
      "1x All-Purpose Interior Cleaner (500ml)",
      "1x Leather Conditioner (250ml)",
      "1x Glass Cleaner (500ml)",
      "2x Interior Microfiber Cloths",
      "1x Detailing Brush"
    ],
    forWhom: "For anyone who wants a fresh, clean interior",
    howToUse: "Clean surfaces with APC, condition leather, finish with glass cleaner.",
    sizes: ["Standard Kit"],
    featured: true,
    isKit: true
  },
  {
    id: "kit-shine",
    name: "Ultimate Shine Kit",
    price: 129.99,
    image: "/products/shine-kit.jpg",
    images: ["/products/shine-kit.jpg", "/products/shine-kit-2.jpg", "/products/shine-kit-3.jpg"],
    category: "Kits",
    description: "Achieve that deep, glossy shine with our premium protection kit. Includes wax, sealant, and all the tools you need for a professional finish.",
    details: [
      "1x Carnauba Wax (200ml)",
      "1x Paint Sealant (250ml)",
      "1x Clay Bar Kit",
      "2x Applicator Pads",
      "2x Buffing Towels"
    ],
    forWhom: "For enthusiasts who want maximum shine and protection",
    howToUse: "Clay bar first, apply sealant, then finish with carnauba wax.",
    sizes: ["Standard Kit"],
    featured: true,
    isKit: true
  },
  // Wash Products
  {
    id: "shampoo-premium",
    name: "Premium Car Shampoo",
    price: 24.99,
    image: "/products/car-shampoo.jpg",
    images: ["/products/car-shampoo.jpg", "/products/car-shampoo-2.jpg", "/products/car-shampoo-3.jpg"],
    category: "Wash",
    description: "pH-balanced formula that safely lifts dirt without stripping wax or sealant. High foaming action for a scratch-free wash.",
    details: [
      "pH neutral formula",
      "High foam action",
      "Safe on all surfaces",
      "Pleasant citrus scent",
      "Concentrated - 1:100 dilution"
    ],
    forWhom: "Perfect for weekly maintenance washes",
    howToUse: "Dilute 10ml per liter of water. Apply with wash mitt using two-bucket method.",
    sizes: ["500ml", "1L", "5L"],
    bestSeller: true
  },
  {
    id: "wash-mitt",
    name: "Ultra-Soft Wash Mitt",
    price: 19.99,
    image: "/products/wash-mitt.jpg",
    images: ["/products/wash-mitt.jpg", "/products/wash-mitt-2.jpg", "/products/wash-mitt-3.jpg"],
    category: "Wash",
    description: "Premium microfiber wash mitt with deep pile fibers that trap dirt and prevent scratching. Elastic cuff keeps it secure on your hand.",
    details: [
      "Deep pile microfiber",
      "Elastic cuff",
      "Machine washable",
      "Holds plenty of suds",
      "Won't scratch paint"
    ],
    forWhom: "Essential for any car wash routine",
    howToUse: "Soak in soapy water, wash in straight lines, rinse frequently.",
    sizes: ["One Size"]
  },
  {
    id: "wheel-cleaner",
    name: "Iron Wheel Cleaner",
    price: 29.99,
    image: "/products/wheel-cleaner.jpg",
    images: ["/products/wheel-cleaner.jpg", "/products/wheel-cleaner-2.jpg", "/products/wheel-cleaner-3.jpg"],
    category: "Wash",
    description: "Powerful iron fallout remover that turns purple as it dissolves brake dust. Safe on all wheel types including chrome and polished aluminum.",
    details: [
      "Color-changing formula",
      "Dissolves iron particles",
      "Safe on all wheel types",
      "Acid-free formula",
      "Spray and rinse"
    ],
    forWhom: "For wheels with heavy brake dust buildup",
    howToUse: "Spray on dry wheels, wait for color change (2-5 min), agitate and rinse.",
    sizes: ["500ml", "1L"],
    bestSeller: true
  },
  // Interior Products
  {
    id: "interior-cleaner",
    name: "All-Purpose Interior Cleaner",
    price: 21.99,
    image: "/products/interior-cleaner.jpg",
    images: ["/products/interior-cleaner.jpg", "/products/interior-cleaner-2.jpg", "/products/interior-cleaner-3.jpg"],
    category: "Interior",
    description: "Versatile cleaner for all interior surfaces including plastic, vinyl, leather, and fabric. Cuts through grime without leaving residue.",
    details: [
      "Multi-surface formula",
      "No sticky residue",
      "UV protection",
      "Fresh clean scent",
      "Ready to use"
    ],
    forWhom: "Great for regular interior maintenance",
    howToUse: "Spray on surface, agitate with brush or cloth, wipe clean.",
    sizes: ["500ml", "1L"],
    bestSeller: true
  },
  {
    id: "leather-conditioner",
    name: "Premium Leather Conditioner",
    price: 34.99,
    image: "/products/leather-conditioner.jpg",
    images: ["/products/leather-conditioner.jpg", "/products/leather-conditioner-2.jpg", "/products/leather-conditioner-3.jpg"],
    category: "Interior",
    description: "Nourishes and protects leather surfaces. Prevents cracking and fading while leaving a natural, non-greasy finish.",
    details: [
      "Nourishes leather",
      "UV protection",
      "Non-greasy finish",
      "Prevents cracking",
      "Long-lasting protection"
    ],
    forWhom: "For vehicles with leather interiors",
    howToUse: "Apply to applicator pad, work into leather in circular motions, buff off excess.",
    sizes: ["250ml", "500ml"]
  },
  {
    id: "glass-cleaner",
    name: "Streak-Free Glass Cleaner",
    price: 16.99,
    image: "/products/glass-cleaner.jpg",
    images: ["/products/glass-cleaner.jpg", "/products/glass-cleaner-2.jpg", "/products/glass-cleaner-3.jpg"],
    category: "Interior",
    description: "Professional-grade glass cleaner that removes fingerprints, film, and grime without streaking. Safe on tinted windows.",
    details: [
      "Streak-free formula",
      "Safe on tint",
      "Ammonia-free",
      "Removes film buildup",
      "Crystal clear results"
    ],
    forWhom: "For anyone who wants crystal clear windows",
    howToUse: "Spray on glass, wipe with microfiber cloth in one direction.",
    sizes: ["500ml", "1L"]
  },
  // Protection Products
  {
    id: "carnauba-wax",
    name: "Pure Carnauba Wax",
    price: 49.99,
    image: "/products/carnauba-wax.jpg",
    images: ["/products/carnauba-wax.jpg", "/products/carnauba-wax-2.jpg", "/products/carnauba-wax-3.jpg"],
    category: "Protection",
    description: "High-grade Brazilian carnauba wax for that deep, wet-look shine. Easy application and removal with excellent water beading.",
    details: [
      "Grade 1 carnauba",
      "Deep gloss finish",
      "3-month protection",
      "Easy application",
      "Excellent water beading"
    ],
    forWhom: "For enthusiasts who want the ultimate shine",
    howToUse: "Apply thin layer with foam pad, let haze for 5-10 min, buff off with microfiber.",
    sizes: ["200ml"],
    bestSeller: true
  },
  {
    id: "paint-sealant",
    name: "Synthetic Paint Sealant",
    price: 44.99,
    image: "/products/paint-sealant.jpg",
    images: ["/products/paint-sealant.jpg", "/products/paint-sealant-2.jpg", "/products/paint-sealant-3.jpg"],
    category: "Protection",
    description: "Long-lasting synthetic protection that bonds to paint for up to 6 months. Creates a slick, hydrophobic surface.",
    details: [
      "6-month durability",
      "Hydrophobic finish",
      "UV protection",
      "Enhances gloss",
      "Easy to apply"
    ],
    forWhom: "For those who want long-lasting protection",
    howToUse: "Apply thin layer, wait 15-20 min, buff to high gloss.",
    sizes: ["250ml", "500ml"]
  },
  {
    id: "quick-detailer",
    name: "Quick Detailer Spray",
    price: 18.99,
    image: "/products/quick-detailer.jpg",
    images: ["/products/quick-detailer.jpg", "/products/quick-detailer-2.jpg", "/products/quick-detailer-3.jpg"],
    category: "Protection",
    description: "Fast and easy way to maintain your car's shine between washes. Removes light dust and adds gloss in seconds.",
    details: [
      "Instant shine",
      "Removes light dust",
      "Adds slickness",
      "Safe on all surfaces",
      "Pleasant scent"
    ],
    forWhom: "Perfect for quick touch-ups",
    howToUse: "Mist onto surface, wipe with microfiber cloth. Use on cool surface in shade.",
    sizes: ["500ml", "1L"]
  },
  // Accessories
  {
    id: "microfiber-pack",
    name: "Premium Microfiber Towels (5-Pack)",
    price: 29.99,
    image: "/products/microfiber-towels.jpg",
    images: ["/products/microfiber-towels.jpg", "/products/microfiber-towels-2.jpg", "/products/microfiber-towels-3.jpg"],
    category: "Accessories",
    description: "Ultra-soft, lint-free microfiber towels perfect for any detailing task. 400 GSM weight with silk-banded edges to prevent scratching.",
    details: [
      "400 GSM weight",
      "16x16 inch size",
      "Silk-banded edges",
      "Machine washable",
      "Lint-free"
    ],
    forWhom: "Essential for any detailing task",
    howToUse: "Use different towels for different tasks. Wash separately without fabric softener.",
    sizes: ["5-Pack", "10-Pack"],
    bestSeller: true
  },
  {
    id: "applicator-pads",
    name: "Foam Applicator Pads (6-Pack)",
    price: 14.99,
    image: "/products/applicator-pads.jpg",
    images: ["/products/applicator-pads.jpg", "/products/applicator-pads-2.jpg", "/products/applicator-pads-3.jpg"],
    category: "Accessories",
    description: "Soft foam applicator pads for even distribution of wax, sealant, and dressings. Ergonomic design for comfortable use.",
    details: [
      "Soft foam construction",
      "Even product distribution",
      "Washable and reusable",
      "Ergonomic grip",
      "Works with all products"
    ],
    forWhom: "For applying waxes and sealants",
    howToUse: "Apply product to pad, work into surface in overlapping motions.",
    sizes: ["6-Pack"]
  },
  {
    id: "detailing-brush-set",
    name: "Detailing Brush Set",
    price: 24.99,
    image: "/products/brush-set.jpg",
    images: ["/products/brush-set.jpg", "/products/brush-set-2.jpg", "/products/brush-set-3.jpg"],
    category: "Accessories",
    description: "Set of 5 brushes in different sizes for reaching every nook and cranny. Soft bristles won't scratch surfaces.",
    details: [
      "5 different sizes",
      "Soft bristles",
      "Wooden handles",
      "For interior and exterior",
      "Durable construction"
    ],
    forWhom: "For detailed cleaning of tight spaces",
    howToUse: "Use with cleaner to agitate dirt in vents, buttons, trim, and wheel areas.",
    sizes: ["5-Piece Set"]
  }
]

export const categories = [
  { id: "wash", name: "Wash", description: "Shampoos, mitts, and everything for a perfect wash" },
  { id: "interior", name: "Interior", description: "Cleaners and conditioners for a fresh cabin" },
  { id: "protection", name: "Protection", description: "Waxes, sealants, and coatings for lasting shine" },
  { id: "accessories", name: "Accessories", description: "Towels, pads, and tools" },
  { id: "kits", name: "Kits", description: "Complete packages for every need" }
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

export function getBestSellers(): Product[] {
  return products.filter(p => p.bestSeller)
}

export function getKits(): Product[] {
  return products.filter(p => p.isKit)
}
