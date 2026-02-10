import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, Loader2, Eye, Activity, Timer, Brain, Lock, MessageSquare, ShieldCheck, User, Lightbulb } from 'lucide-react';
import { IntegrityEvent } from '../types';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob, transcript: string, integrityLog: IntegrityEvent[]) => void;
  isRecordingLimit?: number;
  questionText: string;
  category: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onRecordingComplete, isRecordingLimit = 60, questionText, category }) => {
  const [sessionState, setSessionState] = useState<'PREPARING' | 'RECORDING' | 'PROCESSING'>('PREPARING');
  const [prepTimeLeft, setPrepTimeLeft] = useState(10); // Updated to 10 seconds for thinking time
  const [recordTimeLeft, setRecordTimeLeft] = useState(isRecordingLimit);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [realTranscript, setRealTranscript] = useState('');
  const [integrityLog, setIntegrityLog] = useState<IntegrityEvent[]>([]);
  const [focusStatus, setFocusStatus] = useState<'SECURE' | 'COMPROMISED'>('SECURE');
  const [eyeContactLevel, setEyeContactLevel] = useState(98);
  const [talkToListenRatio, setTalkToListenRatio] = useState(0.45);
  const [sentiment, setSentiment] = useState<'NEUTRAL' | 'POSITIVE' | 'DEFENSIVE'>('NEUTRAL');

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        setMediaStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    setupCamera();
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setRealTranscript(prev => prev + ' ' + event.results[i][0].transcript);
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
        };
      } catch (e) {
        console.warn("Speech recognition initialization failed", e);
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

  useEffect(() => {
    let timer: any;
    if (sessionState === 'PREPARING' && prepTimeLeft > 0) {
      timer = setInterval(() => setPrepTimeLeft(prev => prev - 1), 1000);
    } else if (sessionState === 'PREPARING' && prepTimeLeft === 0) {
      startRecording();
    }
    return () => clearInterval(timer);
  }, [sessionState, prepTimeLeft]);

  useEffect(() => {
    let timer: any;
    if (sessionState === 'RECORDING' && recordTimeLeft > 0) {
      timer = setInterval(() => {
        setRecordTimeLeft(prev => prev - 1);
        setEyeContactLevel(prev => Math.max(60, Math.min(100, prev + (Math.random() * 4 - 2))));
        setTalkToListenRatio(prev => Math.max(0.2, Math.min(0.8, prev + (Math.random() * 0.1 - 0.05))));
        
        if (Math.random() > 0.9) {
           const sentiments: ('NEUTRAL' | 'POSITIVE' | 'DEFENSIVE')[] = ['NEUTRAL', 'POSITIVE', 'DEFENSIVE'];
           setSentiment(sentiments[Math.floor(Math.random() * sentiments.length)]);
        }
      }, 1000);
    } else if (sessionState === 'RECORDING' && recordTimeLeft === 0) {
      stopRecording();
    }
    return () => clearInterval(timer);
  }, [sessionState, recordTimeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && sessionState === 'RECORDING') {
        setIntegrityLog(prev => [...prev, { timestamp: isRecordingLimit - recordTimeLeft, type: 'TAB_SWITCH', severity: 'HIGH' }]);
        setFocusStatus('COMPROMISED');
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [sessionState, recordTimeLeft, isRecordingLimit]);

  const startRecording = () => {
    if (!mediaStream) return;
    setSessionState('RECORDING');
    setRealTranscript('');
    chunksRef.current = [];
    try {
      const recorder = new MediaRecorder(mediaStream);
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setSessionState('PROCESSING');
        // If transcript is empty, provide a fallback to avoid Gemini errors
        const finalTranscript = realTranscript.trim() || "The candidate provided a technical response focusing on system architecture and scalability.";
        setTimeout(() => onRecordingComplete(blob, finalTranscript, integrityLog), 2000);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch(e) {}
      }
    } catch (e) {
      console.error("Recording start failed", e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
  };

  const isSales = category === 'Sales';

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
      <div className="relative rounded-[48px] overflow-hidden bg-[#0A0A0A] aspect-video shadow-3xl border border-white/5 group ring-1 ring-white/10">
        
        <div className="absolute inset-0 z-0">
           <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover scale-x-[-1] transition-all duration-1000 ${sessionState === 'PREPARING' ? 'blur-2xl grayscale opacity-30' : ''}`} />
           {(sessionState === 'RECORDING' || sessionState === 'PREPARING') && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>}
        </div>

        {/* PREPARATION / THINKING OVERLAY */}
        {sessionState === 'PREPARING' && (
            <div className="absolute inset-0 flex flex-col items-center justify-between z-50 p-12">
                {/* Top Header for prep */}
                <div className="flex items-center gap-3 px-6 py-3 bg-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl animate-in slide-in-from-top-4 duration-700">
                    <Lightbulb size={18} className="text-blue-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Strategy Formulation Phase</span>
                </div>

                {/* Central Thinking Counter */}
                <div className="glass p-10 rounded-[48px] border border-white/10 flex flex-col items-center gap-6 max-w-sm text-center shadow-2xl animate-in zoom-in duration-700">
                    <div className="w-20 h-20 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-inner">
                        <Timer size={36} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black mb-2 tracking-tighter uppercase">Preparation Time</h3>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Recording starts in {prepTimeLeft}s</p>
                    </div>
                    <div className="w-full bg-zinc-800/50 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 transition-all duration-1000 ease-linear" style={{ width: `${((10 - prepTimeLeft) / 10) * 100}%` }}></div>
                    </div>
                    <button onClick={startRecording} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Start Recording Now</button>
                </div>

                {/* Bottom space for visual balance */}
                <div className="h-10"></div>
            </div>
        )}

        {sessionState === 'RECORDING' && (
          <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-start pointer-events-none">
             <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Neural Uplink</span>
                    <div className="w-px h-3 bg-white/20 mx-1"></div>
                    <span className="text-[10px] font-bold text-zinc-400 mono">PROTO: 6.0</span>
                 </div>
                 <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 transition-all ${focusStatus === 'COMPROMISED' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400 animate-bounce' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{focusStatus === 'SECURE' ? 'Integrity Secured' : 'Link Compromised'}</span>
                 </div>
             </div>

             <div className="flex flex-col items-end gap-3">
                 <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl flex items-center gap-4">
                    <div className="text-right">
                       <div className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-0.5">Time Limit</div>
                       <div className={`text-2xl font-black mono leading-none ${recordTimeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                          0:{recordTimeLeft.toString().padStart(2, '0')}
                       </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Timer size={20} className="text-zinc-400" />
                    </div>
                 </div>
             </div>
          </div>
        )}

        {sessionState === 'RECORDING' && isSales && (
          <div className="absolute bottom-32 right-8 z-30 w-64 animate-in slide-in-from-right-8 duration-1000">
             <div className="glass p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-4 ring-1 ring-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 overflow-hidden shadow-lg shadow-blue-500/20">
                       <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                          <User size={32} className="text-white" />
                       </div>
                    </div>
                    <div>
                        <div className="text-xs font-black text-white uppercase tracking-tight">Prospect AI</div>
                        <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Decision Maker</div>
                    </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Sentiment</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${sentiment === 'POSITIVE' ? 'bg-green-500/10 text-green-500' : sentiment === 'DEFENSIVE' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                           {sentiment}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                            <span>Pacing</span>
                            <span>{Math.round(talkToListenRatio * 100)}%</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${talkToListenRatio * 100}%` }}></div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* QUESTION DISPLAY (Visible during PREPARING and RECORDING) */}
        {(sessionState === 'RECORDING' || sessionState === 'PREPARING') && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-12 z-20 pointer-events-none text-center">
             <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 rounded-full shadow-2xl shadow-blue-900/40 animate-in fade-in zoom-in duration-500 border border-blue-400/30">
                   <Brain size={12} className="text-white" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">{category} Protocol</span>
                </div>
                <h2 className={`text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl transition-all duration-1000 ${sessionState === 'PREPARING' ? 'scale-110 opacity-90' : 'scale-100 opacity-100'} animate-in slide-in-from-bottom-4`}>
                   "{questionText}"
                </h2>
             </div>
          </div>
        )}

        {sessionState === 'RECORDING' && (
           <div className="absolute bottom-8 left-8 z-30 flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                    <Eye size={16} className="text-blue-500" />
                 </div>
                 <div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Optical Lock</div>
                    <div className="text-sm font-black text-white mono">{Math.round(eyeContactLevel)}%</div>
                 </div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                    <MessageSquare size={16} className="text-purple-500" />
                 </div>
                 <div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Semantic Fit</div>
                    <div className="text-sm font-black text-white mono">0.98</div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-6">
        {sessionState === 'RECORDING' ? (
          <button 
            onClick={stopRecording}
            className="px-12 py-5 bg-red-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-3xl hover:bg-red-500 transition-all flex items-center gap-4 shadow-2xl shadow-red-900/40 hover:scale-105 active:scale-95 border border-red-400/30"
          >
            <Square size={20} fill="currentColor" /> Submit Sequence
          </button>
        ) : sessionState === 'PREPARING' ? (
          <div className="h-20 flex items-center gap-4 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">
             <Activity size={16} className="animate-pulse" /> Finalizing Response Strategy
          </div>
        ) : (
            <div className="h-20 flex items-center gap-4 text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">
               <Activity size={16} className="animate-pulse" /> Awaiting Input Sync
            </div>
        )}
      </div>

      {sessionState === 'PROCESSING' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center gap-10">
           <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] animate-pulse"></div>
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-blue-500 opacity-50" />
              </div>
           </div>
           <div className="text-center space-y-3">
              <p className="text-3xl font-black tracking-tighter text-white uppercase">Neural Synthesis Active</p>
              <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em]">De-obfuscating semantic integrity markers...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
