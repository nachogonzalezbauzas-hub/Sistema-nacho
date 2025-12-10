import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState, UserStats } from '../types';
import { Brain, Lock, CheckCircle, ArrowRight, Skull, Crown, Zap } from 'lucide-react';

interface JobChangeViewProps {
    state: AppState;
    onJobChange: (newJob: string) => void; // Placeholder for future logic
}

interface JobRequirement {
    label: string;
    isMet: boolean;
    progress?: string;
}

interface JobDefinition {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    requirements: JobRequirement[];
    rewards: string[];
    isUnlocked: boolean;
    isCurrent: boolean;
}

export const JobChangeView: React.FC<JobChangeViewProps> = ({ state }) => {
    const stats = state.stats;

    // --- JOB DEFINITIONS ---
    // In a real app, this would be in a separate data file
    const jobs: JobDefinition[] = [
        {
            id: 'necromancer',
            title: 'Necromancer',
            description: 'A hidden class capable of manipulating the dead. The first step towards true power.',
            icon: Skull,
            color: 'text-purple-400',
            isCurrent: stats.jobClass === 'Necromancer',
            isUnlocked: stats.jobClass === 'None', // Can unlock if current is None
            requirements: [
                { label: 'Reach Level 20', isMet: stats.level >= 20, progress: `${stats.level}/20` },
                { label: 'Intelligence 30+', isMet: stats.intelligence >= 30, progress: `${stats.intelligence}/30` },
                { label: 'Complete 10 Daily Quests', isMet: (state.questHistory?.length || 0) >= 10, progress: `${state.questHistory?.length || 0}/10` }
            ],
            rewards: [
                'Unlock "Extract Shadow" Skill',
                'Intelligence +5',
                'Mana +20%'
            ]
        },
        {
            id: 'shadow_monarch',
            title: 'Shadow Monarch',
            description: 'The absolute ruler of the dead. Command an eternal army and defy death itself.',
            icon: Crown,
            color: 'text-cyan-400', // Using Cyan/Rainbow theme
            isCurrent: stats.jobClass === 'Shadow Monarch',
            isUnlocked: stats.jobClass === 'Necromancer', // Must be Necromancer first
            requirements: [
                { label: 'Reach Level 50', isMet: stats.level >= 50, progress: `${stats.level}/50` },
                { label: 'Intelligence 70+', isMet: stats.intelligence >= 70, progress: `${stats.intelligence}/70` },
                { label: 'Defeat "Igris" (Boss)', isMet: state.dungeonRuns.some(r => r.bossId === 'boss_igris' && r.victory), progress: state.dungeonRuns.some(r => r.bossId === 'boss_igris' && r.victory) ? '1/1' : '0/1' }
            ],
            rewards: [
                'Class: Shadow Monarch',
                'Army Size +10',
                'All Stats +10',
                'Title: "Monarch of Shadows"'
            ]
        }
    ];

    const currentJob = jobs.find(j => j.isCurrent) || { title: 'None', color: 'text-slate-400' };
    const nextJob = jobs.find(j => j.isUnlocked && !j.isCurrent);

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER */}
            <div className="flex items-center gap-3 px-1 border-b border-purple-900/30 pb-2 mb-4">
                <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/30">
                    <Brain className="text-purple-400" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">
                        JOB CHANGE
                    </h2>
                    <p className="text-xs text-purple-400/80 font-mono uppercase tracking-widest mt-0.5">
                        Path to Monarch
                    </p>
                </div>
            </div>

            {/* CURRENT STATUS */}
            <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Crown size={120} />
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Class</h3>
                <div className={`text-3xl font-black ${currentJob.color || 'text-white'} uppercase tracking-tight mb-1`}>
                    {stats.jobClass}
                </div>
                <p className="text-xs text-slate-400 italic">
                    {stats.jobClass === 'None' ? 'You have not awakened a class yet.' : 'You are walking the path of shadows.'}
                </p>
            </div>

            {/* PROGRESSION PATH */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Class Progression</h3>

                {jobs.map((job) => {
                    const isLocked = !job.isUnlocked && !job.isCurrent;
                    const isCompleted = job.isCurrent || (job.id === 'necromancer' && stats.jobClass === 'Shadow Monarch');
                    const canAccept = !isCompleted && !isLocked && job.requirements.every(r => r.isMet);

                    return (
                        <div key={job.id} className={`relative rounded-xl border-2 transition-all ${isCompleted ? 'bg-slate-900/50 border-slate-700 opacity-70' : isLocked ? 'bg-slate-950 border-slate-800 opacity-50' : 'bg-slate-900 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'}`}>
                            {/* Overlay for Locked */}
                            {isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-[1px] rounded-xl">
                                    <Lock className="text-slate-600" size={32} />
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-slate-800 text-slate-400' : 'bg-purple-900/20 text-purple-400'}`}>
                                            <job.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className={`font-black text-lg uppercase italic ${job.color}`}>{job.title}</h4>
                                            <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight">{job.description}</p>
                                        </div>
                                    </div>
                                    {isCompleted && <CheckCircle className="text-green-500" size={20} />}
                                </div>

                                {/* Requirements */}
                                <div className="space-y-2 mb-4 bg-black/20 p-3 rounded-lg">
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Requirements</h5>
                                    {job.requirements.map((req, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs">
                                            <span className={req.isMet ? 'text-slate-300 line-through decoration-slate-600' : 'text-slate-400'}>
                                                {req.label}
                                            </span>
                                            <span className={`font-mono ${req.isMet ? 'text-green-400' : 'text-red-400'}`}>
                                                {req.progress}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Rewards */}
                                <div className="mb-4">
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Rewards</h5>
                                    <div className="flex flex-wrap gap-1">
                                        {job.rewards.map((reward, idx) => (
                                            <span key={idx} className="text-[9px] bg-purple-900/20 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                                                {reward}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                {!isCompleted && !isLocked && (
                                    <button
                                        disabled={!canAccept}
                                        className={`w-full py-3 rounded-lg font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2
                                            ${canAccept
                                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse'
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        {canAccept ? (
                                            <>
                                                <Zap size={14} /> ACCEPT JOB CHANGE
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={14} /> REQUIREMENTS NOT MET
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="text-center pt-6 pb-2 opacity-60">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    "The system awaits your growth."
                </p>
            </div>

        </div>
    );
};
