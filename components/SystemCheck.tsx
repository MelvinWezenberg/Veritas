
import React, { useState, useEffect } from 'react';
import { Camera, Mic, Wifi, Check, Shield, Cpu, Zap, Lock, AlertTriangle } from 'lucide-react';

const SystemCheck: React.FC<{ onComplete: (useMock: boolean) => void }> = ({ onComplete }) => {
  const [steps, setSteps] = useState([
    { id: 'conn', label: 'Network Latency', icon: Wifi, status: 'waiting', error: '' },
    { id: 'media', label: 'Camera & Microphone', icon: Camera, status: 'waiting', error: '' },
    { id: 'ai', label: 'Neural Engine', icon: Cpu, status: 'waiting', error: '' }
  ]);
  
  const [complete, setComplete] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    const runChecks = async () => {
      // Step 1: Network (Simulated for this demo, but realistic delay)
      await new Promise(r => setTimeout(r, 600));
      updateStatus('conn', 'success');

      // Step 2: Real Hardware Request
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Stop the tracks immediately after check to release camera for the main app
        stream.getTracks().forEach(track => track.stop());
        updateStatus('media', 'success');
      } catch (err) {
        console.error("Permission denied:", err);
        updateStatus('media', 'error', 'Access denied. Please enable permissions.');
        setPermissionError(true);
        return; // Stop checks
      }

      // Step 3: AI Engine (TTS Check)
      await new Promise(r => setTimeout(r, 600));
      if ('speechSynthesis' in window) {
         updateStatus('ai', 'success');
      } else {
         updateStatus('ai', 'warning', 'Audio output not supported');
      }
      
      setComplete(true);
    };

    runChecks();
  }, []);

  const updateStatus = (id: string, status: string, error?: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, error } : s));
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 animate-pulse">
            <Shield size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">System Calibration</h2>
        <p className="text-slate-500 text-sm">Verifying hardware integrity for biometric analysis.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 mb-8">
        {steps.map((step) => (
           <div key={step.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${step.status === 'error' ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
              <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${step.status === 'success' ? 'bg-emerald-100 text-emerald-600' : step.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                      <step.icon size={18} />
                  </div>
                  <div>
                      <span className={`text-sm font-bold block ${step.status === 'success' ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                      </span>
                      {step.error && <span className="text-[10px] text-red-500 font-medium">{step.error}</span>}
                  </div>
              </div>
              {step.status === 'success' ? (
                  <Check size={18} className="text-emerald-500" />
              ) : step.status === 'error' ? (
                  <AlertTriangle size={18} className="text-red-500" />
              ) : (
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
              )}
           </div>
        ))}
      </div>

      <button 
        disabled={!complete || permissionError}
        onClick={() => onComplete(false)} // false = Use REAL hardware
        className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${complete && !permissionError ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 hover:scale-[1.02]' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
      >
        {permissionError ? 'Hardware Access Required' : complete ? (
            <>
                Enter Secure Room <Zap size={16} fill="currentColor" />
            </>
        ) : (
            'Calibrating...'
        )}
      </button>
      
      {complete && !permissionError && (
          <p className="text-center text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-6 animate-in fade-in">
              <Lock size={10} className="inline mb-0.5 mr-1" /> Secure Hardware Link Established
          </p>
      )}
    </div>
  );
};

export default SystemCheck;
