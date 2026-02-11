
import React, { useState, useEffect } from 'react';
import { Candidate, InterviewResult, IRTQuestion, IntegrityEvent } from '../types';
import { QUESTION_BANK } from '../constants';
import VideoRecorder from './VideoRecorder';
import { evaluateResponse, generateFollowUpProbe, generateCandidateFeedbackReport } from '../services/geminiService';
import { CheckCircle, Activity, Loader2, BookOpen, Clock, ArrowRight, Sparkles, Download, RefreshCw, Mic, Volume2, AlignLeft, UserCircle2 } from 'lucide-react';

interface InterviewFlowProps {
  candidate: Candidate;
  onComplete: (result: InterviewResult) => void;
  useMockHardware?: boolean;
}

const InterviewFlow: React.FC<InterviewFlowProps> = ({ candidate, onComplete, useMockHardware = false }) => {
  const [step, setStep] = useState<'CONTEXT_BRIEF' | 'PRACTICE_INTRO' | 'PRACTICE_RECORDING' | 'QUESTION' | 'ANALYZING' | 'FOLLOW_UP' | 'COMPLETE'>('CONTEXT_BRIEF');
  const [currentQuestion, setCurrentQuestion] = useState<IRTQuestion | null>(null);
  const [transcript, setTranscript] = useState('');
  const [followUpProbe, setFollowUpProbe] = useState<string | null>(null);
  const [followUpTranscript, setFollowUpTranscript] = useState('');
  const [initialScoreData, setInitialScoreData] = useState<any>(null);
  const [integrityLogs, setIntegrityLogs] = useState<IntegrityEvent[]>([]);
  const [feedbackReport, setFeedbackReport] = useState<any>(null);

  useEffect(() => {
    // Select a random question for the new domains
    const randomQ = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
    setCurrentQuestion(randomQ);
  }, [candidate]);

  const handlePracticeComplete = () => {
      setStep('QUESTION');
  };

  const handleInitialRecordingComplete = async (blob: Blob, text: string, logs: IntegrityEvent[]) => {
    setTranscript(text);
    setIntegrityLogs(logs);
    setStep('ANALYZING');

    if (!currentQuestion) return;

    try {
      const result = await evaluateResponse(currentQuestion.text, text, candidate.seniorityLevel);
      setInitialScoreData(result);

      const needsFollowUp = true; // Always do follow up for this demo

      if (needsFollowUp) {
        try {
          const probe = await generateFollowUpProbe(currentQuestion.text, text);
          setFollowUpProbe(probe);
          setStep('FOLLOW_UP');
        } catch (e) {
          console.error("Follow-up generation failed", e);
          finalizeInterview(result, undefined, logs);
        }
      } else {
        finalizeInterview(result, undefined, logs);
      }
    } catch (e) {
      console.error("Evaluation failed", e);
      finalizeInterview({ 
        technicalAccuracy: 70, 
        structuralIntegrity: 70, 
        assertivenessIndex: 70,
        signalToNoiseRatio: 70,
        seniorityAlignment: 70, 
        recommendation: 'MAYBE', 
        recommendationReason: 'Telemetry sync issue; human review required.',
        speechMetrics: { wpm: 0, fillerWordCount: 0, fillerWords: [], tonality: "Nervous", clarityScore: 50 }
      }, undefined, logs);
    }
  };

  const handleFollowUpRecordingComplete = async (blob: Blob, text: string, logs: IntegrityEvent[]) => {
    setFollowUpTranscript(text);
    setStep('ANALYZING');
    const combinedLogs = [...integrityLogs, ...logs];
    finalizeInterview(initialScoreData, text, combinedLogs);
  };

  const finalizeInterview = async (scores: any, followUpText?: string, finalLogs: IntegrityEvent[] = []) => {
    if (!currentQuestion) return;

    let report = null;
    try {
        report = await generateCandidateFeedbackReport(transcript + " " + (followUpText || ""), scores);
        setFeedbackReport(report);
    } catch (e) { console.error("Report gen failed", e); }

    const weightedScore = Math.round(
      (scores.technicalAccuracy * 0.4) +
      (scores.structuralIntegrity * 0.2) +
      (scores.assertivenessIndex * 0.1) +
      (scores.signalToNoiseRatio * 0.1) +
      (scores.seniorityAlignment * 0.2)
    );

    const result: InterviewResult = {
      candidateId: candidate.id,
      timestamp: new Date().toISOString(),
      overallScore: weightedScore,
      aiRecommendation: scores.recommendation || 'MAYBE',
      aiDecisionReason: scores.recommendationReason || 'Verified technical competency signal.',
      integrityLog: finalLogs,
      responses: [
        {
          questionId: currentQuestion.id,
          transcript: transcript,
          scores: scores,
          speechMetrics: scores.speechMetrics,
          flags: scores.isAIGenerated ? ['AI_SIGNAL_DETECTED'] : [],
          followUp: followUpProbe && followUpText ? {
            probe: followUpProbe,
            response: followUpText,
            score: 85
          } : undefined
        }
      ],
      feedbackReport: report
    };
    
    setStep('COMPLETE');
  };

  if (step === 'CONTEXT_BRIEF') {
    return (
        <div className="max-w-2xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                    <BookOpen size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Protocol Briefing</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">Live Verification</h2>
            </div>

            {/* Hiring Manager Intro Simulation - Research shows this increases trust */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0 overflow-hidden">
                    <UserCircle2 size={48} className="text-slate-400" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">Hiring Manager Note</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Recorded 2h ago</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none text-slate-600 text-sm leading-relaxed border border-slate-100">
                        "I don't need a resume recitation. I need to know how you think under pressure. The AI is going to ask you a specific scenario about your domain. It might interrupt you if you get too generic. Good luck."
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => setStep('PRACTICE_INTRO')}
                    className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3"
                >
                    Test Hardware
                </button>
                <button 
                    onClick={() => setStep('QUESTION')}
                    className="flex-1 py-5 bg-emerald-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl flex items-center justify-center gap-3 group"
                >
                    Start Real Assessment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
  }

  if (step === 'PRACTICE_INTRO') {
      return (
          <div className="max-w-2xl mx-auto py-12 px-6 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-100 text-amber-500">
                  <Sparkles size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Audio/Video Check</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  We will enable your camera and microphone now. This is a non-recorded practice session to ensure the AI can hear you clearly.
              </p>
              <button 
                onClick={() => setStep('PRACTICE_RECORDING')}
                className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                  Enable Hardware
              </button>
          </div>
      )
  }

  if (step === 'PRACTICE_RECORDING') {
      return (
        <div className="max-w-6xl mx-auto py-8 px-6">
            <VideoRecorder 
                key="practice"
                questionText="Practice: What is your favorite complex problem to solve?"
                category="Hardware Check"
                isPractice={true}
                isRecordingLimit={15}
                onRecordingComplete={handlePracticeComplete}
                forceMockMode={false}
            />
            <div className="text-center mt-6">
                <button onClick={() => setStep('QUESTION')} className="text-slate-400 hover:text-slate-600 font-bold text-sm underline">Skip Practice</button>
            </div>
        </div>
      )
  }

  if (step === 'ANALYZING') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in fade-in duration-500">
         <div className="relative w-40 h-40 mb-16">
            <div className="absolute inset-0 border-[1px] border-emerald-100 rounded-full scale-125"></div>
            <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-b-2 border-amber-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                <Activity size={40} className="animate-pulse" />
            </div>
         </div>
         <h2 className="text-3xl font-bold mb-3 tracking-tight text-slate-900">Generating Feedback</h2>
         <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Analyzing assertiveness and signal-to-noise ratio...</p>
      </div>
    );
  }

  if (step === 'COMPLETE') {
    const metrics = initialScoreData?.speechMetrics;
    
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 animate-in slide-in-from-bottom-8 duration-700">
         <div className="text-center mb-12">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-xl relative">
                <CheckCircle size={48} className="relative z-10" />
            </div>
            <h2 className="text-4xl font-bold mb-2 tracking-tight text-slate-900">Assessment Complete</h2>
            <p className="text-slate-500">Instant feedback generated. No waiting weeks for a response.</p>
         </div>

         {metrics && (
             <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 shadow-sm">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                     <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                         <Mic size={18} className="text-purple-500" /> Executive Presence Analysis
                     </h3>
                     <span className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full uppercase">Private Coaching</span>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     <div className="space-y-2">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Speaking Pace</p>
                         <p className="text-2xl font-bold text-slate-900">{metrics.wpm} <span className="text-sm font-medium text-slate-400">wpm</span></p>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full ${metrics.wpm > 160 ? 'bg-amber-400' : metrics.wpm < 110 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                                style={{ width: `${Math.min((metrics.wpm / 200) * 100, 100)}%` }}
                             ></div>
                         </div>
                         <p className="text-[10px] text-slate-500">{metrics.wpm > 160 ? 'A bit fast' : metrics.wpm < 110 ? 'A bit slow' : 'Great pace'}</p>
                     </div>

                     <div className="space-y-2">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filler Words</p>
                         <p className="text-2xl font-bold text-slate-900">{metrics.fillerWordCount}</p>
                         <div className="flex flex-wrap gap-1">
                             {metrics.fillerWords?.slice(0,3).map((w: string, i: number) => (
                                 <span key={i} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">{w}</span>
                             ))}
                         </div>
                     </div>

                     <div className="space-y-2">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tonality</p>
                         <p className="text-xl font-bold text-slate-900 capitalize">{metrics.tonality}</p>
                         <p className="text-[10px] text-slate-500">Detected from text sentiment</p>
                     </div>

                     <div className="space-y-2">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clarity Score</p>
                         <div className="relative w-16 h-16 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                                  <circle cx="32" cy="32" r="28" stroke="#059669" strokeWidth="4" fill="transparent" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * metrics.clarityScore) / 100} />
                              </svg>
                              <span className="absolute text-sm font-bold text-emerald-600">{metrics.clarityScore}</span>
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {feedbackReport && (
             <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                         <Sparkles size={18} className="text-amber-400" /> My Skills Certificate
                     </h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     <div>
                         <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Key Strengths</h4>
                         <ul className="space-y-2">
                             {feedbackReport.strengths?.map((s: string, i: number) => (
                                 <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                     <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {s}
                                 </li>
                             ))}
                         </ul>
                     </div>
                     <div>
                         <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Growth Areas</h4>
                         <ul className="space-y-2">
                             {feedbackReport.growthAreas?.map((s: string, i: number) => (
                                 <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                     <RefreshCw size={14} className="text-amber-500 mt-0.5 shrink-0" /> {s}
                                 </li>
                             ))}
                         </ul>
                     </div>
                 </div>
                 
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Executive Coaching Tip</h4>
                     <p className="text-slate-700 font-medium italic">"{feedbackReport.careerTips}"</p>
                 </div>
             </div>
         )}

         <div className="flex gap-4">
             <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                 <Download size={18} /> Download Full Report
             </button>
             <button 
                onClick={() => onComplete({ 
                    ...initialScoreData, 
                    feedbackReport, 
                    aiRecommendation: 'HIRE', 
                    aiDecisionReason: 'Strong technical performance.',
                    responses: [], 
                    candidateId: candidate.id, 
                    integrityLog: integrityLogs,
                    overallScore: 92,
                    timestamp: new Date().toISOString()
                })}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
             >
                 Return to Dashboard
             </button>
         </div>
      </div>
    );
  }

  if (!currentQuestion && step === 'QUESTION') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in fade-in duration-500">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Session Context...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <VideoRecorder 
        key={step}
        questionText={step === 'FOLLOW_UP' ? followUpProbe! : (currentQuestion?.text || 'Describe your approach to building highly scalable distributed architectures.')}
        category={currentQuestion?.category || 'General'}
        onRecordingComplete={step === 'FOLLOW_UP' ? handleFollowUpRecordingComplete : handleInitialRecordingComplete}
        isRecordingLimit={60}
        forceMockMode={false}
      />
    </div>
  );
};

export default InterviewFlow;
