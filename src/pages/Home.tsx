import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Quote, Sparkles, MapPin, Calendar, CheckCircle2, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BOOKING_LINK } from '../lib/constants';
import DetailingQuiz from '../components/DetailingQuiz';
import ServiceMap from '../components/ServiceMap';
import Testimonials from '../components/Testimonials';
import AIConditionEstimator from '../components/AIConditionEstimator';
import { SERVICES } from '../data/services';
import { CITIES } from '../data/cities';

export default function Home() {
  const featuredServices = [
    SERVICES.find(s => s.id === 'interior-detail'),
    SERVICES.find(s => s.id === 'full-detail-package'),
    SERVICES.find(s => s.id === 'ceramic-5yr')
  ].filter(Boolean) as typeof SERVICES;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-zinc-950 text-white overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src="/20191020_165304.jpg"
            alt="Luxury car detailing"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm text-sm font-medium text-zinc-300">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>5-Star Rated in Bellevue & Omaha</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Professional Auto Detailing in <span className="text-zinc-400">Bellevue & Omaha</span>
            </h1>

          <p className="text-xl text-zinc-300 max-w-2xl leading-relaxed">
            10+ years of showroom quality detailing and professional paint correction. I specialize in precision restoration and ceramic coatings for residents across <Link to="/areas/bellevue-ne" className="text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all">Bellevue</Link> and the entire <Link to="/areas/omaha-ne" className="text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all">Omaha</Link> metro area.
          </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-lg h-14 px-8 bg-white text-zinc-950 hover:bg-zinc-200" asChild>
                <Link to="/book">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your Detail
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white" asChild>
                <Link to="/services">
                  View Services
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Assessment Section */}
      <section className="py-24 bg-zinc-50 overflow-hidden border-b border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Virtual Assessment</h2>
            <h3 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
              Get an Expert Opinion <span className="text-zinc-400 italic font-medium tracking-tight">Instantly.</span>
            </h3>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Don't guess what your car needs. Use our AI-powered vision system to identify invisible contaminants and surface defects.
            </p>
          </div>
          <AIConditionEstimator />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Our Commitment</h2>
                <h3 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
                  Meticulous <span className="text-zinc-400 italic">Auto Detailing</span> in Omaha.
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed max-w-xl">
                  Bryan's Showroom Quality Detailing is built on the belief that <Link to="/areas/omaha-ne" className="text-zinc-900 font-bold hover:underline">Omaha</Link> and <Link to="/areas/bellevue-ne" className="text-zinc-900 font-bold hover:underline">Bellevue</Link> drivers deserve more than a basic car wash. We focus on technical precision and professional-grade paint restoration to keep your vehicle looking its best for years to come.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-1">Expert Paint Correction & Restoration</h4>
                    <p className="text-zinc-600">With over a decade of experience serving the Omaha metro area, we understand the specific environmental challenges your vehicle faces. We don't just cover up imperfections; we correct them using safe, proven techniques.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-1">Premium Components & Safe Methods</h4>
                    <p className="text-zinc-600">We use professional-grade ceramic coatings and specialized cleaning agents formulated for long-term protection. Our multi-stage process ensures every surface is treated with the specific care it requires.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-1">A Personal Standard of Perfection</h4>
                    <p className="text-zinc-600">Every vehicle we touch is a reflection of our dedication. We take the time necessary to achieve a showroom finish, prioritizing quality and long-term preservation above all else.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" className="h-14 px-8" asChild>
                  <Link to="/services">Discover Our Process</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="/20191020_062847.jpg" 
                  alt="Precision detailing work" 
                  className="h-full object-cover"
                  style={{ width: '632px' }}
                />
              </div>
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-zinc-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
              <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
              
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-xl z-20 border border-zinc-100">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-zinc-900">10+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 leading-tight">
                    Years of<br />Experience
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Services - Data Driven */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
                Premium Detailing Packages
              </h2>
              <p className="text-lg text-zinc-600">
                Stop paying for a quick wash. Invest in protection, restoration, and preservation.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/services" className="gap-2">
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => (
              <div 
                key={service.id} 
                className={`rounded-3xl p-8 shadow-sm border flex flex-col relative ${
                  idx === 1 
                    ? 'bg-zinc-900 text-white border-zinc-800 shadow-2xl transform md:-translate-y-4' 
                    : 'bg-white text-zinc-900 border-zinc-200'
                }`}
              >
                {idx === 1 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className={`text-sm mb-6 flex-grow font-medium ${idx === 1 ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {service.shortDescription}
                </p>
                <div className="space-y-4 mb-8">
                  {service.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={`h-4 w-4 ${idx === 1 ? 'text-emerald-500' : 'text-zinc-900'}`} />
                      <span className={idx === 1 ? 'text-zinc-300' : 'text-zinc-700'}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className={`pt-6 border-t mt-auto ${idx === 1 ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <p className={`text-sm mb-4 ${idx === 1 ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Starting at <span className={`text-lg font-bold ${idx === 1 ? 'text-white' : 'text-zinc-900'}`}>${service.price.car || service.price.rv || service.price.suv}</span>
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button className={`w-full ${idx === 1 ? 'bg-white text-zinc-900 hover:bg-zinc-200' : ''}`} asChild>
                      <Link to="/book">Book Now</Link>
                    </Button>
                    <Button variant="ghost" className={`w-full text-xs font-black uppercase tracking-widest ${idx === 1 ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : ''}`} asChild>
                      <Link to={`/services/detail/${service.id}`}>Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Specialty Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* RV & Boat Blurb */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 flex flex-col md:flex-row gap-8 items-center">
              <div className="shrink-0 w-24 h-24 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                <MapPin className="h-10 w-10" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">RV, Boat & Equipment Detailing</h3>
                <p className="text-zinc-600 text-sm mb-4">From oxidation removal to full cleanups, I handle larger vehicles and equipment that need more than a basic wash.</p>
                <Link to="/services/rv-boat-detailing" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-900 hover:gap-3 transition-all">
                  View Large Detailing <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Maintenance Blurb */}
            <div className="bg-zinc-100 rounded-3xl p-8 border border-zinc-200 flex flex-col md:flex-row gap-8 items-center">
              <div className="shrink-0 w-24 h-24 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                <Sparkles className="h-10 w-10" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Maintenance Detailing</h3>
                <p className="text-zinc-600 text-sm mb-4">Keep your vehicle looking freshly detailed year-round without needing a full reset every time.</p>
                <Link to="/services/maintenance-plans" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-900 hover:gap-3 transition-all">
                  Maintain Your Shine <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest">
              <Quote className="h-4 w-4" />
              <span>Customer Success</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
              What Our Clients <span className="text-zinc-400 italic">Say</span>
            </h2>
            <p className="text-lg text-zinc-600">
              Join hundreds of satisfied car owners in the Bellevue and Omaha area.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              <span>Free Assessment</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
              What does your vehicle <span className="text-zinc-400 italic">actually</span> need?
            </h2>
            <p className="text-lg text-zinc-600">
              Take our 30-second vehicle health quiz to get a personalized detailing recommendation.
            </p>
          </div>
          <DetailingQuiz />
        </div>
      </section>

      {/* FAQ Summary Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
              Common <span className="text-zinc-400 italic">Questions</span>
            </h2>
            <p className="text-lg text-zinc-600">
              Quick answers to help you choose the right service for your vehicle.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-2">How long does it take?</h3>
              <p className="text-sm text-zinc-600">Most interior or exterior details take 2-4 hours. Full restorations or ceramic coatings can take 1-3 days.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-2">Where are you located?</h3>
              <p className="text-sm text-zinc-600">We are based in Bellevue and serve the full Omaha metro area, providing both drop-off and expert on-site detailing options for your convenience.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-2">Is a deposit required?</h3>
              <p className="text-sm text-zinc-600">Yes, a $50 non-refundable deposit is required to secure your appointment. This is applied to your final total.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-2">What if it rains?</h3>
              <p className="text-sm text-zinc-600">If weather prevents us from working safely, we will contact you to reschedule for the next available slot.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/faq">View All FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
              Bellevue & Omaha Detailing Excellence
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Get showroom-quality results from our premium detailing service based in Bellevue. We serve the entire Omaha metro area including <Link to="/areas/papillion-ne" className="text-zinc-900 font-bold hover:underline">Papillion</Link>, <Link to="/areas/la-vista-ne" className="text-zinc-900 font-bold hover:underline">La Vista</Link>, and <Link to="/areas/council-bluffs-ia" className="text-zinc-900 font-bold hover:underline">Council Bluffs</Link> with flexible scheduling.
            </p>
          </div>
          <ServiceMap />
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {CITIES.map(city => (
              <Link
                key={city.slug}
                to={`/areas/${city.slug}`}
                className="px-4 py-3 bg-white rounded-xl border border-zinc-200 text-sm font-black uppercase tracking-widest text-zinc-700 shadow-sm hover:border-zinc-900 hover:text-zinc-900 transition-all"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready for Showroom Quality?</h2>
          <p className="text-xl text-zinc-400">
            Secure your spot today. We require a deposit to hold your appointment, ensuring dedicated time for your vehicle's transformation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" className="text-lg h-14 px-8 bg-white text-zinc-950 hover:bg-zinc-200" asChild>
              <Link to="/book">Book Appointment</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white" asChild>
              <a href="tel:712-305-6313">Call (712) 305-6313</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
