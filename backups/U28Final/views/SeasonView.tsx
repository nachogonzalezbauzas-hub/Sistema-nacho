import React from 'react';
import { SeasonDefinition, SeasonProgress, RankTier } from '../types';
import { SeasonTierCard, RankPill } from '../components/UIComponents';
import { format } from 'date-fns';
import { Trophy, Calendar, Sparkles } from 'lucide-react';

interface SeasonViewProps {
    season: SeasonDefinition;
    progress: SeasonProgress;
    onClaimReward: (tier: RankTier) => void;
}

export const SeasonView: React.FC<SeasonViewProps> = ({ season, progress, onClaimReward }) => {
    const ranks: RankTier[] = ['E', 'D', 'C', 'B', 'A', 'S'];

    const getTierStatus = (tier: RankTier): 'LOCKED' | 'REACHED' | 'CLAIMED' => {
        if (progress.claimedRewards.includes(tier)) return 'CLAIMED';

        const currentRankIndex = ranks.indexOf(progress.rank);
        const targetRankIndex = ranks.indexOf(tier);

        if (currentRankIndex >= targetRankIndex) return 'REACHED';
        return 'LOCKED';
    };

    const nextRank = ranks[ranks.indexOf(progress.rank) + 1];
    const nextTarget = nextRank ? season.xpTargets[nextRank] : season.xpTargets.S;
    const currentTarget = season.xpTargets[progress.rank] || 0; // Approximate base

    // Calculate percentage to next rank
    // Simplified: just show total XP vs next target
    const percent = Math.min(100, (progress.seasonXP / nextTarget) * 100);

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-900/50 bg-[#050a14] p-6 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md flex items-center gap-2">
                                {season.name}
                            </h2>
                            <div className="flex items-center gap-2 text-xs text-blue-400/80 font-mono mt-1">
                                <Calendar size={12} />
                                {format(new Date(season.startDate), 'MMM d')} - {format(new Date(season.endDate), 'MMM d, yyyy')}
                            </div>
                        </div>
                        <RankPill rank={progress.rank} size="lg" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono font-bold">
                            <span className="text-slate-400">SEASON XP</span>
                            <span className="text-blue-400">{progress.seasonXP} / {nextTarget}</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000"
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-slate-500 text-right">
                            {nextRank ? `Next Rank: ${nextRank}` : 'Max Rank Reached'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Rank Ladder */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="text-yellow-500" /> Season Ladder
                </h3>

                <div className="space-y-3">
                    {ranks.map((tier) => {
                        if (tier === 'E') return null; // Skip E as it has no rewards usually or is base
                        const reward = season.rewards[tier];
                        if (!reward) return null;

                        return (
                            <SeasonTierCard
                                key={tier}
                                tier={tier}
                                xpRequired={season.xpTargets[tier]}
                                status={getTierStatus(tier)}
                                rewards={reward}
                                onClaim={() => onClaimReward(tier)}
                            />
                        );
                    })}
                </div>
            </div>

        </div>
    );
};
