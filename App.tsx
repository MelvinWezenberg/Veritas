
import React, { useState, useEffect } from 'react';
import { AppState, Candidate, InterviewResult, Job, Application } from './types';
import Auth from './components/Auth';
import InterviewFlow from './components/InterviewFlow';
import RecruiterDashboard from './components/RecruiterDashboard';
import SystemCheck from './components/SystemCheck';
import JobDiscovery from './components/JobDiscovery';
import LandingPage from './components/LandingPage';
import { Shield, LayoutDashboard, UserCheck, Users, Briefcase, Home, LogOut, Settings, BarChart2, Hexagon, ChevronRight } from 'lucide-react';

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const handleLogin = (user: Candidate) => {
    setCurrentUser(user);
    setAppState(AppState.JOB_BOARD);
  };

  const handleApply = (job: Job) => {
    setActiveJob(job);
    // Auto-heal session if user bypassed Auth
    if (!currentUser) {
        const guest: Candidate = {
            id: 'guest-' + Math.random().toString(36).substr(2, 9),
            name: 'Candidate Prototype',
            email: 'guest@veritas.ai',
            provider: 'LinkedIn',
            metadata: { accountAgeYears: 5, connectionDensity: 7, profileCompletion: 80 },
            experienceYears: 5,
            seniorityLevel: 'Senior'
        };
        setCurrentUser(guest);
    }
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

  const renderPublicSite = () => (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100">
        <header className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setAppState(AppState.LANDING)}>
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:bg-emerald-500 transition-colors">
                        <Hexagon size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">Veritas <span className="text-emerald-600">AI</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                        <a href="#" className="hover:text-slate-900 transition-colors">How it Works</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Case Studies</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
                    </nav>
                    <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
                    <button 
                        onClick={() => setAppState(AppState.AUTH)}
                        className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => setAppState(AppState.RECRUITER_PANEL)}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
                    >
                        Start Hiring
                    </button>
                </div>
            </div>
        </header>
        <main className="pt-20">
            <LandingPage 
                onCandidateEnter={() => setAppState(AppState.AUTH)} 
                onRecruiterEnter={() => setAppState(AppState.RECRUITER_PANEL)} 
            />
        </main>
    </div>
  );

  const renderAppLayout = () => (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
        {/* Fixed Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 z-20 shadow-sm">
            <div>
                <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => setAppState(AppState.LANDING)}>
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:bg-emerald-500 transition-colors">
                        <Hexagon size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight block leading-none text-slate-900">Veritas</span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Enterprise</span>
                    </div>
                </div>

                <nav className="space-y-2">
                    <div className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</div>
                    <button 
                        onClick={() => setAppState(AppState.JOB_BOARD)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all sidebar-item ${appState === AppState.JOB_BOARD ? 'bg-emerald-50 text-emerald-700 active font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        <Briefcase size={18} /> Opportunities
                    </button>
                    <button 
                        onClick={() => setAppState(AppState.DASHBOARD)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all sidebar-item ${appState === AppState.DASHBOARD ? 'bg-emerald-50 text-emerald-700 active font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        <UserCheck size={18} /> My Profile
                    </button>
                    
                    <div className="mt-8 px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiring Console</div>
                    <button 
                        onClick={() => setAppState(AppState.RECRUITER_PANEL)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all sidebar-item ${appState === AppState.RECRUITER_PANEL ? 'bg-emerald-50 text-emerald-700 active font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        <LayoutDashboard size={18} /> Recruiter Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                        <BarChart2 size={18} /> Analytics
                    </button>
                </nav>
            </div>

            <div>
                <div className="p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">System Online</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 relative z-10">Veritas Engine v5.2</p>
                    <p className="text-[10px] text-slate-400 relative z-10">Low Latency Mode</p>
                </div>
                <button onClick={() => setAppState(AppState.LANDING)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all">
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-slate-50">
            <div className="relative z-10 min-h-full">
                {appState === AppState.AUTH && <div className="h-screen flex items-center justify-center"><Auth onLogin={handleLogin} /></div>}
                
                {appState === AppState.JOB_BOARD && (
                    <div className="p-10 max-w-7xl mx-auto">
                        <JobDiscovery onApply={handleApply} applications={applications} />
                    </div>
                )}
                
                {appState === AppState.SYSTEM_CHECK && <SystemCheck onComplete={handleSystemCheckComplete} />}
                
                {appState === AppState.INTERVIEW && (
                    <div className="h-screen flex flex-col justify-center bg-white">
                        {(currentUser || allCandidates[0]) ? 
                            <InterviewFlow candidate={currentUser || allCandidates[0]} onComplete={handleInterviewComplete} /> 
                        : null}
                    </div>
                )}

                {appState === AppState.DASHBOARD && (
                     <div className="h-screen flex items-center justify-center bg-white">
                        <div className="text-center max-w-lg">
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-xl">
                                <UserCheck size={40} className="text-emerald-600" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">Application Verified</h2>
                            <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                                Your skills have been validated and added to your profile. Recruiters can now see your verified technical strengths.
                            </p>
                            <button 
                                onClick={() => setAppState(AppState.JOB_BOARD)} 
                                className="px-8 py-4 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                            >
                                Browse More Roles
                            </button>
                        </div>
                     </div>
                )}

                {appState === AppState.RECRUITER_PANEL && (
                    <div className="h-screen overflow-hidden bg-slate-50">
                        <RecruiterDashboard candidates={allCandidates} />
                    </div>
                )}
            </div>
        </main>
    </div>
  );

  return appState === AppState.LANDING ? renderPublicSite() : renderAppLayout();
};

export default App;
