import React from 'react';
import { motion } from 'framer-motion';
import { UserStats, SeasonProgress } from '@/types';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { getFrameStyles } from '@/components';
import { getHunterRank } from '@/utils/rankSystem';
import { ActiveTitle } from './ActiveTitle';
import { ExpBar } from './ExpBar';
import { PowerRankBadge } from './PowerRank';
import { t } from '@/data/translations';

interface HeroSectionProps {
    stats: UserStats;
    seasonProgress: SeasonProgress | null;
    totalPower: number;
    language: 'en' | 'es';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stats, seasonProgress, totalPower, language }) => {
    const equippedTitle = [...TITLES, ...(stats.customTitles || [])].find(t => t.id === stats.equippedTitleId);
    const selectedFrame = [...AVATAR_FRAMES, ...(stats.customFrames || [])].find(f => f.id === (stats.selectedFrameId || 'default'));
    const { frameStyle, effect } = getFrameStyles(stats.selectedFrameId || 'default', selectedFrame);

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
                                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em] mb-1">{t('dash_level', language)}</span>
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
                                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em]">{t('dash_system_online', language)}</span>
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

                                {/* Rank Badge - Minimalist Premium Design */}
                                <div className="relative">
                                    {(() => {
                                        const currentRank = getHunterRank(seasonProgress?.seasonXP || 0);

                                        // Rank styling configuration
                                        const rankConfig: Record<string, { hex: string; glow: string; intensity: number }> = {
                                            'E': { hex: '#64748b', glow: '', intensity: 0 },
                                            'D': { hex: '#94a3b8', glow: '', intensity: 0 },
                                            'C': { hex: '#22c55e', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]', intensity: 0.15 },
                                            'B': { hex: '#3b82f6', glow: 'shadow-[0_0_25px_rgba(59,130,246,0.25)]', intensity: 0.2 },
                                            'A': { hex: '#a855f7', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]', intensity: 0.25 },
                                            'S': { hex: '#eab308', glow: 'shadow-[0_0_35px_rgba(234,179,8,0.35)]', intensity: 0.3 },
                                            'SS': { hex: '#ef4444', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.4)]', intensity: 0.35 },
                                            'SSS': { hex: '#ffffff', glow: 'shadow-[0_0_50px_rgba(255,255,255,0.5)]', intensity: 0.5 },
                                        };

                                        const config = rankConfig[currentRank] || rankConfig['E'];
                                        const isSSS = currentRank === 'SSS';
                                        const isHighRank = ['S', 'SS', 'SSS'].includes(currentRank);

                                        return (
                                            <>
                                                <style>{`
                                                    @keyframes rank-pulse {
                                                        0%, 100% { opacity: 0.6; }
                                                        50% { opacity: 1; }
                                                    }
                                                    @keyframes rank-rainbow {
                                                        0% { background-position: 0% 50%; }
                                                        100% { background-position: 200% 50%; }
                                                    }
                                                    .rank-shimmer::before {
                                                        content: '';
                                                        position: absolute;
                                                        inset: 0;
                                                        background: linear-gradient(
                                                            90deg,
                                                            transparent 0%,
                                                            rgba(255,255,255,0.08) 50%,
                                                            transparent 100%
                                                        );
                                                        background-size: 200% 100%;
                                                        animation: rank-pulse 4s ease-in-out infinite;
                                                    }
                                                `}</style>

                                                {/* Main container */}
                                                <div className={`
                                                    relative overflow-hidden
                                                    ${config.glow}
                                                    ${isHighRank ? 'rank-shimmer' : ''}
                                                `}>
                                                    {/* Outer frame */}
                                                    <div
                                                        className="relative px-8 py-4 bg-black/60 backdrop-blur-sm"
                                                        style={{
                                                            border: `1px solid ${config.hex}40`,
                                                        }}
                                                    >
                                                        {/* Inner accent lines */}
                                                        <div
                                                            className="absolute top-1 left-1 right-1 h-[1px]"
                                                            style={{ backgroundColor: `${config.hex}30` }}
                                                        />
                                                        <div
                                                            className="absolute bottom-1 left-1 right-1 h-[1px]"
                                                            style={{ backgroundColor: `${config.hex}30` }}
                                                        />

                                                        {/* Label */}
                                                        <div
                                                            className="text-[9px] font-medium uppercase tracking-[0.3em] text-center mb-2"
                                                            style={{ color: `${config.hex}99` }}
                                                        >
                                                            {t('dash_hunter_rank', language)}
                                                        </div>

                                                        {/* Rank text */}
                                                        <div
                                                            className={`
                                                                text-4xl font-black tracking-[0.15em] text-center
                                                                ${isSSS ? '' : ''}
                                                            `}
                                                            style={isSSS ? {
                                                                background: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b)',
                                                                backgroundSize: '200% 100%',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                animation: 'rank-rainbow 3s linear infinite',
                                                            } : {
                                                                color: config.hex,
                                                                textShadow: config.intensity > 0 ? `0 0 ${config.intensity * 40}px ${config.hex}` : 'none',
                                                            }}
                                                        >
                                                            {currentRank}
                                                        </div>

                                                        {/* Corner decorations for high ranks */}
                                                        {isHighRank && (
                                                            <>
                                                                <div className="absolute top-0 left-0 w-4 h-[2px]" style={{ backgroundColor: config.hex }} />
                                                                <div className="absolute top-0 left-0 w-[2px] h-4" style={{ backgroundColor: config.hex }} />
                                                                <div className="absolute bottom-0 right-0 w-4 h-[2px]" style={{ backgroundColor: config.hex }} />
                                                                <div className="absolute bottom-0 right-0 w-[2px] h-4" style={{ backgroundColor: config.hex }} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <ActiveTitle equippedTitle={equippedTitle} totalPower={totalPower} language={language} />
                                <PowerRankBadge power={totalPower} language={language} size="md" />
                            </div>
                            <ExpBar stats={stats} language={language} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
