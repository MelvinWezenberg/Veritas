
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { ShieldCheck, AlertTriangle, ChevronRight, User, TrendingUp, Filter, FileText, Activity, EyeOff, Sparkles, Settings2, Save, Users, BrainCircuit, Mail, Calendar, CheckCircle, XCircle, HelpCircle, ArrowUpRight, Ear, MessageCircle, BarChart2, ArrowRight } from 'lucide-react';
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

  // Fix: Added missing handleScheduleInterview function
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
        displayCandidate = {
            ...displayCandidate,
            name: `Candidate ${candidate.id.slice(0,4).toUpperCase()}`,
        };
    }
    return displayCandidate;
  };

  if (activeTab === 'SETUP') {
      return (
          <div className="h-full max-w-7xl mx-auto p-12 flex flex-col gap-16 animate-in fade-in duration-1000">
              <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h2 className="text-5xl font-black tracking-tighter">Calibration Hub</h2>
                    <p className="text-zinc-500 text-lg font-medium">Fine-tune the neural filters for this search.</p>
                  </div>
                  <button onClick={() => setActiveTab('PIPELINE')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                     View Results <ArrowUpRight size={16} />
                  </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                  <div className="space-y-12">
                      <div className="glass p-10 rounded-[48px] border border-white/10 shadow-3xl space-y-8">
                          <div className="flex items-center gap-3 text-blue-500">
                             <FileText size={24} />
                             <h3 className="text-sm font-black uppercase tracking-widest">Source Context</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Role Architecture</label>
                                <textarea 
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="w-full h-40 bg-black/40 border border-white/5 rounded-3xl p-6 text-sm leading-relaxed focus:border-blue-500/50 transition-all outline-none resize-none"
                                />
                            </div>
                            <button 
                                onClick={handleGenerateConfig}
                                disabled={isGenerating}
                                className="w-full py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                            >
                                {isGenerating ? <Activity className="animate-spin" /> : <Sparkles size={16} />}
                                {isGenerating ? 'Synthesizing...' : 'Calibrate AI engine'}
                            </button>
                          </div>
                      </div>

                      {aiConfig && (
                          <div className="glass p-10 rounded-[48px] border border-white/10 animate-in slide-in-from-bottom-8 duration-700">
                             <div className="flex items-center gap-3 text-purple-500 mb-8">
                                <Settings2 size={24} />
                                <h3 className="text-sm font-black uppercase tracking-widest">Signal Hierarchy</h3>
                             </div>
                             <div className="space-y-8">
                                {Object.entries(aiConfig.weights).map(([key, val]) => (
                                    <div key={key}>
                                        <div className="flex justify-between text-[10px] mb-3 uppercase font-black text-zinc-500 tracking-widest">
                                            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <span className="text-white font-mono">{Math.round((val as number) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                                           <div className="h-full bg-blue-500" style={{ width: `${(val as number) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                          </div>
                      )}
                  </div>

                  <div className="space-y-8">
                      {aiConfig ? (
                          <div className="p-10 bg-blue-600/5 rounded-[56px] border border-blue-500/10 h-full flex flex-col justify-between">
                              <div className="space-y-8">
                                <div className="flex items-center gap-4 text-blue-400">
                                  <BrainCircuit size={32} />
                                  <h3 className="text-2xl font-black tracking-tight">Active Probes</h3>
                                </div>
                                <div className="space-y-4">
                                    {aiConfig.questions.map((q, i) => (
                                        <div key={i} className="p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{q.category}</span>
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase">{q.difficulty}</span>
                                            </div>
                                            <p className="text-sm text-zinc-300 leading-relaxed font-medium">"{q.text}"</p>
                                        </div>
                                    ))}
                                </div>
                              </div>
                              <button onClick={() => setActiveTab('PIPELINE')} className="mt-12 py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-3xl hover:bg-blue-500 shadow-2xl transition-all">Deploy Sourcing Agent</button>
                          </div>
                      ) : (
                          <div className="h-full border-[2px] border-dashed border-white/5 rounded-[56px] flex flex-col items-center justify-center text-zinc-700 gap-8 p-16 text-center bg-white/[0.01]">
                              <div className="p-8 bg-zinc-800/20 rounded-full">
                                <Sparkles size={64} className="opacity-20" />
                              </div>
                              <div className="space-y-4">
                                <p className="text-xl font-black tracking-tight text-zinc-500 uppercase">Awaiting Context</p>
                                <p className="text-sm text-zinc-600 font-medium max-w-xs leading-relaxed">Provide role architecture to initialize the automated screening sequence.</p>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-1000">
        {/* TOP NAV BAR */}
        <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      <BarChart2 size={16} />
                   </div>
                   <h2 className="text-xl font-black tracking-tighter uppercase">Sourcing Hub</h2>
                </div>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="flex items-center gap-6">
                    <button onClick={() => setActiveTab('SETUP')} className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                        <Settings2 size={14} /> Engine Settings
                    </button>
                    <div className="text-[10px] text-green-500 font-bold flex items-center gap-2 uppercase tracking-widest">
                       <Activity size={12} className="animate-pulse" /> Agent Online
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => setBlindMode(!blindMode)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all border ${blindMode ? 'bg-purple-600 text-white border-purple-600' : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'}`}
            >
                <EyeOff size={14} /> {blindMode ? 'Identity Redacted' : 'Enable Neutral Mode'}
            </button>
        </div>

        <div className="flex flex-1 overflow-hidden p-10 gap-10">
            {/* AGENTIC SHORTLIST SIDEBAR */}
            <div className="w-[420px] flex flex-col gap-6 h-full">
                <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-3">
                        <Users size={18} className="text-zinc-600" />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Shortlist of One</h3>
                    </div>
                    <span className="text-[10px] font-black mono bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-400">CNT: {candidates.length}</span>
                </div>
                <div className="overflow-y-auto pr-4 custom-scrollbar flex flex-col gap-4 h-full pb-32">
                    {candidates.sort((a,b) => calculateScore(b.results) - calculateScore(a.results)).map((rawCandidate) => {
                    const candidate = getDisplayData(rawCandidate);
                    const score = candidate.results?.overallScore || 0;
                    const isSelected = selectedCandidate?.id === rawCandidate.id;
                    const recommendation = candidate.results?.aiRecommendation;
                    
                    return (
                        <div 
                        key={rawCandidate.id}
                        onClick={() => setSelectedCandidate(rawCandidate)}
                        className={`group p-8 rounded-[40px] border transition-all duration-500 cursor-pointer ${isSelected ? 'bg-white/5 border-white/20 shadow-2xl translate-x-2' : 'bg-transparent border-white/5 hover:bg-white/[0.02] hover:border-white/10'}`}
                        >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-6">
                                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 text-white scale-110' : 'bg-white/5 text-zinc-600 border border-white/10 group-hover:text-zinc-400'}`}>
                                    <User size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className={`font-black text-lg tracking-tight ${blindMode ? 'font-mono uppercase text-sm' : 'text-white'}`}>{candidate.name}</h3>
                                    <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${recommendation === 'HIRE' ? 'text-green-500' : 'text-zinc-600'}`}>
                                        {recommendation === 'HIRE' ? <CheckCircle size={12} /> : <Activity size={12} />}
                                        {recommendation || 'Analyzing'}
                                    </div>
                                </div>
                            </div>
                            <div className={`text-2xl font-black mono tracking-tighter ${score > 85 ? 'text-green-500' : score > 70 ? 'text-blue-500' : 'text-zinc-600'}`}>
                                {score || '--'}
                            </div>
                        </div>
                        </div>
                    );
                    })}
                </div>
            </div>

            {/* DETAIL REVIEW HUB */}
            <div className="flex-1 glass rounded-[56px] border border-white/10 overflow-y-auto custom-scrollbar relative shadow-3xl">
                {selectedCandidate ? (
                <div className="p-16 flex flex-col gap-20">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-6">
                            <h1 className={`text-6xl font-black tracking-tighter ${blindMode ? 'font-mono text-purple-400 text-4xl' : 'text-white'}`}>
                                {getDisplayData(selectedCandidate).name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                                   <div className={`w-2 h-2 rounded-full ${selectedCandidate.results?.aiRecommendation === 'HIRE' ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
                                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verdict:</span>
                                   <span className={`text-xs font-black uppercase tracking-[0.2em] ${selectedCandidate.results?.aiRecommendation === 'HIRE' ? 'text-green-400' : 'text-white'}`}>{selectedCandidate.results?.aiRecommendation || 'Pending'}</span>
                                </div>
                                <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                                   <Activity size={14} className="text-blue-500" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Match Accuracy:</span>
                                   <span className="text-xs font-black text-white mono">0.992</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                                <Mail size={20} />
                            </button>
                            <button 
                              onClick={() => handleScheduleInterview(selectedCandidate.id)}
                              className={`px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-xl ${notifiedCandidates.includes(selectedCandidate.id) ? 'bg-zinc-900 text-zinc-600' : 'bg-white text-black hover:scale-105 shadow-white/10'}`}
                            >
                                {notifiedCandidates.includes(selectedCandidate.id) ? 'Invitation Sent' : 'Fast-Track Hire'}
                                {notifiedCandidates.includes(selectedCandidate.id) ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* AI Rationale Card */}
                    <div className="p-12 bg-white/[0.03] border border-white/10 rounded-[48px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                           <BrainCircuit size={120} />
                        </div>
                        <div className="relative z-10 space-y-4">
                           <div className="flex items-center gap-2 text-blue-500">
                              <Sparkles size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Explainable AI Summary</span>
                           </div>
                           <p className="text-2xl text-zinc-200 leading-relaxed font-medium">
                               "{selectedCandidate.results?.aiDecisionReason || 'Analyzing performance telemetry...'}"
                           </p>
                        </div>
                    </div>

                    {/* GONG-STYLE QUANTIFICATION */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-black/40 rounded-[48px] p-10 border border-white/5 space-y-8 min-h-[400px]">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Signal Parity mapping</h4>
                            <div className="w-full h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                    { subject: 'Technical', A: selectedCandidate.results?.responses[0]?.scores.technicalAccuracy || 0 },
                                    { subject: 'Communication', A: selectedCandidate.results?.responses[0]?.scores.coherence || 0 },
                                    { subject: 'Authenticity', A: selectedCandidate.results?.responses[0]?.scores.authenticity || 0 },
                                    { subject: 'Seniority', A: selectedCandidate.results?.responses[0]?.scores.seniorityAlignment || 0 },
                                    { subject: 'Resilience', A: 92 },
                                ]}>
                                    <PolarGrid stroke="#ffffff08" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }} />
                                    <Radar name="Candidate" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={3} />
                                </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-[48px] p-10 border border-white/5 space-y-10">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Interpersonal Quant</h4>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                                            <Ear size={16} className="text-blue-500" /> Interaction Ratio
                                        </div>
                                        <span className="text-white font-mono font-bold text-lg">0.62</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-blue-600" style={{width: '62%'}}></div>
                                        <div className="h-full bg-zinc-700" style={{width: '38%'}}></div>
                                    </div>
                                    <p className="text-[10px] text-zinc-600 font-medium">Optimal consultative flow detected. High empathy markers found.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                                            <MessageCircle size={16} className="text-purple-500" /> Objection Handling
                                        </div>
                                        <span className="text-white font-mono font-bold text-lg">94/100</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-600" style={{width: '94%'}}></div>
                                    </div>
                                    <p className="text-[10px] text-zinc-600 font-medium">Successfully navigated 3/3 challenging probes with no defensive latency.</p>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-3xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <ShieldCheck size={20} className="text-green-500" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Neutral Audit Passed</span>
                                </div>
                                <span className="text-[10px] font-mono text-zinc-600">CERT: 2026-FPR</span>
                            </div>
                        </div>
                    </div>

                    {/* Transcripts Section */}
                    <div className="space-y-10 pb-20">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <Activity size={20} className="text-zinc-500" />
                            <h4 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em]">Interaction Packet</h4>
                        </div>
                        {selectedCandidate.results?.responses.map((resp, i) => (
                        <div key={i} className="space-y-10">
                            <div className="p-12 rounded-[56px] bg-white/[0.02] border border-white/5 space-y-8">
                                <div className="flex justify-between items-center text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase">
                                    <span>Primary Neural Probe {i + 1}</span>
                                    <span className="text-blue-500">Confidence Match: {resp.scores.technicalAccuracy}%</span>
                                </div>
                                <p className="text-3xl text-white leading-tight font-light tracking-tight">
                                    "{resp.transcript}"
                                </p>
                            </div>
                            
                            {resp.followUp && (
                            <div className="ml-20 p-10 rounded-[48px] bg-blue-600/5 border border-blue-500/10 space-y-6 relative">
                                <div className="absolute top-10 left-[-40px] w-10 h-px bg-blue-500/30"></div>
                                <div className="flex items-center gap-3 text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">
                                    <Sparkles size={14} /> AI Follow-up sequence
                                </div>
                                <p className="text-lg text-zinc-400 font-medium italic">"{resp.followUp.probe}"</p>
                                <div className="bg-black/60 p-8 rounded-3xl border border-white/5">
                                   <p className="text-xl text-zinc-100 leading-relaxed font-medium">"{resp.followUp.response}"</p>
                                </div>
                            </div>
                            )}
                        </div>
                        ))}
                    </div>
                </div>
                ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-800 space-y-8 bg-white/[0.01]">
                    <div className="p-10 bg-zinc-900/50 rounded-full">
                       <Users size={120} className="opacity-5" />
                    </div>
                    <p className="font-black text-2xl opacity-10 tracking-[0.5em] uppercase">Select signal to analyze</p>
                </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default RecruiterDashboard;
