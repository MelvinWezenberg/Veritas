import React, { useState } from 'react';
import { Shield, Linkedin, Mail, Loader2 } from 'lucide-react';
import { Candidate } from '../types';

interface AuthProps {
  onLogin: (user: Candidate) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleSocialLogin = (provider: 'LinkedIn' | 'Google') => {
    setIsAnalyzing(true);
    
    // Simulate Ghost Account Detection Algorithm delay
    setTimeout(() => {
      setIsAnalyzing(false);
      
      const mockCandidate: Candidate = {
        id: `user-${Date.now()}`,
        name: provider === 'LinkedIn' ? 'Jordan Lee' : 'Alex Burner',
        email: provider === 'LinkedIn' ? 'jordan.lee@tech.co' : 'temp1234@gmail.com',
        provider: provider,
        metadata: {
          accountAgeYears: provider === 'LinkedIn' ? 5.4 : 0.1,
          connectionDensity: provider === 'LinkedIn' ? 8.2 : 1.5,
          profileCompletion: provider === 'LinkedIn' ? 100 : 35,
          isGhost: provider === 'Google', // Simulating a burner account for Google login
        },
        experienceYears: provider === 'LinkedIn' ? 6 : 2,
        seniorityLevel: provider === 'LinkedIn' ? 'Senior' : 'Junior'
      };

      onLogin(mockCandidate);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-md mx-auto">
      <div className="mb-12 text-center">
        <div className="w-20 h-20 bg-white rounded-[32px] mx-auto mb-8 flex items-center justify-center shadow-2xl group transition-transform hover:rotate-6">
           <Shield size={36} className="text-black" />
        </div>
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">Vera AI</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Verified Career Ecosystem</p>
      </div>

      {isAnalyzing ? (
        <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
           <div className="relative">
             <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 animate-pulse"></div>
             <Loader2 size={56} className="text-blue-500 animate-spin relative z-10" />
           </div>
           <div className="text-center space-y-2">
             <p className="text-xl font-bold tracking-tight">Syncing Career Graph...</p>
             <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">VERIFYING_IDENTITY_STATE // OIDC_PROTO</p>
           </div>
           
           <div className="w-64 h-0.5 bg-zinc-800 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
           </div>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <button 
            onClick={() => handleSocialLogin('LinkedIn')}
            className="w-full p-5 bg-[#0077b5] hover:bg-[#006097] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-900/20"
          >
            <Linkedin size={20} />
            Connect LinkedIn Graph
          </button>
          
          <button 
            onClick={() => handleSocialLogin('Google')}
            className="w-full p-5 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <Mail size={20} />
            Connect Google Identity
          </button>

          <p className="text-[10px] text-zinc-600 text-center mt-8 max-w-xs mx-auto leading-relaxed font-bold uppercase tracking-widest">
            Vera AI bypasses the resume. By signing in, you initialize a verified interaction profile for instant interviewing.
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;
