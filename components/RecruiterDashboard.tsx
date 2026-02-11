
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { ShieldCheck, EyeOff, Settings2, BrainCircuit, Mail, CheckCircle, Activity, AlertCircle, Coins, Lock, Search } from 'lucide-react';
import { Candidate, InterviewResult } from '../types';

interface RecruiterDashboardProps {
  candidates: (Candidate & { results?: InterviewResult })[];
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ candidates }) => {
  const [activeTab, setActiveTab] = useState<'SETUP' | 'PIPELINE'>('PIPELINE'); 
  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(candidates[0] || null);
  const [blindMode, setBlindMode] = useState(false);

  const getRadarData = (c: typeof candidates[0]) => {
      const scores = c.results?.responses[0]?.scores;
      return [
          { subject: 'Tech Depth', A: scores?.technicalAccuracy || 0, fullMark: 100 },
          { subject: 'Structure', A: scores?.structuralIntegrity || 0, fullMark: 100 },
          { subject: 'Assertiveness', A: scores?.assertivenessIndex || 0, fullMark: 100 },
          { subject: 'Signal/Noise', A: scores?.signalToNoiseRatio || 0, fullMark: 100 },
          { subject: 'Seniority', A: scores?.seniorityAlignment || 0, fullMark: 100 },
      ];
  };

  const getDisplayData = (candidate: typeof candidates[0]) => {
    let displayCandidate = { ...candidate };
    if (blindMode) {
        displayCandidate = {
            ...displayCandidate,
            name: `Candidate-${candidate.id.slice(0,4)}`,
            email: 'redacted@veritas.ai',
        };
    }
    return displayCandidate;
  };

  if (activeTab === 'PIPELINE') {
      return (
        <div className="flex flex-col h-full animate-in fade-in duration-1000 bg-slate-50">
            {/* TOP BAR: Financial & Calibration */}
            <div className="px-8 py-4 bg-slate-900 text-white flex justify-between items-center shadow-md sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900">V</div>
                        <span className="font-bold tracking-tight">Recruiter Console</span>
                    </div>
                    <div className="h-6 w-px bg-white/20"></div>
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <Coins size={14} />
                        <span>VERIFICATION CREDITS: 12</span>
                        <span className="text-slate-500 ml-1">(Pay-Per-Qualified-Match Active)</span>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <button onClick={() => setBlindMode(!blindMode)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${blindMode ? 'bg-amber-500 text-slate-900 border-amber-500' : 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500'}`}>
                        <EyeOff size={14} /> {blindMode ? 'Bias Blocking: ON' : 'Bias Blocking: OFF'}
                    </button>
                    <button onClick={() => setActiveTab('SETUP')} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200">
                        <Settings2 size={14} /> Calibration
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* LIST: High Volume Filter */}
                <div className="w-[380px] bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input type="text" placeholder="Filter by Verified Skill..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                    </div>
                    {candidates.map(c => {
                        const display = getDisplayData(c);
                        const isSelected = selectedCandidate?.id === c.id;
                        return (
                            <div 
                                key={c.id} 
                                onClick={() => setSelectedCandidate(c)}
                                className={`p-6 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'bg-emerald-50/50 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-bold text-sm ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}>{display.name}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c.results?.aiRecommendation === 'HIRE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                        {c.results?.aiRecommendation}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">{display.seniorityLevel} • {c.experienceYears}y Exp</p>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1 text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-medium">
                                        <Activity size={10} className="text-emerald-500" /> {c.results?.overallScore}% Fit
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* DETAIL: Deep Dive */}
                {selectedCandidate ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-8">
                        <div className="max-w-5xl mx-auto space-y-6">
                            
                            {/* HEADER CARD */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-slate-900">{getDisplayData(selectedCandidate).name}</h1>
                                        {selectedCandidate.results?.aiRecommendation === 'HIRE' && (
                                            <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                <ShieldCheck size={14} /> Verified Match
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                        <span className="flex items-center gap-1"><Mail size={14}/> {getDisplayData(selectedCandidate).email}</span>
                                        <span>•</span>
                                        <span>{selectedCandidate.provider} IDV Passed</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 shadow-lg shadow-emerald-600/20">
                                            Unlock Contact Info (1 Credit)
                                        </button>
                                        <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50">
                                            Request Async Follow-up
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-5xl font-black text-emerald-600 tracking-tighter mb-1">{selectedCandidate.results?.overallScore}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Veritas Score</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* RADAR CHART */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Activity className="text-purple-500" size={20} />
                                            <h3 className="font-bold text-slate-900">Psychometric Profile</h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">vs. Role Baseline</span>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData(selectedCandidate)}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                                <Radar name="Candidate" dataKey="A" stroke="#059669" strokeWidth={3} fill="#10b981" fillOpacity={0.2} />
                                                <Tooltip />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* AI EXECUTIVE SUMMARY */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col">
                                    <div className="flex items-center gap-2 mb-6">
                                        <BrainCircuit className="text-blue-500" size={20} />
                                        <h3 className="font-bold text-slate-900">Executive Summary</h3>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                        <p className="text-slate-700 leading-relaxed text-sm font-medium italic">
                                            "{selectedCandidate.results?.aiDecisionReason}"
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-6 flex-1">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Assertiveness Index</span>
                                                <span className="text-xs font-bold text-emerald-600">{selectedCandidate.results?.responses[0]?.scores?.assertivenessIndex}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedCandidate.results?.responses[0]?.scores?.assertivenessIndex}%` }}></div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">Direct statements vs. hedging (e.g. "I think", "maybe").</p>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Signal-to-Noise</span>
                                                <span className="text-xs font-bold text-emerald-600">{selectedCandidate.results?.responses[0]?.scores?.signalToNoiseRatio}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedCandidate.results?.responses[0]?.scores?.signalToNoiseRatio}%` }}></div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">Data density vs. corporate fluff.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LINGUISTIC FORENSICS */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-amber-500" /> Linguistic Forensics
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detected Hedging Phrases</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {["possibly", "I believe", "sort of", "usually"].map((word, i) => (
                                                <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium rounded-lg">
                                                    "{word}"
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Key Impact Metrics Extracted</h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-sm text-slate-700">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span>Reduced write latency by <strong>15%</strong></span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-slate-700">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span>Implemented <strong>Paxos</strong> consensus</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                        <Lock size={48} className="mb-4 opacity-20" />
                        <p className="font-medium">Select a Verified Candidate to unlock details</p>
                    </div>
                )}
            </div>
        </div>
      );
  }

  return (
      <div className="p-12 text-center">
          <h2 className="text-2xl font-bold">Calibration Mode</h2>
          <button onClick={() => setActiveTab('PIPELINE')} className="mt-4 text-emerald-600 underline">Back to Pipeline</button>
      </div>
  );
};

export default RecruiterDashboard;
