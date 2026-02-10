
import React from 'react';
import { Job, Application } from '../types';
import { MOCK_JOBS } from '../constants';
import { Search, Briefcase, MapPin, DollarSign, ArrowRight, Clock, Sparkles, Zap, Star } from 'lucide-react';

interface JobDiscoveryProps {
  onApply: (job: Job) => void;
  applications: Application[];
}

const JobDiscovery: React.FC<JobDiscoveryProps> = ({ onApply, applications }) => {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      {/* Welcome & Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 glass rounded-[48px] border border-emerald-500/10 relative overflow-hidden group bg-gradient-to-br from-[#064e3b] to-[#022c22]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={120} className="text-amber-400" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
              Verified Skills <br />
              <span className="text-emerald-100/40">Not Just Paper.</span>
            </h1>
            <p className="text-emerald-100/70 text-lg max-w-md mb-8 leading-relaxed">
              Resumes are outdated. Vera AI verifies your technical depth through real-time neural probes, putting your skills directly in front of top engineering leads.
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 transition-colors cursor-pointer">
                <Search size={16} /> Explore Open Roles
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 glass rounded-[40px] border border-emerald-500/10 h-full bg-[#064e3b]/40">
            <h3 className="text-xs font-black text-emerald-100/40 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={14} /> Active Tracking
            </h3>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="p-4 bg-emerald-900/40 rounded-2xl border border-emerald-500/10 flex items-center justify-between group hover:bg-emerald-500/10 transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-sm text-white">Application {app.id.slice(0, 4)}</p>
                      <p className="text-[10px] text-emerald-100/50 font-mono">{app.status.replace('_', ' ')}</p>
                    </div>
                    <ArrowRight size={16} className="text-emerald-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-10 text-emerald-100">
                <Briefcase size={40} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">No active applications <br /> Initiate a probe to begin.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Job List */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-4">
          <h2 className="text-2xl font-black tracking-tight text-white">On-Demand Opportunities</h2>
          <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
            <Zap size={12} className="text-amber-500" /> Instant Interview Enabled
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_JOBS.map((job) => (
            <div key={job.id} className="p-8 glass rounded-[40px] border border-emerald-500/10 flex flex-col justify-between hover:border-emerald-500/30 transition-all hover:translate-y-[-4px] group bg-[#064e3b]/30">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                    <Star size={20} className="text-emerald-100/30 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    High Match
                  </span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight mb-1 text-white">{job.title}</h3>
                <p className="text-emerald-100/60 font-bold text-sm mb-4">{job.company}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-emerald-100/40">
                    <MapPin size={12} /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-100/40">
                    <DollarSign size={12} /> {job.salary}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-emerald-900/50 rounded-full text-[10px] font-bold text-emerald-100/60 border border-emerald-500/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onApply(job)}
                className="w-full py-4 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl shadow-emerald-900/10"
              >
                Start Instant Assessment <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JobDiscovery;
