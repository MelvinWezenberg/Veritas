
import React from 'react';
import { Shield, ArrowRight, CheckCircle, Clock, FileText, Lock, Activity, Users, Database, Hexagon, X, Star } from 'lucide-react';

interface LandingPageProps {
  onCandidateEnter: () => void;
  onRecruiterEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCandidateEnter, onRecruiterEnter }) => {
  return (
    <div className="flex flex-col animate-in fade-in duration-700 bg-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center z-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-emerald-700">The Future of Hiring is Here</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6 max-w-4xl">
                Stop Hiring Resumes. <br />
                <span className="text-emerald-600">Start Hiring Potential.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed font-normal mb-10">
                Paper CVs are outdated, easily fabricated, and fail to show true ability. Veritas replaces them with verified, video-based skill assessments that reveal the real candidate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={onRecruiterEnter}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                    I'm Hiring Talent <ArrowRight size={18} />
                </button>
                <button 
                    onClick={onCandidateEnter}
                    className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    Verify My Skills
                </button>
            </div>
            
            <div className="mt-16 flex items-center gap-8 text-slate-400 grayscale opacity-60">
                <div className="font-bold text-xl">ACME Corp</div>
                <div className="font-bold text-xl">Stripe</div>
                <div className="font-bold text-xl">Linear</div>
                <div className="font-bold text-xl">Vercel</div>
            </div>
        </div>
      </section>

      {/* THE PROBLEM: Old vs New */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Why the old way is broken</h2>
                <p className="text-slate-500 max-w-xl mx-auto">
                    Traditional hiring relies on documents that can be exaggerated. Veritas relies on proof.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* The Old Way */}
                <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] -mr-10 -mt-10 z-0"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-red-600">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">The Resume</h3>
                        <ul className="space-y-4 mt-6">
                            <li className="flex items-start gap-3 text-slate-600">
                                <X size={20} className="text-red-500 shrink-0 mt-0.5" />
                                <span><strong>Easily Fabricated:</strong> 40% of resumes contain lies about skills.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <X size={20} className="text-red-500 shrink-0 mt-0.5" />
                                <span><strong>Static & Outdated:</strong> Doesn't show current ability or soft skills.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <X size={20} className="text-red-500 shrink-0 mt-0.5" />
                                <span><strong>Bias Prone:</strong> Hiring based on school names rather than talent.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* The Veritas Way */}
                <div className="p-8 bg-white rounded-3xl border-2 border-emerald-500 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-10 -mt-10 z-0"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Skill Assessment</h3>
                        <ul className="space-y-4 mt-6">
                            <li className="flex items-start gap-3 text-slate-600">
                                <div className="p-1 bg-emerald-100 rounded-full text-emerald-600 mt-0.5"><CheckCircle size={14} /></div>
                                <span><strong>Proven Competency:</strong> Candidates solve real problems on video.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <div className="p-1 bg-emerald-100 rounded-full text-emerald-600 mt-0.5"><CheckCircle size={14} /></div>
                                <span><strong>AI-Analyzed:</strong> Scoring based on technical depth and communication.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <div className="p-1 bg-emerald-100 rounded-full text-emerald-600 mt-0.5"><CheckCircle size={14} /></div>
                                <span><strong>Bias Reduced:</strong> Focus purely on the content of the answer.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="py-24 px-6 bg-white">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Success Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
                    <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
                    </div>
                    <p className="text-lg text-slate-800 font-medium mb-6">"We cut our time-to-hire by 60%. Instead of reading 500 resumes, we watched the top 10 verified skill demos."</p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">JD</div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">Jane Doe</div>
                            <div className="text-xs text-slate-500">VP Engineering, FinTech Co</div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
                    <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
                    </div>
                    <p className="text-lg text-slate-800 font-medium mb-6">"As a candidate, I loved skipping the phone screen. I proved my coding skills once and got 5 interview offers."</p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">MS</div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">Mark Smith</div>
                            <div className="text-xs text-slate-500">Senior React Developer</div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
                    <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
                    </div>
                    <p className="text-lg text-slate-800 font-medium mb-6">"The 'Ghost' detection saved us. Veritas flagged 3 fake candidates that looked perfect on paper."</p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">AL</div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">Sarah Lee</div>
                            <div className="text-xs text-slate-500">Head of Talent, CyberSec Inc</div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -mr-20 -mt-20 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-700 rounded-full -ml-10 -mb-10 opacity-50"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to modernize your hiring?</h2>
            <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
                Join 500+ companies using Veritas to hire faster, fairer, and with more accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <button 
                    onClick={onRecruiterEnter}
                    className="px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                    Get Started for Free
                </button>
            </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-100 bg-white text-center">
         <div className="flex items-center justify-center gap-2 mb-6">
            <Hexagon size={24} className="text-emerald-600" strokeWidth={2.5} />
            <span className="font-bold text-xl text-slate-900 tracking-tight">Veritas <span className="text-emerald-600">AI</span></span>
         </div>
         <div className="flex justify-center gap-8 mb-8 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Security</a>
         </div>
         <p className="text-xs text-slate-400 font-medium">
            © 2026 Veritas AI Inc. Dublin, Ireland.
         </p>
      </footer>

    </div>
  );
};

export default LandingPage;
