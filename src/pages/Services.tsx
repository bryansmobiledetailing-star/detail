import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Info, ArrowRight, Calendar as CalendarIcon, Check, Sparkles, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SERVICES, VEHICLE_SIZES, SPECIALTY_SIZES, type Service } from '../data/services';
import { getSquareHeaders } from '../lib/config';

interface SquareService {
  id: string;
  name: string;
  variations: {
    id: string;
    name: string;
    price: number;
  }[];
}

export default function Services() {
  const [squareServices, setSquareServices] = useState<SquareService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSquareData() {
      try {
        const response = await fetch('/api/catalog/services', {
          headers: getSquareHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          setSquareServices(data);
        }
      } catch (err) {
        console.error("Failed to fetch Square services:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSquareData();
  }, []);

  const fullServices = SERVICES.filter(s => s.categoryId === 'full-detailing');
  const interiorServices = SERVICES.filter(s => s.categoryId === 'interior-detailing');
  const exteriorServices = SERVICES.filter(s => s.categoryId === 'exterior-detailing');
  const correctionServices = SERVICES.filter(s => s.categoryId === 'paint-correction');
  const ceramicServices = SERVICES.filter(s => s.categoryId === 'protection');
  const specialtyServices = SERVICES.filter(s => ['rv-boat-detailing', 'tractor-detailing'].includes(s.categoryId));
  const maintenanceServices = SERVICES.filter(s => s.categoryId === 'maintenance');

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <div className="flex justify-center mb-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isLoading ? 'bg-zinc-100 text-zinc-400' : 'bg-emerald-50 text-emerald-600'}`}>
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing Prices...
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Square Pricing Active
                </>
              )}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900">
            Professional Detailing Services in <span className="text-zinc-400 italic font-medium">Bellevue & Omaha</span>
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Expert ceramic coating, paint correction, interior restoration, and specialty detailing for RVs, boats, and tractors based in Bellevue, Nebraska.
          </p>
        </div>

        {/* Maintenance Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">Maintenance Detailing</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {maintenanceServices.map((service) => (
              <ServiceCard key={service.id} service={service} squareServices={squareServices} />
            ))}
          </div>
        </div>

        {/* Full Detailing */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">Full Detailing Packages</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {fullServices.map((service) => (
              <ServiceCard key={service.id} service={service} squareServices={squareServices} />
            ))}
          </div>
        </div>

        {/* Interior & Exterior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-zinc-900">Interior Detailing</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <div className="grid gap-8">
              {interiorServices.map((service) => (
                <ServiceCard key={service.id} service={service} squareServices={squareServices} />
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-zinc-900">Exterior Detailing</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <div className="grid gap-8">
              {exteriorServices.map((service) => (
                <ServiceCard key={service.id} service={service} squareServices={squareServices} />
              ))}
            </div>
          </div>
        </div>

        {/* Paint Correction & Ceramic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-zinc-900">Paint Correction</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <div className="grid gap-8">
              {correctionServices.map((service) => (
                <ServiceCard key={service.id} service={service} squareServices={squareServices} />
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-zinc-900">Ceramic Coating</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <div className="grid gap-8">
              {ceramicServices.map((service) => (
                <ServiceCard key={service.id} service={service} squareServices={squareServices} />
              ))}
            </div>
          </div>
        </div>

        {/* RV, Boat & Tractor Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-3xl font-bold text-zinc-900">RV, Boat & Equipment Detailing</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {specialtyServices.map((service) => (
              <ServiceCard key={service.id} service={service} squareServices={squareServices} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, squareServices }: { service: Service; squareServices: SquareService[] }) {
  const sizesToDisplay = service.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES;
  
  const getPrice = (sizeId: string) => {
    const squareMatch = squareServices.find(ss => 
      ss.name.toLowerCase().includes(service.name.toLowerCase()) ||
      service.name.toLowerCase().includes(ss.name.toLowerCase())
    );

    if (squareMatch) {
      const sizeName = sizesToDisplay.find(s => s.id === sizeId)?.name;
      const variation = squareMatch.variations.find(v => 
        v.name.toLowerCase().includes(sizeName?.toLowerCase() || '')
      ) || squareMatch.variations[0];
      return variation ? variation.price : service.price[sizeId];
    }
    return service.price[sizeId];
  };

  const startingPrice = getPrice(sizesToDisplay[0].id);
  
  return (
    <div className={`rounded-3xl p-8 flex flex-col relative transition-all duration-300 h-full ${
      service.highlight 
        ? 'bg-zinc-900 text-white shadow-2xl shadow-zinc-200 border border-zinc-800 transform lg:-translate-y-2' 
        : 'bg-white text-zinc-900 shadow-sm border border-zinc-100 hover:shadow-md hover:border-zinc-200'
    }`}>
      {service.badge && (
        <div className={`absolute top-0 left-8 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase z-10 ${
          service.badge === 'Most Popular' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
          service.badge === 'Top Choice' ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' :
          'bg-zinc-100 text-zinc-800 border border-zinc-200'
        }`}>
          {service.badge}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight mb-1">{service.name}</h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
            <CalendarIcon className="h-3 w-3" />
            <span>Est. {typeof service.duration === "string" ? service.duration : `${service.duration.car || service.duration.rv || Object.values(service.duration)[0]} (varies)`}</span>
          </div>
        </div>
      </div>

      <p className={`text-sm leading-relaxed mb-6 font-medium ${service.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {service.shortDescription}
      </p>

      {service.bestFor && (
        <div className={`p-4 rounded-2xl border mb-8 ${service.highlight ? 'bg-zinc-800/40 border-zinc-700' : 'bg-zinc-50 border-zinc-100'}`}>
          <div className="flex items-start gap-3">
            <Sparkles className={`h-4 w-4 shrink-0 mt-0.5 ${service.highlight ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>Best For</p>
              <p className={`text-xs font-semibold leading-relaxed ${service.highlight ? 'text-zinc-300' : 'text-zinc-700'}`}>{service.bestFor}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4 mb-8">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>Core Features</p>
        <div className="space-y-3">
          {service.features.slice(0, 5).map((feature: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <Check className={`h-3 w-3 shrink-0 ${service.highlight ? 'text-emerald-400' : 'text-zinc-900'}`} />
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
              <span className={`text-xs font-bold ${service.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>{service.pricingType === 'variable' ? 'Starts' : 'From'}</span>
              <span className="text-3xl font-black tracking-tighter">${startingPrice}{service.pricingType === 'variable' && <span className="text-sm">/ft</span>}</span>
            </div>
          </div>
          
          <div className={`grid grid-cols-2 gap-2 p-4 rounded-2xl ${service.highlight ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
            {sizesToDisplay.slice(0, 4).map((size) => (
              <div key={size.id} className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-widest ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {size.name.split('/')[0]}
                </span>
                <span className={`text-sm font-black ${service.highlight ? 'text-white' : 'text-zinc-900'}`}>
                  {getPrice(size.id) ? `$${getPrice(size.id)}` : 'Quote'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            className={`w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest transition-all ${
              service.highlight 
                ? 'bg-white text-zinc-950 hover:bg-zinc-200' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
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
              service.highlight ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
            asChild
          >
            <Link to={`/services/detail/${service.id}`}>
              Learn More <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
