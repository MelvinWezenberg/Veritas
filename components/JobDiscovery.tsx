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
          <div className="p-10 glass rounded-[48px] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={120} className="text-blue-500" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
              Verified Skills <br />
              <span className="text-zinc-500">Not Just Paper.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-md mb-8 leading-relaxed">
              Resumes are outdated. Vera AI verifies your technical depth through real-time neural probes, putting your skills directly in front of top engineering leads.
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Search size={16} /> Explore Open Roles
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 glass rounded-[40px] border border-white/10 h-full">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={14} /> Active Tracking
            </h3>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-sm">Application {app.id.slice(0, 4)}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{app.status.replace('_', ' ')}</p>
                    </div>
                    <ArrowRight size={16} className="text-zinc-700 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-10">
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
          <h2 className="text-2xl font-black tracking-tight">On-Demand Opportunities</h2>
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <Zap size={12} className="text-yellow-500" /> Instant Interview Enabled
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_JOBS.map((job) => (
            <div key={job.id} className="p-8 glass rounded-[40px] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all hover:translate-y-[-4px] group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                    <Star size={20} className="text-zinc-400 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    High Match
                  </span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight mb-1">{job.title}</h3>
                <p className="text-zinc-500 font-bold text-sm mb-4">{job.company}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <MapPin size={12} /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <DollarSign size={12} /> {job.salary}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-zinc-400 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onApply(job)}
                className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-white/5"
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
