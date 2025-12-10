import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppState, StatType } from '../types';
import { getSystemGrade, getRecommendedFocusStats, buildRecommendedMissions } from '../utils/analysis';
import { Card, Button, StatIcon } from '../components/UIComponents';
import { Brain, CheckCircle, Calendar, Moon, Scale, ArrowUp, ArrowDown, Minus, Plus } from 'lucide-react';

interface AdvisorViewProps {
    state: AppState;
    onAddRecommendedMission: (template: any) => void;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({ state, onAddRecommendedMission }) => {
    const report = useMemo(() => getSystemGrade(state), [state]);
    const recommendedMissions = useMemo(() => buildRecommendedMissions(state), [state]);

    const gradeColor = {
        S: 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]',
        A: 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]',
        B: 'text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]',
        C: 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]',
        D: 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    }[report.grade];

    const gradeBorder = {
        S: 'border-yellow-500/50 bg-yellow-950/20',
        A: 'border-blue-500/50 bg-blue-950/20',
        B: 'border-teal-500/50 bg-teal-950/20',
        C: 'border-orange-500/50 bg-orange-950/20',
        D: 'border-red-500/50 bg-red-950/20',
    }[report.grade];

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER */}
            <div className="flex items-center gap-3 px-1 border-b border-blue-900/30 pb-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-500/30">
                    <Brain className="text-blue-400" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">
                        SYSTEM ADVISOR
                    </h2>
                    <p className="text-xs text-blue-400/80 font-mono uppercase tracking-widest mt-0.5">
                        Weekly Analysis & Guidance
                    </p>
                </div>
            </div>

            {/* SYSTEM REPORT CARD */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className={`relative overflow-hidden p-6 border ${gradeBorder}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Brain size={120} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                            Current Evaluation
                        </span>

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className={`text-8xl font-black ${gradeColor} font-mono mb-2`}
                        >
                            {report.grade}
                        </motion.div>

                        <div className="px-3 py-1 rounded-full bg-slate-950/50 border border-white/10 mb-4">
                            <span className={`text-xs font-bold uppercase tracking-widest ${gradeColor.split(' ')[0]}`}>
                                {report.label}
                            </span>
                        </div>

                        <p className="text-sm text-slate-300 italic max-w-xs leading-relaxed">
                            "{report.message}"
                        </p>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/10">
                        <div className="flex flex-col items-center">
                            <CheckCircle size={16} className="text-green-400 mb-1" />
                            <span className="text-lg font-black text-white">{report.activity.missionsCompleted}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-bold">Missions</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Calendar size={16} className="text-blue-400 mb-1" />
                            <span className="text-lg font-black text-white">{report.activity.uniqueDaysActive}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-bold">Days</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Moon size={16} className="text-purple-400 mb-1" />
                            <span className="text-lg font-black text-white">
                                {report.activity.avgSleepLast7 ? report.activity.avgSleepLast7.toFixed(1) : '-'}
                            </span>
                            <span className="text-[9px] text-slate-500 uppercase font-bold">Sleep Avg</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Scale size={16} className="text-orange-400 mb-1" />
                            <div className="flex items-center gap-0.5">
                                {report.activity.weightDeltaLast7 !== null ? (
                                    <>
                                        {report.activity.weightDeltaLast7 > 0 ? <ArrowUp size={12} className="text-red-400" /> : report.activity.weightDeltaLast7 < 0 ? <ArrowDown size={12} className="text-green-400" /> : <Minus size={12} className="text-slate-400" />}
                                        <span className="text-lg font-black text-white">{Math.abs(report.activity.weightDeltaLast7).toFixed(1)}</span>
                                    </>
                                ) : (
                                    <span className="text-lg font-black text-white">-</span>
                                )}
                            </div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold">Weight</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* STAT FOCUS */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Stat Analysis</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                        <div className="p-2 rounded bg-cyan-900/20 border border-cyan-500/30">
                            <StatIcon stat={report.stats.strongestStat} size={18} />
                        </div>
                        <div>
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Strongest</span>
                            <span className="text-sm font-bold text-cyan-400 uppercase tracking-wide">{report.stats.strongestStat}</span>
                        </div>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                        <div className="p-2 rounded bg-red-900/20 border border-red-500/30">
                            <StatIcon stat={report.stats.weakestStat} size={18} />
                        </div>
                        <div>
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Weakest</span>
                            <span className="text-sm font-bold text-red-400 uppercase tracking-wide">{report.stats.weakestStat}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* RECOMMENDED MISSIONS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Recommended Quests</h3>
                <div className="space-y-3">
                    {recommendedMissions.map((mission, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (idx * 0.1) }}
                        >
                            <Card className="p-4 border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded border ${mission.isDaily ? 'bg-blue-900/20 border-blue-500/30' : 'bg-purple-900/20 border-purple-500/30'}`}>
                                            <StatIcon stat={mission.targetStat} size={14} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{mission.title}</h4>
                                            <span className="text-[10px] text-slate-500 font-mono uppercase">{mission.targetStat} • {mission.xpReward} XP</span>
                                        </div>
                                    </div>
                                    {mission.isDaily && (
                                        <span className="text-[9px] font-bold bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">DAILY</span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-400 mb-3 pl-9">{mission.detail}</p>

                                <Button
                                    onClick={() => onAddRecommendedMission(mission)}
                                    className="w-full h-8 text-xs bg-slate-800 hover:bg-blue-600 border-slate-700 hover:border-blue-500 transition-all"
                                >
                                    <Plus size={12} className="mr-1.5" /> ACCEPT QUEST
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* FOOTER */}
            <div className="text-center pt-6 pb-2 opacity-60">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    {report.grade === 'S' || report.grade === 'A'
                        ? "System note: Maintain this momentum."
                        : "System note: Even small steps reawaken the stats."}
                </p>
            </div>

        </div>
    );
};
