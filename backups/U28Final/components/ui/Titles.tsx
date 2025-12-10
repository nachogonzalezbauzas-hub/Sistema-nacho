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
    uncommon: 'hover:animate-pulse',
    rare: 'animate-pulse',
    epic: 'animate-pulse hover:scale-[1.03]',
    legendary: 'animate-bounce hover:scale-[1.02]',
    mythic: 'animate-pulse hover:animate-bounce',
    godlike:
        'animate-pulse shadow-[0_0_25px_rgba(244,244,245,0.75)] hover:scale-[1.04]',
};

const rarityIconAnimation: Record<TitleRarity, string> = {
    common: '',
    uncommon: 'group-hover:scale-110',
    rare: 'group-hover:-translate-y-[1px]',
    epic: 'group-hover:rotate-1',
    legendary: 'group-hover:-rotate-1',
    mythic: 'group-hover:scale-110 group-hover:-translate-y-[2px]',
    godlike: 'group-hover:scale-125 group-hover:rotate-3',
};

interface TitleBadgeProps {
    title: Title;
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

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        group relative w-full text-left rounded-xl border px-3 py-3
        bg-gradient-to-br ${style.bgGradient} ${style.borderColor}
        ${style.textColor}
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
                    <span className="text-sm font-semibold tracking-wide uppercase">
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
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-cyan-400/10 to-emerald-400/10 blur-xl" />
            )}
        </button>
    );
};

export const TitleCard: React.FC<{ title: Title; isUnlocked: boolean; isEquipped: boolean; onToggle: () => void }> = ({ title, isUnlocked, isEquipped, onToggle }) => {
    return (
        <div className={`relative p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${isEquipped ? 'bg-blue-950/40 border-blue-400 ring-1 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : isUnlocked ? 'bg-white/5 border-blue-500/30 hover:border-blue-400 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-slate-900/50 border-slate-800 opacity-60 grayscale'}`}>
            <div className={`text-3xl mb-3 ${isUnlocked && !isEquipped ? 'group-hover:scale-110 transition-transform' : ''} ${isEquipped ? 'animate-pulse-fast' : ''}`}>{isUnlocked ? title.icon : <Lock size={24} className="text-slate-600" />}</div>
            <h4 className={`text-xs font-black uppercase tracking-wider mb-2 ${isUnlocked ? 'text-blue-100' : 'text-slate-600'}`}>{title.name}</h4>
            <p className="text-[10px] text-slate-400 font-mono leading-tight mb-4 min-h-[2.5em] line-clamp-2">{title.description}</p>
            {isUnlocked ? (
                <button onClick={onToggle} className={`w-full py-2 rounded text-[9px] font-bold uppercase tracking-[0.15em] transition-all ${isEquipped ? 'bg-transparent text-blue-400 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] active:scale-95'}`}>{isEquipped ? 'EQUIPPED' : 'EQUIP TITLE'}</button>
            ) : (
                <div className="w-full py-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest border border-slate-800 rounded bg-slate-900/50 flex items-center justify-center gap-1.5"><Lock size={10} /> LOCKED</div>
            )}
            {isEquipped && <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse"></div>}
        </div>
    );
};
