import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle2, ArrowRight, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { analyzeVehicleImage } from '../services/geminiService';
import { RecommendationResult } from '../types';
import { BOOKING_LINK } from '../lib/constants';

const AIConditionEstimator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCondition, setManualCondition] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
      setManualCondition(null);
    }
  };

  const [activeObjection, setActiveObjection] = useState<string | null>(null);

  const handleObjection = (objection: string) => {
    setActiveObjection(objection);
  };

  const OBJECTIONS = [
    { id: 'price', q: "Why is this price higher?", a: "Pro-grade results require pro-grade chemicals and extensive labor hours. We don't just 'wash' cars; we restore them to a factory-fresh state using safe, pH-balanced techniques." },
    { id: 'paint', q: "Do I need paint correction?", a: "If your paint looks dull or has swirl marks in direct sunlight, correction is the only way to remove those defects permanently. Wax only hides them temporarily." },
    { id: 'worse', q: "What if my car is worse than selected?", a: "No problem. I'll do a quick 2-minute walkthrough before starting to confirm the scope. If it needs more work, we'll discuss the adjustment before a single tool touches the car." }
  ];

  const handleAnalyze = async () => {
    if (!preview) return;

    setIsAnalyzing(true);
    setError(null);
    setActiveObjection(null);

    try {
      const assessment = await analyzeVehicleImage(preview);
      setResult(assessment);
    } catch (err: any) {
      console.error(err);
      if (err.message === 'QUOTA_EXHAUSTED') {
        setError('Your Gemini API credits are currently depleted. Please visit AI Studio to manage your project billing, or use the manual assessment below to get your estimate immediately.');
      } else {
        setError('We hit a speed bump analyzing that photo. Try a clearer shot in better lighting, or use the manual assessment below.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-zinc-100 max-w-5xl mx-auto overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] italic shadow-xl">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          <span>Gemini Pro Vision 2.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter leading-none italic">
              AI Surface <span className="text-zinc-400">Scan.</span>
            </h3>
            <p className="text-zinc-500 leading-relaxed font-medium">
              Stop guessing. Upload a photo of your vehicle's biggest concern. My AI visual system identifies the damage and builds your custom restoration path in seconds.
            </p>
          </div>

          <div className="space-y-6">
            {!preview ? (
              <div className="space-y-8">
                <label className="flex flex-col items-center justify-center aspect-[5/4] rounded-[2.5rem] border-4 border-dashed border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-900 transition-all cursor-pointer group shadow-inner">
                  <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform mb-6">
                    <Camera className="h-10 w-10 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                  </div>
                  <span className="text-lg font-black text-zinc-900 italic">Capture Transformation</span>
                  <span className="text-xs text-zinc-400 mt-2 font-medium">Drop image or tap to browse</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>

                <div className="pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-grow bg-zinc-100" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 whitespace-nowrap">Manual Selection</p>
                    <div className="h-px flex-grow bg-zinc-100" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'Light', label: 'Light', color: 'bg-emerald-500', desc: 'Maintained' },
                      { id: 'Moderate', label: 'Moderate', color: 'bg-amber-500', desc: 'Typical Use' },
                      { id: 'Severe', label: 'Severe', color: 'bg-red-500', desc: 'Neglected' }
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setManualCondition(c.id);
                          setError(null);
                          setResult({
                            condition: c.id as any,
                            service: {
                              name: c.id === 'Severe' ? 'Showroom Restore Detail' : 'Advanced Reset Detail',
                              priceRange: c.id === 'Severe' ? { min: 449, max: 599 } : { min: 349, max: 449 }
                            },
                            visibleIssues: [
                              `Surface exhibits ${c.desc.toLowerCase()} levels of oxidation and contamination.`
                            ],
                            upsellOptions: c.id === 'Severe' ? ['Ceramic Coating', 'Headlight Restoration'] : ['Clay Bar Treatment']
                          });
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 ${
                          manualCondition === c.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl translate-y-[-4px]' : 'border-zinc-50 bg-zinc-50/50 text-zinc-400 hover:border-zinc-100'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg ${c.color} opacity-20`} />
                        <p className="text-[10px] font-black uppercase tracking-widest">{c.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-[5/4] rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white ring-1 ring-zinc-100">
                  <img src={preview} alt="Vehicle condition preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => { setFile(null); setPreview(null); setResult(null); setManualCondition(null); setError(null); }}
                    className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black transition-all hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-[2rem] bg-red-50 border border-red-100 flex gap-4 items-start"
                  >
                    <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-red-900 italic mb-1">Analysis Failed</p>
                      <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
                      <div className="mt-4 flex gap-3">
                         <div className="h-0.5 flex-grow bg-red-100/50 mt-2" />
                         <span className="text-[8px] font-black uppercase text-red-300">Fast Path Alternative</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {!result && (
                  <Button 
                    className="w-full h-20 text-xl font-black gap-3 italic shadow-2xl shadow-zinc-200" 
                    disabled={isAnalyzing}
                    onClick={handleAnalyze}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        Scanning Surface...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="h-7 w-7 text-emerald-400" />
                        {error ? 'Try Again' : 'Run AI Assessment'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center space-y-6 p-12 bg-zinc-50 rounded-[3rem] border-2 border-zinc-50 min-h-[560px]"
              >
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-zinc-100">
                  <Sparkles className="h-12 w-12 text-zinc-100" />
                </div>
                <div className="space-y-2">
                    <h4 className="font-black text-zinc-400 italic text-xl">System Standby</h4>
                    <p className="text-zinc-400 text-sm max-w-[240px] font-medium leading-relaxed">Detailed restoration path will generate here after visual input.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] -mr-16 -mt-16 pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
                  <div className="flex items-center gap-3 text-emerald-400 mb-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Vehicle Condition: {result.condition}</span>
                  </div>
                  <h4 className="text-3xl font-black italic tracking-tighter mb-4 leading-none">{result.service.name}</h4>
                  <div className="space-y-2 mb-4">
                    {result.visibleIssues?.map((issue, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs text-zinc-400 font-medium leading-relaxed italic">
                        <span className="text-emerald-400 shrink-0 select-none">•</span>
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-full">
                      Est. ${result.service.priceRange?.min} - ${result.service.priceRange?.max}
                    </span>
                  </div>
                </div>

                {/* Upsell Recommendations */}
                {result.upsellOptions && result.upsellOptions.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Restoration Booster Pack</p>
                    <div className="grid grid-cols-1 gap-2">
                      {result.upsellOptions.map((option, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between group hover:border-zinc-300 transition-all">
                          <div className="flex items-center gap-3">
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-bold text-zinc-900 italic tracking-tight">{option}</span>
                          </div>
                          <CheckCircle2 className="h-4 w-4 text-zinc-200 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Objection Handling Assistant */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">AI Sales Assistant</p>
                  <div className="flex flex-wrap gap-2">
                    {OBJECTIONS.map(obj => (
                        <button
                          key={obj.id}
                          onClick={() => handleObjection(obj.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                            activeObjection === obj.id 
                            ? 'bg-zinc-900 border-zinc-900 text-white' 
                            : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200'
                          }`}
                        >
                          {obj.q}
                        </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {activeObjection && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl overflow-hidden"
                        >
                            <p className="text-sm text-emerald-900 font-medium leading-relaxed">
                                {OBJECTIONS.find(o => o.id === activeObjection)?.a}
                            </p>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Condition-Based High Ticket Push */}
                {result.condition === 'Severe' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-3xl bg-emerald-500 text-zinc-950 flex flex-col gap-4 shadow-xl shadow-emerald-500/20"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Premium Upgrade Peak</span>
                        </div>
                        <h5 className="text-xl font-black italic tracking-tighter leading-none">Want long-term protection instead of temporary results?</h5>
                        <p className="text-xs font-semibold opacity-80 leading-relaxed">I highly recommend a Ceramic Coating for this level of damage to prevent recurrence and lock in that deep gloss forever.</p>
                        <Button variant="secondary" asChild className="h-12 font-black bg-zinc-950 text-white w-fit">
                            <Link to="/services/ceramic-coatings">Explore Coatings</Link>
                        </Button>
                    </motion.div>
                )}

                <div className="pt-6">
                  <Button className="w-full h-16 text-xl font-black italic gap-3 shadow-2xl shadow-zinc-200" asChild>
                    <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                        Reserve & Lock-In Price
                        <ArrowRight className="h-6 w-6" />
                    </a>
                  </Button>
                  <p className="text-[10px] text-center text-zinc-400 mt-4 font-black uppercase tracking-[0.2em]">Limited Slots Available This Week</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIConditionEstimator;
