
import React from 'react';
import { Shield, ArrowRight, CheckCircle, Clock, FileText, Lock, Activity, Users, Database, Hexagon, X, Star, Zap, TrendingUp, Search, Brain, ZapOff, Ghost } from 'lucide-react';

interface LandingPageProps {
  onCandidateEnter: () => void;
  onRecruiterEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCandidateEnter, onRecruiterEnter }) => {
  return (
    <div className="flex flex-col animate-in fade-in duration-700 bg-white selection:bg-emerald-100">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center z-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">The High-Stakes Interview Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-8 max-w-5xl animate-in slide-in-from-bottom-6 duration-1000">
                Don't Hire Resumes.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Hire Verified Potential.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl leading-relaxed font-medium mb-12 animate-in slide-in-from-bottom-8 duration-1000">
                85% of employers are shifting to skills-based hiring. Veritas replaces static PDFs with <span className="text-slate-900 font-bold underline decoration-emerald-300 decoration-4 underline-offset-4">verified conversational assessments</span> that reveal soft skills, leadership, and technical depth instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-in slide-in-from-bottom-10 duration-1000">
                <button 
                    onClick={onRecruiterEnter}
                    className="flex-1 px-8 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-base hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 group"
                >
                    Start Hiring <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={onCandidateEnter}
                    className="flex-1 px-8 py-5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    Verify My Profile
                </button>
            </div>
        </div>
      </section>

      {/* MARKET STATS BAR */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                  <div className="text-4xl font-black text-slate-900 mb-2">5x</div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">More Predictive of Success</p>
                  <p className="text-xs text-slate-400 mt-1">vs. traditional credential hiring</p>
              </div>
              <div>
                  <div className="text-4xl font-black text-slate-900 mb-2">30-50%</div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Reduction in Time-to-Fill</p>
                  <p className="text-xs text-slate-400 mt-1">by removing manual screening</p>
              </div>
              <div>
                  <div className="text-4xl font-black text-slate-900 mb-2">+24%</div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Diversity Improvement</p>
                  <p className="text-xs text-slate-400 mt-1">in underrepresented roles</p>
              </div>
          </div>
      </section>

      {/* RECRUITER PAIN POINT: "Synthetic Applications" */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                    <div className="inline-block p-3 bg-red-100 text-red-600 rounded-2xl mb-6">
                        <Activity size={32} />
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">The "Synthetic Application" Crisis</h2>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                        Generative AI allows candidates to spam thousands of applications with tailored, fake resumes. Indeed and LinkedIn are flooded with noise.
                    </p>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        Recruiters face a "Data Void"—they have too many applicants but zero visibility into <span className="font-bold text-slate-900">soft skills, cultural fit, or leadership potential</span> until the interview.
                    </p>
                    <div className="flex gap-4">
                        <div className="pl-4 border-l-4 border-red-200">
                            <div className="font-bold text-slate-900">The Black Hole</div>
                            <div className="text-sm text-slate-500">75% of applicants never hear back.</div>
                        </div>
                        <div className="pl-4 border-l-4 border-red-200">
                            <div className="font-bold text-slate-900">Bot Spam</div>
                            <div className="text-sm text-slate-500">Keyword matching is dead.</div>
                        </div>
                    </div>
                </div>
                
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-amber-100 rounded-[3rem] transform rotate-3 scale-95 opacity-50"></div>
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl opacity-50">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                                        <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                    </div>
                                    <X className="text-red-400" />
                                </div>
                            ))}
                            <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center">
                                <p className="text-red-600 font-bold text-sm">⚠️ Keyword Stuffing Detected</p>
                                <p className="text-xs text-red-400 mt-1">Resume reliability: Low</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CANDIDATE PROMISE: "No More Ghosting" */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">The Candidate Promise</h2>
                  <p className="text-lg text-slate-600">
                      We hate "The Black Hole" as much as you do. Veritas is designed to give you power, feedback, and closure instantly.
                  </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                          <Zap size={24} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Instant Feedback Loop</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          Never wait weeks for a rejection. Our AI provides a detailed performance breakdown and coaching tips within 60 seconds of your interview.
                      </p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                          <Ghost size={24} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Anti-Ghosting Protocol</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          Your "Verified Match" status is pushed directly to hiring managers' active pipelines, bypassing the ATS filter entirely.
                      </p>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                          <Shield size={24} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Own Your Data</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          Your verified results are portable. Use your "Veritas Score" to apply to hundreds of other companies without re-interviewing.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* PRICING MODEL: Outcome Based */}
      <section className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                      <h2 className="text-4xl font-bold mb-6">Pay for Results,<br/>Not Seats.</h2>
                      <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                          Traditional platforms charge you to post jobs. We charge you only when you find a <strong>Verified Match</strong>.
                      </p>
                      <ul className="space-y-4 mb-8">
                          <li className="flex items-center gap-3">
                              <CheckCircle className="text-emerald-400" size={20} />
                              <span>Free Job Postings (Unlimited)</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <CheckCircle className="text-emerald-400" size={20} />
                              <span>Free AI Initial Screening</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <CheckCircle className="text-emerald-400" size={20} />
                              <span>Pay $10 per Verified Qualified Candidate</span>
                          </li>
                      </ul>
                      <button 
                        onClick={onRecruiterEnter}
                        className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all"
                      >
                          Start Hiring Risk-Free
                      </button>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                          <div>
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Enterprise Plan</p>
                              <p className="text-3xl font-bold mt-2">Outcome Model</p>
                          </div>
                          <div className="text-right">
                              <p className="text-3xl font-bold text-emerald-400">$0</p>
                              <p className="text-sm text-slate-400">upfront cost</p>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-300">Candidates Screened</span>
                              <span className="font-mono">1,400</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-300">AI Interviews Conducted</span>
                              <span className="font-mono">850</span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-bold text-white pt-4 border-t border-white/10">
                              <span>Verified Matches Found</span>
                              <span className="text-emerald-400">12</span>
                          </div>
                          <div className="mt-6 p-4 bg-emerald-500/20 rounded-xl text-center border border-emerald-500/30">
                              <p className="text-sm font-bold text-emerald-300">Total Cost: $120</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-100 bg-white text-center">
         <div className="flex items-center justify-center gap-2 mb-6">
            <Hexagon size={24} className="text-emerald-600" strokeWidth={2.5} />
            <span className="font-bold text-xl text-slate-900 tracking-tight">Veritas <span className="text-emerald-600">AI</span></span>
         </div>
         <p className="text-xs text-slate-400 font-medium">
            © 2026 Veritas AI Inc. Built for the Post-Resume Economy.
         </p>
      </footer>

    </div>
  );
};

export default LandingPage;
