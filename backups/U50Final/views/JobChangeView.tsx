import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState, UserStats } from '@/types';
import { Brain, Lock, CheckCircle, ArrowRight, Skull, Crown, Zap, Sword, Eye, Shield, Sparkles, Heart, Target, Flame, Users } from 'lucide-react';
import { t, Language } from '@/data/translations';
import { useStore } from '@/store';

interface JobChangeViewProps {
    state: AppState;
    onJobChange: (newJob: string) => void; // Placeholder for future logic
    language?: Language;
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
    jobClassName: string; // The actual value for setJobClass
}

export const JobChangeView: React.FC<JobChangeViewProps> = ({ state, language = 'en' as Language }) => {
    const stats = state.stats;
    const { setJobClass } = useStore();

    // --- JOB DEFINITIONS (SEQUENTIAL PROGRESSION) ---
    // Tier 1 unlocks from None, Tier 2 from Tier 1, etc.
    const JOB_ORDER = ['None', 'Warrior', 'Swift Runner', 'Guardian', 'Scholar', 'Vitalist', 'Fortune Seeker', 'Balanced Master', 'Shadow Lord', 'Shadow Monarch'] as const;
    const currentTier = JOB_ORDER.indexOf(stats.jobClass as any);

    const jobs: JobDefinition[] = [
        // === TIER 1: WARRIOR (from None) ===
        {
            id: 'warrior',
            jobClassName: 'Warrior',
            title: t('job_berserker_title', language),
            description: t('job_berserker_desc', language),
            icon: Sword,
            color: 'text-red-400',
            isCurrent: stats.jobClass === 'Warrior',
            isUnlocked: currentTier === 0, // From None
            requirements: [
                { label: t('job_req_level_20', language), isMet: stats.level >= 20, progress: `${stats.level}/20` },
                { label: t('job_req_str_25', language), isMet: stats.strength >= 25, progress: `${stats.strength}/25` },
                { label: t('job_req_missions_15', language), isMet: (state.missions?.filter(m => m.completions > 0).length || 0) >= 15, progress: `${state.missions?.filter(m => m.completions > 0).length || 0}/15` }
            ],
            rewards: [
                t('job_reward_str_10', language),
                t('job_reward_rage', language),
                t('job_reward_crit_15', language)
            ]
        },
        // === TIER 2: SWIFT RUNNER (from Warrior) ===
        {
            id: 'swift_runner',
            jobClassName: 'Swift Runner',
            title: t('job_assassin_title', language),
            description: t('job_assassin_desc', language),
            icon: Eye,
            color: 'text-slate-300',
            isCurrent: stats.jobClass === 'Swift Runner',
            isUnlocked: currentTier === 1, // From Warrior
            requirements: [
                { label: t('job_req_agi_30', language), isMet: stats.agility >= 30, progress: `${stats.agility}/30` },
                { label: t('job_req_dungeons_5', language), isMet: (state.dungeonRuns?.filter(r => r.victory).length || 0) >= 5, progress: `${state.dungeonRuns?.filter(r => r.victory).length || 0}/5` }
            ],
            rewards: [
                t('job_reward_agi_8', language),
                t('job_reward_stealth', language),
                t('job_reward_dodge_20', language)
            ]
        },
        // === TIER 3: GUARDIAN (from Swift Runner) ===
        {
            id: 'guardian',
            jobClassName: 'Guardian',
            title: t('job_tank_title', language),
            description: t('job_tank_desc', language),
            icon: Shield,
            color: 'text-amber-400',
            isCurrent: stats.jobClass === 'Guardian',
            isUnlocked: currentTier === 2, // From Swift Runner
            requirements: [
                { label: t('job_req_vit_35', language), isMet: stats.vitality >= 35, progress: `${stats.vitality}/35` },
                { label: t('job_req_streak_7', language), isMet: (stats.streak || 0) >= 7, progress: `${stats.streak || 0}/7` }
            ],
            rewards: [
                t('job_reward_vit_10', language),
                t('job_reward_shield', language),
                t('job_reward_hp_25', language)
            ]
        },
        // === TIER 4: SCHOLAR (from Guardian) ===
        {
            id: 'scholar',
            jobClassName: 'Scholar',
            title: t('job_mage_title', language),
            description: t('job_mage_desc', language),
            icon: Sparkles,
            color: 'text-blue-400',
            isCurrent: stats.jobClass === 'Scholar',
            isUnlocked: currentTier === 3, // From Guardian
            requirements: [
                { label: t('job_req_level_25', language), isMet: stats.level >= 25, progress: `${stats.level}/25` },
                { label: t('job_req_int_35', language), isMet: stats.intelligence >= 35, progress: `${stats.intelligence}/35` }
            ],
            rewards: [
                t('job_reward_int_8', language),
                t('job_reward_arcane', language),
                t('job_reward_mp_30', language)
            ]
        },
        // === TIER 5: VITALIST (from Scholar) ===
        {
            id: 'vitalist',
            jobClassName: 'Vitalist',
            title: t('job_healer_title', language),
            description: t('job_healer_desc', language),
            icon: Heart,
            color: 'text-green-400',
            isCurrent: stats.jobClass === 'Vitalist',
            isUnlocked: currentTier === 4, // From Scholar
            requirements: [
                { label: t('job_req_vit_25', language), isMet: stats.vitality >= 25, progress: `${stats.vitality}/25` },
                { label: t('job_req_body_10', language), isMet: (state.bodyRecords?.length || 0) >= 10, progress: `${state.bodyRecords?.length || 0}/10` }
            ],
            rewards: [
                t('job_reward_vit_5', language),
                t('job_reward_heal', language),
                t('job_reward_regen_50', language)
            ]
        },
        // === TIER 6: FORTUNE SEEKER (from Vitalist) ===
        {
            id: 'fortune_seeker',
            jobClassName: 'Fortune Seeker',
            title: t('job_ranger_title', language),
            description: t('job_ranger_desc', language),
            icon: Target,
            color: 'text-emerald-400',
            isCurrent: stats.jobClass === 'Fortune Seeker',
            isUnlocked: currentTier === 5, // From Vitalist
            requirements: [
                { label: t('job_req_agi_25', language), isMet: stats.agility >= 25, progress: `${stats.agility}/25` },
                { label: t('job_req_fortune_20', language), isMet: stats.fortune >= 20, progress: `${stats.fortune}/20` }
            ],
            rewards: [
                t('job_reward_agi_5', language),
                t('job_reward_fortune_5', language),
                t('job_reward_precision', language)
            ]
        },
        // === TIER 7: BALANCED MASTER (from Fortune Seeker) ===
        {
            id: 'balanced_master',
            jobClassName: 'Balanced Master',
            title: t('job_monk_title', language),
            description: t('job_monk_desc', language),
            icon: Flame,
            color: 'text-orange-400',
            isCurrent: stats.jobClass === 'Balanced Master',
            isUnlocked: currentTier === 6, // From Fortune Seeker
            requirements: [
                { label: t('job_req_str_20', language), isMet: stats.strength >= 20, progress: `${stats.strength}/20` },
                { label: t('job_req_vit_20', language), isMet: stats.vitality >= 20, progress: `${stats.vitality}/20` },
                { label: t('job_req_metabolism_25', language), isMet: stats.metabolism >= 25, progress: `${stats.metabolism}/25` }
            ],
            rewards: [
                t('job_reward_balance', language),
                t('job_reward_fist', language)
            ]
        },
        // === TIER 8: SHADOW LORD (from Balanced Master) ===
        {
            id: 'shadow_lord',
            jobClassName: 'Shadow Lord',
            title: t('job_summoner_title', language),
            description: t('job_summoner_desc', language),
            icon: Users,
            color: 'text-teal-400',
            isCurrent: stats.jobClass === 'Shadow Lord',
            isUnlocked: currentTier === 7, // From Balanced Master
            requirements: [
                { label: t('job_req_int_25', language), isMet: stats.intelligence >= 25, progress: `${stats.intelligence}/25` },
                { label: t('job_req_shadows_3', language), isMet: (state.shadows?.length || 0) >= 3, progress: `${state.shadows?.length || 0}/3` }
            ],
            rewards: [
                t('job_reward_summon', language),
                t('job_reward_army_5', language),
                t('job_reward_fortune_3', language)
            ]
        },
        // === TIER 9: SHADOW MONARCH (FINAL - from Shadow Lord) ===
        {
            id: 'shadow_monarch',
            jobClassName: 'Shadow Monarch',
            title: t('job_shadow_monarch_title', language),
            description: t('job_shadow_monarch_desc', language),
            icon: Crown,
            color: 'text-cyan-400',
            isCurrent: stats.jobClass === 'Shadow Monarch',
            isUnlocked: currentTier === 8, // From Shadow Lord
            requirements: [
                { label: t('job_req_level_50', language), isMet: stats.level >= 50, progress: `${stats.level}/50` },
                { label: t('job_req_int_70', language), isMet: stats.intelligence >= 70, progress: `${stats.intelligence}/70` },
                { label: t('job_req_igris', language), isMet: state.dungeonRuns.some(r => r.bossId === 'boss_igris' && r.victory), progress: state.dungeonRuns.some(r => r.bossId === 'boss_igris' && r.victory) ? '1/1' : '0/1' }
            ],
            rewards: [
                t('job_reward_class_sm', language),
                t('job_reward_army_10', language),
                t('job_reward_all_10', language),
                t('job_reward_title_sm', language)
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
                        {t('job_title', language)}
                    </h2>
                    <p className="text-xs text-purple-400/80 font-mono uppercase tracking-widest mt-0.5">
                        {t('job_subtitle', language)}
                    </p>
                </div>
            </div>

            {/* CURRENT STATUS */}
            <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Crown size={120} />
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('job_current_class', language)}</h3>
                <div className={`text-3xl font-black ${currentJob.color || 'text-white'} uppercase tracking-tight mb-1`}>
                    {stats.jobClass}
                </div>
                <p className="text-xs text-slate-400 italic">
                    {stats.jobClass === 'None' ? t('job_no_class_desc', language) : t('job_has_class_desc', language)}
                </p>
            </div>

            {/* PROGRESSION PATH */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">{t('job_progression', language)}</h3>

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
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">{t('job_requirements', language)}</h5>
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
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t('job_rewards', language)}</h5>
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
                                        onClick={() => canAccept && setJobClass(job.jobClassName)}
                                        className={`w-full py-3 rounded-lg font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2
                                            ${canAccept
                                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse'
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        {canAccept ? (
                                            <>
                                                <Zap size={14} /> {t('job_accept', language)}
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={14} /> {t('job_requirements_not_met', language)}
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
                    {t('job_footer', language)}
                </p>
            </div>

        </div>
    );
};
