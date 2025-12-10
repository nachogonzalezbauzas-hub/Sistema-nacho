import React from 'react';
import { UserStats, EffectiveStats, SeasonDefinition, SeasonProgress, Milestone, StatType } from '../../types';
import { StatIcon, Button, RankPill } from '../UIComponents';
import { User } from 'lucide-react';
import { t } from '../../data/translations';

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
    return (
        <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <StatIcon stat={label} className="w-8 h-8 rounded-lg bg-slate-900/50 p-1.5 text-slate-400" />
                <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t(`stat_${label.toLowerCase()}` as any, language)}</div>
                    <div className="text-xl font-black text-white font-mono">{value}</div>
                </div>
            </div>
            {bonus > 0 && (
                <div className="text-xs font-mono text-blue-400 font-bold">
                    (+{bonus})
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
