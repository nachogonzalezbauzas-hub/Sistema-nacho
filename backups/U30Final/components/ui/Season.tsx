import React from 'react';
import { Check, Lock } from 'lucide-react';
import { RankTier, SeasonReward } from '../../types';
import { Button } from './Button';

export const RankPill: React.FC<{ rank: RankTier; size?: 'sm' | 'md' | 'lg' }> = ({ rank, size = 'md' }) => {
    let colors = "";
    switch (rank) {
        case 'E': colors = "bg-slate-800 text-slate-400 border-slate-700"; break;
        case 'D': colors = "bg-slate-700 text-white border-slate-500"; break;
        case 'C': colors = "bg-green-900/40 text-green-400 border-green-500/40"; break;
        case 'B': colors = "bg-blue-900/40 text-blue-400 border-blue-500/40"; break;
        case 'A': colors = "bg-purple-900/40 text-purple-400 border-purple-500/40"; break;
        case 'S': colors = "bg-yellow-900/40 text-yellow-400 border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.3)]"; break;
        case 'SS': colors = "bg-red-900/40 text-red-500 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse"; break;
        case 'SSS': colors = "bg-black text-white border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-pulse ring-1 ring-white/20"; break;
    }

    const sizeClasses = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : size === 'lg' ? 'text-xl px-4 py-1' : 'text-xs px-2 py-1';

    return (
        <span className={`font-black font-mono rounded border ${colors} ${sizeClasses} inline-flex items-center justify-center`}>
            {rank}
        </span>
    );
};

export const SeasonBadge: React.FC<{ name: string; rank: RankTier; progress: number; onClick?: () => void }> = ({ name, rank, progress, onClick }) => {
    return (
        <button onClick={onClick} className="group relative flex items-center gap-3 bg-[#050a14] border border-blue-900/50 rounded-full pl-1 pr-4 py-1 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all">
            <RankPill rank={rank} size="sm" />
            <div className="flex flex-col items-start">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-300 transition-colors">{name}</span>
                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </button>
    );
};

export const SeasonTierCard: React.FC<{
    tier: RankTier;
    xpRequired: number;
    status: 'LOCKED' | 'REACHED' | 'CLAIMED';
    rewards: SeasonReward;
    onClaim: () => void;
}> = ({ tier, xpRequired, status, rewards, onClaim }) => {
    const isLocked = status === 'LOCKED';
    const isClaimed = status === 'CLAIMED';
    const canClaim = status === 'REACHED';

    return (
        <div className={`
      relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
      ${isLocked ? 'bg-slate-900/20 border-slate-800 opacity-50 grayscale' : ''}
      ${canClaim ? 'bg-blue-950/30 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : ''}
      ${isClaimed ? 'bg-slate-900/50 border-slate-700' : ''}
    `}>
            {/* Rank Icon */}
            <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                <RankPill rank={tier} size="lg" />
                <span className="text-[9px] font-mono text-slate-500">{xpRequired} XP</span>
            </div>

            {/* Rewards List */}
            <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                    {rewards.xpBonus && (
                        <span className="text-[10px] font-bold text-blue-300 bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/20">+{rewards.xpBonus} XP</span>
                    )}
                    {rewards.statBonus && (
                        <span className="text-[10px] font-bold text-yellow-300 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-500/20">STATS</span>
                    )}
                    {rewards.unlockTitleId && (
                        <span className="text-[10px] font-bold text-purple-300 bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20">TITLE</span>
                    )}
                    {rewards.unlockFrameId && (
                        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/20">FRAME</span>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div>
                {isClaimed ? (
                    <div className="flex items-center gap-1 text-green-500 font-bold text-[10px] uppercase tracking-wider bg-green-950/20 px-3 py-1.5 rounded border border-green-900/50">
                        <Check size={12} /> Claimed
                    </div>
                ) : canClaim ? (
                    <Button variant="primary" onClick={() => {
                        onClaim();
                    }} className="animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                        Claim
                    </Button>
                ) : (
                    <div className="flex items-center gap-1 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                        <Lock size={12} /> Locked
                    </div>
                )}
            </div>
        </div>
    );
};
