// Initial mock data for Womup Quick-Commerce Vegetable Delivery Platform

export const AREAS = [
  {
    id: 'AREA_TRAGAD',
    name: 'Tragad',
    city: 'Ahmedabad',
    pincode: '382470',
    storeId: 'STORE_06',
    storeName: 'Tragad Hub Express DarkStore',
    deliveryFee: 15,
    eta: '8 mins',
    coordinates: { lat: 23.1256, lng: 72.5843 },
    serviceable: true
  },
  {
    id: 'AREA_BOPAL',
    name: 'Bopal',
    city: 'Ahmedabad',
    pincode: '380058',
    storeId: 'STORE_01',
    storeName: 'Bopal Central DarkStore',
    deliveryFee: 20,
    eta: '11 mins',
    coordinates: { lat: 23.0338, lng: 72.4634 },
    serviceable: true
  },
  {
    id: 'AREA_SATELLITE',
    name: 'Satellite',
    city: 'Ahmedabad',
    pincode: '380015',
    storeId: 'STORE_02',
    storeName: 'Satellite Hub Store',
    deliveryFee: 25,
    eta: '14 mins',
    coordinates: { lat: 23.0305, lng: 72.5178 },
    serviceable: true
  },
  {
    id: 'AREA_SGHIGHWAY',
    name: 'SG Highway / Bodakdev',
    city: 'Ahmedabad',
    pincode: '380054',
    storeId: 'STORE_03',
    storeName: 'Bodakdev Express Depot',
    deliveryFee: 20,
    eta: '12 mins',
    coordinates: { lat: 23.0489, lng: 72.5074 },
    serviceable: true
  },
  {
    id: 'AREA_VASTRAPUR',
    name: 'Vastrapur',
    city: 'Ahmedabad',
    pincode: '380052',
    storeId: 'STORE_04',
    storeName: 'Vastrapur Lake Store',
    deliveryFee: 15,
    eta: '9 mins',
    coordinates: { lat: 23.0350, lng: 72.5293 },
    serviceable: true
  },
  {
    id: 'AREA_MANINAGAR',
    name: 'Maninagar',
    city: 'Ahmedabad',
    pincode: '380008',
    storeId: 'STORE_05',
    storeName: 'East Ahmedabad DarkStore',
    deliveryFee: 30,
    eta: '18 mins',
    coordinates: { lat: 22.9978, lng: 72.6033 },
    serviceable: true
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🧺' },
  { id: 'fresh-vegetables', name: 'Daily Veggies', icon: '🥦' },
  { id: 'leafy', name: 'Leafy Greens', icon: '🥬' },
  { id: 'roots', name: 'Roots & Tubers', icon: '🥕' },
  { id: 'exotic', name: 'Exotic & Salads', icon: '🥑' },
  { id: 'fruits', name: 'Fresh Fruits', icon: '🍎' },
  { id: 'masala', name: 'Chilli & Herbs', icon: '🌶️' }
];

export const PRODUCTS = [
  {
    id: 'P101',
    name: 'Fresh Potato (Aloo)',
    slug: 'potato',
    category: 'roots',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60',
    unit: '1 kg',
    variants: ['500 g', '1 kg', '2 kg'],
    description: 'Farm-fresh local potatoes, ideal for everyday curries and roasts.',
    freshness: 'Harvested Today',
    tags: ['Daily Essential', 'Bestseller']
  },
  {
    id: 'P102',
    name: 'Hybrid Tomato (Tamatar)',
    slug: 'tomato',
    category: 'fresh-vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60',
    unit: '1 kg',
    variants: ['500 g', '1 kg', '2 kg'],
    description: 'Firm, juicy red tomatoes rich in lycopene and vitamin C.',
    freshness: 'Direct from Farm',
    tags: ['Fresh Arrival']
  },
  {
    id: 'P103',
    name: 'Nashik Red Onion (Pyaz)',
    slug: 'onion',
    category: 'roots',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60',
    unit: '1 kg',
    variants: ['1 kg', '2 kg', '5 kg'],
    description: 'Crisp and pungent premium Nashik pink/red onions.',
    freshness: 'Grade A Quality',
    tags: ['Essential']
  },
  {
    id: 'P104',
    name: 'Organic Spinach (Palak)',
    slug: 'spinach',
    category: 'leafy',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60',
    unit: '250 g',
    variants: ['250 g', '500 g'],
    description: 'Tender green iron-rich spinach leaves, washed & trimmed.',
    freshness: 'Crisp & Green',
    tags: ['Superfood']
  },
  {
    id: 'P105',
    name: 'Fresh Coriander (Dhaniya)',
    slug: 'coriander',
    category: 'leafy',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&auto=format&fit=crop&q=60',
    unit: '100 g',
    variants: ['100 g', '200 g'],
    description: 'Fragrant aromatic coriander leaves with refreshing flavor.',
    freshness: 'Farm Picked',
    tags: ['Daily Need']
  },
  {
    id: 'P106',
    name: 'Spicy Green Chilli (Hari Mirch)',
    slug: 'green-chilli',
    category: 'masala',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=60',
    unit: '200 g',
    variants: ['100 g', '200 g', '500 g'],
    description: 'Fiery Indian green chillies for genuine flavor and zest.',
    freshness: 'Fresh & Crisp',
    tags: ['Spicy']
  },
  {
    id: 'P107',
    name: 'Sweet Orange Carrot (Gajar)',
    slug: 'carrot',
    category: 'roots',
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=500&auto=format&fit=crop&q=80',
    unit: '500 g',
    variants: ['500 g', '1 kg'],
    description: 'Crunchy sweet carrots perfect for salads, juices and cooking.',
    freshness: 'Harvested Today',
    tags: ['Crunchy']
  },
  {
    id: 'P108',
    name: 'Fresh Cauliflower (Phool Gobhi)',
    slug: 'cauliflower',
    category: 'fresh-vegetables',
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=60',
    unit: '1 pc (approx 500-700g)',
    variants: ['1 pc', '2 pc'],
    description: 'Snow-white compact cauliflower heads packed with fiber.',
    freshness: 'Pest-free Farm Fresh',
    tags: ['Popular']
  },
  {
    id: 'P109',
    name: 'Green Capsicum (Shimla Mirch)',
    slug: 'capsicum',
    category: 'fresh-vegetables',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=60',
    unit: '500 g',
    variants: ['250 g', '500 g', '1 kg'],
    description: 'Crispy bell peppers with vibrant green skin and sweet flavor.',
    freshness: 'Direct from Polyhouse',
    tags: ['Salad Star']
  },
  {
    id: 'P110',
    name: 'Ginger (Adrak)',
    slug: 'ginger',
    category: 'masala',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60',
    unit: '200 g',
    variants: ['100 g', '200 g', '500 g'],
    description: 'Strong, aromatic fresh ginger rhizomes packed with warmth.',
    freshness: 'A-Grade Roots',
    tags: ['Immunity']
  },
  {
    id: 'P111',
    name: 'Royal Delicious Apple (Seb)',
    slug: 'apple',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60',
    unit: '4 pcs (approx 600g)',
    variants: ['4 pcs', '1 kg'],
    description: 'Crispy sweet mountain apples bursting with natural sweetness.',
    freshness: 'Kashmir Orchard Fresh',
    tags: ['Fruit Favorite']
  },
  {
    id: 'P112',
    name: 'Ripe Robusta Banana (Kela)',
    slug: 'banana',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60',
    unit: '6 pcs',
    variants: ['6 pcs', '12 pcs'],
    description: 'Naturally ripened, rich in potassium and energy.',
    freshness: 'Ripened Naturally',
    tags: ['Energy']
  }
];

// AREA-WISE PRICING MATRIX (Core USP)
// Maps: [productId][areaId] => { price, mrp, stock }
export const INITIAL_AREA_PRICES = {
  P101: { // Potato
    AREA_BOPAL: { price: 32, mrp: 40, stock: 45 },
    AREA_SATELLITE: { price: 35, mrp: 42, stock: 38 },
    AREA_SGHIGHWAY: { price: 34, mrp: 42, stock: 50 },
    AREA_VASTRAPUR: { price: 30, mrp: 38, stock: 25 },
    AREA_MANINAGAR: { price: 31, mrp: 39, stock: 30 }
  },
  P102: { // Tomato
    AREA_BOPAL: { price: 42, mrp: 50, stock: 35 },
    AREA_SATELLITE: { price: 45, mrp: 55, stock: 28 },
    AREA_SGHIGHWAY: { price: 44, mrp: 52, stock: 40 },
    AREA_VASTRAPUR: { price: 40, mrp: 48, stock: 50 },
    AREA_MANINAGAR: { price: 39, mrp: 46, stock: 22 }
  },
  P103: { // Onion
    AREA_BOPAL: { price: 36, mrp: 45, stock: 60 },
    AREA_SATELLITE: { price: 39, mrp: 48, stock: 45 },
    AREA_SGHIGHWAY: { price: 38, mrp: 46, stock: 55 },
    AREA_VASTRAPUR: { price: 35, mrp: 44, stock: 40 },
    AREA_MANINAGAR: { price: 34, mrp: 42, stock: 35 }
  },
  P104: { // Spinach
    AREA_BOPAL: { price: 24, mrp: 30, stock: 20 },
    AREA_SATELLITE: { price: 28, mrp: 35, stock: 15 },
    AREA_SGHIGHWAY: { price: 26, mrp: 32, stock: 18 },
    AREA_VASTRAPUR: { price: 22, mrp: 28, stock: 25 },
    AREA_MANINAGAR: { price: 25, mrp: 30, stock: 12 }
  },
  P105: { // Coriander
    AREA_BOPAL: { price: 15, mrp: 20, stock: 30 },
    AREA_SATELLITE: { price: 18, mrp: 25, stock: 20 },
    AREA_SGHIGHWAY: { price: 16, mrp: 22, stock: 25 },
    AREA_VASTRAPUR: { price: 14, mrp: 18, stock: 35 },
    AREA_MANINAGAR: { price: 15, mrp: 20, stock: 18 }
  },
  P106: { // Green Chilli
    AREA_BOPAL: { price: 22, mrp: 30, stock: 25 },
    AREA_SATELLITE: { price: 26, mrp: 35, stock: 22 },
    AREA_SGHIGHWAY: { price: 24, mrp: 32, stock: 30 },
    AREA_VASTRAPUR: { price: 20, mrp: 28, stock: 28 },
    AREA_MANINAGAR: { price: 22, mrp: 30, stock: 15 }
  },
  P107: { // Carrot
    AREA_BOPAL: { price: 48, mrp: 60, stock: 32 },
    AREA_SATELLITE: { price: 54, mrp: 65, stock: 24 },
    AREA_SGHIGHWAY: { price: 50, mrp: 62, stock: 28 },
    AREA_VASTRAPUR: { price: 46, mrp: 58, stock: 35 },
    AREA_MANINAGAR: { price: 45, mrp: 56, stock: 20 }
  },
  P108: { // Cauliflower
    AREA_BOPAL: { price: 38, mrp: 50, stock: 18 },
    AREA_SATELLITE: { price: 44, mrp: 55, stock: 14 },
    AREA_SGHIGHWAY: { price: 42, mrp: 52, stock: 20 },
    AREA_VASTRAPUR: { price: 36, mrp: 48, stock: 22 },
    AREA_MANINAGAR: { price: 38, mrp: 50, stock: 15 }
  },
  P109: { // Capsicum
    AREA_BOPAL: { price: 52, mrp: 65, stock: 25 },
    AREA_SATELLITE: { price: 58, mrp: 72, stock: 18 },
    AREA_SGHIGHWAY: { price: 55, mrp: 70, stock: 22 },
    AREA_VASTRAPUR: { price: 48, mrp: 60, stock: 30 },
    AREA_MANINAGAR: { price: 50, mrp: 64, stock: 16 }
  },
  P110: { // Ginger
    AREA_BOPAL: { price: 38, mrp: 48, stock: 30 },
    AREA_SATELLITE: { price: 42, mrp: 52, stock: 20 },
    AREA_SGHIGHWAY: { price: 40, mrp: 50, stock: 25 },
    AREA_VASTRAPUR: { price: 35, mrp: 45, stock: 28 },
    AREA_MANINAGAR: { price: 36, mrp: 46, stock: 18 }
  },
  P111: { // Apple
    AREA_BOPAL: { price: 130, mrp: 160, stock: 25 },
    AREA_SATELLITE: { price: 145, mrp: 175, stock: 20 },
    AREA_SGHIGHWAY: { price: 140, mrp: 170, stock: 22 },
    AREA_VASTRAPUR: { price: 125, mrp: 155, stock: 30 },
    AREA_MANINAGAR: { price: 128, mrp: 158, stock: 18 }
  },
  P112: { // Banana
    AREA_BOPAL: { price: 42, mrp: 55, stock: 40 },
    AREA_SATELLITE: { price: 48, mrp: 60, stock: 35 },
    AREA_SGHIGHWAY: { price: 45, mrp: 58, stock: 38 },
    AREA_VASTRAPUR: { price: 40, mrp: 52, stock: 45 },
    AREA_MANINAGAR: { price: 40, mrp: 50, stock: 28 }
  }
};

export const COUPONS = [
  {
    code: 'FIRST50',
    type: 'FLAT',
    discount: 50,
    minOrder: 199,
    description: '₹50 flat off on first order above ₹199'
  },
  {
    code: 'VEG20',
    type: 'PERCENTAGE',
    percentage: 20,
    maxDiscount: 60,
    minOrder: 149,
    description: '20% off on fresh veggies up to ₹60'
  },
  {
    code: 'FRESH10',
    type: 'PERCENTAGE',
    percentage: 10,
    maxDiscount: 40,
    minOrder: 99,
    description: '10% instant discount on fresh greens'
  }
];

export const INITIAL_CAMPAIGNS = [
  {
    id: 'CMP_101',
    name: 'Weekend Fresh Green Bonanza',
    subject: '🌿 Flat 20% off on Fresh Palak, Dhaniya & Methi this weekend!',
    content: 'Stock up your kitchen with fresh morning harvests. 10-minute delivery to your doorstep in Ahmedabad.',
    recipientType: 'ALL_USERS',
    scheduledAt: '2026-09-06T09:00',
    status: 'SCHEDULED',
    createdAt: '2026-09-04T10:00:00',
    sentCount: 0,
    targetCount: 1850
  },
  {
    id: 'CMP_100',
    name: 'Welcome to Womup Quick Veggies',
    subject: 'Welcome to Womup! ₹50 off on your first fresh vegetable order',
    content: 'Thank you for choosing Womup! Use code FIRST50 for farm-fresh vegetables delivered in 10 minutes.',
    recipientType: 'NEW_USERS',
    scheduledAt: '2026-09-01T10:00',
    status: 'COMPLETED',
    createdAt: '2026-08-31T15:30:00',
    sentCount: 420,
    targetCount: 420
  }
];

/**
 * Parse weight or quantity string into comparable unit values
 * Supports: '1 kg', '500 g', '200 g', '250 g', '100 g', '2 kg', '5 kg',
 *           '1 pc', '2 pc', '6 pcs', '12 pcs', '4 pcs (approx 600g)'
 */
export const parseUnitWeight = (unitStr) => {
  if (!unitStr) return { type: 'weight', value: 1000 };
  const str = String(unitStr).toLowerCase().trim();

  // If approx grams provided in parenthesis, e.g. "4 pcs (approx 600g)"
  const approxGramsMatch = str.match(/approx\s*([\d.]+)\s*g/i);
  const approxGrams = approxGramsMatch ? parseFloat(approxGramsMatch[1]) : null;

  // KG check: e.g. "1 kg", "2.5 kg", "2kg", "5 kg"
  const kgMatch = str.match(/^([\d.]+)\s*kg/i);
  if (kgMatch) {
    return { type: 'weight', value: parseFloat(kgMatch[1]) * 1000 };
  }

  // Gram check: e.g. "500 g", "250 gm", "200 grams", "100g"
  const gMatch = str.match(/^([\d.]+)\s*g/i);
  if (gMatch) {
    return { type: 'weight', value: parseFloat(gMatch[1]) };
  }

  // Pieces check: e.g. "1 pc", "2 pc", "6 pcs", "12 pcs", "4 pcs"
  const pcMatch = str.match(/^([\d.]+)\s*pc/i);
  if (pcMatch) {
    return { 
      type: 'piece', 
      value: parseFloat(pcMatch[1]),
      approxGrams
    };
  }

  return { type: 'weight', value: 1000 };
};

/**
 * Calculates multiplier for selected variant relative to base product unit
 */
export const getVariantMultiplier = (baseUnit, variant) => {
  if (!baseUnit || !variant || baseUnit === variant) return 1;

  const base = parseUnitWeight(baseUnit);
  const target = parseUnitWeight(variant);

  // Both are weight (e.g. 500 g vs 1 kg)
  if (base.type === 'weight' && target.type === 'weight') {
    return base.value > 0 ? target.value / base.value : 1;
  }

  // Both are pieces (e.g. 6 pcs vs 12 pcs)
  if (base.type === 'piece' && target.type === 'piece') {
    return base.value > 0 ? target.value / base.value : 1;
  }

  // Target is weight, base has approxGrams (e.g. Apple: '4 pcs (approx 600g)' vs '1 kg')
  if (base.approxGrams && target.type === 'weight') {
    return target.value / base.approxGrams;
  }

  // Base is weight, target has approxGrams
  if (target.approxGrams && base.type === 'weight') {
    return target.approxGrams / base.value;
  }

  return 1;
};

/**
 * Returns scaled price, mrp and discount for a specific variant
 */
export const getVariantPricing = (basePrice, baseMrp, baseUnit, variant) => {
  const multiplier = getVariantMultiplier(baseUnit, variant);
  const price = Math.max(1, Math.round((basePrice || 30) * multiplier));
  const mrp = Math.max(price, Math.round((baseMrp || 40) * multiplier));
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  
  return { price, mrp, discount, multiplier };
};

