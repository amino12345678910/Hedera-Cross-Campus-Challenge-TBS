import React, { useState } from 'react';
import { 
  FinancialEvent, 
  EventCategory 
} from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  Smartphone, 
  Landmark, 
  Home, 
  Zap, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Filter,
  ExternalLink,
  Search,
  Calendar,
  Layers
} from 'lucide-react';

interface EventTimelineProps {
  events: FinancialEvent[];
  onOpenVerifyModal: (selectedEvent?: FinancialEvent) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  onOpenVerifyModal
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'OBLIGATION' | 'INCOME' | 'MICRO_LOAN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (category: EventCategory) => {
    switch (category) {
      case 'EDUCATION':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'INCOME':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'UTILITY':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'MICRO_LOAN':
        return <Landmark className="w-4 h-4 text-blue-400" />;
      case 'HOUSING':
        return <Home className="w-4 h-4 text-amber-400" />;
      case 'MEMBERSHIP':
        return <Zap className="w-4 h-4 text-slate-300" />;
      default:
        return <Landmark className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (event: FinancialEvent) => {
    switch (event.status) {
      case 'PAID_ON_TIME':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid on time
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case 'PAID_LATE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            {event.daysLate} days late (cured)
          </span>
        );
      case 'DEFAULTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Defaulted
          </span>
        );
      default:
        return null;
    }
  };

  const filteredEvents = events.filter(e => {
    if (activeFilter === 'OBLIGATION' && !e.isObligation) return false;
    if (activeFilter === 'INCOME' && e.category !== 'INCOME') return false;
    if (activeFilter === 'MICRO_LOAN' && e.category !== 'MICRO_LOAN') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.counterparty.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.amount.toString().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
      
      {/* Timeline Controls & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Financial Event Timeline
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-slate-100 text-slate-700">
              {events.length} Events Audited
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological log of obligations and settlements verified against Hedera Consensus Service.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenVerifyModal()}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify Evidence</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setActiveFilter('OBLIGATION')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeFilter === 'OBLIGATION'
                ? 'bg-blue-50 text-blue-800 border border-blue-200 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Obligations (12)
          </button>
          <button
            onClick={() => setActiveFilter('MICRO_LOAN')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeFilter === 'MICRO_LOAN'
                ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Micro-Loans (6)
          </button>
          <button
            onClick={() => setActiveFilter('INCOME')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeFilter === 'INCOME'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Inflow (3)
          </button>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payments, vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-60 pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 shadow-2xs"
          />
        </div>

      </div>

      {/* Timeline Stream List */}
      <div className="mt-8 relative">
        
        {/* Subtle Vertical Connector Line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-200 hidden sm:block" />

        <div className="space-y-3.5">
          {filteredEvents.map((evt) => {
            const isIncome = evt.category === 'INCOME';

            return (
              <div
                key={evt.id}
                className="relative pl-0 sm:pl-12 group transition-all"
              >
                {/* Node Bullet on Connector Line */}
                <div className="hidden sm:flex absolute left-4 top-4 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-emerald-600 transition-all items-center justify-center z-10 shadow-xs">
                  <div className={`w-1.5 h-1.5 rounded-full ${isIncome ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                </div>

                {/* Event Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Event Title & Metadata */}
                    <div className="flex items-start space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        {getCategoryIcon(evt.category)}
                      </div>
                      
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {evt.title}
                          </h4>
                          {getStatusBadge(evt)}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="text-slate-800 font-semibold">{evt.counterparty}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center text-slate-500">
                            <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                            {evt.date}
                          </span>
                          {evt.dueDate && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-400">
                                Due: {evt.dueDate}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>
                    </div>

                    {/* Amount & Hedera Verification Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 border-slate-200/80 pt-3 sm:pt-0">
                      <div className={`text-base sm:text-lg font-bold font-mono ${
                        isIncome ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {isIncome ? '+' : '-'}{evt.amount.toLocaleString()} {evt.currency}
                      </div>

                      {/* Hedera Consensus Badge / Action */}
                      <button
                        onClick={() => onOpenVerifyModal(evt)}
                        title="Click to view Hedera Consensus Service running hash & sequence"
                        className="mt-1.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-emerald-700 border border-slate-200 text-[11px] font-mono font-semibold transition-colors shadow-2xs"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>HCS #{evt.proof.sequenceNumber}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
