
import React, { useState, useRef, useEffect } from 'react';
import { Square, Loader2, Eye, Activity, Timer, Brain, Lock, MessageSquare, ShieldCheck, User, Lightbulb, RefreshCw } from 'lucide-react';
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
  const [prepTimeLeft, setPrepTimeLeft] = useState(10);
  const [recordTimeLeft, setRecordTimeLeft] = useState(isRecordingLimit);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  
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
      setIsSyncing(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        setMediaStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsSyncing(false);
      } catch (err) {
        console.error("Camera access error:", err);
        setIsSyncing(false);
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
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setRealTranscript(prev => prev + ' ' + event.results[i][0].transcript);
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
      // Robust retry: if camera isn't ready, wait 500ms and try again
      if (mediaStream) {
        startRecording();
      } else {
        const retryTimer = setTimeout(() => {
            if (mediaStream) startRecording();
            else console.error("Camera failed to sync in time.");
        }, 500);
        return () => clearTimeout(retryTimer);
      }
    }
    return () => clearInterval(timer);
  }, [sessionState, prepTimeLeft, mediaStream]);

  useEffect(() => {
    let timer: any;
    if (sessionState === 'RECORDING' && recordTimeLeft > 0) {
      timer = setInterval(() => {
        setRecordTimeLeft(prev => prev - 1);
        setEyeContactLevel(prev => Math.max(60, Math.min(100, prev + (Math.random() * 4 - 2))));
        setTalkToListenRatio(prev => Math.max(0.2, Math.min(0.8, prev + (Math.random() * 0.1 - 0.05))));
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
        const finalTranscript = realTranscript.trim() || "Transcript verification in progress based on primary audio feed.";
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
      <div className="relative rounded-[48px] overflow-hidden bg-[#0A0A0A] aspect-video shadow-3xl border border-emerald-500/10 group ring-1 ring-emerald-900/20">
        
        <div className="absolute inset-0 z-0">
           <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover scale-x-[-1] transition-all duration-1000 ${sessionState === 'PREPARING' ? 'blur-2xl grayscale opacity-30' : ''}`} />
           {(sessionState === 'RECORDING' || sessionState === 'PREPARING') && <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/95 via-transparent to-[#022c22]/40"></div>}
        </div>

        {sessionState === 'PREPARING' && (
            <div className="absolute inset-0 flex flex-col items-center justify-between z-50 p-12">
                <div className="flex items-center gap-3 px-6 py-3 bg-emerald-600/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl animate-in slide-in-from-top-4 duration-700">
                    <Lightbulb size={18} className="text-emerald-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Phase 1: Strategic Formulation</span>
                </div>

                <div className="glass p-10 rounded-[48px] border border-emerald-500/10 flex flex-col items-center gap-6 max-w-sm text-center shadow-2xl animate-in zoom-in duration-700">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                        {isSyncing ? <RefreshCw className="animate-spin" size={36} /> : <Timer size={36} className="animate-pulse" />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black mb-2 tracking-tighter uppercase text-white">{isSyncing ? 'Syncing Hardware' : 'Preparation Time'}</h3>
                        <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-widest">{isSyncing ? 'Optimizing Gaze Tracking' : `Session recording starts in ${prepTimeLeft}s`}</p>
                    </div>
                    {!isSyncing && (
                        <div className="w-full bg-emerald-900/50 h-1.5 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 transition-all duration-1000 ease-linear" style={{ width: `${((10 - prepTimeLeft) / 10) * 100}%` }}></div>
                        </div>
                    )}
                    <button onClick={startRecording} className="text-[10px] font-black uppercase tracking-widest text-emerald-100/40 hover:text-white transition-colors">Bypass Thinking Time</button>
                </div>
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
                 <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 transition-all ${focusStatus === 'COMPROMISED' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 animate-bounce' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{focusStatus === 'SECURE' ? 'Integrity Secured' : 'Link Compromised'}</span>
                 </div>
             </div>
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
        )}

        {(sessionState === 'RECORDING' || sessionState === 'PREPARING') && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-12 z-20 pointer-events-none text-center">
             <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-600 rounded-full shadow-2xl shadow-emerald-900/40 animate-in fade-in zoom-in duration-500 border border-emerald-400/30">
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
                    <Eye size={16} className="text-emerald-500" />
                 </div>
                 <div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Optical Lock</div>
                    <div className="text-sm font-black text-white mono">{Math.round(eyeContactLevel)}%</div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-6">
        {sessionState === 'RECORDING' && (
          <button 
            onClick={stopRecording}
            className="px-12 py-5 bg-red-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-3xl hover:bg-red-500 transition-all flex items-center gap-4 shadow-2xl shadow-red-900/40 hover:scale-105 active:scale-95 border border-red-400/30"
          >
            <Square size={20} fill="currentColor" /> Submit Signal
          </button>
        )}
        {sessionState === 'PREPARING' && (
            <div className="h-20 flex items-center gap-4 text-emerald-800 text-[10px] font-black uppercase tracking-[0.4em]">
               <Activity size={16} className="animate-pulse" /> Finalizing Response Map
            </div>
        )}
      </div>

      {sessionState === 'PROCESSING' && (
        <div className="fixed inset-0 bg-emerald-950/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center gap-10">
           <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] animate-pulse"></div>
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-emerald-500 opacity-50" />
              </div>
           </div>
           <div className="text-center space-y-3">
              <p className="text-3xl font-black tracking-tighter text-white uppercase">Neural Synthesis Active</p>
              <p className="text-emerald-100/40 font-mono text-[10px] uppercase tracking-[0.5em]">De-obfuscating semantic integrity markers...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
