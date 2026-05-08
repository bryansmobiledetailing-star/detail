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
      title: 'Auto Detailing Omaha NE | Paint Correction & Ceramic Coating',
      description: 'Top-rated auto detailing services in Omaha, NE. Specializing in interior detailing, exterior paint correction, and ceramic coating for Nebraska drivers.'
    },
    content: {
      title: 'Auto Detailing in Omaha, NE',
      intro: 'I provide professional auto detailing services for drivers in Omaha and surrounding areas. From deep interior detailing to advanced paint correction and ceramic coating, every service is designed to restore and protect your vehicle perfectly.',
      servicesLabel: 'Auto Detailing Services Available in Omaha:',
      whyLabel: 'Why Omaha drivers choose our car detailing:',
      whyPoints: [
        'Expert paint correction and ceramic coating',
        'Deep stain extraction interior detailing',
        'Flexible scheduling across Bellevue and Omaha area',
        'Professional shop and mobile services'
      ],
      serviceAreas: ['Omaha', 'Bellevue', 'Papillion', 'La Vista', 'Council Bluffs'],
      cta: 'Book your auto detailing today and get a showroom-ready vehicle without the hassle.'
    }
  },
  {
    slug: 'bellevue-ne',
    name: 'Bellevue, NE',
    type: 'primary',
    seo: {
      title: 'Car Detailing Bellevue NE | Auto Detailing & Ceramic Coating',
      description: 'The premier car detailing in Bellevue, NE. Expert auto detailing, paint correction, interior detailing, and ceramic coating services.'
    },
    content: {
      title: 'Auto Detailing in Bellevue, NE',
      intro: 'Based right here in Bellevue, I offer the most thorough and professional auto detailing experience in the region. Whether you need a deep interior detailing reset, advanced paint correction, or long-lasting ceramic coating, we bring your vehicle back to pristine condition.',
      servicesLabel: 'Auto Detailing Services Available in Bellevue:',
      whyLabel: 'Why Bellevue residents trust our car detailing:',
      whyPoints: [
        'Local Bellevue-based auto detailing operation',
        'Expert ceramic coating & paint correction',
        'Serving Offutt AFB and surrounding communities',
        'Highest attention to detail for interior and exterior'
      ],
      serviceAreas: ['Bellevue', 'Offutt AFB', 'Omaha', 'Papillion'],
      cta: 'Schedule your Bellevue auto detailing now.'
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
