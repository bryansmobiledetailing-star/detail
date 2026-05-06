import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Sparkles,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  Car,
  Info,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  SERVICES,
  CATEGORIES,
  VEHICLE_SIZES,
  SPECIALTY_SIZES,
  type Service,
} from "../data/services";
import { BOOKING_LINK } from "../lib/constants";

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = SERVICES.find((s) => s.id === serviceId);
  const category = service
    ? CATEGORIES.find((c) => c.id === service.categoryId)
    : null;

  React.useEffect(() => {
    if (service) {
      document.title = service.seo.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', service.seo.description);
      } else {
        const desc = document.createElement('meta');
        desc.name = "description";
        desc.content = service.seo.description;
        document.head.appendChild(desc);
      }
    }
  }, [service]);

  const allSizes = [...VEHICLE_SIZES, ...SPECIALTY_SIZES];

  if (!service || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-[2.5rem] shadow-xl border border-zinc-100 max-w-md w-full">
          <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-zinc-300" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">
            Service Not Found
          </h1>
          <p className="text-zinc-500 mb-8 font-medium">
            The service you're looking for might have been moved or renamed.
          </p>
          <Button
            asChild
            className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest bg-zinc-900"
          >
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Dynamic Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
            <Link
              to="/services"
              className="hover:text-zinc-900 transition-colors"
            >
              Services
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              to={`/services/${category.slug}`}
              className="hover:text-zinc-900 transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-900">
              {service.name.split(" (")[0].split(" -")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                {service.badge && (
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ${
                      service.badge === "Most Popular"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : service.badge === "Top Choice"
                          ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                          : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                    }`}
                  >
                    {service.badge}
                  </span>
                )}
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.9]">
                  {service.name}
                </h1>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-xl">
                  {service.longDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-8 py-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    Duration
                  </span>
                  <div className="flex items-center gap-3 text-zinc-900 font-black">
                    <div className="w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                      <Clock className="h-4 w-4" />
                    </div>
                    {typeof service.duration === "string"
                      ? service.duration
                      : `${service.duration.car || service.duration.rv || Object.values(service.duration)[0]} (varies)`}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    Standards
                  </span>
                  <div className="flex items-center gap-3 text-zinc-900 font-black">
                    <div className="w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    Showroom Quality
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="h-16 px-12 text-lg font-black uppercase tracking-widest rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  asChild
                >
                  <Link
                    to={`/book?serviceId=${service.id}`}
                    className="flex items-center gap-3"
                  >
                    <Calendar className="h-5 w-5" />
                    Book Securely
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-12 text-lg font-black uppercase tracking-widest rounded-2xl border-zinc-200 hover:bg-zinc-50 transition-all"
                  asChild
                >
                  <Link to="/quote">Get Custom Quote</Link>
                </Button>
                {SERVICES.filter((s) => s.categoryId === category.id).length >
                  1 && (
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-16 px-8 text-sm font-black uppercase tracking-widest rounded-2xl transition-all"
                    asChild
                  >
                    <Link to={`/services/${category.slug}`}>
                      Compare Packages
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white">
                <img
                  src={service.image || category.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Abstract decorative elements */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-100/50 rounded-full filter blur-3xl opacity-60 mix-blend-multiply" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-zinc-200/50 rounded-full filter blur-3xl opacity-60 mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing & Selection Section */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-grow bg-zinc-200" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                    Pricing Matrix
                  </span>
                  <div className="h-px flex-grow bg-zinc-200" />
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white shadow-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-zinc-100">
                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                          Vehicle Size
                        </th>
                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                          Est. Duration
                        </th>
                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">
                          Base Investment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {Object.entries(service.price).map(([slug, price]) => {
                        const sizeInfo = allSizes.find((s) => s.id === slug);
                        if (!sizeInfo) return null;

                        return (
                          <tr
                            key={slug}
                            className="group hover:bg-zinc-50/50 transition-colors"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <span className="text-2xl grayscale group-hover:grayscale-0 transition-all leading-none">
                                  {sizeInfo.icon}
                                </span>
                                <span className="text-sm font-bold text-zinc-900">
                                  {sizeInfo.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
                                <Clock className="h-3.5 w-3.5" />
                                {typeof service.duration === "string" 
                                  ? service.duration 
                                  : service.duration[slug] || 'Custom'}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className="text-xl font-black text-zinc-900">
                                ${price}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
                      <Info className="h-3 w-3" />
                      Final quote provided upon vehicle inspection
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-grow bg-zinc-200" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                    Restoration Depth
                  </span>
                  <div className="h-px flex-grow bg-zinc-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-base font-semibold text-zinc-700 leading-relaxed group-hover:text-zinc-900 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope & Recommendations Section */}
              {service.bestFor && (
                <div className="space-y-8 pt-8 border-t border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-grow bg-zinc-200" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                      Scope & Recommendations
                    </span>
                    <div className="h-px flex-grow bg-zinc-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.bestFor && (
                      <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white relative overflow-hidden group border border-zinc-800 flex flex-col justify-between shadow-xl">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                          <Sparkles className="h-20 w-20" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4 italic flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3" />
                            Perfect Match For
                          </p>
                          <p className="text-xl font-black italic tracking-tighter leading-tight relative z-10">
                            {service.bestFor}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:w-1/3 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-black tracking-tight text-zinc-900">
                    Service Standards
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 p-3 bg-zinc-50 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Bellevue & Omaha Service area
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 p-3 bg-zinc-50 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Secure Drop-off environment
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 p-3 bg-zinc-50 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Advanced chemical decontamination
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 p-3 bg-zinc-50 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      100% Satisfaction Guarantee
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 italic text-[10px] text-zinc-400 font-medium">
                    * All times are estimates based on standard vehicle
                    condition.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center mx-auto border border-zinc-100 shadow-sm">
                <ShieldCheck className="h-8 w-8 text-zinc-900" />
              </div>
              <h4 className="text-lg font-black tracking-tight">
                Full Licensed
              </h4>
              <p className="text-sm text-zinc-500 font-medium">
                100% insured for your peace of mind and vehicle safety.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center mx-auto border border-zinc-100 shadow-sm">
                <Car className="h-8 w-8 text-zinc-900" />
              </div>
              <h4 className="text-lg font-black tracking-tight">
                Technical Prep
              </h4>
              <p className="text-sm text-zinc-500 font-medium">
                Advanced decontamination techniques included in every detail.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center mx-auto border border-zinc-100 shadow-sm">
                <MapPin className="h-8 w-8 text-zinc-900" />
              </div>
              <h4 className="text-lg font-black tracking-tight">Bellevue HQ</h4>
              <p className="text-sm text-zinc-500 font-medium">
                Secure brick-and-mortar location for precision detailing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900">
              Explore Other Packages
            </h2>
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/services">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.filter(
              (s) => s.categoryId === service.categoryId && s.id !== service.id,
            )
              .slice(0, 3)
              .map((relService) => (
                <Link
                  key={relService.id}
                  to={`/services/detail/${relService.id}`}
                  className="group bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                      {relService.name.split(" (")[0].split(" -")[0]}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-zinc-900 translate-x-0 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-zinc-500 font-medium line-clamp-2 mb-6">
                    {relService.shortDescription}
                  </p>
                  <div className="mt-auto pt-6 border-t border-zinc-50 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Starting at
                    </span>
                    <span className="text-lg font-black text-zinc-900">
                      $
                      {relService.isSpecialty
                        ? relService.price.rv
                        : relService.price.car}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Ready for the <span className="text-emerald-400">Showroom</span>{" "}
              Finish?
            </h2>
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
              Choose your vehicle size and secure your date. Our professional
              detailing shop in Bellevue handles the rest.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              size="lg"
              className="h-16 px-12 text-lg font-black uppercase tracking-widest bg-white text-zinc-950 hover:bg-zinc-200"
              asChild
            >
              <Link to={`/book?serviceId=${service.id}`}>
                Configure & Book Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-12 text-lg font-black uppercase tracking-widest border-zinc-700 hover:bg-zinc-800 text-white"
              asChild
            >
              <Link to="/services">Compare Others</Link>
            </Button>
          </div>
          <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">
            5.0 Rated Professional Detailing in Omaha Area
          </p>
        </div>
      </section>
    </div>
  );
}
