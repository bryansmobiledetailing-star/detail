export type VehicleSize = 'car' | 'suv' | 'truck' | 'largeSuv' | 'rv' | 'tractor';

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: Record<string, number>;
  pricingType: 'fixed' | 'custom' | 'variable';
  squareName: string;
  seo: {
    title: string;
    description: string;
  };
  features: string[];
  duration: string | Record<string, string>;
  badge?: string | null;
  highlight?: boolean;
  image?: string;
  isSpecialty?: boolean;
  bestFor?: string;
}

export const CATEGORIES = [
  { 
    id: 'interior-detailing', 
    slug: 'interior-detailing',
    name: 'Interior Detailing', 
    description: 'If your interior is starting to look worn, dusty, or stained, this is where I bring it back. My interior detailing focus is on cleaning, restoring, and refreshing every surface.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7228392ef23?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'exterior-detailing', 
    slug: 'exterior-detailing',
    name: 'Exterior Detailing', 
    description: 'Remove road grime and contamination that dulls your finish. My exterior detailing service restores gloss while adding protection to keep it looking better longer.',
    image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'full-detailing', 
    slug: 'full-detailing',
    name: 'Full Detailing Packages', 
    description: 'The best place to start. Combined interior and exterior work into one complete service to get your vehicle back to showroom condition.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'paint-correction', 
    slug: 'paint-correction',
    name: 'Paint Correction', 
    description: 'Fix swirl marks, scratches, and restore clarity to your clear coat. Precision machine polishing for real improvement, not temporary shine.',
    image: 'https://images.unsplash.com/photo-1507136566006-bb91e5088c97?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'protection', 
    slug: 'ceramic-coating',
    name: 'Ceramic Coating', 
    description: 'The ultimate protection. Creates a durable layer over your paint that resists dirt, water, and environmental damage while keeping a high-gloss finish.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'maintenance', 
    slug: 'maintenance-plans',
    name: 'Maintenance Detailing', 
    description: 'Stay ahead of the mess. Consistent upkeep detailing designed for vehicles that have already had a full reset.',
    image: 'https://images.unsplash.com/photo-1620055375841-7667ff4a193b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'rv-boat-detailing',
    slug: 'rv-boat-detailing',
    name: 'RV, Boat & Equipment Detailing',
    description: 'Specialized detailing for larger vehicles. From oxidation removal to full cleanups, we handle the big stuff that needs more than a basic wash.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'tractor-detailing',
    slug: 'tractor-farm-equipment',
    name: 'Tractor & Farm Equipment',
    description: 'Professional cleaning and restoration for tractors and farm machinery. We remove heavy building and grease to keep your equipment looking better and lasting longer.',
    image: 'https://images.unsplash.com/photo-1594913785162-e678ac052429?auto=format&fit=crop&q=80&w=1200'
  }
];

export const VEHICLE_SIZES = [
  { id: 'car', name: 'Sedan / Coupe', icon: '🚗' },
  { id: 'suv', name: 'Small SUV / Crossover', icon: '🚙' },
  { id: 'truck', name: 'Truck / Large SUV', icon: '🛻' },
  { id: 'largeSuv', name: 'XL Vehicle / Van', icon: '🚐' },
];

export const SPECIALTY_SIZES = [
  { id: 'rv', name: 'RV / Boat / Trailer', icon: '🏠' },
  { id: 'tractor', name: 'Tractor / Equipment', icon: '🚜' },
];

export const ADD_ONS = [
  { id: 'pet-hair', name: 'Pet Hair Removal', price: 40, duration: '45-60 mins', description: 'Deep removal of pet hair from carpets, seats, and crevices.' },
  { id: 'seat-shampoo', name: 'Shampoo & Extraction', price: 60, duration: '60 mins', description: 'Hot water extraction and stain lifting for all cloth upholstery.' },
  { id: 'smoke-odor', name: 'Odor Neutralizer (Ozone)', price: 100, duration: '3.5 hours', description: 'Ozone treatment to eliminate smoke, mold, and biological odors.' },
  { id: 'engine-bay', name: 'Engine Bay Detail', price: 50, duration: '45 mins', description: 'Safe degreasing, steam cleaning, and dressing of the engine compartment.' },
  { id: 'headlight', name: 'Headlight Restoration', price: 80, duration: '60 mins', description: 'Multi-stage sanding and polishing to restore clarity and UV protection.' },
];

export const SERVICES: Service[] = [
  // --- INTERIOR ---
  {
    id: 'interior-detail',
    categoryId: 'interior-detailing',
    name: 'Interior Detail',
    shortDescription: 'Full interior cleaning for normal use vehicles. Removes buildup, light stains, and restores a clean, fresh feel.',
    longDescription: 'Restore your interior to a clean, comfortable condition. From light cleanup to full resets, I handle everything from everyday buildup to heavy staining and pet hair.',
    price: { car: 179, suv: 199, truck: 219, largeSuv: 249 },
    pricingType: 'fixed',
    squareName: 'Interior Detail',
    seo: {
      title: 'Interior Car Detailing Bellevue NE | Omaha Interior Cleaning',
      description: 'Professional interior detailing in Bellevue, NE. Deep cleaning and refreshing for your vehicle interior. Serving Omaha, Papillion, and La Vista.'
    },
    features: ['Deep Vacuum & Crevice Clean', 'Steam Sanitization of Hard Surfaces', 'Upholstery Scrub & Light Spot Treat', 'Leather Cleaning & Conditioning', 'Anti-Static Dust Protection'],
    duration: '3-4 hours',
    bestFor: 'Daily drivers needing a thorough refresh.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7228392ef23?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'interior-reset',
    categoryId: 'interior-detailing',
    name: 'Interior Reset',
    shortDescription: 'Deep interior restoration for heavy dirt, stains, and pet hair. Designed for neglected or heavily used vehicles.',
    longDescription: 'When the interior needs more than a standard detail, the Interior Reset is the solution. I focus on heavy stain removal, deep carpet extraction, and intensive cleaning of all surfaces to bring a dirty interior back to life.',
    price: { car: 249, suv: 279, truck: 309, largeSuv: 349 },
    pricingType: 'fixed',
    squareName: 'Interior Reset',
    seo: {
      title: 'Deep Interior Car Cleaning Bellevue NE | Heavy Stain & Pet Hair Removal',
      description: 'Intensive interior restoration in Bellevue. We handle heavy stains, pet hair, and neglected interiors across the Omaha area.'
    },
    features: ['Hot Water Upholstery Extraction', 'Heavy Stain Removal Treatment', 'Deep Pet Hair Extraction', 'Intensive Steam Cleaning', 'Odor Neutralization'],
    duration: '5-7 hours',
    bestFor: 'Neglected vehicles, pets, or high-mileage interiors.',
    badge: 'Deep Restoration'
  },

  // --- EXTERIOR ---
  {
    id: 'exterior-enhancement',
    categoryId: 'exterior-detailing',
    name: 'Exterior Enhancement',
    shortDescription: 'Decontaminates paint, restores gloss, and adds protection. Best option beyond a basic wash.',
    longDescription: 'More than a wash. This removes contamination, restores gloss, and adds protection so your paint looks better and stays cleaner longer.',
    price: { car: 120, suv: 140, truck: 160, largeSuv: 180 },
    pricingType: 'fixed',
    squareName: 'Exterior Enhancement',
    seo: {
      title: 'Exterior Detailing Bellevue NE | Gloss Restoration Omaha Area',
      description: 'Exterior enhancement detail in Bellevue. Remove contaminants, restore gloss, and protect your paint. Serving the greater Omaha area.'
    },
    features: ['Technical pH-neutral Hand Wash', 'Iron Decontamination', 'Clay Bar Treatment', '6-Month Ceramic Sealant', 'Wheel Barrel & Tire Detail'],
    duration: '2-3 hours',
    bestFor: 'Vehicles needing a smooth finish and protection.',
    badge: 'Best-Seller',
    highlight: true,
    image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'paint-enhancement-polish',
    categoryId: 'exterior-detailing',
    name: 'Paint Enhancement Polish',
    shortDescription: 'Removes light swirls and improves gloss so your paint looks noticeably better.',
    longDescription: 'This service includes a machine polish enhancement to remove very light swirl marks and significantly boost the depth and clarity of your paint. It’s the perfect middle ground between a wash and full correction.',
    price: { car: 249, suv: 289, truck: 329, largeSuv: 369 },
    pricingType: 'fixed',
    squareName: 'Paint Enhancement Polish',
    seo: {
      title: 'Paint Enhancement Bellevue NE | Machine Polishing Omaha Area',
      description: 'Machine polish enhancement in Bellevue. Remove light swirls and boost paint gloss for a showroom look across Omaha.'
    },
    features: ['All Exterior Enhancement Features', 'Machine Polish Enhancement', 'Light Swirl Removal', 'Enhanced Gloss & Clarity', 'Sealant Upgrade'],
    duration: '4-6 hours',
    bestFor: 'Improving paint appearance without full correction.'
  },

  // --- PAINT CORRECTION ---
  {
    id: 'paint-correction-l1',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 1)',
    shortDescription: 'Light improvement. Removes minor haze and light swirl marks.',
    longDescription: 'Focused on real improvement, this single-stage correction removes light defects and restores clarity to the clear coat. Ideal for newer vehicles or those with minor wear.',
    price: { car: 350, suv: 400, truck: 450, largeSuv: 500 },
    pricingType: 'custom',
    squareName: 'Paint Correction (Level 1)',
    seo: {
      title: 'Single-Stage Paint Correction Bellevue NE | Omaha Paint Polishing',
      description: 'Professional Level 1 paint correction in Bellevue and Omaha. Restore paint clarity and remove minor imperfections.'
    },
    features: ['Single-Stage Machine Correction', 'Surface Decontamination', 'Gloss Restoration', 'Wipeout Inspection', 'Paint Depth Assessment'],
    duration: '6-8 hours',
    bestFor: 'Newer vehicles or well-maintained paint.'
  },
  {
    id: 'paint-correction-l2',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 2)',
    shortDescription: 'Moderate correction. Removes the majority of swirl marks and light scratches.',
    longDescription: 'A two-stage correction process that first uses a compound to pull out defects, followed by a finishing polish to refine the surface. This addresses moderate swirl marks and deeper imperfections.',
    price: { car: 550, suv: 650, truck: 750, largeSuv: 850 },
    pricingType: 'custom',
    squareName: 'Paint Correction (Level 2)',
    seo: {
      title: 'Two-Stage Paint Correction Bellevue NE | Swirl Removal Omaha',
      description: 'Stage 2 paint correction in Bellevue. Removes the majority of swirls and scratches to restore depth.'
    },
    features: ['Two-Stage Compounding & Polishing', 'Intensive Defect Removal', 'High-Clarity Finishing', 'Prep for Ceramic Coating', 'Detailed Surface Inspection'],
    duration: '1-2 Days',
    bestFor: 'Older vehicles or paint with visible swirl marks.',
    highlight: true
  },

  // --- CERAMIC COATING ---
  {
    id: 'ceramic-3yr',
    categoryId: 'protection',
    name: '3-Year Ceramic Coating',
    shortDescription: '3-year protection. Makes maintenance easier and keeps paint glossy.',
    longDescription: 'I apply professional ceramic coatings in Bellevue for customers across Omaha who want real protection. This 3-year system provides a durable hydrophobic layer that resists environmental damage.',
    price: { car: 700, suv: 800, truck: 900, largeSuv: 1000 },
    pricingType: 'custom',
    squareName: '3-Year Ceramic Coating',
    seo: {
      title: '3-Year Ceramic Coating Bellevue NE | Omaha Paint Protection',
      description: 'Durable 3-year ceramic coating in Bellevue, NE. Hydrophobic protection that makes cleaning easier. Serving the Omaha metro.'
    },
    features: ['3-Year Professional Grade Coating', 'Deep Hydrophobic Properties', 'UV Protection Barrier', 'Ease of Maintenance', 'Technical Prep Wash Included'],
    duration: '1-2 Days',
    bestFor: 'Long-term shoppers on a budget.'
  },
  {
    id: 'ceramic-5yr',
    categoryId: 'protection',
    name: 'Protection Package',
    shortDescription: 'Superior durability and high gloss protection. Keeps paint looking new for years.',
    longDescription: 'Long-term protection that keeps your vehicle cleaner, shinier, and easier to maintain over time.',
    price: { car: 1100, suv: 1250, truck: 1400, largeSuv: 1550 },
    pricingType: 'custom',
    squareName: 'Protection Package',
    seo: {
      title: '5-Year Ceramic Coating Bellevue NE | Best Car Protection Omaha',
      description: 'My most popular 5-year ceramic coating in Bellevue. Professional-grade protection and extreme gloss for Omaha vehicles.'
    },
    features: ['5-Year Professional Coating', 'Maximum Gloss & Depth', 'Strongest Chemical Resistance', 'Superior Water Beading', 'Lifetime Warranty Eligibility (Optional)'],
    duration: '2 Days',
    bestFor: 'Ultimate long-term protection for any vehicle.',
    badge: 'Best Value',
    highlight: true
  },

  // --- FULL DETAIL ---
  {
    id: 'full-detail-package',
    categoryId: 'full-detailing',
    name: 'Full Detail Package',
    shortDescription: 'Interior Detail + Exterior Enhancement. Best overall value and most popular choice.',
    longDescription: 'Complete interior and exterior services bundled together for the best overall results and value.',
    price: { car: 299, suv: 339, truck: 379, largeSuv: 419 },
    pricingType: 'fixed',
    squareName: 'Full Detail Package',
    seo: {
      title: 'Full Car Detailing Bellevue NE | Complete Auto Refresh Omaha',
      description: 'Comprehensive full detailing in Bellevue and Omaha. Interior and exterior restoration in one complete service.'
    },
    features: ['Standard Interior Detail', 'Exterior Enhancement Detail', 'Engine Bay Clean & Dressing', 'Exhaust Tip Polishing', 'Door Jam Restoration'],
    duration: '5-7 hours',
    bestFor: 'Vehicles that haven’t been detailed in 6+ months.',
    badge: 'Popular Choice'
  },
  {
    id: 'showroom-package',
    categoryId: 'full-detailing',
    name: 'Showroom Package',
    shortDescription: 'Interior Reset + Paint Enhancement. Big transformation inside and out.',
    longDescription: 'The Showroom Package is for those who want a noticeable transformation. This includes the Interior Reset for heavy cleaning and a Paint Enhancement Polish to restore visual depth and gloss to the exterior.',
    price: { car: 449, suv: 499, truck: 549, largeSuv: 599 },
    pricingType: 'fixed',
    squareName: 'Showroom Package',
    seo: {
      title: 'Showroom Detailing Package Bellevue NE | Deep Restoration Omaha',
      description: 'Ultimate showroom restoration detail in Bellevue. Intensive interior reset and paint enhancement for Omaha drivers.'
    },
    features: ['Interior Reset (Heavy Cleaning)', 'Paint Enhancement Machine Polish', 'Engine Bay Detail', 'Fabric/Leather Protection', '1-Year Paint Protection'],
    duration: '1 Day',
    bestFor: 'Pre-sale prep or deep restoration.',
    highlight: true
  },

  // --- MAINTENANCE ---
  {
    id: 'maintenance-detail',
    categoryId: 'maintenance',
    name: 'Maintenance Plan',
    shortDescription: 'Light interior and exterior upkeep to keep your vehicle clean between full details.',
    longDescription: 'Keep your vehicle looking freshly detailed year-round without needing a full reset every time.',
    price: { car: 99, suv: 119, truck: 139, largeSuv: 159 },
    pricingType: 'fixed',
    squareName: 'Maintenance Plan',
    seo: {
      title: 'Car Detailing Maintenance Bellevue NE | Routine Upkeep Omaha',
      description: 'Maintain your vehicle condition with regular detailing in Bellevue. Best for vehicles that have already had a full reset.'
    },
    features: ['Gentle Interior Refresh & Wipe', 'Safe Hand Wash & Dry', 'Tire & Wheel Face Clean', 'Glass Cleaning & Vacuum', 'Protection Top-Off'],
    duration: '1.5-2.5 hours',
    bestFor: 'Keeping a clean vehicle clean.'
  },

  // --- RV & BOAT ---
  {
    id: 'rv-boat-wash-wax',
    categoryId: 'rv-boat-detailing',
    name: 'RV / Boat Wash & Wax',
    shortDescription: 'Thorough cleaning with protection for larger vehicles and boats.',
    longDescription: 'Thorough exterior cleaning followed by protection to improve shine and help prevent environmental buildup. Pricing: $8–$12 per foot depending on size and condition. Serving Bellevue and the entire Omaha metro area.',
    price: { rv: 8 }, 
    pricingType: 'variable',
    squareName: 'RV / Boat Wash & Wax',
    seo: {
      title: 'RV & Boat Wash & Wax Bellevue NE | Exterior Protection Omaha',
      description: 'Professional RV and Boat wash and wax in Bellevue, NE. Serving the Omaha area with specialized care for large vehicles.'
    },
    features: ['Technical Exterior Wash', 'Surface Contaminant Removal', 'UV-Resistant Wax Application', 'Roof & Trim Cleaning', 'Wheel & Chrome Polish'],
    duration: '4-8 hours',
    isSpecialty: true
  },
  {
    id: 'rv-boat-oxidation',
    categoryId: 'rv-boat-detailing',
    name: 'Oxidation Removal (RV/Boat)',
    shortDescription: 'Removes chalky, faded oxidation and restores surface appearance.',
    longDescription: 'When gel coat or paint becomes chalky and faded, a simple wash isn’t enough. This intensive restoration process removes oxidation to restore original color and gloss. Pricing: $12–$20 per foot depending on severity.',
    price: { rv: 12 },
    pricingType: 'variable',
    squareName: 'Oxidation Removal (RV/Boat)',
    seo: {
      title: 'RV & Boat Oxidation Removal Bellevue NE | Gel Coat Restoration Omaha',
      description: 'Restore faded gel coat and paint on your RV or boat. Specialized oxidation removal in Bellevue serving the Omaha metro.'
    },
    features: ['Multi-Stage Oxidation Removal', 'Gel Coat Restoration', 'High-Gloss Finishing Polish', 'Mirror-Shine Sealant', 'Technical Surface Leveling'],
    duration: '1-2 Days',
    isSpecialty: true,
    badge: 'Pro Restoration'
  },

  // --- TRACTOR / FARM ---
  {
    id: 'tractor-detailing-service',
    categoryId: 'tractor-detailing',
    name: 'Tractor / Farm Equipment Detailing',
    shortDescription: 'Removes heavy dirt and grease to keep equipment looking better and lasting longer.',
    longDescription: 'Farm equipment and work vehicles take constant abuse from dirt, grease, and weather. Cleaning and restoration services for tractors and machinery in Bellevue. Pricing depends on size and condition. Reach out with photos for a quote.',
    price: { tractor: 150 }, 
    pricingType: 'custom',
    squareName: 'Tractor / Farm Equipment Detailing',
    seo: {
      title: 'Tractor & Farm Equipment Detailing Bellevue NE | Omaha Area',
      description: 'Professional farm machinery and tractor detailing in Bellevue. We remove heavy grease and dirt to protect your investment.'
    },
    features: ['Heavy Degreasing & Steam Clean', 'Technical Exterior Wash', 'Component Surface Cleaning', 'Protection Sealant', 'Glass & Cab Restoration'],
    duration: '4-10 hours',
    isSpecialty: true
  }
];


