
import React, { useState, useMemo } from 'react';
import { Job, Application } from '../types';
import { MOCK_JOBS } from '../constants';
import { Search, MapPin, DollarSign, Clock, Briefcase, Filter, ArrowUpRight, Zap, Building2, CheckCircle2, SlidersHorizontal, X, Globe, TrendingUp } from 'lucide-react';

interface JobDiscoveryProps {
  onApply: (job: Job) => void;
  applications: Application[];
}

const JobDiscovery: React.FC<JobDiscoveryProps> = ({ onApply, applications }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'REMOTE' | 'HIGH_PAY' | 'ENGINEERING'>('ALL');

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      // 1. Text Search
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Category Filters
      if (selectedFilter === 'REMOTE') {
        return job.location.toLowerCase().includes('remote');
      }
      if (selectedFilter === 'HIGH_PAY') {
        // Simple heuristic for mock data: check if salary string contains high numbers
        return job.salary.includes('$2') || job.salary.includes('$3');
      }
      if (selectedFilter === 'ENGINEERING') {
        return job.title.toLowerCase().includes('engineer') || job.tags.includes('Rust') || job.tags.includes('Go');
      }

      return true;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* HEADER & SEARCH */}
      <div className="mb-8 space-y-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Find your next role</h1>
           <p className="text-slate-500 mt-1">Discover verified opportunities matching your skills.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                    placeholder="Search by title, skill, or company (e.g. 'Distributed Systems')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                {[
                    { id: 'ALL', label: 'Recommended' },
                    { id: 'REMOTE', label: 'Remote Only', icon: Globe },
                    { id: 'HIGH_PAY', label: '$200k+', icon: DollarSign },
                    { id: 'ENGINEERING', label: 'Engineering', icon: Briefcase },
                ].map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id as any)}
                        className={`whitespace-nowrap flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${
                            selectedFilter === filter.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        {filter.icon && <filter.icon size={16} />}
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: JOB FEED */}
        <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'Result' : 'Results'}
                </span>
                <span className="text-xs font-medium text-emerald-600 cursor-pointer hover:underline">
                    Save search alert
                </span>
            </div>

            {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                    <div key={job.id} className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500/30 hover:shadow-lg transition-all relative overflow-hidden">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex gap-4">
                                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                                    <Building2 className="text-slate-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="text-slate-500 font-medium text-sm mt-0.5 mb-2">
                                        {job.company}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-slate-400" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign size={14} className="text-slate-400" />
                                            {job.salary}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                            <Clock size={12} />
                                            Posted 2 days ago
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="hidden md:block">
                                <button 
                                    onClick={() => onApply(job)}
                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-500 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                                >
                                    <Zap size={16} fill="currentColor" /> Instant Apply
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                                {job.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-bold border border-slate-100 whitespace-nowrap">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Mobile only button */}
                            <button 
                                onClick={() => onApply(job)}
                                className="md:hidden p-2 bg-emerald-50 text-emerald-600 rounded-full"
                            >
                                <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
                    <button 
                        onClick={() => {setSearchQuery(''); setSelectedFilter('ALL');}}
                        className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>

        {/* RIGHT COLUMN: WIDGETS */}
        <div className="lg:col-span-4 space-y-6">
            {/* Widget 1: Application Tracker */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900">My Applications</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                        {applications.length}
                    </span>
                </div>
                
                {applications.length > 0 ? (
                    <div className="space-y-4">
                        {applications.slice(0, 3).map(app => (
                            <div key={app.id} className="flex items-start gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="mt-1">
                                    {app.status === 'ASSESSMENT_COMPLETE' ? (
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">
                                        {MOCK_JOBS.find(j => j.id === app.jobId)?.title || 'Application'}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                                        {MOCK_JOBS.find(j => j.id === app.jobId)?.company} • <span className="text-emerald-600">{app.status.replace('_', ' ').toLowerCase()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors border rounded-lg border-slate-100 hover:bg-slate-50">
                            View All History
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-sm text-slate-400">No active applications.</p>
                        <p className="text-xs text-slate-400 mt-1">Start an assessment to get verified.</p>
                    </div>
                )}
            </div>

            {/* Widget 2: Profile Strength */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp size={80} />
                </div>
                <h3 className="font-bold text-lg mb-1 relative z-10">Profile Strength</h3>
                <div className="flex items-end gap-2 mb-4 relative z-10">
                    <span className="text-4xl font-bold text-emerald-400">Intermediate</span>
                </div>
                
                <div className="w-full bg-white/10 h-2 rounded-full mb-4 relative z-10">
                    <div className="h-full bg-emerald-500 rounded-full w-[65%]"></div>
                </div>
                
                <p className="text-xs text-slate-300 mb-6 leading-relaxed relative z-10">
                    Complete 1 more assessment to reach <strong className="text-white">Senior</strong> status and unlock premium roles.
                </p>
                
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors relative z-10">
                    Verify New Skill
                </button>
            </div>

            {/* Widget 3: Helpful Links */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4 text-sm">Resources</h3>
                <ul className="space-y-3">
                    {['Salary Calculator', 'Interview Prep Guide', 'Market Trends 2026'].map((item, i) => (
                        <li key={i} className="flex items-center justify-between text-sm text-slate-600 hover:text-emerald-600 cursor-pointer group">
                            {item}
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};

export default JobDiscovery;
