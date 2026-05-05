import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const DEFAULT_FAQS = [
  {
    question: 'How long does detailing take?',
    answer: 'The time required depends on the service package and the condition of your vehicle. An Essential Interior Detail typically takes 1.5 - 2.5 hours, while a Signature Full Detail can take 4 - 6 hours. Paint Correction and Ceramic Coating services may require your vehicle for 1 to 3 days to ensure proper curing and perfection.',
    order: 1
  },
  {
    question: 'What is your rain or weather policy?',
    answer: 'For mobile detailing, your appointment is weather-dependent. If rain, snow, or extreme temperatures are forecasted, we will contact you at least 24 hours in advance to reschedule. If you have a garage or covered area, we can often still perform interior services or minor exterior work.',
    order: 2
  },
  {
    question: 'Do I need to provide water or electricity for mobile services?',
    answer: 'We are fully self-contained! We bring our own professional-grade spot-free water and silent power generators. As long as we have enough space to park our van near your vehicle, we don\'t need to plug into your home.',
    order: 3
  }
];

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  order: number;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const q = query(collection(db, 'faqs'), orderBy('order'));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            setFaqs(DEFAULT_FAQS);
        } else {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FaqItem[];
            setFaqs(data);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
     return (
        <div className="min-h-screen bg-zinc-50 py-16 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16 space-y-4">
          <div className="mx-auto w-16 h-16 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center mb-6">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Frequently Asked Questions</h1>
          <p className="text-lg text-zinc-600">
            Everything you need to know about our services, processes, and policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-zinc-900 pr-8">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-zinc-600 leading-relaxed border-t border-zinc-100 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-zinc-900 text-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-zinc-400 mb-6">We're here to help. Contact us directly for personalized advice about your vehicle.</p>
          <div className="flex justify-center gap-4">
            <a href="tel:712-305-6313" className="px-6 py-3 bg-white text-zinc-900 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
              Call Us
            </a>
            <a href="mailto:bryansmobiledetailing@gmail.com" className="px-6 py-3 border border-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
