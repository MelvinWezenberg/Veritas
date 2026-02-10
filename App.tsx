import React, { useState, useEffect } from 'react';
import { AppState, Candidate, InterviewResult, Job, Application } from './types';
import Auth from './components/Auth';
import InterviewFlow from './components/InterviewFlow';
import RecruiterDashboard from './components/RecruiterDashboard';
import SystemCheck from './components/SystemCheck';
import Tour from './components/Tour';
import JobDiscovery from './components/JobDiscovery';
import LandingPage from './components/LandingPage';
import { Shield, LayoutDashboard, UserCheck, Users, Info, Briefcase, Home } from 'lucide-react';

const MOCK_CANDIDATES: (Candidate & { results?: InterviewResult })[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    email: 'sarah.c@example.com',
    provider: 'LinkedIn',
    metadata: { accountAgeYears: 8, connectionDensity: 9, profileCompletion: 95, isGhost: false },
    experienceYears: 7,
    seniorityLevel: 'Senior',
    results: {
      candidateId: 'c1',
      overallScore: 92,
      aiRecommendation: 'HIRE',
      aiDecisionReason: 'Expert knowledge of distributed consensus; strong communication during follow-up.',
      timestamp: new Date().toISOString(),
      integrityLog: [],
      responses: [
        {
          questionId: '1',
          transcript: "In distributed systems, Redis locks use the Redlock algorithm. During a network partition, we require a majority quorum of nodes to maintain safety. I've implemented this in high-throughput payment pipelines before...",
          scores: { technicalAccuracy: 95, coherence: 90, authenticity: 95, seniorityAlignment: 90 },
          flags: [],
          followUp: {
            probe: "How would you handle clock drift between Redis nodes in this scenario?",
            response: "Clock drift is mitigated by adding a drift factor to the TTL calculation. If the elapsed time + drift exceeds the limit, the lock is invalid.",
            score: 94
          }
        }
      ]
    }
  }
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [currentUser, setCurrentUser] = useState<Candidate | null>(null);
  const [allCandidates, setAllCandidates] = useState(MOCK_CANDIDATES);
  const [showTour, setShowTour] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  useEffect(() => {
    // Only show tour if not in Landing or Auth state to avoid clutter
    if (appState !== AppState.LANDING && appState !== AppState.AUTH && appState !== AppState.RECRUITER_PANEL) {
      const hasSeenTour = localStorage.getItem('vera_tour_seen');
      if (!hasSeenTour) {
        setShowTour(true);
      }
    }
  }, [appState]);

  const handleLogin = (user: Candidate) => {
    setCurrentUser(user);
    setAppState(AppState.JOB_BOARD);
  };

  const handleApply = (job: Job) => {
    setActiveJob(job);
    setAppState(AppState.SYSTEM_CHECK);
  };

  const handleSystemCheckComplete = () => {
    setAppState(AppState.INTERVIEW);
  };

  const handleInterviewComplete = (result: InterviewResult) => {
    if (currentUser && activeJob) {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        jobId: activeJob.id,
        candidateId: currentUser.id,
        status: 'ASSESSMENT_COMPLETE',
        timestamp: new Date().toISOString(),
        result: result
      };
      setApplications(prev => [newApp, ...prev]);
      
      const updatedUser = { ...currentUser, results: result };
      setAllCandidates(prev => [updatedUser, ...prev]);
      setCurrentUser(updatedUser);
    }
    setAppState(AppState.DASHBOARD);
  };

  const isRecruiterMode = appState === AppState.RECRUITER_PANEL;

  const toggleMode = () => {
    if (isRecruiterMode) {
      setAppState(AppState.LANDING);
    } else {
      setAppState(AppState.RECRUITER_PANEL);
    }
  };

  const renderContent = () => {
    switch(appState) {
      case AppState.LANDING:
        return <LandingPage 
          onCandidateEnter={() => setAppState(AppState.AUTH)} 
          onRecruiterEnter={() => setAppState(AppState.RECRUITER_PANEL)} 
        />;
      case AppState.AUTH:
        return <Auth onLogin={handleLogin} />;
      case AppState.JOB_BOARD:
        return <JobDiscovery onApply={handleApply} applications={applications} />;
      case AppState.SYSTEM_CHECK:
        return <SystemCheck onComplete={handleSystemCheckComplete} />;
      case AppState.INTERVIEW:
        return currentUser ? <InterviewFlow candidate={currentUser} onComplete={handleInterviewComplete} /> : null;
      case AppState.DASHBOARD:
        return (
          <div className="text-center py-20 flex flex-col items-center animate-in fade-in zoom-in duration-700">
             <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500 border border-green-500/20 shadow-lg shadow-green-500/10">
                <UserCheck size={40} />
             </div>
             <h2 className="text-4xl font-bold mb-4 tracking-tight">Assessment Secured</h2>
             <p className="text-zinc-400 mb-10 max-w-md leading-relaxed">Your neural probe is complete. Your verified skills are now being presented to the hiring team at {activeJob?.company}.</p>
             <div className="p-8 glass rounded-[32px] text-left max-w-md w-full border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Protocol Status</span>
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-green-500/20">Final Review</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-sm font-bold text-white mb-1">Neural Verification</p>
                     <p className="text-xs text-zinc-400">Technical depth matched against {activeJob?.title} requirements.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-sm font-bold text-white mb-1">Verified Identity</p>
                     <p className="text-xs text-zinc-400">Interaction session cross-verified with professional graph.</p>
                  </div>
                </div>
             </div>
             <button 
              onClick={() => setAppState(AppState.JOB_BOARD)} 
              className="mt-12 text-zinc-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
             >
               Back to Career Ecosystem
             </button>
          </div>
        );
      case AppState.RECRUITER_PANEL:
        return <RecruiterDashboard candidates={allCandidates} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-blue-500/30">
      {showTour && <Tour onComplete={() => {
        localStorage.setItem('vera_tour_seen', 'true');
        setShowTour(false);
      }} />}

      <header className="border-b border-white/5 p-5 backdrop-blur-3xl bg-black/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setAppState(AppState.LANDING)}>
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
              <Shield size={20} className="text-black" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tighter uppercase text-white">Vera</span>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Career Ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {appState !== AppState.LANDING && (
              <div className="flex bg-black/80 p-1.5 rounded-full border border-white/10 shadow-inner">
                 <button 
                   onClick={() => isRecruiterMode && setAppState(AppState.JOB_BOARD)}
                   className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${!isRecruiterMode ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   <Briefcase size={14} /> Ecosystem
                 </button>
                 <button 
                   onClick={() => !isRecruiterMode && setAppState(AppState.RECRUITER_PANEL)}
                   className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isRecruiterMode ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   <LayoutDashboard size={14} /> Employer Hub
                 </button>
              </div>
            )}
            
            {/* Show Home Button on Recruiter or Auth screens to get back to Landing */}
            <button 
              onClick={() => setAppState(AppState.LANDING)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <Home size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-0 relative">
         <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none"></div>
         <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[160px] rounded-full pointer-events-none"></div>
         
         <div className="relative z-10 h-full">
            {renderContent()}
         </div>
      </main>

      {appState !== AppState.LANDING && (
        <footer className="border-t border-white/5 p-6 text-center">
          <span className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.3em]">
            Verified Identity Protocol // Vera AI v5.0.0
          </span>
        </footer>
      )}
    </div>
  );
};

export default App;
