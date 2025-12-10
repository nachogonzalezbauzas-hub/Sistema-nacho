import React from 'react';
import { motion } from 'framer-motion';
import { Title, TitleRarity } from '@/types';
import { rarityStyles, PremiumParticleEffect } from '@/components';
import { Crown, Zap } from 'lucide-react';
import { t, Language } from '@/data/translations';
import { getIconByName } from '@/utils/iconMapper';

interface ActiveTitleProps {
    equippedTitle?: Title;
    totalPower: number;
    language: Language;
}

// Minimalist but premium styling by rarity
const rarityEffects: Record<TitleRarity, {
    glow: string;
    borderGlow: string;
    textGlow: string;
    shimmer: boolean;
    rainbow: boolean;
}> = {
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
};

export const ActiveTitle: React.FC<ActiveTitleProps> = ({ equippedTitle, totalPower, language = 'en' as Language }) => {
    const rarity = equippedTitle?.rarity || 'common';
    const effects = rarityEffects[rarity];

    return (
        <>
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

            {/* Title Module */}
            <div className={`
                relative group flex items-center gap-3 px-5 py-2.5 
                backdrop-blur-md transition-all duration-500 
                bg-black/40 rounded-lg
                ${effects.glow}
                ${effects.borderGlow}
                border
                overflow-hidden
            `}>
                {/* Premium Particle Effect */}
                {['godlike', 'celestial', 'transcendent'].includes(rarity) && (
                    <PremiumParticleEffect rarity={rarity as any} />
                )}

                {/* Shimmer overlay for epic+ */}
                {effects.shimmer && (
                    <div className="absolute inset-0 rounded-lg shimmer-border pointer-events-none"></div>
                )}



                {/* Icon */}
                <div className={`relative z-10 transition-all duration-300 ${equippedTitle ? rarityStyles[equippedTitle.rarity].labelColor : 'text-slate-500'} ${effects.textGlow}`}>
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
                            text-sm font-bold uppercase tracking-wider
                            ${effects.rainbow ? 'rainbow-text' : ''}
                            ${!effects.rainbow && equippedTitle ? rarityStyles[equippedTitle.rarity].textColor : ''}
                            ${!effects.rainbow ? effects.textGlow : ''}
                            ${!equippedTitle ? 'text-slate-500' : ''}
                        `}
                    >
                        {equippedTitle?.name || t('dash_none_equipped', language)}
                    </div>
                </div>

                {/* Subtle corner accents for legendary+ */}
                {['legendary', 'mythic', 'godlike'].includes(rarity) && (
                    <>
                        <div className={`absolute top-0 left-0 w-3 h-[1px] ${effects.rainbow ? 'bg-white/60' : `bg-current opacity-40`}`} style={!effects.rainbow ? { color: rarity === 'legendary' ? '#fbbf24' : '#ef4444' } : {}}></div>
                        <div className={`absolute top-0 left-0 w-[1px] h-3 ${effects.rainbow ? 'bg-white/60' : `bg-current opacity-40`}`} style={!effects.rainbow ? { color: rarity === 'legendary' ? '#fbbf24' : '#ef4444' } : {}}></div>
                        <div className={`absolute bottom-0 right-0 w-3 h-[1px] ${effects.rainbow ? 'bg-white/60' : `bg-current opacity-40`}`} style={!effects.rainbow ? { color: rarity === 'legendary' ? '#fbbf24' : '#ef4444' } : {}}></div>
                        <div className={`absolute bottom-0 right-0 w-[1px] h-3 ${effects.rainbow ? 'bg-white/60' : `bg-current opacity-40`}`} style={!effects.rainbow ? { color: rarity === 'legendary' ? '#fbbf24' : '#ef4444' } : {}}></div>
                    </>
                )}
            </div>
        </>
    );
};
