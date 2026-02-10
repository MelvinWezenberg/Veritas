import React, { useState } from 'react';
import { Shield, Zap, TrendingUp, Users, ArrowRight, FileX, CheckCircle, Clock, Sparkles, BrainCircuit, Lock, BarChart3, Calculator, Scale } from 'lucide-react';

interface LandingPageProps {
  onCandidateEnter: () => void;
  onRecruiterEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCandidateEnter, onRecruiterEnter }) => {
  const [roiInputs, setRoiInputs] = useState({
    timeToHireManual: 25, // hours
    hourlyRate: 85, // $
    hiresPerYear: 12,
    baseSalary: 120000
  });

  // ROI Formula: ((T_manual - T_ai) * R + (C_mishire * P_reduction)) / C_platform
  // T_ai = 0.5 hours (Reviewing shortlist)
  // C_mishire = 15x base salary (2026 Spec)
  // P_reduction = 40% conservative
  const calculateROI = () => {
    const timeSavings = (roiInputs.timeToHireManual - 0.5) * roiInputs.hourlyRate * roiInputs.hiresPerYear;
    const misHireCost = roiInputs.baseSalary * 15; 
    const riskMitigation = misHireCost * 0.40; // 40% reduction in bad hires
    const totalValue = timeSavings + riskMitigation;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue);
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-1000">
      
      {/* DECISION INTELLIGENCE HERO */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
              <Sparkles size={12} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Decision Intelligence Engine v6.0</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05]">
              The Resume is a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Liability.</span>
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
              Stop hiring based on static PDFs. Start hiring based on <span className="text-white font-bold">verified neural probes</span> and Explainable AI. Vera delivers a "Shortlist of One."
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onRecruiterEnter}
                className="px-8 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
              >
                Deploy AI Recruiters <ArrowRight size={16} />
              </button>
              <button 
                onClick={onCandidateEnter}
                className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                One-Click Verification
              </button>
            </div>
          </div>

          {/* SKILL HEATMAP VISUALIZATION */}
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="glass p-8 rounded-[40px] border border-white/10 relative shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-bold">Role: Senior API Architect</h3>
                    <p className="text-xs text-zinc-500 font-mono">CANDIDATE_ID: 8821X // LIVE SCAN</p>
                 </div>
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
               </div>

               <div className="space-y-4">
                  {/* Skill Rows */}
                  {[
                    { skill: "Distributed Locking", score: 98, color: "bg-green-500" },
                    { skill: "GraphQL Federation", score: 92, color: "bg-green-500" },
                    { skill: "System Design", score: 88, color: "bg-blue-500" },
                    { skill: "Kubernetes Operators", score: 45, color: "bg-red-500" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                          <span>{item.skill}</span>
                          <span className="text-white">{item.score}%ile</span>
                       </div>
                       <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                            style={{ width: `${item.score}%` }}
                          ></div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <BrainCircuit size={20} className="text-purple-500" />
                     <span className="text-xs font-bold text-zinc-300">Neural Verification Complete</span>
                  </div>
                  <div className="text-xl font-black text-white tracking-tighter">HIRE</div>
               </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-black border border-zinc-800 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
               <div className="w-10 h-10 bg-yellow-500/20 text-yellow-500 rounded-lg flex items-center justify-center">
                  <Shield size={20} />
               </div>
               <div>
                  <div className="text-[10px] text-zinc-500 font-black uppercase">Fraud Check</div>
                  <div className="text-xs font-bold text-white">100% Verified Identity</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANTI-BIAS AUDIT SECTION */}
      <section className="py-24 bg-zinc-900/30 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                     <Scale size={16} className="text-purple-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Compliance & Ethics</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-6">Automated Algorithmic Audits</h2>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                     Vera AI performs continuous self-audits to ensure fairness. Unlike human recruiters, our neural models are mathematically proven to ignore demographics, focusing purely on <span className="text-white">competency signals</span>.
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-sm font-bold text-zinc-300">EEOC 2026 Compliance Reports</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-sm font-bold text-zinc-300">Demographic-Blind Audio Processing</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-sm font-bold text-zinc-300">Explainable Decision Logs</span>
                     </li>
                  </ul>
               </div>
               <div className="p-8 glass rounded-[32px] border border-white/10">
                  <div className="flex justify-between items-center mb-8">
                     <span className="text-xs font-bold text-zinc-500 uppercase">Bias Audit Log // Q3 2026</span>
                     <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/20">Passed</span>
                  </div>
                  <div className="space-y-6">
                     {[
                        { label: "Gender Parity", val: 0.99 },
                        { label: "Age Neutrality", val: 0.98 },
                        { label: "Ethnicity Blindness", val: 1.00 }
                     ].map((metric, i) => (
                        <div key={i}>
                           <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                              <span>{metric.label}</span>
                              <span>{metric.val.toFixed(2)} / 1.00</span>
                           </div>
                           <div className="h-1 bg-zinc-800 w-full rounded-full">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${metric.val * 100}%` }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2026 REVENUE ENGINEERING (ROI CALCULATOR) */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-black tracking-tighter mb-4">Revenue Engineering</h2>
               <p className="text-zinc-400">Calculate the cost of legacy hiring vs. Agentic Intelligence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 glass p-10 rounded-[48px] border border-white/10">
               {/* Inputs */}
               <div className="lg:col-span-1 space-y-8">
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Time-to-Hire (Manual Hours)</label>
                     <input 
                        type="range" min="10" max="100" 
                        value={roiInputs.timeToHireManual} 
                        onChange={(e) => setRoiInputs({...roiInputs, timeToHireManual: parseInt(e.target.value)})}
                        className="w-full accent-blue-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                     />
                     <div className="text-right text-xl font-black mt-2">{roiInputs.timeToHireManual} hrs</div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Recruiter Cost ($/hr)</label>
                     <input 
                        type="range" min="30" max="200" 
                        value={roiInputs.hourlyRate} 
                        onChange={(e) => setRoiInputs({...roiInputs, hourlyRate: parseInt(e.target.value)})}
                        className="w-full accent-blue-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                     />
                     <div className="text-right text-xl font-black mt-2">${roiInputs.hourlyRate}/hr</div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Strategic Mis-hire Cost (2026)</label>
                     <div className="text-sm text-zinc-400 mb-2">Calculated at 15x Base Salary (${(roiInputs.baseSalary/1000).toFixed(0)}k)</div>
                  </div>
               </div>

               {/* Formula Viz */}
               <div className="lg:col-span-2 flex flex-col justify-center items-center text-center relative border-l border-white/10 pl-10">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                     <Calculator size={100} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Projected Annual ROI</h3>
                  <div className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 mb-6">
                     {calculateROI()}
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 max-w-lg w-full">
                     <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-zinc-400">Recruiting Velocity Gains</span>
                        <span className="text-green-400 font-mono font-bold">+700%</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">Risk Mitigation (Bad Hires)</span>
                        <span className="text-green-400 font-mono font-bold">-$2.7M Risk</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* HYBRID AGENTIC PRICING */}
      <section className="py-20 px-6 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-black tracking-tight mb-4">Hybrid Agentic Model</h2>
               <p className="text-zinc-400">Capacity-based pricing. Deploy Agents, not seats.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               
               {/* AGENT SEAT */}
               <div className="p-10 bg-zinc-900 rounded-[40px] border border-white/10 flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-all">
                  <div className="mb-8 relative z-10">
                     <h3 className="text-xl font-bold mb-2 text-white">AI Recruiter Agent</h3>
                     <p className="text-sm text-zinc-500 mb-6">Equivalent to 1 FTE Recruiter Capacity.</p>
                     <div className="text-5xl font-black tracking-tighter mb-1">$1,500<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
                     <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Per Active Agent</p>
                  </div>
                  <ul className="space-y-4 flex-1 mb-8 relative z-10">
                     <li className="flex items-center gap-3 text-sm text-zinc-300">
                        <BrainCircuit size={16} className="text-blue-500" /> 24/7 Asynchronous Interviewing
                     </li>
                     <li className="flex items-center gap-3 text-sm text-zinc-300">
                        <BrainCircuit size={16} className="text-blue-500" /> "Shortlist of One" Generation
                     </li>
                     <li className="flex items-center gap-3 text-sm text-zinc-300">
                        <BrainCircuit size={16} className="text-blue-500" /> Automated Soft-Skill Analysis
                     </li>
                  </ul>
                  <button onClick={onRecruiterEnter} className="w-full py-4 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-bold text-xs uppercase tracking-widest shadow-lg relative z-10">
                     Deploy Agent
                  </button>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full"></div>
               </div>

               {/* SUCCESS FEE */}
               <div className="p-10 glass rounded-[40px] border border-white/10 flex flex-col relative overflow-hidden">
                  <div className="mb-8">
                     <h3 className="text-xl font-bold mb-2">Performance Fee</h3>
                     <p className="text-sm text-zinc-500 mb-6">Aligned incentives. We only win when you hire.</p>
                     <div className="text-5xl font-black tracking-tighter mb-1">5%<span className="text-lg text-zinc-500 font-normal"> of salary</span></div>
                     <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Per Successful Placement</p>
                  </div>
                  <ul className="space-y-4 flex-1 mb-8">
                     <li className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle size={16} className="text-green-500" /> 90-Day Retention Guarantee
                     </li>
                     <li className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle size={16} className="text-green-500" /> Executive Deep-Scan Verification
                     </li>
                     <li className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle size={16} className="text-green-500" /> Unlimited Candidate Pool
                     </li>
                  </ul>
                  <button onClick={onRecruiterEnter} className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold text-xs uppercase tracking-widest">
                     Contact Sales
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
         <div className="flex items-center justify-center gap-3 mb-6 opacity-50">
            <Shield size={24} />
            <span className="font-black tracking-tighter text-xl">Vera AI</span>
         </div>
         <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            © 2026 Vera AI Inc. All Rights Reserved. // Decision Intelligence Ecosystem
         </p>
      </footer>

    </div>
  );
};

export default LandingPage;
