import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, Zap, Brain, Crown, Flame } from 'lucide-react';
import { StatType } from '@/types';

export const StatIcon: React.FC<{ stat: StatType; size?: number; className?: string }> = ({ stat, size = 20, className = "" }) => {
    let animClass = "";
    let color = "";
    switch (stat) {
        case 'Strength': animClass = "animate-pulse-fast"; color = "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"; return <Dumbbell size={size} className={`${className} ${animClass} ${color}`} />;
        case 'Vitality': animClass = "animate-pulse-slow"; color = "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"; return <Activity size={size} className={`${className} ${animClass} ${color}`} />;
        case 'Agility': animClass = "animate-bounce-slight"; color = "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"; return <Zap size={size} className={`${className} ${animClass} ${color}`} />;
        case 'Intelligence': animClass = "animate-float"; color = "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]"; return <Brain size={size} className={`${className} ${animClass} ${color}`} />;
        case 'Fortune': animClass = ""; color = "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]"; return <Crown size={size} className={`${className} ${animClass} ${color}`} />;
        case 'Metabolism': animClass = "animate-pulse"; color = "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"; return <Flame size={size} className={`${className} ${animClass} ${color}`} />;
        default: return <Activity size={size} className={className} />;
    }
};

export const StatBadge: React.FC<{ stat: StatType }> = ({ stat }) => {
    let style = "";
    switch (stat) {
        case 'Strength': style = "text-cyan-300 bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]"; break;
        case 'Vitality': style = "text-red-300 bg-red-950/40 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]"; break;
        case 'Agility': style = "text-yellow-300 bg-yellow-950/40 border-yellow-500/40 shadow-[0_0_10px_rgba(250,204,21,0.2)]"; break;
        case 'Intelligence': style = "text-purple-300 bg-purple-950/40 border-purple-500/40 shadow-[0_0_10px_rgba(192,132,252,0.2)]"; break;
        case 'Fortune': style = "text-green-300 bg-green-950/40 border-green-500/40 shadow-[0_0_10px_rgba(74,222,128,0.2)]"; break;
        case 'Metabolism': style = "text-blue-300 bg-blue-950/40 border-blue-500/40 shadow-[0_0_10px_rgba(96,165,250,0.2)]"; break;
    }
    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${style}`}>
            <StatIcon stat={stat} size={10} />
            {stat}
        </div>
    );
};

export const StatCard: React.FC<{ stat: StatType; value: number; highlight?: boolean }> = ({ stat, value, highlight = false }) => {
    let styles = { border: '', text: '', bg: '', particle: '', highlightRing: '', shadow: '' };

    switch (stat) {
        case 'Strength':
            styles = {
                border: 'border-cyan-500/30 group-hover:border-cyan-400',
                text: 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]',
                bg: 'from-cyan-950/20 to-[#02040a]',
                particle: 'bg-cyan-400',
                highlightRing: 'ring-cyan-400',
                shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.1)]'
            };
            break;
        case 'Vitality':
            styles = {
                border: 'border-red-500/30 group-hover:border-red-400',
                text: 'text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]',
                bg: 'from-red-950/20 to-[#02040a]',
                particle: 'bg-red-500',
                highlightRing: 'ring-red-400',
                shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]'
            };
            break;
        case 'Agility':
            styles = {
                border: 'border-yellow-500/30 group-hover:border-yellow-400',
                text: 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]',
                bg: 'from-yellow-950/20 to-[#02040a]',
                particle: 'bg-yellow-400',
                highlightRing: 'ring-yellow-400',
                shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.1)]'
            };
            break;
        case 'Intelligence':
            styles = {
                border: 'border-purple-500/30 group-hover:border-purple-400',
                text: 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]',
                bg: 'from-purple-950/20 to-[#02040a]',
                particle: 'bg-purple-400',
                highlightRing: 'ring-purple-400',
                shadow: 'shadow-[0_0_20px_rgba(192,132,252,0.1)]'
            };
            break;
        case 'Fortune':
            styles = {
                border: 'border-green-500/30 group-hover:border-green-400',
                text: 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]',
                bg: 'from-green-950/20 to-[#02040a]',
                particle: 'bg-green-400',
                highlightRing: 'ring-green-400',
                shadow: 'shadow-[0_0_20px_rgba(74,222,128,0.1)]'
            };
            break;
        case 'Metabolism':
            styles = {
                border: 'border-blue-500/30 group-hover:border-blue-400',
                text: 'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]',
                bg: 'from-blue-950/20 to-[#02040a]',
                particle: 'bg-blue-400',
                highlightRing: 'ring-blue-400',
                shadow: 'shadow-[0_0_20px_rgba(96,165,250,0.1)]'
            };
            break;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`
        relative group overflow-hidden rounded-xl border ${styles.border} 
        bg-gradient-to-br ${styles.bg} cursor-default 
        ${styles.shadow} backdrop-blur-sm h-full
        ${highlight ? `ring-2 ${styles.highlightRing} animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.2)]` : ''}
      `}
        >
            {/* Grid Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

            {/* Floating Particles */}
            <div className={`absolute top-2 right-2 w-1 h-1 rounded-full ${styles.particle} opacity-60 animate-pulse`}></div>
            <div className={`absolute bottom-3 left-3 w-1 h-1 rounded-full ${styles.particle} opacity-40 animate-pulse delay-700`}></div>

            <div className="flex flex-col items-center justify-center p-4 relative z-10">
                <div className={`relative p-3 rounded-full border border-opacity-20 mb-2 bg-[#02040a] ${styles.border} shadow-lg`}>
                    <StatIcon stat={stat} size={20} className="relative z-10" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1 group-hover:text-slate-300 transition-colors">{stat}</span>
                <span className={`text-2xl font-black font-mono tracking-tighter ${styles.text}`}>{value}</span>
            </div>

            {/* Hover Glitch Border */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-xl pointer-events-none transition-colors duration-300"></div>
        </motion.div>
    );
};

export const StreakBadge: React.FC<{ value: number }> = ({ value }) => {
    if (!value || value <= 0) return null;
    return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-950/30 border border-orange-500/40 px-2.5 py-1 text-[9px] font-bold text-orange-400 uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-pulse">
            <Flame size={10} className="text-orange-500 fill-orange-500" /> {value} Day Streak
        </span>
    );
};
