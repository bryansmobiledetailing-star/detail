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

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  seo?: {
    title: string;
    description: string;
  };
}

export const CATEGORIES: Category[] = [
  { 
    id: 'interior-detailing', 
    slug: 'interior-detailing',
    name: 'Interior Detailing', 
    description: 'Breathe new life into your cabin with our premium interior car detailing in Bellevue and Omaha. We eliminate dust, deep set stains, and odors to deliver a hygienic, factory-fresh driving experience you can instantly feel.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7228392ef23?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'Interior Auto Detailing Bellevue NE | Car Interior Cleaners Omaha',
      description: 'Top-rated interior car detailing in Bellevue and Omaha. We specialize in deep cleaning, hot water extraction, and odor removal to restore your vehicle\'s inside.'
    }
  },
  { 
    id: 'exterior-detailing', 
    slug: 'exterior-detailing',
    name: 'Exterior Detailing', 
    description: 'Erase road grime and environmental contamination that dulls your clear coat. Our exterior car detailing service safely restores a brilliant gloss while laying down durable paint protection to defend your vehicle.',
    image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'Exterior Auto Detailing Bellevue NE | Car Wash & Wax Omaha',
      description: 'Professional exterior car detailing and hand washes in Bellevue and Omaha. We safely remove grime, perform clay bar treatments, and apply durable wax protection.'
    }
  },
  { 
    id: 'full-detailing', 
    slug: 'full-detailing',
    name: 'Full Detailing Packages', 
    description: 'The ultimate automotive transformation. We combine our elite interior and exterior auto detailing services into one complete package, engineered to get your car, truck, or SUV back to pristine showroom condition.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'Full Car Detailing Packages Bellevue NE | Complete Auto Detail Omaha',
      description: 'Comprehensive full auto detailing packages in Bellevue and Omaha. From interior shampooing to exterior paint enhancement, we transform your vehicle inside and out.'
    }
  },
  { 
    id: 'paint-correction', 
    slug: 'paint-correction',
    name: 'Paint Correction', 
    description: 'Permanently remove swirl marks, scratches, and oxidation. Our multi-stage machine polishing and paint correction restores true mirror-like clarity and depth to your clear coat—not just a temporary shine.',
    image: 'https://images.unsplash.com/photo-1507136566006-bb91e5088c97?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'Auto Paint Correction Bellevue NE | Machine Polishing & Swirl Removal Omaha',
      description: 'Expert paint correction in Bellevue and Omaha. We permanently erase swirl marks, scratches, and oxidation through multi-stage machine polishing for a flawless gloss.'
    }
  },
  { 
    id: 'protection', 
    slug: 'ceramic-coating',
    name: 'Ceramic Coating', 
    description: 'Lock in perfection. Our professional-grade ceramic coating creates a resilient, hydrophobic shield over your paint, repelling water, dirt, and UV damage to maintain a high-gloss finish for years.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'Ceramic Coating Bellevue NE | Long-Lasting Auto Paint Protection Omaha',
      description: 'Protect your vehicle with premium ceramic coating in Bellevue and Omaha. Enjoy years of extreme hydrophobic water beading, deep gloss, and scratch resistance.'
    }
  },
  { 
    id: 'maintenance', 
    slug: 'maintenance-plans',
    name: 'Maintenance Detailing', 
    description: 'Preserve your vehicle\'s value and showroom shine year-round. Our exclusive maintenance auto detailing plans are engineered for Bellevue and Omaha drivers who demand flawless upkeep.',
    image: 'https://images.unsplash.com/photo-1620055375841-7667ff4a193b?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'Car Maintenance Detailing Plans Bellevue NE | Auto Upkeep Omaha',
      description: 'Join our exclusive car maintenance detailing plans in Bellevue and Omaha. Preventative washing and interior upkeep designed to protect your detailing investment.'
    }
  },
  {
    id: 'rv-boat-detailing',
    slug: 'rv-boat-detailing',
    name: 'RV, Boat & Equipment Detailing',
    description: 'Protect your biggest investments from the harsh Midwest elements. From intense oxidation removal to full gel-coat cleanups, our specialized detailing ensures your RV or boat is always adventure-ready.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'RV & Boat Detailing Bellevue NE | Marine Gel-Coat Cleaning Omaha',
      description: 'Specialized RV and Boat detailing in Bellevue and Omaha. We perform intense gel-coat oxidation removal, marine washing, and UV wax sealing.'
    }
  },
  {
    id: 'tractor-detailing',
    slug: 'tractor-farm-equipment',
    name: 'Tractor & Farm Equipment',
    description: 'Maximize the lifespan and performance of your farm machinery. We execute heavy-duty cleaning and degreasing to safeguard your tractors and equipment from destructive buildup.',
    image: 'https://images.unsplash.com/photo-1594913785162-e678ac052429?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'Tractor & Farm Equipment Detailing Bellevue NE | Heavy Ag Cleaning Omaha',
      description: 'Industrial-grade tractor and farm equipment detailing in Bellevue and Omaha. Extend the lifespan of your agricultural machinery with powerful degreasing.'
    }
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
    name: 'Signature Interior Detail',
    shortDescription: 'Professional interior cleaning that eliminates buildup and light stains for a fresh, comfortable cabin.',
    longDescription: 'Reclaim the comfort of your daily commute in Bellevue and Omaha. Our Signature Interior Detail is a professional deep-cleaning service that goes far beyond a quick vacuum. By thoroughly cleaning and sanitizing plastics, extracting light stains, and air-purging tight crevices, we eliminate everyday buildup and restore a crisp, clean, factory-fresh feel to your vehicle’s interior.',
    price: { car: 179, suv: 199, truck: 219, largeSuv: 249 },
    pricingType: 'fixed',
    squareName: 'Signature Interior Detail',
    seo: {
      title: 'Interior Car Detailing Bellevue NE | Auto Detailing Omaha',
      description: 'Experience premium interior car detailing in Bellevue and Omaha. We eliminate dust, grime, and stains to restore a flawless, hygienic driving environment.'
    },
    features: [
      'Full dual-stage vacuum (Interior & Trunk)',
      'Cracks & crevices air-purged of dust/crumbs',
      'Plastics & vinyl deep cleaned & sanitized',
      'Cupholders & cubbies detailed',
      'Door panels & pockets scrubbed',
      'Streak-free interior glass clarity',
      'High-traffic stain spot treatment',
      'Rubber/Carpet mats deep cleaned',
      'Premium UV barrier (Prevents cracking)',
      'Door jambs degreased & shined'
    ],
    duration: '2-3.5 hours',
    bestFor: 'Daily drivers needing a professional reset and long-term surface protection.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7228392ef23?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'interior-reset',
    categoryId: 'interior-detailing',
    name: 'Deep Interior Restoration',
    shortDescription: 'Intensive deep cleaning & hot water extraction for heavy dirt, severe stains, and stubborn pet hair.',
    longDescription: 'Turn back the clock on severely neglected interiors. Designed for family haulers and heavily used vehicles in the Omaha metro, the Deep Interior Restoration utilizes advanced hot water extraction and therapeutic steam sanitization to pull out deep-seated stains, eliminate ground-in dirt, and completely remove stubborn pet hair. We permanently transform your cabin, recovering its value and pristine condition.',
    price: { car: 249, suv: 279, truck: 309, largeSuv: 349 },
    pricingType: 'fixed',
    squareName: 'Deep Interior Restoration',
    seo: {
      title: 'Deep Interior Car Cleaning Bellevue NE | Stain & Pet Hair Removal',
      description: 'Total interior auto restoration in Bellevue. We specialize in hot water extraction, heavy stain removal, and pet hair eradication across the Omaha area.'
    },
    features: [
      'Everything in Interior Detail',
      'Hot water extraction (Removes deep stains)',
      'Therapeutic steam sanitization',
      'Intensive fabric & upholstery shampoo',
      'Complete pet hair removal & de-linting',
      'Seat track & sliding rail deep clean',
      'Headliner safely spot-cleaned',
      'Deep odor neutralization treatment'
    ],
    duration: '4-6 hours',
    bestFor: 'Neglected interiors, heavy pet hair, or used-cars needing a "Factory Fresh" feel.',
    badge: 'Deep Restoration'
  },

  // --- EXTERIOR ---
  {
    id: 'exterior-enhancement',
    categoryId: 'exterior-detailing',
    name: 'Premium Wash & Wax',
    shortDescription: 'Advanced decontamination wash & premium paint sealant for high-gloss protection.',
    longDescription: 'Elevate your vehicle\'s curb appeal far beyond a standard car wash. Nebraska roads bombard your clear coat with iron fallout to brake dust. Our Premium Wash & Wax uses a technical chemical decontamination and clay bar treatment to pull embedded grit out of your paint, leaving it smooth-as-glass. We lock in the gloss with a hydrophobic silica sealant that protects against harsh weather for up to 6 months.',
    price: { car: 149, suv: 169, truck: 189, largeSuv: 209 },
    pricingType: 'fixed',
    squareName: 'Premium Wash & Wax',
    seo: {
      title: 'Exterior Auto Detailing Bellevue NE | Paint Decontamination Omaha',
      description: 'Professional exterior car detailing in Bellevue. We utilize iron decontamination, clay bar treatments, and durable paint sealants for a high-gloss finish.'
    },
    features: [
      'Deep foam hand wash (Two-bucket safety)',
      'Wheels, barrels & wheel arches detailed',
      'High-gloss tire dressing (No-sling formula)',
      'Clay bar "Smooth-to-touch" treatment',
      'Iron & Fallout chemical decontamination',
      'Hydrophobic gloss sealant (6-month protection)',
      'Exterior glass hydrophobic treatment',
      'Trim restoration & UV protection'
    ],
    duration: '2-3 hours',
    bestFor: 'Ending the "rough paint" feel and adding a mirror-like protective shield.',
    badge: 'Best-Seller',
    highlight: true,
    image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'paint-enhancement-polish',
    categoryId: 'exterior-detailing',
    name: 'Paint Enhancement Polish',
    shortDescription: 'Machine polishing gloss enhancement that powerfully reduces light swirls and oxidation.',
    longDescription: 'Instantly upgrade the visual impact of your paint. Using orbital machine polishers and premium finishing compounds, our single-stage Paint Enhancement Polish targets dull, oxidized clear coats. By clearing away micro-marring and a layer of light swirls, we restore 50-70% of the paint\'s original clarity, injecting massive depth and reflective shine into vehicles across Bellevue and Omaha.',
    price: { car: 299, suv: 349, truck: 399, largeSuv: 449 },
    pricingType: 'fixed',
    squareName: 'Paint Enhancement Polish',
    seo: {
      title: 'Machine Paint Polishing Bellevue NE | Car Gloss Enhancement Omaha',
      description: 'Boost your car\'s shine with machine paint polishing in Bellevue. Our rapid enhancement effectively reduces light swirl marks and dramatically improves clear coat clarity.'
    },
    features: [
      'Everything in Exterior Enhancement',
      'Single-stage machine polish (Rupes system)',
      'Significant gloss enhancement',
      'Light swirl & haze reduction',
      'Paint sealant protection (STS3000)',
      'Deep visual depth restoration'
    ],
    duration: '4-5 hours',
    bestFor: 'Maximum gloss and light defect removal without full correction.',
  },

  // --- PAINT CORRECTION ---
  {
    id: 'paint-correction-l1',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 1)',
    shortDescription: 'Dedicated single-stage machine correction to permanently erase minor defects and haze.',
    longDescription: 'Attain true clarity with professional Paint Correction. This intensive single-stage abrasive polishing process safely levels the top layer of your clear coat, permanently eradicating unsightly car wash scratches, minor swirl marks, and environmental haze. The result is a flawless, mirror-like finish that prepares your paint perfectly for a protective sealant or entry-level ceramic coating.',
    price: { car: 350, suv: 400, truck: 450, largeSuv: 500 },
    pricingType: 'custom',
    squareName: 'Paint Correction (Level 1)',
    seo: {
      title: 'Level 1 Paint Correction Bellevue NE | Swirl Removal Omaha',
      description: 'Erase swirl marks and scratches with professional Level 1 Paint Correction in Bellevue and Omaha. Achieve a brilliant, clear-coat mirror finish.'
    },
    features: ['Single-Stage Machine Correction', 'Surface Decontamination', 'Gloss Restoration', 'Wipeout Inspection', 'Paint Depth Assessment'],
    duration: '6-8 hours',
    bestFor: 'Newer vehicles or well-maintained paint.'
  },
  {
    id: 'paint-correction-l2',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 2)',
    shortDescription: 'Advanced two-stage compounding and polishing to remove heavy swirls and scratches.',
    longDescription: 'The ultimate restoration for heavily swirled or scratched paint. Our Level 2 Paint Correction utilizes a heavy cutting compound to aggressively remove deep defects, followed by an ultra-fine finishing polish to refine the surface and extract maximum gloss. This intensive process rescues older paint systems, making your vehicle look better than the day it rolled off the showroom floor.',
    price: { car: 550, suv: 650, truck: 750, largeSuv: 850 },
    pricingType: 'custom',
    squareName: 'Paint Correction (Level 2)',
    seo: {
      title: 'Two-Stage Paint Correction Bellevue NE | Deep Scratch Removal Omaha',
      description: 'Rescue your clear coat with our multi-stage Paint Correction in Bellevue and Omaha. Eliminate severe swirl marks and scratches for a breathtaking gloss.'
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
    shortDescription: 'Professional 3-year ceramic shield that repels dirt, water, and UV damage.',
    longDescription: 'Stop waxing your car every season. Our professional-grade 3-Year Ceramic Coating bonds chemically with your clear coat to form an ultra-durable, impenetrable layer of protection. Enjoy self-cleaning hydrophobic properties that sheet water instantly, resist harsh road salts, and make routine maintenance washes 80% easier—all while locking in a permanent, wet-look gloss.',
    price: { car: 700, suv: 800, truck: 900, largeSuv: 1000 },
    pricingType: 'custom',
    squareName: '3-Year Ceramic Coating',
    seo: {
      title: '3-Year Ceramic Coating Bellevue NE | Auto Paint Protection Omaha',
      description: 'Protect your vehicle with a durable 3-year ceramic coating in Bellevue and Omaha. Unmatched hydrophobic water beading, UV resistance, and an incredible wet-look shine.'
    },
    features: ['3-Year Professional Grade Coating', 'Deep Hydrophobic Properties', 'UV Protection Barrier', 'Ease of Maintenance', 'Technical Prep Wash Included'],
    duration: '1-2 Days',
    bestFor: 'Long-term shoppers on a budget.'
  },
  {
    id: 'protection-package',
    categoryId: 'protection',
    name: 'Protection Package',
    shortDescription: 'The ultimate exterior bundle: Expert paint correction sealed perfectly under a ceramic coating.',
    longDescription: 'The absolute pinnacle of automotive surface care. We meticulously prepare your vehicle by completely decontaminating the exterior and performing a precision Paint Correction to guarantee the paint is completely flawless. Immediately after, we seal that perfection under a premium Ceramic Coating. This package guarantees years of extreme durability, stunning visual depth, and effortless maintenance.',
    price: { car: 999, suv: 1199, truck: 1399, largeSuv: 1599 },
    pricingType: 'custom',
    squareName: 'Protection Package',
    seo: {
      title: 'Ceramic Coating & Paint Correction Package Bellevue NE | Omaha',
      description: 'The ultimate auto detailing package for Bellevue and Omaha. Combine precision paint correction with a professional ceramic coating to guarantee flawless, long-term protection.'
    },
    features: [
      'Full technical prep wash',
      'Complete clay & decontamination',
      'Precision paint correction',
      'Professional ceramic coating application',
      'Windshield & wheel face coating included'
    ],
    duration: '2 Days',
    bestFor: 'New vehicles or those wanting the absolute best protection.',
    badge: 'Best Value',
    highlight: true
  },

  // --- FULL DETAIL ---
  {
    id: 'express-detail',
    categoryId: 'full-detailing',
    name: 'Express Mini Detail',
    shortDescription: 'Our entry-level maintenance package for a quick exterior wash and basic interior tidy-up.',
    longDescription: 'Perfect for well-maintained vehicles needing a quick refresh. The Express Mini Detail provides a thorough foam hand wash, wheel cleaning, and tire shine for the exterior. Inside, we perform a basic vacuum, wipe down all hard surfaces, and clean interior glass. Great for monthly maintenance or a quick spruce-up before the weekend. *Note: Does not include deep stain removal, pet hair extraction, or wax.*',
    price: { car: 119, suv: 139, truck: 159, largeSuv: 179 },
    pricingType: 'fixed',
    squareName: 'Express Mini Detail',
    seo: {
      title: 'Express Mini Detail Bellevue NE | Maintenance Car Wash Omaha',
      description: 'Keep your car looking sharp with our Express Mini Detail in Bellevue and Omaha. Includes a hand wash, interior vacuum, and wipe down for well-maintained vehicles.'
    },
    features: [
      'Foam Hand Wash & Hand Dry',
      'Faces of Wheels Cleaned & Tires Shined',
      'Basic Interior & Trunk Vacuum',
      'Wipe Down of Dash, Console & Door Panels',
      'Interior & Exterior Glass Cleaned',
      'Perfect for Monthly Upkeep'
    ],
    duration: '1.5-2 hours',
    bestFor: 'Vehicles that are already well-maintained or detailed regularly.',
  },
  {
    id: 'full-detail-package',
    categoryId: 'full-detailing',
    name: 'Signature Full Detail',
    shortDescription: 'Comprehensive top-to-bottom transformation combining our Elite Interior & Exterior services.',
    longDescription: 'Why settle for half the job? The Signature Full Detail is our highly-rated, comprehensive reset engineered to protect both the inside and outside of your vehicle. By bundling our thorough Signature Interior Detail with the decontamination and gloss enhancement of our Premium Wash & Wax, you achieve a totally rejuvenated, show-ready vehicle while securing exceptional package savings.',
    price: { car: 279, suv: 319, truck: 359, largeSuv: 399 },
    pricingType: 'fixed',
    squareName: 'Signature Full Detail',
    seo: {
      title: 'Full Car Detailing Package Bellevue NE | Complete Auto Refresh Omaha',
      description: 'Transform your vehicle inside and out with our Signature Full Detail in Bellevue and Omaha. Combining elite interior cleaning with exterior decontamination.'
    },
    features: [
      'Signature Interior Detail',
      'Premium Exterior Wash & Wax',
      'Wheel & Tire Deep Clean',
      'Bundle Savings Applied ✅',
      'Complete 360-Degree Transformation'
    ],
    duration: '4-6 hours',
    bestFor: 'The essential bi-annual refresh for vehicles that deserve to look their best.',
    badge: 'Best Value'
  },
  {
    id: 'showroom-package',
    categoryId: 'full-detailing',
    name: 'Showroom Package',
    shortDescription: 'Our most aggressive restoration package, combining heavy interior extraction and exterior machine polishing.',
    longDescription: 'Maximize your vehicle’s resale value and drastically wind back the clock. The Showroom Package is a heavy-duty overhaul combining our deep-extraction Interior Reset and our gloss-enhancing Paint Enhancement Polish. We brutally assault interior stains and aggressively buff out clear coat haze, restoring the lost aesthetic glory of neglected daily drivers or pre-sale vehicles.',
    price: { car: 499, suv: 549, truck: 599, largeSuv: 649 },
    pricingType: 'fixed',
    squareName: 'Showroom Package',
    seo: {
      title: 'Showroom Restoration Auto Detailing Bellevue NE | Resale Detail Omaha',
      description: 'Boost your car\'s resale value with our Showroom Detailing Package. Deep stain extraction and machine paint polishing to resurrect heavily used vehicles across Bellevue and Omaha.'
    },
    features: [
      'Intensive Interior Reset (Shampoo/Steam)',
      'Machine Paint Enhancement Polish',
      'Restores 50-70% Paint Clarity',
      'Full Engine Bay Restoration',
      'Deep Odor & Fabric Protection',
      'Maximum Resale Value Prep'
    ],
    duration: '6-8 hours',
    bestFor: 'Pre-sale prep, used car purchases, or restoring the family "adventure" vehicle.',
    highlight: true
  },

  // --- MAINTENANCE ---
  {
    id: 'maintenance-detail',
    categoryId: 'maintenance',
    name: 'Maintenance Plan',
    shortDescription: 'Exclusive monthly routine upkeep reserved for previously detailed and coated vehicles.',
    longDescription: 'Protect your detailing investment with our recurring Maintenance Plan. Tailored exclusively for vehicles that have recently received one of our complete detailing or ceramic coating packages, this service utilizes safe wash methods and rapid interior wipe-downs to ensure your vehicle remains in impeccable condition year-round without inducing new paint defects.',
    price: { car: 119, suv: 139, truck: 159, largeSuv: 179 },
    pricingType: 'fixed',
    squareName: 'Maintenance Plan',
    seo: {
      title: 'Car Maintenance Detailing Plan Bellevue NE | Auto Cleaning Omaha',
      description: 'Preserve your ceramic coating or fresh detail. Join our exclusive car maintenance detailing plan in Bellevue and Omaha for routine, high-quality vehicle upkeep.'
    },
    features: [
      'Routine maintenance vacuum',
      'Quick interior wipe down',
      'Glass cleaned inside & out',
      'Safe, scratch-free hand wash',
      'Spray protection sealant refresh',
      'Tire dressing application'
    ],
    duration: '1.5-2 hours',
    bestFor: 'Existing clients wanting to maintain their investment.',
  },

  // --- RV & BOAT ---
  {
    id: 'rv-boat-wash-wax',
    categoryId: 'rv-boat-detailing',
    name: 'RV / Boat Wash & Wax',
    shortDescription: 'Meticulous exterior wash and robust UV sealant protection for large recreational vehicles.',
    longDescription: 'Safeguard your massive mobile investments against harsh aquatic and highway environments. We deliver a meticulously detailed hand wash to strip away aggressive bug splatter and road grime, finishing with an advanced UV-protective wax or sealant to defend the vast surface area of your RV, camper, or boat.',
    price: { rv: 10 }, 
    pricingType: 'variable',
    squareName: 'RV / Boat Wash & Wax',
    seo: {
      title: 'RV & Boat Wash & Wax Detailing Bellevue NE | Omaha RV Cleaning',
      description: 'Protect your camper or boat with our specialized RV and Boat detailing services in Bellevue and Omaha. Complete wash, bug removal, and long-lasting UV wax protection.'
    },
    features: [
      'Technical hand wash',
      'Roof wash (where accessible)',
      'Wheels & arches cleaned',
      'Bug & insect removal',
      'Sealant or wax UV protection'
    ],
    duration: '4-6 hours',
    isSpecialty: true
  },
  {
    id: 'rv-boat-oxidation',
    categoryId: 'rv-boat-detailing',
    name: 'Oxidation Removal (RV/Boat)',
    shortDescription: 'Aggressive machine compounding to restore color and gloss to chalky, oxidized gel-coats.',
    longDescription: 'When the sun drastically fades your RV or vessel, a simple wash won’t cut it. Our Oxidation Removal tackles severe chalkiness and gel-coat degradation. Using heavy rotary or dual-action machine polishing, we cut through the damaging oxidation, restoring vibrant, mirror-like gloss and sealing it tight to drastically improve the life of the surface.',
    price: { rv: 20 },
    pricingType: 'variable',
    squareName: 'Oxidation Removal (RV/Boat)',
    seo: {
      title: 'RV & Boat Oxidation Removal Bellevue NE | Gel-Coat Polishing Omaha',
      description: 'Restore the shine to your faded RV, camper, or boat. We specialize in aggressive machine oxidation removal and gel-coat polishing across the Omaha metro.'
    },
    features: [
      'Heavy compound process',
      'Machine surface restoration',
      'Gloss recovery polishing',
      'Mirror-shine sealant application',
      'Improvement-focused restoration'
    ],
    duration: '1-2 Days',
    isSpecialty: true,
    badge: 'Restoration'
  },

  // --- TRACTOR / FARM ---
  {
    id: 'tractor-detailing-service',
    categoryId: 'tractor-detailing',
    name: 'Tractor / Equipment Cleanup',
    shortDescription: 'Industrial-strength degreasing and cleaning to protect your agricultural investments.',
    longDescription: 'Nebraska agriculture demands reliable, well-maintained machinery. Our Equipment Cleanup service utilizes industrial-strength degreasing, high-pressure hot water, and meticulous interior cab detailing to blast away corrosive buildup, mud, and grease. Clean machinery operates cooler, lasts longer, and provides a drastically superior operator experience.',
    price: { tractor: 200 }, 
    pricingType: 'custom',
    squareName: 'Tractor / Farm Equipment Detailing',
    seo: {
      title: 'Tractor & Farm Equipment Detailing Bellevue NE | Agricultural Cleaning',
      description: 'Industrial-grade agricultural equipment cleaning in Bellevue. We provide heavy-duty tractor degreasing, pressure washing, and cab detailing.'
    },
    features: [
      'Heavy-duty degreasing',
      'Pressure wash of all surfaces',
      'Cab interior wipe down',
      'Mud & heavy dirt removal',
      'Glass clarity restore'
    ],
    duration: '3-6 hours',
    isSpecialty: true
  }
];


