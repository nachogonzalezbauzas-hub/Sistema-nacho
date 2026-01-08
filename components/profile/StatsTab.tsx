import React from 'react';
import { UserStats, EffectiveStats, SeasonDefinition, SeasonProgress, Milestone, StatType } from '@/types';
import { StatIcon, Button, RankPill } from '@/components';
import { RadarChart } from './RadarChart';
import { User } from 'lucide-react';
import { t } from '@/data/translations';

interface StatsTabProps {
    stats: UserStats;
    effectiveStats: EffectiveStats;
    season?: SeasonDefinition;
    seasonProgress?: SeasonProgress;
    onOpenSeason?: () => void;
    activeMilestones: number;
    completedMilestones: number;
    language: 'en' | 'es';
}

const StatDetail: React.FC<{ label: StatType; value: number; base: number; language: 'en' | 'es' }> = ({ label, value, base, language }) => {
    const bonus = value - base;

    // Color mapping for stats
    const statColors: Record<string, string> = {
        Strength: 'from-red-900/40 to-red-900/10 border-red-500/30 text-red-400',
        Vitality: 'from-green-900/40 to-green-900/10 border-green-500/30 text-green-400',
        Agility: 'from-yellow-900/40 to-yellow-900/10 border-yellow-500/30 text-yellow-400',
        Intelligence: 'from-blue-900/40 to-blue-900/10 border-blue-500/30 text-blue-400',
        Fortune: 'from-amber-900/40 to-amber-900/10 border-amber-500/30 text-amber-400',
        Metabolism: 'from-purple-900/40 to-purple-900/10 border-purple-500/30 text-purple-400'
    };

    const colorClass = statColors[label] || 'from-slate-900/40 to-slate-900/10 border-slate-500/30 text-slate-400';

    return (
        <div className={`
            relative overflow-hidden rounded-xl border p-3 flex items-center justify-between
            bg-gradient-to-br ${colorClass} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:brightness-110
        `}>
            <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 rounded-lg bg-black/30 backdrop-blur-md shadow-inner">
                    <StatIcon stat={label} className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-[10px] font-black opacity-70 uppercase tracking-widest">{t(`stat_${label.toLowerCase()}` as any, language)}</div>
                    <div className="text-2xl font-black text-white font-mono leading-none mt-0.5 drop-shadow-md">{value}</div>
                </div>
            </div>
            {bonus > 0 && (
                <div className="text-xs font-mono font-bold bg-black/30 px-2 py-1 rounded-md backdrop-blur-md border border-white/10">
                    <span className="text-green-400">+{bonus}</span>
                </div>
            )}
        </div>
    );
};

export const StatsTab: React.FC<StatsTabProps> = ({
    stats,
    effectiveStats,
    season,
    seasonProgress,
    onOpenSeason,
    activeMilestones,
    completedMilestones,
    language
}) => {
    return (
        <div className="space-y-4">
            {/* Visual Stats Chart */}
            <div className="flex justify-center py-2 mb-2">
                <RadarChart stats={effectiveStats} language={language} />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {[
                    { l: 'Strength', v: effectiveStats.strength, b: stats.strength },
                    { l: 'Vitality', v: effectiveStats.vitality, b: stats.vitality },
                    { l: 'Agility', v: effectiveStats.agility, b: stats.agility },
                    { l: 'Intelligence', v: effectiveStats.intelligence, b: stats.intelligence },
                    { l: 'Fortune', v: effectiveStats.fortune, b: stats.fortune },
                    { l: 'Metabolism', v: effectiveStats.metabolism, b: stats.metabolism }
                ].map((s) => (
                    <div key={s.l} className="h-full">
                        <StatDetail label={s.l as StatType} value={s.v} base={s.b} language={language} />
                    </div>
                ))}
            </div>

            {/* U22 Season Summary */}
            {season && seasonProgress && (
                <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <User size={80} />
                    </div>
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                            {t('profile_season_progress', language)}
                        </h3>
                        <RankPill rank={seasonProgress.rank} size="sm" />
                    </div>

                    <div className="flex justify-between items-end relative z-10">
                        <div>
                            <span className="text-[10px] text-slate-500 font-mono uppercase block mb-0.5">{t('profile_current_xp', language)}</span>
                            <span className="text-xl font-black text-white font-mono">{seasonProgress.seasonXP}</span>
                        </div>
                        <Button variant="ghost" onClick={onOpenSeason} className="text-xs h-8 border border-blue-500/30 text-blue-300 hover:bg-blue-900/20">
                            {t('profile_view_season', language)}
                        </Button>
                    </div>
                </div>
            )}

            {/* U21 Milestone Summary */}
            <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                    {t('profile_epic_summary', language)}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 flex flex-col items-center">
                        <span className="text-2xl font-black text-white">{activeMilestones}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t('profile_active_arcs', language)}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 flex flex-col items-center">
                        <span className="text-2xl font-black text-blue-400">{completedMilestones}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t('profile_completed', language)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800/50">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">{t('profile_streak', language)}</span>
                    <span className="text-xl font-mono text-white">{stats.streak} {t('profile_days', language)}</span>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800/50">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">{t('profile_last_active', language)}</span>
                    <span className="text-xs font-mono text-slate-400">{stats.lastActiveDate ? new Date(stats.lastActiveDate).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};
