import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ArrowLeft, Sparkles, Car, Shield, Droplets, Wind, Trash2, Zap, User, Users, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { BOOKING_LINK } from '../lib/constants';

const QUESTIONS = [
  {
    id: 'vehicle_type',
    question: "What type of vehicle do you drive?",
    options: [
      { id: 'car', label: 'Sedan / Coupe', icon: <Car className="h-5 w-5" />, score: 0 },
      { id: 'suv', label: 'SUV / Truck', icon: <Users className="h-5 w-5" />, score: 0 },
      { id: 'rv', label: 'RV / Motorhome', icon: <Shield className="h-5 w-5" />, score: 0 },
    ]
  },
  {
    id: 'parking',
    question: "Where is your vehicle primarily parked?",
    options: [
      { id: 'indoor', label: 'Indoor / Covered', icon: <Shield className="h-5 w-5" />, score: 10 },
      { id: 'driveway', label: 'Driveway', icon: <Droplets className="h-5 w-5" />, score: 5 },
      { id: 'street', label: 'Street', icon: <Wind className="h-5 w-5" />, score: 2 },
    ]
  },
  {
    id: 'wash_frequency',
    question: "How often do you wash your vehicle?",
    options: [
      { id: 'weekly', label: 'Weekly', icon: <Zap className="h-5 w-5" />, score: 10 },
      { id: 'monthly', label: 'Monthly', icon: <Droplets className="h-5 w-5" />, score: 7 },
      { id: 'rarely', label: 'Rarely', icon: <Trash2 className="h-5 w-5" />, score: 3 },
    ]
  },
  {
    id: 'paint_feel',
    question: "How does the paint feel when you touch it?",
    options: [
      { id: 'smooth', label: 'Smooth like glass', icon: <CheckCircle2 className="h-5 w-5" />, score: 10 },
      { id: 'rough', label: 'Rough or gritty', icon: <Wind className="h-5 w-5" />, score: 5 },
      { id: 'swirls', label: 'I see swirl marks', icon: <Droplets className="h-5 w-5" />, score: 4 },
    ]
  },
  {
    id: 'interior_usage',
    question: "How would you describe the interior usage?",
    options: [
      { id: 'light', label: 'Light (Just me)', icon: <User className="h-5 w-5" />, score: 10 },
      { id: 'moderate', label: 'Moderate (Family/Kids)', icon: <Users className="h-5 w-5" />, score: 6 },
      { id: 'heavy', label: 'Heavy (Pets/Work)', icon: <Trash2 className="h-5 w-5" />, score: 2 },
    ]
  }
];

export default function DetailingQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { id: string, score: number }>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (questionId: string, optionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: { id: optionId, score } }));
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsFinished(true);
    }
  };

  const totalScore = (Object.values(answers) as { score: number }[]).reduce((a, b) => a + b.score, 0);
  const maxScore = (QUESTIONS.length - 1) * 10; 
  const healthScore = Math.round((totalScore / maxScore) * 100);

  const getRecommendation = () => {
    const isRV = answers['vehicle_type']?.id === 'rv';
    
    const isHighTicketCandidate = answers['paint_feel']?.id === 'swirls' || answers['paint_feel']?.id === 'rough';
    
    if (isRV) {
      return {
        title: "RV Specialist Care",
        desc: "RV surfaces require specialized decontamination and protection to prevent oxidation. We recommend our 'RV Exterior Wash & Ceramic' to preserve your investment.",
        package: "RV Exterior Wash & Ceramic",
        id: "rv-wash-protect",
        highTicket: true
      };
    }

    if (isHighTicketCandidate) {
      return {
        title: "Paint Correction Needed",
        desc: "Since you've detected surface defects (swirls/grittiness), a standard wash won't fix it. You need Paint Correction + Ceramic Coating to permanently restore that glass-like finish.",
        package: "Ceramic Coating + Paint Correction",
        id: "ceramic-coating",
        highTicket: true
      };
    }

    if (healthScore > 80) return {
      title: "Maintenance Pro",
      desc: "Your vehicle is in great shape! Let's keep it that way. A professional decontamination wash and sealant will lock in this condition.",
      package: "Maintenance Detail",
      id: "maintenance-detail",
      highTicket: false
    };
    if (healthScore > 50) return {
      title: "Needs a Refresh",
      desc: "Your vehicle is showing some wear. Our 'Showroom Full Detail' will bring back that showroom shine and remove light contaminants.",
      package: "Showroom Full Detail",
      id: "showroom-full",
      highTicket: false
    };
    return {
      title: "Restoration Candidate",
      desc: "Your vehicle needs some serious love. We recommend our 'Showroom Full Detail' with a Paint Correction add-on for the best results.",
      package: "Showroom Full Detail",
      id: "showroom-full",
      highTicket: false
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-[3rem] shadow-xl border border-zinc-100 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Restoration AI Quiz</span>
                </div>
                <div className="h-1 flex-grow mx-8 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-zinc-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>
              </div>

              <h2 className="text-3xl font-black text-zinc-900 mb-10 italic tracking-tight">{QUESTIONS[step].question}</h2>

              <div className="grid gap-3">
                {QUESTIONS[step].options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(QUESTIONS[step].id, opt.id, opt.score)}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        {opt.icon}
                      </div>
                      <span className="font-bold text-zinc-900">{opt.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-zinc-900" />
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="mt-8 flex items-center text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors py-3 pr-4 -ml-3 pl-3 rounded-xl hover:bg-zinc-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" stroke="#f4f4f5" strokeWidth="8" 
                  />
                  <motion.circle 
                    cx="50" cy="50" r="45" 
                    fill="none" stroke={healthScore > 70 ? "#10b981" : healthScore > 40 ? "#f59e0b" : "#ef4444"} 
                    strokeWidth="8" 
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * healthScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-zinc-900">{healthScore}%</span>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Health</span>
                </div>
              </div>

              <h2 className="text-3xl font-black text-zinc-900 mb-2">{recommendation.title}</h2>
              <p className="text-zinc-600 mb-8 max-w-sm mx-auto leading-relaxed">
                {recommendation.desc}
              </p>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Recommended Package</p>
                <p className="text-xl font-black text-zinc-900">{recommendation.package}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-emerald-100" asChild>
                  <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">Book This Package Now</a>
                </Button>
                <Button variant="outline" className="w-full h-12 text-zinc-500" onClick={() => {
                  setStep(0);
                  setAnswers({});
                  setIsFinished(false);
                }}>
                  Retake Quiz
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isFinished && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 text-white border border-zinc-800 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6">
            <Sparkles className="h-24 w-24 text-emerald-500/10" />
          </div>
          
          <div className="relative z-10 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-3xl font-black italic">Wait! We can get even more precise.</h3>
              <p className="text-zinc-400 max-w-md mx-auto md:mx-0">
                Our AI Vision system can analyze your vehicle's specific surface condition from a photo for a technical assessment.
              </p>
            </div>
            
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200 h-14 px-8 text-lg font-bold gap-2" asChild>
              <Link to="/quote">
                <Camera className="h-5 w-5" />
                Upload Photo for AI Review
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
