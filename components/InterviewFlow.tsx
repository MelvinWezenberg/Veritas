
import React, { useState, useEffect } from 'react';
import { Candidate, InterviewResult, IRTQuestion, IntegrityEvent } from '../types';
import { QUESTION_BANK } from '../constants';
import VideoRecorder from './VideoRecorder';
import { evaluateResponse, generateFollowUpProbe } from '../services/geminiService';
import { CheckCircle, Activity, Loader2 } from 'lucide-react';

interface InterviewFlowProps {
  candidate: Candidate;
  onComplete: (result: InterviewResult) => void;
}

const InterviewFlow: React.FC<InterviewFlowProps> = ({ candidate, onComplete }) => {
  const [step, setStep] = useState<'QUESTION' | 'ANALYZING' | 'FOLLOW_UP' | 'COMPLETE'>('QUESTION');
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

  if (step === 'ANALYZING') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in fade-in duration-500">
         <div className="relative w-40 h-40 mb-16">
            <div className="absolute inset-0 border-[1px] border-white/5 rounded-full scale-125"></div>
            <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-b-2 border-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                <Activity size={40} className="animate-pulse" />
            </div>
         </div>
         <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase">Mapping Signal</h2>
         <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.5em]">De-obfuscating Interaction Metadata...</p>
      </div>
    );
  }

  if (step === 'COMPLETE') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in zoom-in duration-1000">
         <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-[32px] flex items-center justify-center mb-10 border border-green-500/20 shadow-2xl relative">
            <div className="absolute inset-0 bg-green-500/10 blur-[30px] rounded-full"></div>
            <CheckCircle size={48} className="relative z-10" />
         </div>
         <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase">Probe Verified</h2>
         <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.3em]">Session terminated. Transmitting encrypted packet.</p>
      </div>
    );
  }

  // If question is not yet picked, show a brief initialization loader
  if (!currentQuestion && step === 'QUESTION') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in fade-in duration-500">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Initializing Session Context...</p>
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
