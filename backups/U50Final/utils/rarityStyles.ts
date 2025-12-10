import { AchievementRarity } from '../data/achievements';

export const getRarityStyles = (rarity: AchievementRarity) => {
    switch (rarity) {
        case 'COMMON': return { border: 'border-slate-600', text: 'text-slate-400', bg: 'bg-slate-900/50', glow: '', badge: 'bg-slate-800 text-slate-300' };
        case 'UNCOMMON': return { border: 'border-green-600', text: 'text-green-400', bg: 'bg-green-950/20', glow: 'shadow-[0_0_10px_rgba(74,222,128,0.1)]', badge: 'bg-green-900/50 text-green-300' };
        case 'RARE': return { border: 'border-blue-600', text: 'text-blue-400', bg: 'bg-blue-950/20', glow: 'shadow-[0_0_10px_rgba(96,165,250,0.1)]', badge: 'bg-blue-900/50 text-blue-300' };
        case 'EPIC': return { border: 'border-purple-600', text: 'text-purple-400', bg: 'bg-purple-950/20', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.2)]', badge: 'bg-purple-900/50 text-purple-300' };
        case 'LEGENDARY': return { border: 'border-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-950/20', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.2)]', badge: 'bg-yellow-900/50 text-yellow-300' };
        case 'MYTHIC': return { border: 'border-red-600', text: 'text-red-500', bg: 'bg-red-950/20', glow: 'shadow-[0_0_25px_rgba(248,113,113,0.3)]', badge: 'bg-red-900/50 text-red-300' };
        case 'GODLIKE': return { border: 'border-white', text: 'text-white animate-rainbow-text', bg: 'bg-slate-900', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-rainbow-border', badge: 'bg-white/10 text-white' };
        default: return { border: 'border-slate-700', text: 'text-slate-500', bg: 'bg-slate-950/30', glow: '', badge: 'bg-slate-800 text-slate-500' };
    }
};
