import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Sparkles } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

const TRANSFORMATIONS = [
  {
    id: 1,
    before: '/20191020_062847.jpg',
    after: '/20191020_062924.jpg',
    label: 'Stage 2 Paint Correction'
  },
  {
    id: 2,
    before: '/20191020_110329.jpg',
    after: '/20191020_110339.jpg',
    label: 'Deep Interior Restoration'
  }
];

const GALLERY_IMAGES = [
  { id: 1, src: '/20191020_121957.jpg', category: 'interior', alt: 'Clean car interior' },
  { id: 2, src: '/20191020_165304.jpg', category: 'exterior', alt: 'Glossy car exterior' },
  { id: 3, src: '/20191020_165120.jpg', category: 'paint', alt: 'Paint correction progress' },
  { id: 4, src: '/20191103_010853.jpg', category: 'ceramic', alt: 'Ceramic coating gloss' },
  { id: 5, src: '/20191020_110332.jpg', category: 'interior', alt: 'Detailed cabin' },
  { id: 6, src: '/20191020_062851.jpg', category: 'exterior', alt: 'Freshly washed vehicle' },
  { id: 7, src: '/20191020_165130.jpg', category: 'paint', alt: 'Surface reflection' },
  { id: 8, src: '/20191020_165218.jpg', category: 'exterior', alt: 'Showroom finish' },
  { id: 9, src: '/20191020_165146.jpg', category: 'paint', alt: 'Detailing focus' },
  { id: 10, src: '/20191020_122005.jpg', category: 'interior', alt: 'Spotless seats' },
  { id: 11, src: '/20191020_062857.jpg', category: 'exterior', alt: 'Vehicle cleanup' },
  { id: 12, src: '/20191020_165125.jpg', category: 'paint', alt: 'Correction in progress' },
  { id: 13, src: '/20191020_165133.jpg', category: 'exterior', alt: 'Detailing step' },
  { id: 14, src: '/20191020_165137.jpg', category: 'paint', alt: 'Mirror reflection' },
  { id: 15, src: '/20191020_165149.jpg', category: 'exterior', alt: 'Final wipe down' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Work' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'paint', label: 'Paint Correction' },
  { id: 'ceramic', label: 'Ceramic Coating' },
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const filteredImages = filter === 'all' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === filter);

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Our Work</h1>
          <p className="text-lg text-zinc-600">
            See the difference professional detailing makes. Browse our gallery of recent transformations.
          </p>
        </div>

        {/* Featured Transformations */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <h2 className="text-2xl font-bold text-zinc-900">Featured Transformations</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {TRANSFORMATIONS.map(t => (
              <div key={t.id} className="space-y-4">
                <BeforeAfterSlider 
                  beforeImage={t.before} 
                  afterImage={t.after} 
                />
                <div className="text-center">
                  <p className="font-bold text-zinc-900">{t.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat.id 
                  ? 'bg-zinc-900 text-white' 
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredImages.map(img => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-medium capitalize">{img.category} Detailing</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
