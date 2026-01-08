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
};

export const rarityLabel: Partial<Record<string, string>> = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
    mythic: 'Mythic',
    godlike: 'Godlike',
};

// U23.1 – animación distinta por rareza
const rarityContainerAnimation: Partial<Record<string, string>> = {
    legendary: 'animate-pulse',
    mythic: 'animate-pulse',
    godlike: 'animate-pulse',
};

const rarityIconAnimation: Partial<Record<string, string>> = {
    godlike: 'animate-spin-slow'
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

    // Enable particles for premium rarities
    const isPremium = ['mythic', 'godlike'].includes(title.rarity);

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

    const isPremium = ['mythic', 'godlike'].includes(title.rarity);

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
