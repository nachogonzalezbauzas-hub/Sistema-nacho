import React from 'react';
import { Lock } from 'lucide-react';
import { Title, TitleRarity } from '../../types';

export const rarityStyles: Record<
    TitleRarity,
    {
        labelColor: string;
        borderColor: string;
        bgGradient: string;
        textColor: string;
    }
> = {
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

const rarityLabel: Record<TitleRarity, string> = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
    mythic: 'Mythic',
    godlike: 'Godlike',
};

// U23.1 – animación distinta por rareza
const rarityContainerAnimation: Record<TitleRarity, string> = {
    common: '',
    uncommon: '',
    rare: '',
    epic: '',
    legendary: '',
    mythic: '',
    godlike: '',
};

const rarityIconAnimation: Record<TitleRarity, string> = {
    common: '',
    uncommon: '',
    rare: '',
    epic: '',
    legendary: '',
    mythic: '',
    godlike: '',
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
    const style = rarityStyles[title.rarity];
    const containerAnim = rarityContainerAnimation[title.rarity];
    const iconAnim = rarityIconAnimation[title.rarity];

    // Use custom styles from title definition if available
    const titleTextStyle = title.textStyle || style.textColor;
    const titleGlowStyle = title.glowStyle || '';

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        group relative w-full text-left rounded-xl border px-3 py-3
        bg-gradient-to-br ${style.bgGradient} ${style.borderColor}
        transition-all duration-200
        hover:scale-[1.02] active:scale-[0.97]
        hover:border-opacity-100
        ${isEquipped ? 'ring-2 ring-sky-400/80 ring-offset-2 ring-offset-slate-900' : ''}
        ${containerAnim}
      `}
        >
            {/* Icon + Title */}
            <div className="flex items-center gap-3">
                <div
                    className={`
            flex h-9 w-9 items-center justify-center rounded-full
            bg-slate-950/60 shadow-inner
            transition-transform duration-200
            ${iconAnim}
          `}
                >
                    <span className="text-xl">{title.icon}</span>
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
            <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className={`font-semibold ${style.labelColor}`}>
                    {rarityLabel[title.rarity]}
                </span>
                {isEquipped && (
                    <span className="rounded-full bg-sky-500/20 px-2 py-[1px] text-[10px] font-semibold text-sky-200">
                        EQUIPPED
                    </span>
                )}
            </div>

            {/* Glow extra para godlike */}
            {title.rarity === 'godlike' && (
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-cyan-400/10 to-emerald-400/10 blur-xl animate-pulse" />
            )}
        </button>
    );
};

export const TitleCard: React.FC<{ title: Title; isUnlocked: boolean; isEquipped: boolean; onToggle: () => void }> = ({ title, isUnlocked, isEquipped, onToggle }) => {
    const style = rarityStyles[title.rarity];
    const containerAnim = rarityContainerAnimation[title.rarity];
    const iconAnim = rarityIconAnimation[title.rarity];

    return (
        <div
            onClick={isUnlocked ? onToggle : undefined}
            className={`
                relative group flex flex-col items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer min-h-[160px]
                ${isEquipped
                    ? `${style.borderColor} bg-slate-900/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-[1.02] z-10 ring-1 ring-offset-1 ring-offset-slate-950 ${style.labelColor.replace('text-', 'ring-')}`
                    : isUnlocked
                        ? `${style.borderColor} bg-slate-950/40 hover:bg-slate-900/60 hover:scale-[1.02] hover:z-10 hover:shadow-lg`
                        : 'border-slate-800 bg-slate-950/20 opacity-50 grayscale'
                }
                ${containerAnim}
            `}
        >
            {/* Rarity Badge */}
            <div className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded border ${isUnlocked ? `${style.borderColor} ${style.labelColor} bg-black/50` : 'border-slate-700 text-slate-500 bg-black/30'}`}>
                {rarityLabel[title.rarity].toUpperCase()}
            </div>

            {/* Selected Indicator */}
            {isEquipped && (
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${style.labelColor.replace('text-', 'bg-')} shadow-[0_0_5px_currentColor] animate-pulse`}></div>
            )}

            {/* Icon */}
            <div className="flex-1 flex items-center justify-center w-full py-2">
                <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center relative overflow-visible transition-transform duration-300
                    ${isUnlocked ? `bg-gradient-to-br ${style.bgGradient} shadow-inner ${iconAnim}` : 'bg-slate-900 border border-slate-800'}
                `}>
                    {isUnlocked ? (
                        <span className="text-3xl filter drop-shadow-md">
                            {React.isValidElement(title.icon)
                                ? React.cloneElement(title.icon as React.ReactElement, { size: 32 })
                                : title.icon}
                        </span>
                    ) : (
                        <Lock size={20} className="text-slate-600" />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="w-full text-center space-y-1">
                <h4 className={`text-xs font-black uppercase tracking-wider truncate ${isUnlocked ? style.textColor : 'text-slate-600'}`}>
                    {title.name}
                </h4>
                <p className="text-[9px] text-slate-500 font-mono leading-tight line-clamp-2 h-[2.2em]">
                    {title.description}
                </p>
            </div>

            {/* Godlike Effect */}
            {title.rarity === 'godlike' && isUnlocked && (
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-cyan-400/10 to-emerald-400/10 blur-xl animate-pulse" />
            )}
        </div>
    );
};
