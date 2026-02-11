
import React, { useState, useRef, useEffect } from 'react';
import { Square, Loader2, Brain, ShieldCheck, Activity, User, Mic, MonitorPlay, Zap, BarChart3, Volume2 } from 'lucide-react';
import { IntegrityEvent } from '../types';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob, transcript: string, integrityLog: IntegrityEvent[]) => void;
  isRecordingLimit?: number;
  questionText: string;
  category: string;
  isPractice?: boolean;
  forceMockMode?: boolean;
}

const INTERRUPTION_SCRIPTS = [
  "Sorry to interrupt, but I need you to be more specific. Give me the exact metric.",
  "Pause there. That sounds like a generalization. What was the actual impact?",
  "Let me stop you. You're using corporate jargon. Explain it to me like I'm five.",
  "Hold on. Move directly to the ROI. We are short on time."
];

const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onRecordingComplete, 
  isRecordingLimit = 60, 
  questionText, 
  category, 
  isPractice = false,
  forceMockMode = false 
}) => {
  const [sessionState, setSessionState] = useState<'PREPARING' | 'AI_SPEAKING' | 'RECORDING' | 'INTERRUPTED' | 'PROCESSING'>('PREPARING');
  const [timeLeft, setTimeLeft] = useState(isRecordingLimit);
  const [prepCount, setPrepCount] = useState(3);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionError, setPermissionError] = useState(false);
  const [interruptionTriggered, setInterruptionTriggered] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const aiCanvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null); // For Speech-to-Text stub
  
  const [liveTranscript, setLiveTranscript] = useState("");
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);

  // 1. Initialize Hardware
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const initStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        activeStream = stream;
        streamRef.current = stream;
        
        if (videoRef.current) videoRef.current.srcObject = stream;
        
        // Audio Analysis
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 32;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(avg);
          requestAnimationFrame(updateLevel);
        };
        updateLevel();

      } catch (e) {
        console.error("Camera access denied", e);
        setPermissionError(true);
      }
    };
    initStream();
    return () => {
      if (activeStream) activeStream.getTracks().forEach(t => t.stop());
    };
  }, []);

  // 2. AI Avatar Animation (The "Halo")
  useEffect(() => {
    const canvas = aiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const drawAI = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pulsating Orb
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 50 + Math.sin(time * 0.1) * 5;
        
        // Outer Glow
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 2);
        gradient.addColorStop(0, '#10b981'); // Emerald Center
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#ecfdf5';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Waveform rings
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + (i * 20) + Math.sin(time * 0.2 + i) * 10, 0, Math.PI * 2);
            ctx.stroke();
        }

        time++;
        requestAnimationFrame(drawAI);
    };
    
    // Only run animation loop if AI is speaking to save resources, but for smooth transition we keep it ready
    const animationId = requestAnimationFrame(drawAI);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // 3. Text to Speech Logic
  const speakText = (text: string, onEnd?: () => void) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Clear queue
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1; // Slightly faster for business context
      utterance.pitch = 1.0;
      
      // Try to get a specific voice (English)
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback if no TTS
      setTimeout(() => { if (onEnd) onEnd(); }, 3000);
    }
  };

  // 4. Session Orchestration
  useEffect(() => {
    if (sessionState === 'PREPARING') {
      const timer = setTimeout(() => {
        if (prepCount > 0) {
            setPrepCount(p => p - 1);
        } else {
            // Start AI Question
            setSessionState('AI_SPEAKING');
            speakText(questionText, () => {
                startRecording(); // Start recording after AI finishes
            });
        }
      }, 1000);
      return () => clearTimeout(timer);
    } 
    
    if (sessionState === 'RECORDING') {
      const timer = setTimeout(() => {
         if (timeLeft > 0) {
             setTimeLeft(t => t - 1);
             // Logic for Interruption: Trigger random interruption between 10s and 20s if not yet triggered
             if (!interruptionTriggered && !isPractice && timeLeft < (isRecordingLimit - 10) && timeLeft > (isRecordingLimit - 25) && Math.random() > 0.9) {
                 triggerInterruption();
             }
         } else {
             handleStopRecording();
         }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionState, prepCount, timeLeft]);

  const triggerInterruption = () => {
      setInterruptionTriggered(true);
      if (mediaRecorderRef.current) mediaRecorderRef.current.pause(); // Pause recording
      
      setSessionState('INTERRUPTED');
      const randomInterruption = INTERRUPTION_SCRIPTS[Math.floor(Math.random() * INTERRUPTION_SCRIPTS.length)];
      
      speakText(randomInterruption, () => {
          setSessionState('RECORDING');
          if (mediaRecorderRef.current) mediaRecorderRef.current.resume();
      });
  };

  const startRecording = () => {
    setSessionState('RECORDING');
    if (streamRef.current) {
        try {
            const recorder = new MediaRecorder(streamRef.current);
            chunksRef.current = [];
            recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
            recorder.start();
            mediaRecorderRef.current = recorder;
            
            // Stub for Speech Recognition (Browser support varies)
            if ('webkitSpeechRecognition' in window) {
                const SpeechRecognition = (window as any).webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.onresult = (event: any) => {
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        interimTranscript += event.results[i][0].transcript;
                    }
                    setLiveTranscript(prev => interimTranscript); // In real app, append properly
                };
                recognition.start();
                recognitionRef.current = recognition;
            }
        } catch (e) {
            console.error("Recorder start error", e);
        }
    }
  };

  const handleStopRecording = () => {
    setSessionState('PROCESSING');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }

    setTimeout(() => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        // Use live transcript if available, else a stub so the demo flow continues
        const finalTranscript = liveTranscript.length > 5 ? liveTranscript : "(Transcript unavailable in this browser environment. AI analysis will simulate based on audio patterns.)";
        onRecordingComplete(blob, finalTranscript, integrityEvents);
    }, 1500);
  };

  if (permissionError) {
      return (
          <div className="h-64 flex flex-col items-center justify-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300">
              <Zap size={32} className="text-red-500 mb-4" />
              <p className="text-slate-900 font-bold">Hardware Access Denied</p>
              <p className="text-slate-500 text-sm">Please allow camera/microphone access to continue.</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-in fade-in duration-700">
      
      {/* HEADER INFO */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full">
            <Activity size={14} className="text-emerald-600" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{category} Assessment</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight">"{questionText}"</h2>
      </div>

      {/* VIDEO CONTAINER */}
      <div className="relative aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-900 group">
        
        {/* AI AVATAR LAYER (Visible when AI speaks) */}
        <canvas 
            ref={aiCanvasRef}
            width={640}
            height={480}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${sessionState === 'AI_SPEAKING' || sessionState === 'INTERRUPTED' ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}
        />

        {/* USER VIDEO LAYER */}
        <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 transform ${sessionState === 'AI_SPEAKING' || sessionState === 'INTERRUPTED' ? 'scale-90 opacity-40 blur-sm' : 'scale-100 opacity-100'}`} 
        />

        {/* HUD OVERLAYS */}
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-30">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`px-4 py-1.5 rounded-lg backdrop-blur-md border flex items-center gap-2 ${sessionState === 'RECORDING' ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-slate-800/50 border-white/10 text-white'}`}>
                        <div className={`w-2 h-2 rounded-full ${sessionState === 'RECORDING' ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></div>
                        <span className="text-xs font-bold uppercase tracking-widest">
                            {sessionState === 'AI_SPEAKING' ? 'INTERVIEWER SPEAKING' : sessionState === 'INTERRUPTED' ? 'INTERRUPTION' : sessionState}
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end">
                    <div className="text-4xl font-mono font-bold text-white tabular-nums tracking-tighter drop-shadow-lg">
                        00:{sessionState === 'PREPARING' ? `0${prepCount}` : timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </div>
                </div>
            </div>

            {/* Interruption Overlay */}
            {sessionState === 'INTERRUPTED' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600/90 text-white px-8 py-4 rounded-2xl font-bold text-xl uppercase tracking-widest animate-pulse border border-red-400 shadow-2xl">
                        Interruption Detected
                    </div>
                </div>
            )}

            {/* Bottom Bar */}
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-48 bg-black/40 backdrop-blur rounded-xl border border-white/10 flex items-center px-3 gap-1">
                        <Mic size={14} className="text-slate-400" />
                        {/* Audio Visualizer Bars */}
                        {[...Array(12)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-2 rounded-full transition-all duration-75 ${sessionState === 'AI_SPEAKING' ? 'bg-emerald-400' : 'bg-white'}`}
                                style={{ height: `${Math.max(10, Math.min(100, (sessionState === 'AI_SPEAKING' ? 80 : audioLevel) * (Math.random() + 0.5)))}%`, opacity: 0.8 }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex justify-center">
        {sessionState === 'RECORDING' && (
            <button onClick={handleStopRecording} className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <Square size={18} fill="currentColor" /> Finish Answer
            </button>
        )}
        {sessionState === 'PROCESSING' && (
            <div className="flex items-center gap-3 text-emerald-600 font-bold animate-pulse">
                <Brain size={24} />
                <span>Generating Psychometric Profile...</span>
            </div>
        )}
        {sessionState === 'AI_SPEAKING' && (
            <div className="flex items-center gap-3 text-emerald-600 font-bold">
                 <Volume2 className="animate-pulse" /> Listening to Interviewer...
            </div>
        )}
      </div>

    </div>
  );
};

export default VideoRecorder;
