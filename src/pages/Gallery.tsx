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
  { id: 1, src: '/20191020_121957.jpg', category: 'interior', alt: 'Clean car interior detailing Omaha Bellevue' },
  { id: 2, src: '/20191020_165304.jpg', category: 'exterior', alt: 'Glossy car exterior auto detailing Nebraska' },
  { id: 3, src: '/20191020_165120.jpg', category: 'paint', alt: 'Paint correction progress scratch removal Bellevue' },
  { id: 4, src: '/20191103_010853.jpg', category: 'ceramic', alt: 'Ceramic coating gloss protection Omaha' },
  { id: 5, src: '/20191020_110332.jpg', category: 'interior', alt: 'Detailed cabin interior cleaning Omaha' },
  { id: 6, src: '/20191020_062851.jpg', category: 'exterior', alt: 'Freshly washed vehicle exterior detail Bellevue' },
  { id: 7, src: '/20191020_165130.jpg', category: 'paint', alt: 'Surface reflection paint polishing Omaha NE' },
  { id: 8, src: '/20191020_165218.jpg', category: 'exterior', alt: 'Showroom finish auto detailing near me' },
  { id: 9, src: '/20191020_165146.jpg', category: 'paint', alt: 'Detailing focus paint restoration Bellevue' },
  { id: 10, src: '/20191020_122005.jpg', category: 'interior', alt: 'Spotless seats upholstery cleaning Omaha' },
  { id: 11, src: '/20191020_062857.jpg', category: 'exterior', alt: 'Vehicle cleanup mobile detailing Omaha' },
  { id: 12, src: '/20191020_165125.jpg', category: 'paint', alt: 'Correction in progress car paint repair' },
  { id: 13, src: '/20191020_165133.jpg', category: 'exterior', alt: 'Detailing step professional car wash Bellevue' },
  { id: 14, src: '/20191020_165137.jpg', category: 'paint', alt: 'Mirror reflection paint correction Omaha' },
  { id: 15, src: '/20191020_165149.jpg', category: 'exterior', alt: 'Final wipe down showroom shine Bellevue' },
  { id: 16, src: '/FB_IMG_1571796997570.jpg', category: 'exterior', alt: 'Exterior detailing result hand wash Omaha' },
  { id: 17, src: '/FB_IMG_1571796999524.jpg', category: 'paint', alt: 'Paint reflection after correction auto detail' },
  { id: 18, src: '/IMG_20210907_193919.jpg', category: 'interior', alt: 'Vehicle interior detailing vacuuming seats' },
  { id: 19, src: '/IMG_20210907_193940.jpg', category: 'interior', alt: 'Cleaned dashboard and seats deep interior detail' },
  { id: 20, src: '/20200419_013025-COLLAGE~2.jpg', category: 'exterior', alt: 'Auto detailing compilation Bellevue NE' },
  { id: 21, src: '/20211009_021727-COLLAGE.jpg', category: 'interior', alt: 'Before and after interior cleaning detailer Omaha' },
  { id: 22, src: '/20211009_025807-COLLAGE.jpg', category: 'exterior', alt: 'Before and after exterior detail transformation' },
  { id: 23, src: '/20211009_025807-COLLAGE~3.jpg', category: 'paint', alt: 'Paint restoration results scratch removal Bellevue' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Work' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'paint', label: 'Paint Correction' },
  { id: 'ceramic', label: 'Ceramic Coating' },
];

import { Helmet } from 'react-helmet-async';

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const filteredImages = filter === 'all' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === filter);

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <Helmet>
        <title>Portfolio & Auto Detailing Gallery | Bryan's Detailing Omaha & Bellevue</title>
        <meta name="description" content="View our portfolio of premium auto detailing, paint correction, interior restorations, and ceramic coating projects completed in Bellevue and Omaha." />
        <link rel="canonical" href="https://bryansdetailing.com/gallery" />
      </Helmet>
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
