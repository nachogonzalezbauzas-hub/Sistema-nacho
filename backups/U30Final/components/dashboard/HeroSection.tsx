import React from 'react';
import { motion } from 'framer-motion';
import { UserStats, SeasonProgress } from '../../types';
import { TITLES } from '../../data/titles';
import { getFrameStyles } from '../ui/Avatar';
import { getHunterRank } from '../../utils/rankSystem';
import { ActiveTitle } from './ActiveTitle';
import { ExpBar } from './ExpBar';

interface HeroSectionProps {
    stats: UserStats;
    seasonProgress: SeasonProgress | null;
    totalPower: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stats, seasonProgress, totalPower }) => {
    const equippedTitle = TITLES.find(t => t.id === stats.equippedTitleId);
    const { frameStyle, effect } = getFrameStyles(stats.selectedFrameId || 'default');

    const scanlineVariant = {
        animate: {
            y: ["0%", "100%"],
            opacity: [0, 0.5, 0],
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
        }
    };

    const glitchTextVariant = {
        animate: {
            x: [0, -2, 2, -1, 1, 0],
            opacity: [1, 0.8, 1, 0.9, 1],
            transition: { duration: 0.5, repeat: Infinity, repeatDelay: 5 }
        }
    };

    return (
        <div className="relative group perspective-1000">
            {/* Holographic Container */}
            <div className="relative bg-[#030712]/90 border border-blue-500/30 p-1 overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)]">
                {/* Animated Border Lines */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_2s_infinite]"></div>
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_2s_infinite_reverse]"></div>
                <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-[shimmer_3s_infinite]"></div>
                <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-[shimmer_3s_infinite_reverse]"></div>

                {/* Inner Content */}
                <div className="relative bg-[#02040a] p-6 md:p-8 overflow-hidden">
                    {/* Tech Decoration Background */}
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <div className="flex flex-col items-end gap-1">
                            <div className="w-24 h-1 bg-blue-500"></div>
                            <div className="w-16 h-1 bg-blue-500/50"></div>
                            <div className="w-8 h-1 bg-blue-500/30"></div>
                        </div>
                    </div>

                    {/* Scanline Effect */}
                    <motion.div variants={scanlineVariant} animate="animate" className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-[20%] pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        {/* LEVEL CIRCLE (Central) - Acts as Avatar with Frame */}
                        <div className="relative mb-6 group cursor-pointer">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full group-hover:bg-blue-500/30 transition-all duration-500"></div>

                            {/* Outer Ring */}
                            <div className="w-40 h-40 rounded-full border border-blue-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 border border-t-transparent border-l-transparent border-blue-400/40 rounded-full animate-[spin_8s_linear_infinite]"></div>
                                <div className="absolute inset-2 border border-b-transparent border-r-transparent border-cyan-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>

                                {/* Inner Circle with Avatar Frame Styles */}
                                <div className={`w-32 h-32 rounded-full bg-[#050505] flex flex-col items-center justify-center relative z-10 overflow-hidden ${frameStyle} ${effect}`}>
                                    {/* Default content if no specific frame effect overrides background */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black opacity-50"></div>

                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em] mb-1">Level</span>
                                        <span className="text-5xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">{stats.level}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Player Data HUD */}
                        <div className="flex-1 w-full text-center md:text-left space-y-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-blue-900/50 pb-4">
                                <div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em]">System Online</span>
                                    </div>
                                    <motion.h1
                                        variants={glitchTextVariant}
                                        animate="animate"
                                        className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                                        style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '1px rgba(59,130,246,0.5)' }}
                                    >
                                        Sung Jin-Woo
                                    </motion.h1>
                                </div>

                                {/* Rank Badge */}
                                <div className="relative group/rank">
                                    {(() => {
                                        const currentRank = getHunterRank(seasonProgress?.seasonXP || 0);
                                        let rankColor = "blue";
                                        let rankHex = "#3b82f6";

                                        switch (currentRank) {
                                            case 'E': rankColor = "slate"; rankHex = "#94a3b8"; break;
                                            case 'D': rankColor = "slate"; rankHex = "#cbd5e1"; break;
                                            case 'C': rankColor = "green"; rankHex = "#22c55e"; break;
                                            case 'B': rankColor = "blue"; rankHex = "#3b82f6"; break;
                                            case 'A': rankColor = "purple"; rankHex = "#a855f7"; break;
                                            case 'S': rankColor = "yellow"; rankHex = "#eab308"; break;
                                            case 'SS': rankColor = "red"; rankHex = "#ef4444"; break;
                                            case 'SSS': rankColor = "white"; rankHex = "#ffffff"; break;
                                        }

                                        return (
                                            <>
                                                <div className="absolute inset-0 blur-xl opacity-40 group-hover/rank:opacity-70 transition-opacity" style={{ backgroundColor: rankHex }}></div>
                                                <div className="relative bg-black/50 px-6 py-2 backdrop-blur-md border" style={{ borderColor: `${rankHex}80` }}>
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-center mb-1" style={{ color: rankHex }}>Hunter Rank</div>
                                                    <div className="text-3xl font-black italic tracking-widest" style={{ color: currentRank === 'SSS' ? 'white' : rankHex, textShadow: `0 0 10px ${rankHex}` }}>
                                                        {currentRank}
                                                    </div>
                                                    {/* Decorative corners */}
                                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: rankHex }}></div>
                                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: rankHex }}></div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            <ActiveTitle equippedTitle={equippedTitle} totalPower={totalPower} />
                            <ExpBar stats={stats} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
