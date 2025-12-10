import React from 'react';
import { Lock } from 'lucide-react';
import { Title, TitleRarity } from '@/types';
import { getIconByName } from '@/utils/iconMapper';
import { PremiumParticleEffect } from './PremiumParticleEffect';
import { useStore } from '@/store/useStore';
import { t } from '@/data/translations';

export const rarityStyles: Partial<Record<
    TitleRarity,
    {
        labelColor: string;
        borderColor: string;
        bgGradient: string;
        textColor: string;
    }
>> = {
    common: {
        labelColor: 'text-slate-200',
        borderColor: 'border-slate-500/60',
        bgGradient: 'from-slate-800/70 via-slate-900/80 to-slate-950',
        textColor: 'text-slate-100',
    },
    uncommon: {
        labelColor: 'text-emerald-300',
        borderColor: 'border-emerald-500/70',
        bgGradient: 'from-emerald-900/60 via-slate-950 to-black',
        textColor: 'text-emerald-100',
    },
    rare: {
        labelColor: 'text-sky-300',
        borderColor: 'border-sky-500/80',
        bgGradient: 'from-sky-900/60 via-slate-950 to-black',
        textColor: 'text-sky-100',
    },
    epic: {
        labelColor: 'text-purple-300',
        borderColor: 'border-purple-500/80',
        bgGradient: 'from-purple-900/60 via-slate-950 to-black',
        textColor: 'text-purple-100',
    },
    legendary: {
        labelColor: 'text-amber-300',
        borderColor: 'border-amber-500/80',
        bgGradient: 'from-amber-900/60 via-slate-950 to-black',
        textColor: 'text-amber-100',
    },
    mythic: {
        labelColor: 'text-red-300',
        borderColor: 'border-red-500/80',
        bgGradient: 'from-red-900/60 via-slate-950 to-black',
        textColor: 'text-red-100',
    },
    godlike: {
        labelColor: 'text-cyan-200',
        borderColor: 'border-fuchsia-400/80',
        bgGradient:
            'from-fuchsia-900/60 via-indigo-900/70 to-emerald-900/70',
        textColor: 'text-cyan-100',
    },
    celestial: {
        labelColor: 'text-cyan-300',
        borderColor: 'border-cyan-400',
        bgGradient: 'from-cyan-900 via-blue-900 to-slate-900 animate-pulse-slow',
        textColor: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-200 to-white drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]',
    },
    transcendent: {
        labelColor: 'text-white',
        borderColor: 'border-white/80',
        bgGradient: 'from-white/20 via-yellow-900/40 to-amber-900/60 animate-pulse',
        textColor: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-amber-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.9)]',
    },
    primordial: {
        labelColor: 'text-amber-500',
        borderColor: 'border-amber-700',
        bgGradient: 'from-orange-950 via-amber-900 to-black',
        textColor: 'text-amber-300',
    },
    eternal: {
        labelColor: 'text-emerald-300',
        borderColor: 'border-emerald-500',
        bgGradient: 'from-emerald-900 via-teal-900 to-black',
        textColor: 'text-emerald-100',
    },
    divine: {
        labelColor: 'text-yellow-100',
        borderColor: 'border-yellow-300',
        bgGradient: 'from-yellow-900 via-amber-800 to-black',
        textColor: 'text-yellow-50',
    },
    cosmic: {
        labelColor: 'text-indigo-300',
        borderColor: 'border-indigo-500',
        bgGradient: 'from-indigo-900 via-blue-900 to-black',
        textColor: 'text-indigo-100',
    },
    infinite: {
        labelColor: 'text-white',
        borderColor: 'border-slate-400',
        bgGradient: 'from-black via-slate-900 to-black',
        textColor: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-white animate-shine',
    },
    // Zone Rarities
    magma: {
        labelColor: 'text-red-400',
        borderColor: 'border-red-600',
        bgGradient: 'from-orange-900 via-red-900 to-black',
        textColor: 'text-red-200',
    },
    abyssal: {
        labelColor: 'text-cyan-400',
        borderColor: 'border-cyan-600',
        bgGradient: 'from-blue-900 via-cyan-900 to-black',
        textColor: 'text-cyan-200',
    },
    verdant: {
        labelColor: 'text-green-400',
        borderColor: 'border-green-600',
        bgGradient: 'from-green-900 via-emerald-900 to-black',
        textColor: 'text-green-200',
    },
    storm: {
        labelColor: 'text-purple-400',
        borderColor: 'border-purple-600',
        bgGradient: 'from-indigo-900 via-purple-900 to-black',
        textColor: 'text-purple-200',
    },
    lunar: {
        labelColor: 'text-slate-300',
        borderColor: 'border-slate-500',
        bgGradient: 'from-slate-800 via-slate-900 to-black',
        textColor: 'text-slate-200',
    },
    solar: {
        labelColor: 'text-amber-400',
        borderColor: 'border-amber-600',
        bgGradient: 'from-orange-800 via-amber-800 to-black',
        textColor: 'text-amber-200',
    },
    nebula: {
        labelColor: 'text-fuchsia-400',
        borderColor: 'border-fuchsia-600',
        bgGradient: 'from-pink-900 via-fuchsia-900 to-black',
        textColor: 'text-fuchsia-200',
    },
    singularity: {
        labelColor: 'text-violet-400',
        borderColor: 'border-violet-600',
        bgGradient: 'from-violet-950 via-black to-black',
        textColor: 'text-violet-200',
    },
    nova: {
        labelColor: 'text-rose-400',
        borderColor: 'border-rose-600',
        bgGradient: 'from-rose-900 via-pink-900 to-black',
        textColor: 'text-rose-200',
    },
    cyber: {
        labelColor: 'text-emerald-400',
        borderColor: 'border-emerald-600',
        bgGradient: 'from-green-900 via-black to-black',
        textColor: 'text-emerald-200',
    },
    crystal: {
        labelColor: 'text-teal-300',
        borderColor: 'border-teal-500',
        bgGradient: 'from-teal-900 via-cyan-900 to-black',
        textColor: 'text-teal-100',
    },
    ethereal: {
        labelColor: 'text-sky-300',
        borderColor: 'border-sky-500',
        bgGradient: 'from-sky-900 via-blue-900 to-black',
        textColor: 'text-sky-100',
    },
    crimson: {
        labelColor: 'text-red-500',
        borderColor: 'border-red-700',
        bgGradient: 'from-red-950 via-black to-black',
        textColor: 'text-red-300',
    },
    heavenly: {
        labelColor: 'text-yellow-200',
        borderColor: 'border-yellow-400',
        bgGradient: 'from-yellow-800 via-amber-800 to-black',
        textColor: 'text-yellow-100',
    },
    antimatter: {
        labelColor: 'text-white',
        borderColor: 'border-white',
        bgGradient: 'from-black via-gray-900 to-black',
        textColor: 'text-white',
    },
    temporal: {
        labelColor: 'text-orange-400',
        borderColor: 'border-orange-600',
        bgGradient: 'from-orange-900 via-amber-900 to-black',
        textColor: 'text-orange-200',
    },
    chaotic: {
        labelColor: 'text-pink-500',
        borderColor: 'border-pink-600',
        bgGradient: 'from-pink-900 via-rose-900 to-black',
        textColor: 'text-pink-300',
    },
    void: {
        labelColor: 'text-gray-500',
        borderColor: 'border-gray-700',
        bgGradient: 'from-gray-950 via-black to-black',
        textColor: 'text-gray-400',
    },
    omega: {
        labelColor: 'text-indigo-400',
        borderColor: 'border-indigo-600',
        bgGradient: 'from-indigo-900 via-violet-900 to-black',
        textColor: 'text-indigo-200',
    },
};

export const rarityLabel: Partial<Record<string, string>> = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
    mythic: 'Mythic',
    godlike: 'Godlike',
    celestial: 'Celestial',
    transcendent: 'Transcendent',
    primordial: 'Primordial',
    eternal: 'Eternal',
    divine: 'Divine',
    cosmic: 'Cosmic',
    infinite: 'Infinite',
    // Zone Labels - Capitalize defaults
    magma: 'Magma',
    abyssal: 'Abyssal',
    verdant: 'Verdant',
    storm: 'Storm',
    lunar: 'Lunar',
    solar: 'Solar',
    nebula: 'Nebula',
    singularity: 'Singularity',
    nova: 'Nova',
    cyber: 'Cyber',
    crystal: 'Crystal',
    ethereal: 'Ethereal',
    crimson: 'Crimson',
    heavenly: 'Heavenly',
    antimatter: 'Antimatter',
    temporal: 'Temporal',
    chaotic: 'Chaotic',
    void: 'Void',
    omega: 'Omega',
};

// U23.1 – animación distinta por rareza
const rarityContainerAnimation: Partial<Record<string, string>> = {
    transcendent: 'animate-pulse',
    // Zone Animations - Make them feel alive
    magma: 'animate-pulse hover:animate-shake', // Pulse like heat
    abyssal: 'animate-float', // Float like water (need custom keyframe or just pulse) -> fallback to pulse-slow
    storm: 'animate-pulse', // Rapid pulse
    verdant: 'animate-pulse-slow',
    lunar: 'animate-pulse-slow',
    solar: 'animate-pulse',
    nebula: 'animate-pulse-slow',
    singularity: 'animate-pulse-slow',
    nova: 'animate-pulse',
    cyber: 'animate-pulse',
    crystal: 'animate-pulse-slow',
    ethereal: 'animate-float',
    crimson: 'animate-pulse',
    heavenly: 'animate-pulse-slow',
    antimatter: 'animate-pulse-slow',
    temporal: 'animate-pulse-slow',
    chaotic: 'animate-shake',
    void: 'animate-pulse-slow',
    omega: 'animate-pulse',
    primordial: 'animate-pulse-slow',
    eternal: 'animate-float',
    divine: 'animate-pulse',
    cosmic: 'animate-pulse',
    infinite: 'animate-pulse',
};

const rarityIconAnimation: Partial<Record<string, string>> = {
    transcendent: 'animate-spin-slow',
    storm: 'animate-pulse',
    cyber: 'animate-pulse',
    chaotic: 'animate-shake',
    solar: 'animate-spin-slow',
    antimatter: 'animate-spin-slow',
    singularity: 'animate-spin-slow',
    omega: 'animate-spin-slow'
};

const defaultStyle = {
    labelColor: 'text-slate-200',
    borderColor: 'border-slate-500/60',
    bgGradient: 'from-slate-800/70 via-slate-900/80 to-slate-950',
    textColor: 'text-slate-100',
};

interface TitleBadgeProps {
    title: Title & { textStyle?: string; glowStyle?: string };
    isEquipped?: boolean;
    onClick?: () => void;
}

export const TitleBadge: React.FC<TitleBadgeProps> = ({
    title,
    isEquipped = false,
    onClick,
}) => {
    const language = useStore(state => state.state.settings.language);
    // Safe style retrieval
    const style = rarityStyles[title.rarity] || defaultStyle;
    const containerAnim = rarityContainerAnimation[title.rarity] || '';
    const iconAnim = rarityIconAnimation[title.rarity] || '';

    // Use custom styles from title definition if available
    const titleTextStyle = title.textStyle || style.textColor;
    const titleGlowStyle = title.glowStyle || '';

    // Render icon logic
    const renderIcon = () => {
        if (typeof title.icon === 'string') {
            const IconComponent = getIconByName(title.icon, 24); // Assuming 24px default
            if (IconComponent) return IconComponent;
            return title.icon; // Fallback for emoji strings
        }
        return title.icon;
    };

    // Enable particles for ALL zone rarities to make them epic
    const isPremium = ['godlike', 'celestial', 'transcendent', 'omega', 'heavenly', 'singularity', 'magma', 'abyssal', 'verdant', 'storm', 'lunar', 'solar', 'nebula', 'nova', 'cyber', 'crystal', 'ethereal', 'crimson', 'antimatter', 'temporal', 'chaotic', 'void'].includes(title.rarity);

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        group relative w-full text-left rounded-xl border px-3 py-3
        bg-gradient-to-br ${style.bgGradient} ${style.borderColor}
        transition-all duration-200
        hover:scale-[1.02] active:scale-[0.97]
        hover:border-opacity-100 overflow-hidden
        ${isEquipped ? 'ring-2 ring-sky-400/80 ring-offset-2 ring-offset-slate-900' : ''}
        ${containerAnim}
      `}
        >
            {/* Premium Effect */}
            {isPremium && (
                <PremiumParticleEffect rarity={title.rarity as any} />
            )}

            {/* Icon + Title */}
            <div className="flex items-center gap-3 relative z-10">
                <div
                    className={`
            flex h-9 w-9 items-center justify-center rounded-full
            bg-slate-950/60 shadow-inner
            transition-transform duration-200
            ${iconAnim}
          `}
                >
                    <span className="text-xl flex items-center justify-center">{renderIcon()}</span>
                </div>
                <div className="flex flex-col">
                    <span className={`text-sm font-semibold tracking-wide uppercase ${titleTextStyle} ${titleGlowStyle}`}>
                        {title.name}
                    </span>
                    <span className="text-xs text-slate-300/80">
                        {title.description}
                    </span>
                </div>
            </div>

            {/* Rarity + Equipped state */}
            <div className="mt-2 flex items-center justify-between text-[11px] relative z-10">
                <span className={`font-semibold ${style.labelColor}`}>
                    {t(`rarity_${title.rarity.toLowerCase()}` as any, language) || title.rarity}
                </span>
                {isEquipped && (
                    <span className="rounded-full bg-sky-500/20 px-2 py-[1px] text-[10px] font-semibold text-sky-200">
                        {language === 'es' ? 'EQUIPADO' : 'EQUIPPED'}
                    </span>
                )}
            </div>
        </button>
    );
};

export const TitleCard: React.FC<{ title: Title; isUnlocked: boolean; isEquipped: boolean; onToggle: () => void }> = ({ title, isUnlocked, isEquipped, onToggle }) => {
    const language = useStore(state => state.state.settings.language);
    // Safe style retrieval
    const style = rarityStyles[title.rarity] || defaultStyle;
    const containerAnim = rarityContainerAnimation[title.rarity] || '';
    const iconAnim = rarityIconAnimation[title.rarity] || '';

    // Render icon logic
    const renderIcon = () => {
        if (typeof title.icon === 'string') {
            const IconComponent = getIconByName(title.icon, 32); // Larger size for card
            if (IconComponent) return IconComponent;
            // Fallback if icon not found in map
            return <div className="text-xs">{title.icon}</div>;
        }
        return React.isValidElement(title.icon)
            ? React.cloneElement(title.icon as React.ReactElement, { size: 32 })
            : title.icon;
    };

    const isPremium = ['godlike', 'celestial', 'transcendent', 'omega', 'heavenly', 'singularity', 'magma', 'abyssal', 'verdant', 'storm', 'lunar', 'solar', 'nebula', 'nova', 'cyber', 'crystal', 'ethereal', 'crimson', 'antimatter', 'temporal', 'chaotic', 'void'].includes(title.rarity);

    return (
        <div
            onClick={isUnlocked ? onToggle : undefined}
            className={`
                relative group flex flex-col items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer min-h-[160px] overflow-hidden
                ${isEquipped
                    ? `${style.borderColor} bg-slate-900/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-[1.02] z-10 ring-1 ring-offset-1 ring-offset-slate-950 ${style.labelColor.replace('text-', 'ring-')}`
                    : isUnlocked
                        ? `${style.borderColor} bg-slate-950/40 hover:bg-slate-900/60 hover:scale-[1.02] hover:z-10 hover:shadow-lg`
                        : 'border-slate-800 bg-slate-950/20 opacity-50 grayscale'
                }
                ${containerAnim}
            `}
        >
            {/* Premium Effect */}
            {isPremium && isUnlocked && (
                <PremiumParticleEffect rarity={title.rarity as any} />
            )}

            {/* Rarity Badge */}
            <div className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded border z-20 ${isUnlocked ? `${style.borderColor} ${style.labelColor} bg-black/50` : 'border-slate-700 text-slate-500 bg-black/30'}`}>
                {(t(`rarity_${title.rarity.toLowerCase()}` as any, language) || title.rarity).toUpperCase()}
            </div>

            {/* Selected Indicator */}
            {isEquipped && (
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full z-20 ${style.labelColor.replace('text-', 'bg-')} shadow-[0_0_5px_currentColor] animate-pulse`}></div>
            )}

            {/* Icon */}
            <div className="flex-1 flex items-center justify-center w-full py-2 z-10">
                <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center relative overflow-visible transition-transform duration-300
                    ${isUnlocked ? `bg-gradient-to-br ${style.bgGradient} shadow-inner ${iconAnim}` : 'bg-slate-900 border border-slate-800'}
                `}>
                    {isUnlocked ? (
                        <span className="text-3xl filter drop-shadow-md flex items-center justify-center">
                            {renderIcon()}
                        </span>
                    ) : (
                        <Lock size={20} className="text-slate-600" />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="w-full text-center space-y-1 z-10">
                <h4 className={`text-xs font-black uppercase tracking-wider truncate ${isUnlocked ? style.textColor : 'text-slate-600'}`}>
                    {title.name}
                </h4>
                <p className="text-[9px] text-slate-500 font-mono leading-tight line-clamp-2 h-[2.2em]">
                    {title.description}
                </p>
            </div>
        </div>
    );
};
