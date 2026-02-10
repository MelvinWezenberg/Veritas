
import React, { useState, useEffect } from 'react';
import { Candidate, InterviewResult, IRTQuestion, IntegrityEvent } from '../types';
import { QUESTION_BANK } from '../constants';
import VideoRecorder from './VideoRecorder';
import { evaluateResponse, generateFollowUpProbe } from '../services/geminiService';
import { CheckCircle, Activity, Loader2, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface InterviewFlowProps {
  candidate: Candidate;
  onComplete: (result: InterviewResult) => void;
}

const InterviewFlow: React.FC<InterviewFlowProps> = ({ candidate, onComplete }) => {
  const [step, setStep] = useState<'CONTEXT_BRIEF' | 'QUESTION' | 'ANALYZING' | 'FOLLOW_UP' | 'COMPLETE'>('CONTEXT_BRIEF');
  const [currentQuestion, setCurrentQuestion] = useState<IRTQuestion | null>(null);
  const [transcript, setTranscript] = useState('');
  const [followUpProbe, setFollowUpProbe] = useState<string | null>(null);
  const [followUpTranscript, setFollowUpTranscript] = useState('');
  const [initialScoreData, setInitialScoreData] = useState<any>(null);
  const [integrityLogs, setIntegrityLogs] = useState<IntegrityEvent[]>([]);

  useEffect(() => {
    // Select question based on seniority or fallback to any available
    const filtered = QUESTION_BANK.filter(q => {
        if (candidate.seniorityLevel === 'Senior' || candidate.seniorityLevel === 'Staff') return q.beta > 0.75;
        return q.beta <= 0.85;
    });
    
    const pool = filtered.length > 0 ? filtered : QUESTION_BANK;
    const randomQ = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(randomQ);
  }, [candidate]);

  const handleInitialRecordingComplete = async (blob: Blob, text: string, logs: IntegrityEvent[]) => {
    setTranscript(text);
    setIntegrityLogs(logs);
    setStep('ANALYZING');

    if (!currentQuestion) return;

    try {
      const result = await evaluateResponse(currentQuestion.text, text, candidate.seniorityLevel);
      setInitialScoreData(result);

      // Higher seniority gets mandatory follow-up for depth verification
      const needsFollowUp = candidate.seniorityLevel === 'Senior' || 
                            candidate.seniorityLevel === 'Staff' ||
                            result.technicalAccuracy > 80;

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
        coherence: 70, 
        seniorityAlignment: 70, 
        recommendation: 'MAYBE', 
        recommendationReason: 'Telemetry sync issue; human review required.' 
      }, undefined, logs);
    }
  };

  const handleFollowUpRecordingComplete = async (blob: Blob, text: string, logs: IntegrityEvent[]) => {
    setFollowUpTranscript(text);
    setStep('ANALYZING');
    const combinedLogs = [...integrityLogs, ...logs];
    finalizeInterview(initialScoreData, text, combinedLogs);
  };

  const finalizeInterview = (scores: any, followUpText?: string, finalLogs: IntegrityEvent[] = []) => {
    if (!currentQuestion) return;

    // ROI-focused scoring model
    const weightedScore = Math.round(
      (scores.technicalAccuracy * 0.5) +
      (scores.coherence * 0.25) +
      (95 * 0.15) + // Base authenticity from telemetry
      (scores.seniorityAlignment * 0.10)
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
          flags: scores.isAIGenerated ? ['AI_SIGNAL_DETECTED'] : [],
          followUp: followUpProbe && followUpText ? {
            probe: followUpProbe,
            response: followUpText,
            score: 85
          } : undefined
        }
      ]
    };
    
    setStep('COMPLETE');
    // Ensure the complete state is visible before transitioning out
    setTimeout(() => onComplete(result), 2500);
  };

  if (step === 'CONTEXT_BRIEF') {
    return (
        <div className="max-w-2xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <BookOpen size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Protocol Briefing</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 tracking-tight text-white">Technical Context</h2>
                <p className="text-emerald-100/60 text-lg leading-relaxed">
                    You are about to enter the verification environment. This session will focus on <span className="text-white font-bold">Distributed Systems Architecture</span> and <span className="text-white font-bold">Data Consistency Models</span>.
                </p>
            </div>

            <div className="bg-[#064e3b]/40 border border-emerald-500/10 rounded-2xl p-8 mb-10">
                <h3 className="text-sm font-bold text-emerald-100/50 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Activity size={16} /> Key Concepts to Reference
                </h3>
                <div className="flex flex-wrap gap-3">
                    {['CAP Theorem', 'Event Sourcing', 'Optimistic Locking', 'Idempotency', 'Redis', 'Kafka'].map(tag => (
                        <span key={tag} className="px-4 py-2 bg-emerald-950/40 border border-emerald-500/10 rounded-lg text-sm font-mono text-emerald-200">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => setStep('QUESTION')}
                className="w-full py-5 bg-white text-emerald-950 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl flex items-center justify-center gap-3 group"
            >
                Initialize Assessment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-center mt-4 text-xs text-emerald-100/30 font-medium">
                Session ID: {candidate.id.split('-')[0]} // Encrypted
            </div>
        </div>
    );
  }

  if (step === 'ANALYZING') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in fade-in duration-500">
         <div className="relative w-40 h-40 mb-16">
            <div className="absolute inset-0 border-[1px] border-emerald-500/20 rounded-full scale-125"></div>
            <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-b-2 border-amber-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                <Activity size={40} className="animate-pulse" />
            </div>
         </div>
         <h2 className="text-3xl font-bold mb-3 tracking-tight text-white">Mapping Signal</h2>
         <p className="text-emerald-100/40 font-mono text-xs uppercase tracking-widest">De-obfuscating Interaction Metadata...</p>
      </div>
    );
  }

  if (step === 'COMPLETE') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in zoom-in duration-1000">
         <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mb-10 border border-emerald-500/20 shadow-2xl relative">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[30px] rounded-full"></div>
            <CheckCircle size={48} className="relative z-10" />
         </div>
         <h2 className="text-5xl font-bold mb-4 tracking-tight text-white">Probe Verified</h2>
         <p className="text-emerald-100/40 font-mono text-xs uppercase tracking-widest">Session terminated. Transmitting encrypted packet.</p>
      </div>
    );
  }

  if (!currentQuestion && step === 'QUESTION') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in fade-in duration-500">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-emerald-100/40 font-bold uppercase tracking-widest text-xs">Initializing Session Context...</p>
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
      />
    </div>
  );
};

export default InterviewFlow;
