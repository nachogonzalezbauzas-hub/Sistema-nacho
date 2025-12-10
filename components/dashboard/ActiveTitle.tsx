import React from 'react';
import { motion } from 'framer-motion';
import { Title, TitleRarity } from '@/types';
import { rarityStyles } from '@/components/ui/Titles';
import { PremiumParticleEffect } from '@/components/ui/PremiumParticleEffect';
import { Crown, Zap } from 'lucide-react';
import { t, Language } from '@/data/translations';
import { getIconByName } from '@/utils/iconMapper';

interface ActiveTitleProps {
    equippedTitle?: Title;
    totalPower: number;
    language: Language;
}

// Minimalist but premium styling by rarity
const rarityEffects: Partial<Record<TitleRarity, {
    glow: string;
    borderGlow: string;
    textGlow: string;
    shimmer: boolean;
    rainbow: boolean;
}>> = {
    common: {
        glow: '',
        borderGlow: 'border-slate-600/50',
        textGlow: '',
        shimmer: false,
        rainbow: false,
    },
    uncommon: {
        glow: '',
        borderGlow: 'border-emerald-500/40',
        textGlow: 'drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]',
        shimmer: false,
        rainbow: false,
    },
    rare: {
        glow: 'shadow-[0_0_20px_rgba(56,189,248,0.15)]',
        borderGlow: 'border-sky-400/50',
        textGlow: 'drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]',
        shimmer: false,
        rainbow: false,
    },
    epic: {
        glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)]',
        borderGlow: 'border-purple-400/60',
        textGlow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]',
        shimmer: true,
        rainbow: false,
    },
    legendary: {
        glow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
        borderGlow: 'border-amber-400/70',
        textGlow: 'drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]',
        shimmer: true,
        rainbow: false,
    },
    mythic: {
        glow: 'shadow-[0_0_35px_rgba(239,68,68,0.35)]',
        borderGlow: 'border-red-400/70',
        textGlow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]',
        shimmer: true,
        rainbow: false,
    },
    godlike: {
        glow: 'shadow-[0_0_40px_rgba(255,255,255,0.4)]',
        borderGlow: 'border-white/60',
        textGlow: '',
        shimmer: true,
        rainbow: true,
    },
    celestial: {
        glow: 'shadow-[0_0_45px_rgba(34,211,238,0.5)]',
        borderGlow: 'border-cyan-400/60',
        textGlow: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]',
        shimmer: true,
        rainbow: false,
    },
    transcendent: {
        glow: 'shadow-[0_0_50px_rgba(251,191,36,0.6)]',
        borderGlow: 'border-amber-200/80',
        textGlow: 'drop-shadow-[0_0_20px_rgba(251,191,36,1)]',
        shimmer: true,
        rainbow: false,
    },
    primordial: {
        glow: 'shadow-[0_0_45px_rgba(245,158,11,0.5)]',
        borderGlow: 'border-orange-700/80',
        textGlow: 'drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]',
        shimmer: true,
        rainbow: false,
    },
    eternal: {
        glow: 'shadow-[0_0_45px_rgba(16,185,129,0.5)]',
        borderGlow: 'border-emerald-500/80',
        textGlow: 'drop-shadow-[0_0_15px_rgba(52,211,153,0.9)]',
        shimmer: true,
        rainbow: false,
    },
    divine: {
        glow: 'shadow-[0_0_50px_rgba(253,224,71,0.6)]',
        borderGlow: 'border-yellow-200/80',
        textGlow: 'drop-shadow-[0_0_18px_rgba(250,204,21,1)]',
        shimmer: true,
        rainbow: false,
    },
    cosmic: {
        glow: 'shadow-[0_0_50px_rgba(99,102,241,0.6)]',
        borderGlow: 'border-indigo-400/80',
        textGlow: 'drop-shadow-[0_0_18px_rgba(129,140,248,1)]',
        shimmer: true,
        rainbow: false,
    },
    infinite: {
        glow: 'shadow-[0_0_60px_rgba(255,255,255,0.7)]',
        borderGlow: 'border-white',
        textGlow: 'drop-shadow-[0_0_25px_rgba(255,255,255,1)]',
        shimmer: true,
        rainbow: false, // Silver/White Monochrome
    },
    // Zone Rarities - progressively better than Godlike
    magma: { glow: 'shadow-[0_0_45px_rgba(239,68,68,0.5)]', borderGlow: 'border-red-500', textGlow: 'drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]', shimmer: true, rainbow: false },
    abyssal: { glow: 'shadow-[0_0_45px_rgba(6,182,212,0.5)]', borderGlow: 'border-cyan-500', textGlow: 'drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]', shimmer: true, rainbow: false },
    verdant: { glow: 'shadow-[0_0_45px_rgba(34,197,94,0.5)]', borderGlow: 'border-green-500', textGlow: 'drop-shadow-[0_0_15px_rgba(34,197,94,0.9)]', shimmer: true, rainbow: false },
    storm: { glow: 'shadow-[0_0_50px_rgba(168,85,247,0.6)]', borderGlow: 'border-purple-500', textGlow: 'drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]', shimmer: true, rainbow: false },
    lunar: { glow: 'shadow-[0_0_50px_rgba(148,163,184,0.6)]', borderGlow: 'border-slate-300', textGlow: 'drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]', shimmer: true, rainbow: false },
    solar: { glow: 'shadow-[0_0_55px_rgba(251,191,36,0.7)]', borderGlow: 'border-amber-400', textGlow: 'drop-shadow-[0_0_25px_rgba(251,191,36,1)]', shimmer: true, rainbow: false },
    nebula: { glow: 'shadow-[0_0_55px_rgba(217,70,239,0.7)]', borderGlow: 'border-fuchsia-500', textGlow: 'drop-shadow-[0_0_25px_rgba(217,70,239,1)]', shimmer: true, rainbow: true },
    singularity: { glow: 'shadow-[0_0_60px_rgba(139,92,246,0.8)]', borderGlow: 'border-violet-600', textGlow: 'drop-shadow-[0_0_30px_rgba(139,92,246,1)]', shimmer: true, rainbow: true },
    nova: { glow: 'shadow-[0_0_60px_rgba(244,63,94,0.8)]', borderGlow: 'border-rose-500', textGlow: 'drop-shadow-[0_0_30px_rgba(244,63,94,1)]', shimmer: true, rainbow: true },
    cyber: { glow: 'shadow-[0_0_60px_rgba(34,197,94,0.8)]', borderGlow: 'border-emerald-500', textGlow: 'drop-shadow-[0_0_30px_rgba(34,197,94,1)]', shimmer: true, rainbow: false },
    crystal: { glow: 'shadow-[0_0_60px_rgba(45,212,191,0.8)]', borderGlow: 'border-teal-400', textGlow: 'drop-shadow-[0_0_30px_rgba(45,212,191,1)]', shimmer: true, rainbow: false },
    ethereal: { glow: 'shadow-[0_0_60px_rgba(14,165,233,0.8)]', borderGlow: 'border-sky-400', textGlow: 'drop-shadow-[0_0_30px_rgba(14,165,233,1)]', shimmer: true, rainbow: false },
    crimson: { glow: 'shadow-[0_0_65px_rgba(220,38,38,0.9)]', borderGlow: 'border-red-600', textGlow: 'drop-shadow-[0_0_35px_rgba(220,38,38,1)]', shimmer: true, rainbow: false },
    heavenly: { glow: 'shadow-[0_0_70px_rgba(253,224,71,0.9)]', borderGlow: 'border-yellow-300', textGlow: 'drop-shadow-[0_0_40px_rgba(253,224,71,1)]', shimmer: true, rainbow: true },
    antimatter: { glow: 'shadow-[0_0_70px_rgba(255,255,255,0.9)]', borderGlow: 'border-white', textGlow: 'drop-shadow-[0_0_40px_rgba(255,255,255,1)]', shimmer: true, rainbow: false }, // Inverted feel
    temporal: { glow: 'shadow-[0_0_70px_rgba(245,158,11,0.9)]', borderGlow: 'border-orange-500', textGlow: 'drop-shadow-[0_0_40px_rgba(245,158,11,1)]', shimmer: true, rainbow: true },
    chaotic: { glow: 'shadow-[0_0_75px_rgba(236,72,153,0.9)]', borderGlow: 'border-pink-600', textGlow: 'drop-shadow-[0_0_45px_rgba(236,72,153,1)]', shimmer: true, rainbow: true },
    void: { glow: 'shadow-[0_0_80px_rgba(0,0,0,0.9)]', borderGlow: 'border-slate-800', textGlow: 'drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]', shimmer: true, rainbow: false },
    omega: { glow: 'shadow-[0_0_100px_rgba(124,58,237,1)]', borderGlow: 'border-violet-500', textGlow: 'drop-shadow-[0_0_60px_rgba(139,92,246,1)]', shimmer: true, rainbow: true },
};

export const ActiveTitle: React.FC<ActiveTitleProps> = ({ equippedTitle, totalPower, language = 'en' as Language }) => {
    const rarity = equippedTitle?.rarity || 'common';
    const effects = rarityEffects[rarity] || rarityEffects['common']!;

    return (
        <div className={`
            relative group flex items-center gap-3 px-5 py-2.5 
            backdrop-blur-md transition-all duration-500 
            bg-black/40 rounded-lg
            h-full
            ${effects.glow}
            ${effects.borderGlow}
            border
            overflow-hidden
        `}>
            {/* CSS for premium effects */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes rainbow-text {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .shimmer-border {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255,255,255,0.1) 45%,
                        rgba(255,255,255,0.3) 50%,
                        rgba(255,255,255,0.1) 55%,
                        transparent 100%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 3s ease-in-out infinite;
                }
                .rainbow-text {
                    background: linear-gradient(
                        90deg,
                        #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b
                    );
                    background-size: 200% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: rainbow-text 3s linear infinite;
                }
            `}</style>

            {/* Premium Particle Effect */}
            {['godlike', 'celestial', 'transcendent', 'primordial', 'eternal', 'divine', 'cosmic', 'infinite', 'omega', 'heavenly', 'singularity', 'magma', 'abyssal', 'verdant', 'storm', 'lunar', 'solar', 'nebula', 'nova', 'cyber', 'crystal', 'ethereal', 'crimson', 'antimatter', 'temporal', 'chaotic', 'void'].includes(rarity) && (
                <PremiumParticleEffect rarity={rarity as any} />
            )}

            {/* Shimmer overlay for epic+ */}
            {effects.shimmer && (
                <div className="absolute inset-0 rounded-lg shimmer-border pointer-events-none"></div>
            )}

            {/* Icon */}
            <div className={`relative z-10 transition-all duration-300 ${equippedTitle ? (rarityStyles[equippedTitle.rarity]?.labelColor || 'text-slate-500') : 'text-slate-500'} ${effects.textGlow}`}>
                {equippedTitle?.icon ? (
                    typeof equippedTitle.icon === 'string' ? (
                        (() => {
                            const IconComponent = getIconByName(equippedTitle.icon, 18);
                            return IconComponent || <span className="text-lg">{equippedTitle.icon}</span>;
                        })()
                    ) : React.isValidElement(equippedTitle.icon) ? (
                        React.cloneElement(equippedTitle.icon as React.ReactElement, { size: 18 })
                    ) : (
                        <span className="text-lg">{equippedTitle.icon}</span>
                    )
                ) : (
                    <Crown size={18} />
                )}
            </div>

            <div className="relative z-10 flex flex-col">
                <div className={`
                    text-[9px] uppercase tracking-[0.2em] font-medium mb-0.5
                    ${equippedTitle ? 'text-slate-400' : 'text-slate-600'}
                `}>
                    {t('dash_active_title', language)}
                </div>

                {/* Title name with progressive styling */}
                <div
                    className={`
                        text-base font-bold uppercase tracking-wider
                        ${effects.rainbow ? 'rainbow-text' : ''}
                        ${!effects.rainbow && equippedTitle ? (rarityStyles[equippedTitle.rarity]?.textColor || 'text-slate-100') : ''}
                        ${!effects.rainbow ? effects.textGlow : ''}
                        ${!equippedTitle ? 'text-slate-500' : ''}
                    `}
                >
                    {equippedTitle?.name || t('dash_none_equipped', language)}
                </div>
            </div>

            {/* Subtle corner accents for legendary+ and all zones */}
            {!['common', 'uncommon', 'rare', 'epic'].includes(rarity) && (
                <>
                    <div className={`absolute top-0 left-0 w-3 h-[1px] ${effects.rainbow ? 'bg-white/60' : `bg-current opacity-40`}`} style={!effects.rainbow ? { color: rarity === 'legendary' ? '#fbbf24' : '#ef4444' } : {}}></div>
                    <div className={`absolute top-0 left-0 w-[1px] h-3 ${effects.rainbow ? 'bg-white/60' : `bg-current opacity-40`}`} style={!effects.rainbow ? { color: rarity === 'legendary' ? '#fbbf24' : '#ef4444' } : {}}></div>
                    <div className={`absolute bottom-0 right-0 w-3 h-[1px] ${effects.rainbow ? 'bg-white/60' : `bg-current opacity-40`}`} style={!effects.rainbow ? { color: rarity === 'legendary' ? '#fbbf24' : '#ef4444' } : {}}></div>
                    <div className={`absolute bottom-0 right-0 w-[1px] h-3 ${effects.rainbow ? 'bg-white/60' : `bg-current opacity-40`}`} style={!effects.rainbow ? { color: rarity === 'legendary' ? '#fbbf24' : '#ef4444' } : {}}></div>
                </>
            )}
        </div>
    );
};
