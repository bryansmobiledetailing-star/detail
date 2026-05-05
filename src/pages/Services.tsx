import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Info, ArrowRight, Calendar as CalendarIcon, Check, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SERVICES, VEHICLE_SIZES, SPECIALTY_SIZES, type Service } from '../data/services';
import { BOOKING_LINK } from '../lib/constants';

export default function Services() {
  const fullServices = SERVICES.filter(s => s.categoryId === 'full-detailing');
  const interiorServices = SERVICES.filter(s => s.categoryId === 'interior-only');
  const exteriorServices = SERVICES.filter(s => s.categoryId === 'exterior-only');
  const specialtyServices = SERVICES.filter(s => ['paint-correction', 'ceramic-coating'].includes(s.categoryId));
  const rvServices = SERVICES.filter(s => s.categoryId === 'specialty-services');

  const maintenanceServices = SERVICES.filter(s => s.categoryId === 'maintenance');

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900">
            Professional Detailing Services in <span className="text-zinc-400 italic font-medium">Bellevue & Omaha</span>
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Expert ceramic coating, paint correction, and interior restoration based in Bellevue. We provide a controlled professional environment for the highest quality results across the Omaha metro area.
          </p>
        </div>

        {/* Maintenance Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">Maintenance</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0 gap-2">
              <Link to="/services/maintenance">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {maintenanceServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-8 p-6 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold mb-2">Join the Maintenance Club</h4>
              <p className="text-emerald-700 text-sm">Save up to 20% on recurring maintenance details by joining our monthly subscription club.</p>
            </div>
            <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
              <Link to="/membership">View Memberships</Link>
            </Button>
          </div>
        </div>

        {/* Full Detailing */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">Full Detailing</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0 gap-2">
              <Link to="/services/full-detailing">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {fullServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* Interior Detailing */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">Interior Only</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0 gap-2">
              <Link to="/services/interior-only">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {interiorServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-6 p-4 bg-zinc-100 text-zinc-600 rounded-lg flex items-start gap-3 text-sm border border-zinc-200">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <p><strong>Note:</strong> Pet hair or heavy soil may incur an additional $40–$80 charge depending on condition (included in Showroom package).</p>
          </div>
        </div>

        {/* Exterior Detailing */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">Exterior Only</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0 gap-2">
              <Link to="/services/exterior-only">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {exteriorServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg flex items-start gap-3 text-sm border border-blue-100">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <p><strong>Care Note:</strong> Our premium exterior services are designed for hand-washing only. <strong>Not for tunnel washes</strong> as automated brushes can damage protection layers and cause swirl marks.</p>
          </div>
        </div>

        {/* Paint Correction & Ceramic */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">Premium Protection & Correction</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild className="shrink-0 gap-2">
                <Link to="/services/paint-correction">
                  Correction <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="shrink-0 gap-2">
                <Link to="/services/ceramic-coating">
                  Ceramic <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {specialtyServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* RV / Motorhome Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">RV, Boat & Specialty</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0 gap-2">
              <Link to="/services/rv-motorhome">
                Specialty Details <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rvServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-8 p-6 bg-zinc-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold mb-2">Custom RV Solutions</h4>
              <p className="text-zinc-400 text-sm">Need roof sealing, oxidation removal, or a full seasonal prep? Contact us for a custom quote on your specific model.</p>
            </div>
            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white" asChild>
              <Link to="/quote">Get Custom RV Quote</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service; key?: React.Key }) {
  const sizesToDisplay = service.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES;
  const startingPrice = service.isSpecialty ? service.price.rv : service.price.car;
  
  return (
    <div className={`rounded-3xl p-8 flex flex-col relative transition-all duration-300 h-full ${
      service.highlight 
        ? 'bg-zinc-900 text-white shadow-2xl shadow-zinc-200 border border-zinc-800 transform lg:-translate-y-2' 
        : 'bg-white text-zinc-900 shadow-sm border border-zinc-100 hover:shadow-md hover:border-zinc-200'
    }`}>
      {service.badge && (
        <div className={`absolute top-0 left-8 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase z-10 ${
          service.badge === 'Most Popular' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
          service.badge === 'Custom' ? 'bg-zinc-900 text-white border border-zinc-700' :
          service.badge === 'Top Choice' ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' :
          service.highlight ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
        }`}>
          {service.badge}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight mb-1">{service.name}</h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
            <CalendarIcon className="h-3 w-3" />
            <span>Est. {typeof service.duration === "string" ? service.duration : `${service.duration.car || service.duration.rv || Object.values(service.duration)[0]} (varies by size)`}</span>
          </div>
        </div>
      </div>

      <p className={`text-sm leading-relaxed mb-6 font-medium ${service.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {service.description}
      </p>

      {/* Guided Decision Sections */}
      <div className="space-y-4 mb-8">
        {service.bestFor && (
          <div className={`p-4 rounded-2xl border ${service.highlight ? 'bg-zinc-800/40 border-zinc-700' : 'bg-zinc-50 border-zinc-100'}`}>
            <div className="flex items-start gap-3">
              <Sparkles className={`h-4 w-4 shrink-0 mt-0.5 ${service.highlight ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>Best For</p>
                <p className={`text-xs font-semibold leading-relaxed ${service.highlight ? 'text-zinc-300' : 'text-zinc-700'}`}>{service.bestFor}</p>
              </div>
            </div>
          </div>
        )}

        {service.considerAlternative && (
          <div className={`p-4 rounded-2xl border border-dashed ${service.highlight ? 'bg-transparent border-zinc-800' : 'bg-transparent border-zinc-200'}`}>
            <div className="flex items-start gap-3">
              <HelpCircle className={`h-4 w-4 shrink-0 mt-0.5 ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>Consider Different Package If</p>
                <p className={`text-xs font-medium leading-relaxed ${service.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>{service.considerAlternative.text}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4 mb-8">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>Core Features</p>
        <div className="space-y-3">
          {service.features.map((feature: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3 group">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                service.highlight ? 'bg-zinc-800 group-hover:bg-emerald-500/20' : 'bg-zinc-50 group-hover:bg-zinc-100'
              }`}>
                <Check className={`h-3 w-3 ${service.highlight ? 'text-emerald-400' : 'text-zinc-900'}`} />
              </div>
              <span className={`text-sm font-semibold tracking-tight ${service.highlight ? 'text-zinc-200' : 'text-zinc-700'}`}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`mt-auto pt-8 border-t ${service.highlight ? 'border-zinc-800' : 'border-zinc-100'}`}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-black uppercase tracking-[0.1em] ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>Investment</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-xs font-bold ${service.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>Starting at</span>
              <span className="text-3xl font-black tracking-tighter">${startingPrice}</span>
            </div>
          </div>
          
          <div className={`grid grid-cols-2 gap-2 p-4 rounded-2xl ${service.highlight ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
            {sizesToDisplay.map((size) => (
              <div key={size.id} className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-widest ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {size.name.split('/')[0]}
                </span>
                <span className={`text-sm font-black ${service.highlight ? 'text-white' : 'text-zinc-900'}`}>
                  {service.price[size.id] ? `$${service.price[size.id]}` : 'Quote'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            className={`w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest transition-all duration-300 ${
              service.highlight 
                ? 'bg-white text-zinc-950 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]'
            }`}
            asChild
          >
            <Link to={`/book?serviceId=${service.id}`} className="flex items-center justify-center gap-3">
              <CalendarIcon className="h-5 w-5" />
              Secure Booking
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full h-12 rounded-2xl text-xs font-black uppercase tracking-widest gap-2 ${
              service.highlight ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            asChild
          >
            <Link to={`/services/detail/${service.id}`}>
              Learn More About {service.name.split(' (')[0].split(' -')[0]} <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

