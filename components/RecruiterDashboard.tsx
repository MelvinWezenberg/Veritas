
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { ShieldCheck, AlertTriangle, ChevronRight, User, TrendingUp, Filter, FileText, Activity, EyeOff, Sparkles, Settings2, Save, Users, BrainCircuit, Mail, Calendar, CheckCircle, XCircle, HelpCircle, ArrowUpRight, Ear, MessageCircle, BarChart2, ArrowRight, Play } from 'lucide-react';
import { Candidate, InterviewResult } from '../types';
import { generateAssessmentCriteria } from '../services/geminiService';

interface RecruiterDashboardProps {
  candidates: (Candidate & { results?: InterviewResult })[];
}

const DEFAULT_WEIGHTS = {
  technicalAccuracy: 0.5,
  coherence: 0.25,
  authenticity: 0.15,
  seniorityAlignment: 0.1
};

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ candidates }) => {
  const [activeTab, setActiveTab] = useState<'SETUP' | 'PIPELINE'>('SETUP');
  
  const [jobDescription, setJobDescription] = useState('Senior Distributed Systems Engineer for high-frequency trading platform. Requires deep knowledge of Rust, lock-free data structures, and sub-millisecond latency optimization.');
  const [idealCandidate, setIdealCandidate] = useState('A developer with 5+ years in finance or cloud infrastructure, comfortable with low-level systems programming.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConfig, setAiConfig] = useState<{
    questions: { text: string; category: string; difficulty: string }[];
    weights: typeof DEFAULT_WEIGHTS;
    rationale: string;
  } | null>(null);

  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(candidates[0] || null);
  const [blindMode, setBlindMode] = useState(false);
  const [notifiedCandidates, setNotifiedCandidates] = useState<string[]>([]);

  const handleScheduleInterview = (id: string) => {
    if (!notifiedCandidates.includes(id)) {
      setNotifiedCandidates(prev => [...prev, id]);
    }
  };

  const handleGenerateConfig = async () => {
    if (!jobDescription || !idealCandidate) return;
    setIsGenerating(true);
    try {
      const result = await generateAssessmentCriteria(jobDescription, idealCandidate);
      const total = Object.values(result.weights).reduce((a: any, b: any) => a + b, 0) as number;
      setAiConfig({
          questions: result.questions,
          weights: {
            technicalAccuracy: (result.weights.technicalAccuracy / total),
            coherence: (result.weights.coherence / total),
            authenticity: (result.weights.authenticity / total),
            seniorityAlignment: (result.weights.seniorityAlignment / total)
          },
          rationale: result.rationale
      });
    } catch (e) {
      console.error("AI Gen Failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateScore = (result: InterviewResult | undefined) => {
    if (!result) return 0;
    const weights = aiConfig?.weights || DEFAULT_WEIGHTS;
    const scores = result.responses[0].scores;
    return Math.round(
        (scores.technicalAccuracy * weights.technicalAccuracy) +
        (scores.coherence * weights.coherence) +
        (scores.authenticity * weights.authenticity) +
        (scores.seniorityAlignment * weights.seniorityAlignment)
    );
  };

  const getDisplayData = (candidate: typeof candidates[0]) => {
    const adjustedScore = calculateScore(candidate.results);
    let displayCandidate = {
      ...candidate,
      results: candidate.results ? { ...candidate.results, overallScore: adjustedScore } : undefined
    };
    if (blindMode) {
        // Redact PII in Neutral Mode
        displayCandidate = {
            ...displayCandidate,
            name: `UUID-${candidate.id.slice(0,4).toUpperCase()}-AX`,
            email: 'redacted@veritas.ai',
        };
    }
    return displayCandidate;
  };

  // Mock function to split text into "segments" for the Evidence Timeline demo
  const getAnnotatedTranscript = (text: string) => {
      // Simple logic to mock annotation chunks
      const sentences = text.split('. ');
      return sentences.map((s, i) => {
          const confidence = i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MED' : 'LOW';
          return {
              text: s + '.',
              confidence,
              start: i * 5, // mock timestamp
          };
      });
  };

  if (activeTab === 'SETUP') {
      return (
          <div className="h-full max-w-7xl mx-auto p-12 flex flex-col gap-16 animate-in fade-in duration-1000 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Calibration Hub</h2>
                    <p className="text-slate-500 text-lg">Define the perfect candidate profile for AI matching.</p>
                  </div>
                  <button onClick={() => setActiveTab('PIPELINE')} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 text-slate-600 shadow-sm">
                     View Pipeline <ArrowUpRight size={16} />
                  </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
                          <div className="flex items-center gap-3 text-emerald-600">
                             <FileText size={24} />
                             <h3 className="text-sm font-bold uppercase tracking-widest">Source Context</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Role Architecture</label>
                                <textarea 
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm leading-relaxed focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none text-slate-700"
                                    placeholder="Paste job description..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Candidate Archetype</label>
                                <textarea 
                                    value={idealCandidate}
                                    onChange={(e) => setIdealCandidate(e.target.value)}
                                    className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm leading-relaxed focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none text-slate-700"
                                    placeholder="Describe the ideal technical profile..."
                                />
                            </div>
                            <button 
                                onClick={handleGenerateConfig}
                                disabled={isGenerating}
                                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20"
                            >
                                {isGenerating ? <Activity className="animate-spin" /> : <Sparkles size={16} />}
                                {isGenerating ? 'Synthesizing...' : 'Calibrate AI Engine'}
                            </button>
                          </div>
                      </div>
                  </div>

                  {/* Right Column: AI Results Display */}
                  <div>
                    {aiConfig ? (
                      <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
                         {/* Rationale Block */}
                         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <BrainCircuit size={14} /> Strategic Rationale
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium">
                               {aiConfig.rationale}
                            </p>
                         </div>

                         {/* Generated Questions */}
                         <div className="space-y-4">
                            <div className="flex justify-between items-end px-1">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generated Probes</h3>
                                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">CONFIDENCE: HIGH</span>
                            </div>
                            {aiConfig.questions.map((q, i) => (
                               <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 flex gap-4 hover:border-emerald-200 transition-colors shadow-sm">
                                  <div className="text-emerald-500 font-mono font-bold text-sm opacity-50">0{i+1}</div>
                                  <div className="space-y-2 w-full">
                                     <p className="text-slate-800 text-sm font-medium leading-relaxed">"{q.text}"</p>
                                     <div className="flex gap-2">
                                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-100 uppercase font-bold tracking-wider">{q.category}</span>
                                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-100 uppercase font-bold tracking-wider">{q.difficulty} Difficulty</span>
                                     </div>
                                  </div>
                               </div>
                            ))}
                         </div>
                         
                         {/* Activate Button */}
                         <button onClick={() => setActiveTab('PIPELINE')} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                            <Save size={16} /> Save & Activate Protocol
                         </button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-3xl min-h-[500px] bg-slate-50">
                         <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <Settings2 size={32} className="text-slate-300" />
                         </div>
                         <p className="font-bold uppercase tracking-widest text-xs text-slate-400">Awaiting Context Calibration</p>
                         <p className="text-[10px] text-slate-400 mt-2 max-w-xs text-center">Input role architecture to generate question sets.</p>
                      </div>
                    )}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-1000 bg-slate-50">
        {/* TOP NAV BAR */}
        <div className="px-8 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                   <h2 className="text-lg font-bold tracking-tight uppercase text-slate-900">Sourcing Hub</h2>
                </div>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center gap-6">
                    <button onClick={() => setActiveTab('SETUP')} className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-2">
                        <Settings2 size={14} /> Engine Settings
                    </button>
                </div>
            </div>
            
            <button 
                onClick={() => setBlindMode(!blindMode)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all border ${blindMode ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
            >
                <EyeOff size={14} /> {blindMode ? 'Neutral Mode Active' : 'Enable Neutral Mode'}
            </button>
        </div>

        <div className="flex flex-1 overflow-hidden p-8 gap-8">
            {/* CANDIDATE FEED SIDEBAR */}
            <div className="w-[400px] flex flex-col gap-6 h-full">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Pipeline Feed</h3>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">{candidates.length} ACTIVE</span>
                </div>
                <div className="overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3 h-full pb-32">
                    {candidates.sort((a,b) => calculateScore(b.results) - calculateScore(a.results)).map((rawCandidate) => {
                    const candidate = getDisplayData(rawCandidate);
                    const score = candidate.results?.overallScore || 0;
                    const isSelected = selectedCandidate?.id === rawCandidate.id;
                    const recommendation = candidate.results?.aiRecommendation;
                    
                    return (
                        <div 
                        key={rawCandidate.id}
                        onClick={() => setSelectedCandidate(rawCandidate)}
                        className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected ? 'bg-white border-emerald-500 shadow-md' : 'bg-white border-slate-100 hover:border-emerald-200'}`}
                        >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm tracking-tight ${blindMode ? 'font-mono text-amber-500' : 'text-slate-900'}`}>{candidate.name}</h3>
                                    <div className="text-xs text-slate-400 mt-1">{rawCandidate.experienceYears}y Exp • {rawCandidate.seniorityLevel}</div>
                                </div>
                            </div>
                            <div className={`text-lg font-mono font-bold ${score > 85 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {score}
                            </div>
                        </div>
                        </div>
                    );
                    })}
                </div>
            </div>

            {/* MAIN DETAIL VIEW */}
            <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-y-auto custom-scrollbar relative shadow-sm">
                {selectedCandidate ? (
                <div className="p-12 flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-8">
                        <div>
                            <h1 className={`text-4xl font-bold tracking-tight mb-4 ${blindMode ? 'font-mono text-amber-500' : 'text-slate-900'}`}>
                                {getDisplayData(selectedCandidate).name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide ${selectedCandidate.results?.aiRecommendation === 'HIRE' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                   Verdict: {selectedCandidate.results?.aiRecommendation}
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                    ID: {selectedCandidate.id}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                              onClick={() => handleScheduleInterview(selectedCandidate.id)}
                              className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${notifiedCandidates.includes(selectedCandidate.id) ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20'}`}
                            >
                                {notifiedCandidates.includes(selectedCandidate.id) ? 'Request Sent' : 'Request Unlock'}
                                {notifiedCandidates.includes(selectedCandidate.id) ? <CheckCircle size={14} /> : <ArrowRight size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* AI SUMMARY */}
                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-2xl relative">
                        <div className="flex items-center gap-2 text-emerald-700 mb-4">
                            <Sparkles size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Explainable AI Summary</span>
                        </div>
                        <p className="text-lg text-slate-700 leading-relaxed font-medium">
                            "{selectedCandidate.results?.aiDecisionReason}"
                        </p>
                    </div>

                    {/* EVIDENCE TIMELINE (TRANSCRIPTS) */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Activity size={16} /> Evidence Timeline
                            </h3>
                            <div className="flex gap-4 text-[10px] font-bold uppercase">
                                <span className="flex items-center gap-1 text-emerald-600"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Verified</span>
                                <span className="flex items-center gap-1 text-amber-500"><div className="w-2 h-2 bg-amber-400 rounded-full"></div> Nuanced</span>
                                <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Weak Signal</span>
                            </div>
                        </div>

                        {selectedCandidate.results?.responses.map((resp, idx) => (
                            <div key={idx} className="space-y-6">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                            Q{idx + 1}
                                        </div>
                                        <div className="text-sm font-medium text-slate-500">Distributed Systems / Redlock Algorithm</div>
                                    </div>
                                    
                                    <div className="space-y-2 leading-relaxed text-lg text-slate-800">
                                        {getAnnotatedTranscript(resp.transcript).map((segment, sIdx) => {
                                            const colorClass = segment.confidence === 'HIGH' ? 'bg-emerald-100 text-emerald-800 decoration-emerald-300' : 
                                                             segment.confidence === 'MED' ? 'bg-amber-100 text-amber-800 decoration-amber-300' : 
                                                             'bg-red-100 text-red-800 decoration-red-300';
                                            
                                            return (
                                                <span 
                                                    key={sIdx} 
                                                    className={`inline hover:bg-white transition-colors cursor-pointer py-0.5 px-1 rounded mx-0.5 underline decoration-2 underline-offset-4 ${colorClass}`}
                                                    title={`Confidence: ${segment.confidence} - Click to Seek`}
                                                >
                                                    {segment.text} 
                                                </span>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="mt-6 pt-6 border-t border-slate-200 flex items-center gap-4">
                                        <button className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-wide">
                                            <Play size={12} fill="currentColor" /> Play Evidence Clip
                                        </button>
                                        <span className="text-xs text-slate-400 font-mono">Timestamp: 04:22</span>
                                    </div>
                                </div>

                                {resp.followUp && (
                                    <div className="ml-12 p-6 rounded-2xl bg-white border border-slate-200 relative shadow-sm">
                                        <div className="absolute -left-6 top-6 w-6 h-px bg-slate-200"></div>
                                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Sparkles size={12} /> AI Follow-Up Probe
                                        </div>
                                        <div className="text-slate-400 italic mb-4">"{resp.followUp.probe}"</div>
                                        <div className="text-slate-800 font-medium">"{resp.followUp.response}"</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-8">
                    <div className="p-8 bg-slate-50 rounded-full border border-slate-100">
                       <Activity size={64} className="opacity-20 text-slate-400" />
                    </div>
                    <p className="font-bold text-lg opacity-50 uppercase tracking-widest text-slate-400">Select an ID to inspect</p>
                </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default RecruiterDashboard;
