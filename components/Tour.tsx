import React, { useState } from 'react';
import { Shield, BrainCircuit, Users, EyeOff, Sparkles, ArrowRight, X, Briefcase } from 'lucide-react';

interface TourProps {
  onComplete: () => void;
}

const TOUR_STEPS = [
  {
    title: "Vera AI Ecosystem",
    description: "Welcome to a world where resumes are obsolete. Vera AI replaces static PDFs with verified, real-time technical interactions.",
    icon: <Briefcase className="text-blue-500" size={32} />,
    color: "from-blue-600/20 to-transparent"
  },
  {
    title: "Instant Neural Probes",
    description: "See a job you like? Launch an instant technical probe. We verify your depth on-demand, bypassing the application wait-time.",
    icon: <BrainCircuit className="text-purple-500" size={32} />,
    color: "from-purple-600/20 to-transparent"
  },
  {
    title: "Verified Career Graph",
    description: "Your Vera profile is built on successful assessments, identity verification, and professional graphs, creating a high-trust resume-killer.",
    icon: <Shield className="text-green-500" size={32} />,
    color: "from-green-600/20 to-transparent"
  },
  {
    title: "Direct Engagement",
    description: "Verified results are transmitted instantly to hiring leads, moving you from 'Applied' to 'Interviewing' in seconds.",
    icon: <Sparkles className="text-yellow-500" size={32} />,
    color: "from-yellow-600/20 to-transparent"
  }
];

const Tour: React.FC<TourProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl px-6">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[48px] border border-white/10 bg-[#0A0A0A] shadow-2xl">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 flex h-1.5 w-full gap-1 p-1.5">
          {TOUR_STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-full flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-white' : 'bg-white/10'}`} 
            />
          ))}
        </div>

        <button 
          onClick={onComplete}
          className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className={`p-12 pt-20 bg-gradient-to-b ${TOUR_STEPS[step].color} transition-colors duration-700`}>
          <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/5 border border-white/10 shadow-inner animate-in zoom-in duration-500">
            {TOUR_STEPS[step].icon}
          </div>
          
          <h2 className="mb-6 text-4xl font-black tracking-tighter text-white animate-in slide-in-from-bottom-2 duration-500 uppercase">
            {TOUR_STEPS[step].title}
          </h2>
          <p className="text-xl leading-relaxed text-zinc-400 animate-in slide-in-from-bottom-4 duration-700">
            {TOUR_STEPS[step].description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 p-10 bg-black/40">
          <button 
            onClick={onComplete}
            className="text-xs font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            Skip Ecosystem Tour
          </button>
          
          <button 
            onClick={next}
            className="flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-xs font-black text-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
          >
            {step === TOUR_STEPS.length - 1 ? "Start Journey" : "Next Phase"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tour;
