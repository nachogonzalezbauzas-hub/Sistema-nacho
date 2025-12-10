import React, { useState, useMemo } from 'react';
import { LogEntry, LogCategory, UserStats, ActiveBuff } from '../types';
import { Card, LogCategoryBadge } from '../components/UIComponents';
import { Search, Target, Swords, Heart, Flame, Trophy, Terminal, Calendar, Sparkles, Zap, Activity, Brain, Dumbbell, DollarSign, Filter } from 'lucide-react';

interface LogsViewProps {
  logs: LogEntry[];
  stats: UserStats;
  activeBuffs: ActiveBuff[];
}

export const LogsView: React.FC<LogsViewProps> = ({ logs, stats, activeBuffs }) => {
  const [filter, setFilter] = useState<'All' | LogCategory>('All');
  const [search, setSearch] = useState('');

  // --- DATA PROCESSING ---

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesFilter = filter === 'All' || log.category === filter;
      const logMessage = log.message || (log as any).title || '';
      const logDetails = log.details || (log as any).description || '';

      const matchesSearch = logMessage.toLowerCase().includes(search.toLowerCase()) ||
        logDetails.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [logs, filter, search]);

  const groupedLogs = useMemo(() => {
    const groups: Record<string, LogEntry[]> = {};
    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let key = date.toLocaleDateString();
      if (date.toDateString() === today.toDateString()) key = 'Today';
      else if (date.toDateString() === yesterday.toDateString()) key = 'Yesterday';

      if (!groups[key]) groups[key] = [];
      groups[key].push(log);
    });
    return groups;
  }, [filteredLogs]);

  // Daily Stats Calculation
  const todayStats = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === todayStr);

    return {
      missions: todayLogs.filter(l => l.category === 'Mission').length,
      xp: todayLogs.reduce((acc, l) => acc + (l.xpChange || 0), 0),
      statsGained: stats.dailyGains ? Object.values(stats.dailyGains).reduce((a, b) => a + b, 0) : 0,
    };
  }, [logs, stats.dailyGains]);

  // 7-Day Activity Data
  const activityData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toDateString();
      const xp = logs
        .filter(l => new Date(l.timestamp).toDateString() === dayStr)
        .reduce((acc, l) => acc + (l.xpChange || 0), 0);
      days.push({ date: d, xp, isToday: i === 0 });
    }
    return days;
  }, [logs]);

  const maxXP = Math.max(...activityData.map(d => d.xp), 100); // Avoid div by zero

  // --- ICONS & STYLES ---

  const getIcon = (category: LogCategory) => {
    switch (category) {
      case 'Mission': return <Target size={16} className="text-blue-400" />;
      case 'LevelUp': return <Swords size={16} className="text-cyan-400" />;
      case 'Health': return <Heart size={16} className="text-pink-400" />;
      case 'Streak': return <Flame size={16} className="text-amber-400" />;
      case 'Achievement': return <Trophy size={16} className="text-purple-400" />;
      case 'Milestone': return <Sparkles size={16} className="text-yellow-400" />;
      case 'System': return <Terminal size={16} className="text-slate-400" />;
      default: return <Activity size={16} className="text-slate-400" />;
    }
  };

  const getBorderColor = (category: LogCategory) => {
    switch (category) {
      case 'Mission': return 'border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      case 'LevelUp': return 'border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.3)]';
      case 'Health': return 'border-pink-500/40';
      case 'Streak': return 'border-amber-500/40';
      case 'Achievement': return 'border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'Milestone': return 'border-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
      default: return 'border-slate-700';
    }
  };

  const FilterPill = ({ cat, label }: { cat: 'All' | LogCategory, label: string }) => (
    <button
      onClick={() => setFilter(cat)}
      className={`
        px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap
        ${filter === cat
          ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.6)] scale-105'
          : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:bg-slate-800 hover:border-blue-500/50 hover:text-blue-300'
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="flex justify-between items-end px-1 pb-2 border-b border-blue-900/30">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            SYSTEM LOGS
          </h2>
          <p className="text-xs text-blue-400/80 font-mono uppercase tracking-widest mt-1 flex items-center gap-2">
            <Activity size={12} />
            Insight Hub
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT COLUMN: SUMMARY & GRAPH */}
        <div className="space-y-6">

          {/* 1) DAILY SUMMARY CARD */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-slate-900/40 backdrop-blur-md shadow-[0_0_30px_rgba(37,99,235,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-900/10 pointer-events-none" />
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-500 group-hover:scale-110 transform">
              <Activity size={120} className="text-blue-400" />
            </div>

            <div className="relative p-5">
              <h3 className="text-xs font-bold text-blue-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_5px_#60a5fa]" />
                Daily Analysis
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white drop-shadow-sm tabular-nums tracking-tight">
                    +{todayStats.xp}
                  </span>
                  <span className="text-[9px] text-blue-400/70 font-bold uppercase tracking-wider">XP Gained</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white drop-shadow-sm tabular-nums tracking-tight">
                    {todayStats.missions}
                  </span>
                  <span className="text-[9px] text-blue-400/70 font-bold uppercase tracking-wider">Missions</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white drop-shadow-sm tabular-nums tracking-tight">
                    {todayStats.statsGained}
                  </span>
                  <span className="text-[9px] text-blue-400/70 font-bold uppercase tracking-wider">Stats Up</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-blue-500/20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/30 border border-blue-500/20">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-xs font-bold text-slate-300">
                    <span className="text-white">{activeBuffs.length}</span> Buffs
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/30 border border-blue-500/20">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-xs font-bold text-slate-300">
                    <span className="text-white">{stats.streak}</span> Day Streak
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2) 7-DAY ACTIVITY MINI-GRAPH */}
          <div className="rounded-2xl border border-blue-900/40 bg-slate-950/50 p-5 backdrop-blur-sm">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex justify-between">
              <span>7-Day Activity</span>
              <span className="text-blue-500/60">XP Trend</span>
            </h3>
            <div className="flex items-end justify-between h-24 gap-2">
              {activityData.map((day, i) => {
                const heightPercent = Math.max(10, (day.xp / maxXP) * 100);
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-[10px] text-white px-2 py-1 rounded border border-blue-500/30 whitespace-nowrap z-10 pointer-events-none">
                      {day.xp} XP
                    </div>
                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 ease-out relative overflow-hidden ${day.isToday
                        ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        : 'bg-blue-900/20 hover:bg-blue-800/40'
                        }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {day.isToday && <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />}
                    </div>
                    {/* Label */}
                    <span className={`text-[9px] font-mono uppercase ${day.isToday ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>
                      {day.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FILTERS & FEED */}
        <div className="space-y-4 h-full flex flex-col">

          {/* 4) FILTERS */}
          <div className="flex flex-col gap-3">
            <div className="relative group">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search system logs..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all placeholder:text-slate-600"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={14} />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              <FilterPill cat="All" label="All" />
              <FilterPill cat="Mission" label="Missions" />
              <FilterPill cat="LevelUp" label="Level Up" />
              <FilterPill cat="Health" label="Health" />
              <FilterPill cat="Streak" label="Streaks" />
              <FilterPill cat="Achievement" label="Awards" />
              <FilterPill cat="Milestone" label="Milestones" />
              <FilterPill cat="System" label="System" />
            </div>
          </div>

          {/* 3) BATTLE LOG FEED */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-6 min-h-[400px] scrollbar-thin scrollbar-thumb-blue-900/50 scrollbar-track-transparent">
            {Object.entries(groupedLogs).map(([dateLabel, groupLogs]) => (
              <div key={dateLabel} className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="sticky top-0 z-10 bg-[#030712]/95 backdrop-blur py-2 border-b border-blue-900/20">
                  <h4 className="text-[10px] font-bold text-blue-500/70 uppercase tracking-widest pl-1">
                    {dateLabel}
                  </h4>
                </div>

                {groupLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="group relative pl-4 transition-all duration-300 hover:scale-[1.01]"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Timeline Line */}
                    <div className="absolute left-[7px] top-8 bottom-[-12px] w-[1px] bg-slate-800 group-last:hidden" />

                    <div className={`
                      relative flex gap-4 p-3.5 rounded-xl border bg-slate-900/40 backdrop-blur-sm
                      hover:bg-slate-800/60 transition-all duration-300
                      ${getBorderColor(log.category)}
                    `}>
                      {/* Icon Box */}
                      <div className={`
                        relative z-10 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                        bg-slate-950 border border-slate-800 shadow-inner
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        {getIcon(log.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-bold text-sm text-slate-200 truncate pr-2 group-hover:text-blue-200 transition-colors">
                            {log.message || (log as any).title}
                          </h5>
                          <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap pt-0.5">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {(log.details || (log as any).description) && (
                          <p className="text-xs text-slate-400/80 leading-relaxed font-light mb-2 line-clamp-2">
                            {log.details || (log as any).description}
                          </p>
                        )}

                        {/* Chips / Rewards */}
                        <div className="flex flex-wrap gap-2">
                          <LogCategoryBadge category={log.category} />

                          {log.xpChange && log.xpChange > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-950/50 border border-blue-500/20 text-[9px] font-bold text-blue-300 font-mono">
                              <Sparkles size={8} /> +{log.xpChange} XP
                            </span>
                          )}

                          {log.statChange && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-950/50 border border-purple-500/20 text-[9px] font-bold text-purple-300 font-mono">
                              <Dumbbell size={8} /> +{log.statChange.amount} {log.statChange.stat.substring(0, 3).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hover Glitch Effect Overlay */}
                      <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 mix-blend-overlay" />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Terminal size={40} className="text-slate-600 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">No logs found</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
