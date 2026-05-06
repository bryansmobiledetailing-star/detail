export interface CityPage {
  slug: string;
  name: string;
  type: 'primary' | 'secondary';
  seo: {
    title: string;
    description: string;
  };
  content: {
    title: string;
    intro: string;
    servicesLabel: string;
    whyLabel: string;
    whyPoints: string[];
    serviceAreas: string[];
    cta: string;
  };
}

export const CITIES: CityPage[] = [
  {
    slug: 'omaha-ne',
    name: 'Omaha, NE',
    type: 'primary',
    seo: {
      title: 'Car Detailing Omaha NE | Interior, Exterior & Ceramic Coating',
      description: 'Professional car detailing services in Omaha, NE. High-quality interior cleaning, exterior protection, and ceramic coating for Nebraska drivers.'
    },
    content: {
      title: 'Car Detailing in Omaha, NE',
      intro: 'I provide professional car detailing services for drivers in Omaha and surrounding areas. Every service is designed to restore, protect, and maintain your vehicle at a higher standard than a basic wash.',
      servicesLabel: 'Services Available in Omaha:',
      whyLabel: 'Why Omaha drivers choose this service:',
      whyPoints: [
        'Focused on quality results, not volume',
        'Premium-level detailing process',
        'Flexible scheduling across Bellevue and Omaha area',
        'Full restoration options available'
      ],
      serviceAreas: ['Omaha', 'Bellevue', 'Papillion', 'La Vista', 'Council Bluffs'],
      cta: 'Book your detail today and get a cleaner, better-looking vehicle without the hassle.'
    }
  },
  {
    slug: 'bellevue-ne',
    name: 'Bellevue, NE',
    type: 'primary',
    seo: {
      title: 'Mobile Car Detailing Bellevue NE | Professional Vehicle Care',
      description: 'The highest-rated mobile detailing in Bellevue, NE. Based in Bellevue, providing fast availability and premium finishes for all vehicle types.'
    },
    content: {
      title: 'Mobile Car Detailing in Bellevue, NE',
      intro: 'Based right here in Bellevue, I offer the most convenient and thorough mobile detailing experience in the region. We come to your home or office with everything needed to transform your vehicle.',
      servicesLabel: 'Services Available in Bellevue:',
      whyLabel: 'Why Bellevue residents trust us:',
      whyPoints: [
        'Local Bellevue-based operation',
        'Fast availability for local residents',
        'Serving Offutt AFB and surrounding communities',
        'Highest attention to detail'
      ],
      serviceAreas: ['Bellevue', 'Offutt AFB', 'Omaha', 'Papillion'],
      cta: 'Schedule your Bellevue mobile detail now.'
    }
  },
  {
    slug: 'papillion-ne',
    name: 'Papillion, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Papillion NE | Mobile Detailing Services',
      description: 'Professional mobile car detailing services in Papillion, NE. Interior cleaning, paint protection, and more.'
    },
    content: {
      title: 'Car Detailing in Papillion, NE',
      intro: 'Providing Papillion drivers with elite mobile detailing solutions that fit your schedule.',
      servicesLabel: 'Our Papillion Services:',
      whyLabel: 'Quality You Can Trust',
      whyPoints: ['Mobile service at your location', 'Professional-grade products', 'Reliable scheduling'],
      serviceAreas: ['Papillion', 'La Vista', 'Bellevue'],
      cta: 'Book your Papillion detail today.'
    }
  },
  {
    slug: 'la-vista-ne',
    name: 'La Vista, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing La Vista NE | Interior & Exterior Cleaning',
      description: 'Mobile car detailing in La Vista, NE. Professional interior and exterior services at your doorstep.'
    },
    content: {
      title: 'Car Detailing in La Vista, NE',
      intro: 'Experience the convenience of high-end mobile detailing in La Vista.',
      servicesLabel: 'La Vista Detailing Services:',
      whyLabel: 'The Professional Difference',
      whyPoints: ['Advanced cleaning techniques', 'Surface protection specialists', 'Convenient home service'],
      serviceAreas: ['La Vista', 'Papillion', 'Omaha'],
      cta: 'Get a free quote for La Vista detailing.'
    }
  },
  {
    slug: 'council-bluffs-ia',
    name: 'Council Bluffs, IA',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Council Bluffs IA | Mobile Detailer',
      description: 'Expert car detailing in Council Bluffs, IA. Mobile interior and exterior detailing for cars, trucks, and SUVs.'
    },
    content: {
      title: 'Car Detailing in Council Bluffs, IA',
      intro: 'Quality mobile detailing services crossing the river to serve Council Bluffs.',
      servicesLabel: 'Council Bluffs Services:',
      whyLabel: 'Our Commmitment',
      whyPoints: ['Thorough multi-point inspection', 'Premium paint sealants', 'Stain-free interiors'],
      serviceAreas: ['Council Bluffs', 'Omaha', 'Bellevue'],
      cta: 'Schedule your Council Bluffs detail.'
    }
  }
];
