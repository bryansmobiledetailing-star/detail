export type VehicleSize = 'car' | 'suv' | 'truck' | 'largeSuv';

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: Record<string, number>;
  features: string[];
  duration: string | Record<string, string>;
  badge?: string | null;
  highlight?: boolean;
  image?: string;
  isSpecialty?: boolean;
  bestFor?: string;
  considerAlternative?: {
    text: string;
    targetServiceId: string;
  };
}

export const CATEGORIES = [
  { 
    id: 'full-detailing', 
    slug: 'full-detailing',
    name: 'Full Detailing', 
    description: 'Complete interior and exterior packages to restore your vehicle to showroom condition.',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'interior-only', 
    slug: 'interior-only',
    name: 'Interior Services', 
    description: 'Deep cleaning, sanitization, and restoration of your vehicle\'s cabin.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7228392ef23?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'exterior-only', 
    slug: 'exterior-only',
    name: 'Exterior Services', 
    description: 'Professional hand washing and premium paint protection for a lasting shine.',
    image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'paint-correction', 
    slug: 'paint-correction',
    name: 'Paint Correction', 
    description: 'Removing micro-scratches and swirls to restore depth and clarity to your paint.',
    image: 'https://images.unsplash.com/photo-1507136566006-bb91e5088c97?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'ceramic-coating', 
    slug: 'ceramic-coating',
    name: 'Ceramic Coating', 
    description: 'The ultimate long-term protection, durability, and extreme gloss.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'specialty-services', 
    slug: 'rv-motorhome',
    name: 'Specialty Services', 
    description: 'RVs, boats, and large scale cleaning for specialty vehicles.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'maintenance', 
    slug: 'maintenance',
    name: 'Maintenance', 
    description: 'Quick upkeep washes for established clients. Hand-wash only; not for tunnel washes.',
    image: 'https://images.unsplash.com/photo-1605164599901-f89ff17963d0?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'add-ons',
    slug: 'add-ons',
    name: 'Add-ons',
    description: 'Supplemental services to enhance your detailing package.',
    image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1200'
  }
];

export const VEHICLE_SIZES = [
  { id: 'car', name: 'Sedan / Coupe', icon: '🚗' },
  { id: 'suv', name: 'Small SUV / Crossover', icon: '🚙' },
  { id: 'truck', name: 'Truck / Large SUV', icon: '🛻' },
  { id: 'largeSuv', name: 'XL Vehicle / Van', icon: '🚐' },
];

export const SPECIALTY_SIZES = [
  { id: 'rv', name: 'RV / Motorhome / Boat', icon: '🏠' },
];

export const ADD_ONS = [
  { id: 'pet-hair', name: 'Pet Hair Extraction', price: 40, duration: '45-60 mins', description: 'Deep removal of pet hair from carpets, seats, and crevices.' },
  { id: 'seat-shampoo', name: 'Shampoo & Extraction', price: 60, duration: '60 mins', description: 'Hot water extraction and stain lifting for all cloth upholstery.' },
  { id: 'smoke-odor', name: 'Odor Neutralizer (Ozone)', price: 100, duration: '3.5 hours', description: 'Ozone treatment to eliminate smoke, mold, and biological odors.' },
  { id: 'leather-condition', name: 'Leather Deep Condition', price: 50, duration: '30 mins', description: 'pH-balanced cleaning and conditioning to restore leather suppleness.' },
  { id: 'engine-bay', name: 'Engine Bay Detail', price: 50, duration: '45 mins', description: 'Safe degreasing, steam cleaning, and dressing of the engine compartment.' },
  { id: 'headlight', name: 'Headlight Restoration', price: 80, duration: '60 mins', description: 'Multi-stage sanding and polishing to restore clarity and UV protection.' },
  { id: 'clay-bar-addon', name: 'Clay Bar Treatment', price: 40, duration: '45 mins', description: 'Mechanical decontamination for a smooth-as-glass paint finish.' },
  { id: 'trim-restore', name: 'Plastic Trim Restore', price: 50, duration: '45 mins', description: 'UV-resistant restoration for faded exterior plastic trim.' },
];

export const SERVICES: Service[] = [
  // FULL DETAILING
  {
    id: 'essential-full',
    categoryId: 'full-detailing',
    name: 'Full Detail (Level 1: Essential)',
    description: 'A thorough seasonal refresh. Includes a premium exterior hand wash and 6-month protection paired with a Level 1 interior cleaning and touchpoint sanitization.',
    price: { car: 249, suv: 299, truck: 329, largeSuv: 349 },
    features: ['Premium Hand Wash & Dry', '6-Month Protective Paint Sealant', 'Level 1 Interior Refresh', 'Door Jamb Detail', 'Tire & Trim Protection'],
    duration: { car: '4-4.5 hours', suv: '4.5-5 hours', truck: '5-5.5 hours', largeSuv: '5.5-6 hours' },
    badge: 'Standard',
    bestFor: 'Daily drivers needing a thorough reset and protection for the next 6 months.',
    considerAlternative: {
      text: 'If you have heavy pet hair or deep stains, go for the Level 2 or Level 3 packages.',
      targetServiceId: 'advanced-full'
    }
  },
  {
    id: 'advanced-full',
    categoryId: 'full-detailing',
    name: 'Full Detail (Level 2: Advanced Reset)',
    description: 'A comprehensive restoration for vehicles needing more than a refresh. Includes iron decontamination, machine polish enhancement, and deep interior cleaning.',
    price: { car: 349, suv: 399, truck: 429, largeSuv: 449 },
    features: ['Premium Hand Wash', 'Iron Decontamination', '6-Month Machine Liquid Wax', 'Level 1 Interior Detail', 'Light Carpet Shampoo'],
    duration: { car: '5-5.5 hours', suv: '5.5-6 hours', truck: '6-6.5 hours', largeSuv: '6.5-7 hours' },
    badge: 'Recommended',
    bestFor: 'Vehicles with light environmental fallout and interior surfaces needing more than a light dust.',
    considerAlternative: {
      text: 'For heavy stains and 12-month ceramic protection, step up to Level 3.',
      targetServiceId: 'showroom-full'
    }
  },
  {
    id: 'showroom-full',
    categoryId: 'full-detailing',
    name: 'Full Detail (Level 3: Showroom Restore)',
    description: 'Our flagship "Total Reset". Includes a technical exterior hand wash, engine bay detail, clay bar decontamination, and 12-month ceramic protection, paired with a deep-restore interior sanitization.',
    price: { car: 449, suv: 499, truck: 549, largeSuv: 599 },
    features: ['Technical Exterior Hand Wash', 'Engine Bay Detail & Dressing', 'Clay Bar Decontamination', '12-Month Ceramic Paint Guard', 'Level 2 Interior Deep-Restore'],
    duration: { car: '6-7 hours', suv: '7-8 hours', truck: '8-9 hours', largeSuv: '9-10 hours' },
    badge: 'Pro Choice',
    highlight: true,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1200',
    bestFor: 'Vehicles that have been neglected for 6+ months or are being prepared for sale.',
    considerAlternative: {
      text: 'If your car is already in good condition, consider the Level 1 Essential.',
      targetServiceId: 'essential-full'
    }
  },

  // NEW CAR
  {
    id: 'new-car-prep',
    categoryId: 'full-detailing',
    name: 'New Car Protection Package',
    description: 'Specifically for vehicles under 3,000 miles. Technical wash, mechanical decontamination, and precision protection for all surfaces.',
    price: { car: 350, suv: 400, truck: 450, largeSuv: 500 },
    features: ['Technical Hand Wash', 'Exo-Decontamination', 'Ceramic Paint Sealant', 'Interior UV Shield'],
    duration: { car: '4-5 hours', suv: '5-6 hours', truck: '6-7 hours', largeSuv: '7-8 hours' },
    badge: 'New Vehicles',
    bestFor: 'Freshly delivered vehicles that need a foundational layer of protection.',
  },

  // INTERIOR
  {
    id: 'essential-interior',
    categoryId: 'interior-only',
    name: 'Interior Detail (Level 1: Refresh)',
    description: 'Thorough cleaning for well-maintained vehicles. Focuses on dust removal, glass clarity, and sanitizing touchpoints for a healthy driving environment.',
    price: { car: 179, suv: 199, truck: 209, largeSuv: 229 },
    features: ['Full Interior Vacuum', 'Surface Sanitization', 'Glass Polishing', 'Crevice Blowout', 'Deodorizing Treatment'],
    duration: { car: '2-2.5 hours', suv: '2.5-3 hours', truck: '3-3.5 hours', largeSuv: '3.5-4 hours' },
    badge: 'Most Popular',
    bestFor: 'Vehicles that are cleaned regularly but need a professional, deep finish.',
    considerAlternative: {
      text: 'If you have any stains or leather needing care, the Level 2 Deep Restore is better.',
      targetServiceId: 'signature-interior'
    }
  },
  {
    id: 'signature-interior',
    categoryId: 'interior-only',
    name: 'Interior Detail (Level 2: Deep Restore)',
    description: 'Complete cabin restoration. Includes high-temp steam sanitization, professional hot water carpet extraction, and premium conditioning for all leather and vinyl.',
    price: { car: 299, suv: 339, truck: 359, largeSuv: 389 },
    features: ['Deep Carpet & Mat Extraction', 'High-Temp Steam Sanitization', 'Leather/Vinyl Conditioning', 'Stain Lifting & Removal', 'UV Protection Coating'],
    duration: { car: '4-5 hours', suv: '5-6 hours', truck: '6-7 hours', largeSuv: '7-8 hours' },
    badge: 'Top Choice',
    highlight: true,
    bestFor: 'Restoring interiors with moderate stains, odors, or leather needing nutrition.',
    considerAlternative: {
      text: 'For heavily neglected interiors or bio-hazards, use the Level 3 Restoration.',
      targetServiceId: 'interior-restoration'
    }
  },
  {
    id: 'interior-restoration',
    categoryId: 'interior-only',
    name: 'Interior Detail (Level 3: Deep Restoration)',
    description: 'For heavily neglected interiors with mold, smoke, or severe pet hair. Industrial-grade techniques used to restore cabins that standard detailing cannot.',
    price: { car: 350, suv: 400, truck: 450, largeSuv: 500 },
    features: ['Mold/Bio Remediation', 'Smoke Odor Removal', 'Industrial Extraction', 'Severe Stain Treatment', 'Ozone Sterilization'],
    duration: { car: '8-10 hours', suv: '10-12 hours', truck: '12-14 hours', largeSuv: '14-16 hours' },
    badge: 'Heavy Duty',
    highlight: false,
    bestFor: 'Vehicles with severe biological issues, heavy smoke odor, or extreme neglect.',
  },

  // EXTERIOR
  {
    id: 'exterior-protection',
    categoryId: 'exterior-only',
    name: 'Exterior Detail (Level 1: Protect & Guard)',
    description: 'Professional decontamination and protection. Removes road grime and fallout, finishing with a machine-applied 12-month ceramic sealant.',
    price: { car: 140, suv: 160, truck: 170, largeSuv: 190 },
    features: ['Iron Decontamination', 'Clay Bar Treatment', '12-Month Ceramic Sealant', 'Wheel Barrel Clean', 'Trim UV Guard'],
    duration: { car: '3-3.5 hours', suv: '3.5-4 hours', truck: '4-4.5 hours', largeSuv: '4.5-5 hours' },
    bestFor: 'Paint that feels rough to the touch or hasn\'t been protected in 6+ months.',
  },
  {
    id: 'maintenance-wash',
    categoryId: 'maintenance',
    name: 'Maintenance Wash (Bi-Weekly)',
    description: 'Exclusive to established clients. A gentle hand-wash and interior refresh to maintain the longevity of your existing coatings and sealants.',
    price: { car: 60, suv: 70, truck: 75, largeSuv: 80 },
    features: ['pH Neutral Hand Wash', 'Interior Vacuum', 'Tire Dressing', 'Sealant Topper'],
    duration: { car: '1-1.3 hours', suv: '1.3-1.5 hours', truck: '1.5-1.8 hours', largeSuv: '1.8-2 hours' },
    bestFor: 'Clients who have received a Full or Ceramic detail in the last 30 days.',
  },

  // PAINT CORRECTION
  {
    id: 'paint-enhancement',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 1: Gloss Enhancement)',
    description: 'A single-stage machine polish to maximize reflection and remove light haze. Best for newer cars seeking a high-gloss finish.',
    price: { car: 200, suv: 250, truck: 275, largeSuv: 300 },
    features: ['Single-stage Machine Polish', 'Haze Removal', 'Gloss Maximization'],
    duration: { car: '4-5 hours', suv: '5-6 hours', truck: '6-7 hours', largeSuv: '7-8 hours' },
    bestFor: 'Maximizing shine on newer paint or before applying a high-end sealant.',
  },
  {
    id: 'paint-correction-l1',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 2: Stage 1)',
    description: 'Removes 60-80% of swirls and light scratches. Drastically improves color depth, clarity, and mirror-reflexion.',
    price: { car: 300, suv: 350, truck: 375, largeSuv: 400 },
    features: ['60-80% Swirl Removal', 'Leveling Compound', 'Mirror Finish'],
    duration: { car: '6-7 hours', suv: '7-8 hours', truck: '8-9 hours', largeSuv: '9-10 hours' },
    bestFor: 'Paint with visible swirl marks from tunnel washes or improper toweling.',
    considerAlternative: {
      text: 'For deep scratches or total restoration, go for Level 3.',
      targetServiceId: 'paint-correction-l2'
    }
  },
  {
    id: 'paint-correction-l2',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 3: Stage 2)',
    description: 'Multi-stage compounding and refining polish. Designed for vehicles with heavy swirling or scratches needing a total paint overhaul.',
    price: { car: 500, suv: 550, truck: 600, largeSuv: 650 },
    features: ['Heavy Defect Removal', 'compounding & Refining', 'Precision Buffing'],
    duration: { car: '12-14 hours', suv: '14-16 hours', truck: '16-18 hours', largeSuv: '18-20 hours' },
    bestFor: 'Older vehicles or paint with heavy oxidization and deep scratching.',
  },

  // CERAMIC
  {
    id: 'ceramic-3yr',
    categoryId: 'ceramic-coating',
    name: '3-Year Ceramic Coating',
    description: 'Professional-grade durable protection. Extreme hydrophobicity and UV resistance. Makes maintenance washing effortless.',
    price: { car: 800, suv: 900, truck: 950, largeSuv: 1000 },
    features: ['3-Year Rated Coating', 'Extreme Water Beading', 'Prep Polish Included'],
    duration: { car: '1 Day', suv: '1 Day', truck: '1.5 Days', largeSuv: '1.5 Days' },
    badge: '3 Year',
    bestFor: 'Long-term protection for most daily drivers with regular maintenance.',
  },
  {
    id: 'ceramic-5yr',
    categoryId: 'ceramic-coating',
    name: '5-Year Ceramic Coating',
    description: 'Increased durability and gloss. Enhanced resistance to environmental fallout and chemical etching for half a decade.',
    price: { car: 1200, suv: 1300, truck: 1400, largeSuv: 1500 },
    features: ['5-Year Rated Coating', 'High Scratch Resistance', 'Chemical Guard'],
    duration: { car: '1 Day', suv: '1.5 Days', truck: '1.5 Days', largeSuv: '2 Days' },
    badge: '5 Year',
    bestFor: 'Vehicles that spend significant time outdoors or in harsh conditions.',
  },
  {
    id: 'ceramic-7yr',
    categoryId: 'ceramic-coating',
    name: '7-Year Ceramic Coating',
    description: 'The ultimate paint protection armor. Maximum hardness, longevity, and self-cleaning properties. Multi-layer application.',
    price: { car: 1500, suv: 1650, truck: 1800, largeSuv: 2000 },
    features: ['7+ Year Rated Coating', 'Multi-Layer Application', 'Self-Cleaning Mirror Gloss'],
    duration: { car: '2 Days', suv: '2.5 Days', truck: '2.5 Days', largeSuv: '3 Days' },
    badge: 'Lifetime',
    bestFor: 'High-end vehicles and owners seeking the absolute best protection available.',
  },

  // SPECIALTY
  {
    id: 'rv-detail',
    categoryId: 'specialty-services',
    name: 'RV & Camper Exterior Restore',
    description: 'Oxidation removal and gloss restoration for fiberglass and gelcoat surfaces. Includes roof cleaning and sealant.',
    price: { rv: 450 },
    features: ['Oxidation Removal', 'Roof Cleaning', 'Gelcoat Protection'],
    duration: { rv: '6-10 hours' },
    isSpecialty: true,
    bestFor: 'Fiberglass RVs that have lost their shine or are showing chalky white oxidation.',
  },
  {
    id: 'boat-detail',
    categoryId: 'specialty-services',
    name: 'Marine Detail (Hull & Interior)',
    description: 'Full boat detailing. Gelcoat protection against salt and UV, deep cleaning of marine vinyl and cabin areas.',
    price: { rv: 500 },
    features: ['Marine Gelcoat Sealant', 'Vinyl Restoration', 'Cabin Sanitization'],
    duration: { rv: '6-12 hours' },
    isSpecialty: true,
    bestFor: 'Boats needing a seasonal refresh and protection against harsh marine environments.',
  },
];

