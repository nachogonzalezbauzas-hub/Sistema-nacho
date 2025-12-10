import React from 'react';
import { motion } from 'framer-motion';

interface PlayerRankTitleProps {
    level: number;
}

export const PlayerRankTitle: React.FC<PlayerRankTitleProps> = ({ level }) => {
    let rank = 'E-Rank';
    let color = 'text-slate-400';
    let glow = '';
    let animation = '';

    if (level >= 100) {
        rank = 'National Level';
        color = 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500';
        glow = 'drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]';
        animation = 'animate-pulse';
    } else if (level >= 80) {
        rank = 'S-Rank';
        color = 'text-yellow-400';
        glow = 'drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]';
        animation = 'animate-pulse';
    } else if (level >= 60) {
        rank = 'A-Rank';
        color = 'text-red-500';
        glow = 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    } else if (level >= 40) {
        rank = 'B-Rank';
        color = 'text-purple-400';
        glow = 'drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]';
    } else if (level >= 20) {
        rank = 'C-Rank';
        color = 'text-blue-400';
        glow = 'drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]';
    } else if (level >= 10) {
        rank = 'D-Rank';
        color = 'text-green-400';
        glow = 'drop-shadow-[0_0_5px_rgba(74,222,128,0.2)]';
    }

    return (
        <div className="flex flex-col items-end">
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                key={rank} // Re-animate on rank change
                className={`text-[10px] font-black uppercase tracking-widest ${color} ${glow} ${animation}`}
            >
                {rank} Hunter
            </motion.div>
            <div className="text-[9px] text-slate-500 font-mono">
                Level {level}
            </div>
        </div>
    );
};
