import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ChevronRight } from 'lucide-react';
import { BOOKING_LINK } from '../lib/constants';

const LINKS = [
  {
    title: "Main Pages",
    items: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Gallery", path: "/gallery" },
      { name: "Membership", path: "/membership" },
      { name: "Gift Cards", path: "/gift-cards" },
      { name: "Book Now", path: BOOKING_LINK, isExternal: true },
    ]
  },
  {
    title: "Services",
    items: [
      { name: "Full Detailing", path: "/services/full-detailing" },
      { name: "Interior Detailing", path: "/services/interior-only" },
      { name: "Exterior Detailing", path: "/services/exterior-only" },
      { name: "Paint Correction", path: "/services/paint-correction" },
      { name: "Ceramic Coating", path: "/services/ceramic-coating" },
      { name: "RV & Motorhome", path: "/services/rv-motorhome" },
    ]
  },
  {
    title: "Support",
    items: [
      { name: "FAQ", path: "/faq" },
      { name: "Request a Quote", path: "/quote" },
      { name: "Contact Us", path: "/" },
    ]
  }
];

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <div className="mx-auto w-16 h-16 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center mb-6">
            <Map className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Sitemap</h1>
          <p className="text-lg text-zinc-600">
            A complete directory of all pages on our website.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {LINKS.map((section) => (
            <div key={section.title} className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-200 pb-2">
                {section.title}
              </h2>
              <ul className="space-y-4">
                {section.items.map((link) => (
                  <li key={link.path}>
                    {'isExternal' in link && link.isExternal ? (
                      <a 
                        href={link.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        <span>{link.name}</span>
                      </a>
                    ) : (
                      <Link 
                        to={link.path} 
                        className="group flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        <span>{link.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
